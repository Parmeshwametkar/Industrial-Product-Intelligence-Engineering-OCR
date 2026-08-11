import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body parser limit for base64 image data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Shared Gemini AI client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are an expert Industrial Product Intelligence, Engineering OCR, and E-Commerce Catalog Data Engineer.

Your task is to analyze the provided image (mechanical drawing, engineering blueprint, product photograph, technical schematic, assembly drawing, dimensioned CAD drawing, datasheet excerpt, or specification label/plate) and convert everything that can be reliably identified into clean, structured, e-commerce-ready industrial product data.

CORE RULE: NEVER invent, assume, or fabricate technical specifications.
Only extract information that is clearly visible in the image, legible through OCR, or directly inferable from unambiguous standard notation. If a value is uncertain, unreadable, or missing, put it in missing_critical_data.

STEP 1: INSPECT IMAGE FORENSICS (Look at title blocks, notes, dimensions, callouts, tables, markings).
STEP 2: OCR & TEXT NORMALIZATION (Expand standard abbreviations like HEX->Hexagonal, OD->Outside Diameter, CS->Carbon Steel, SS->Stainless Steel, ZP->Zinc Plated, etc., when unambiguous).
STEP 3: ENGINEERING INTERPRETATION (Interpret thread specs like 3/8-16 UNC, M10x1.5x50, metric dimensions, PSI, MPa, etc.).
STEP 4: UNITS (Normalize to metric with original imperial in parentheses where clear, e.g. "9.525 mm (3/8 in)").
STEP 5: MATERIAL & COATING (Identify Carbon Steel, Stainless Steel 316, Zinc Plated, Black Oxide, etc. Do not invent materials from just grades).
STEP 6: PRODUCT IDENTIFICATION (Create a concise, buyer-friendly commercial name including visible specs).
STEP 7: INDUSTRIAL TAXONOMY (Assign the most specific defensible industrial category like Fasteners, Hydraulic Valves, Bearings, Pneumatic Fittings, Seals & Gaskets).
STEP 8: UNSPSC (Provide closest plausible UNSPSC code or empty string).
STEP 9: TECHNICAL ATTRIBUTE EXTRACTION (Key dimensions, materials, coatings).
STEP 10: PERFORMANCE RATINGS (Working pressure, tensile strength, voltage, max RPM, temperature range ONLY if explicitly visible).
STEP 11: MISSING DATA ANALYSIS (Identify critical attributes missing or unreadable to an industrial buyer).
STEP 12: CROSS-SELL RECOMMENDATIONS (2-3 closely related products an industrial buyer would purchase alongside).

CRITICAL ANTI-HALLUCINATION RULES:
1. Never invent a manufacturer, part number, dimension, material, grade, coating, or performance rating.
2. If the image contains insufficient information, report missing attributes in missing_critical_data.
3. Return ONLY data supported by the image.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    product_metadata: {
      type: Type.OBJECT,
      properties: {
        predicted_commercial_name: {
          type: Type.STRING,
          description: "Clear, consumer-friendly product title based only on image evidence",
        },
        industrial_category: {
          type: Type.STRING,
          description: "Most specific defensible industrial category",
        },
        unspsc_code_guess: {
          type: Type.STRING,
          description: "Closest defensible UNSPSC code or empty string",
        },
      },
      required: ["predicted_commercial_name", "industrial_category", "unspsc_code_guess"],
    },
    extracted_technical_attributes: {
      type: Type.OBJECT,
      properties: {
        key_dimensions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of dimensions in format 'Dimension name: value'",
        },
        materials_and_coatings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of materials or coatings identified",
        },
        performance_ratings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of performance ratings in format 'Rating name: value'",
        },
      },
      required: ["key_dimensions", "materials_and_coatings", "performance_ratings"],
    },
    commerce_readiness: {
      type: Type.OBJECT,
      properties: {
        missing_critical_data: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Critical missing or unreadable buyer-facing attributes",
        },
        suggested_cross_sell_items: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Related products or cross-sell recommendations",
        },
      },
      required: ["missing_critical_data", "suggested_cross_sell_items"],
    },
  },
  required: ["product_metadata", "extracted_technical_attributes", "commerce_readiness"],
};

// API Endpoint for Industrial Image Analysis
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", customNotes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: "Image base64 data is required.",
      });
    }

    // Clean base64 string if data URL prefix exists or fetch if remote URL
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType || "image/png";

    if (imageBase64.startsWith("http://") || imageBase64.startsWith("https://")) {
      try {
        const fetchRes = await fetch(imageBase64);
        const arrayBuf = await fetchRes.arrayBuffer();
        const contentType = fetchRes.headers.get("content-type");
        if (contentType) detectedMime = contentType;
        cleanBase64 = Buffer.from(arrayBuf).toString("base64");
      } catch (fetchErr: any) {
        return res.status(400).json({
          success: false,
          error: `Failed to fetch image from URL: ${fetchErr.message}`,
        });
      }
    } else if (imageBase64.startsWith("data:")) {
      const commaIdx = imageBase64.indexOf(",");
      if (commaIdx !== -1) {
        const header = imageBase64.substring(0, commaIdx);
        const dataPart = imageBase64.substring(commaIdx + 1);

        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch) {
          detectedMime = mimeMatch[1];
        }

        if (header.includes(";base64")) {
          cleanBase64 = dataPart;
        } else {
          // Plain text / URL encoded string (e.g., SVG utf8)
          const decoded = decodeURIComponent(dataPart);
          cleanBase64 = Buffer.from(decoded, "utf-8").toString("base64");
        }
      }
    }

    const ai = getGeminiClient();

    let parts: any[] = [];

    // If SVG, convert SVG content to text part or inline data
    if (detectedMime.includes("svg") || cleanBase64.startsWith("<svg") || cleanBase64.startsWith("%3Csvg")) {
      let svgText = "";
      try {
        svgText = Buffer.from(cleanBase64, "base64").toString("utf-8");
      } catch {
        svgText = cleanBase64;
      }
      parts.push({
        text: `Here is the SVG engineering drawing source code containing exact dimensions, labels, notes, title block, and vector specifications:\n\n${svgText}`,
      });
    } else {
      parts.push({
        inlineData: {
          mimeType: detectedMime.includes("image") ? detectedMime : "image/png",
          data: cleanBase64,
        },
      });
    }

    let promptText = "Analyze this industrial image/drawing/datasheet. Extract all visible engineering specs, dimensions, materials, and catalog metadata according to your system instructions.";
    if (customNotes) {
      promptText += `\nAdditional Inspector Context/Notes: ${customNotes}`;
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts,
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1, // Low temperature for deterministic factual engineering extraction
      },
    });

    const jsonText = response.text || "{}";
    let parsedData;

    try {
      // Clean possible code fences or surrounding text
      let cleaned = jsonText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      }
      // If there's still text before/after JSON object
      const startIdx = cleaned.indexOf("{");
      const endIdx = cleaned.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleaned = cleaned.substring(startIdx, endIdx + 1);
      }

      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response:", jsonText);
      return res.status(500).json({
        success: false,
        error: "Failed to parse structured JSON from vision OCR engine.",
        raw_text: jsonText,
      });
    }

    return res.json({
      success: true,
      data: parsedData,
      raw_text: jsonText,
      extracted_at: new Date().toISOString(),
      model_used: "gemini-3.6-flash",
    });
  } catch (err: any) {
    console.error("Error analyzing industrial image:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred during image OCR analysis.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
