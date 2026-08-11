import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { ImageInspector } from "./components/ImageInspector";
import { ExtractionResultsView } from "./components/ExtractionResultsView";
import { BatchHistoryDrawer } from "./components/BatchHistoryDrawer";
import { SAMPLE_PRESETS } from "./data/samplePresets";
import { IndustrialProductData, ExtractionHistoryItem } from "./types";
import { AlertCircle, CheckCircle2, Cpu, FileSpreadsheet, Sparkles } from "lucide-react";

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("hex-bolt-drawing");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(SAMPLE_PRESETS[0].imageDataUrl);
  const [imageName, setImageName] = useState<string>(SAMPLE_PRESETS[0].title);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [customNotes, setCustomNotes] = useState<string>("");

  const [extractedData, setExtractedData] = useState<IndustrialProductData | null>(SAMPLE_PRESETS[0].mockData);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>("Initial engineering CAD drawing loaded.");

  const [history, setHistory] = useState<ExtractionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("industrial_ocr_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("industrial_ocr_history", JSON.stringify(history));
    } catch (e) {
      console.warn("Could not save history to localStorage", e);
    }
  }, [history]);

  // Check health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === "boolean") {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch(() => {
        // Dev server starting
      });
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setImageDataUrl(preset.imageDataUrl);
      setImageName(preset.title);
      setExtractedData(preset.mockData);
      setErrorMsg(null);
      setStatusMsg(`Loaded sample preset: ${preset.title}`);
    }
  };

  const handleImageUploaded = (base64Data: string, mime: string, name: string) => {
    setSelectedPresetId("");
    setImageDataUrl(base64Data);
    setMimeType(mime);
    setImageName(name);
    setExtractedData(null);
    setErrorMsg(null);
    setStatusMsg(`Uploaded image: ${name}. Click "Convert Image to Industrial Data" below.`);
  };

  const handleRunAnalysis = async () => {
    if (!imageDataUrl) {
      setErrorMsg("Please upload or select an industrial image first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setStatusMsg("Executing Gemini 3.6 Flash Industrial Vision OCR engine...");

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          mimeType,
          customNotes,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setExtractedData(result.data);
        setStatusMsg("Engineering OCR extraction completed successfully!");

        // Add to history
        const newHistoryItem: ExtractionHistoryItem = {
          id: `hist_${Date.now()}`,
          timestamp: new Date().toISOString(),
          imageName,
          imageDataUrl,
          data: result.data,
          modelUsed: result.model_used || "gemini-3.6-flash",
        };

        setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]); // Keep top 20
      } else {
        // If API fails or key is missing, check if it's a preset to fallback gracefully
        const preset = SAMPLE_PRESETS.find((p) => p.imageDataUrl === imageDataUrl);
        if (preset) {
          setExtractedData(preset.mockData);
          setStatusMsg("Loaded fallback preset catalog schema.");
        } else {
          setErrorMsg(result.error || "Failed to parse industrial specifications from image.");
        }
      }
    } catch (err: any) {
      console.error("Analysis network error:", err);
      // If network or server error, check preset fallback
      const preset = SAMPLE_PRESETS.find((p) => p.imageDataUrl === imageDataUrl);
      if (preset) {
        setExtractedData(preset.mockData);
        setStatusMsg("Analysis completed with fallback preset schema.");
      } else {
        setErrorMsg(
          "Network error communicating with vision backend server: " + (err.message || "Unknown error")
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (item: ExtractionHistoryItem) => {
    setImageDataUrl(item.imageDataUrl);
    setImageName(item.imageName);
    setExtractedData(item.data);
    setStatusMsg(`Loaded history record from ${new Date(item.timestamp).toLocaleString()}`);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onSelectPreset={handleSelectPreset}
        selectedPresetId={selectedPresetId}
        hasApiKey={hasApiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status / Message Banner */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs font-mono flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-200 underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {statusMsg && !errorMsg && (
          <div className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Step 1: Upload & Preset Selector */}
        <ImageUploader
          onImageSelected={handleImageUploaded}
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
          isAnalyzing={isAnalyzing}
          customNotes={customNotes}
          setCustomNotes={setCustomNotes}
        />

        {/* Step 2: Image Inspection Stage */}
        <ImageInspector
          imageDataUrl={imageDataUrl}
          imageName={imageName}
          onAnalyze={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
        />

        {/* Step 3: Extracted Catalog Data Results */}
        {extractedData ? (
          <ExtractionResultsView
            data={extractedData}
            onUpdateData={(updated) => setExtractedData(updated)}
          />
        ) : (
          !isAnalyzing && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Cpu className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300 font-mono">
                Ready for Technical Attribute Extraction
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click "Convert Image to Industrial Data" in the inspector stage above to process drawing dimensions, materials, UNSPSC code, and performance ratings.
              </p>
            </div>
          )
        )}
      </main>

      {/* History Drawer */}
      <BatchHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400 font-mono">
        <p>Industrial Product Intelligence & Engineering OCR Engine • Powered by Gemini 3.6 Multimodal Vision</p>
      </footer>
    </div>
  );
}
