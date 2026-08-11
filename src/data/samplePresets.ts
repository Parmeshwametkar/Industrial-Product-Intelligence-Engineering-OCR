import { SamplePreset } from "../types";

// Helper to construct crisp SVG data URLs representing engineering drawings/blueprints
function createSvgDataUrl(title: string, subtitle: string, svgContent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background:#0f172a; font-family:'Courier New', monospace, sans-serif;">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.8"/>
      </pattern>
      <pattern id="majorgrid" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#grid)"/>
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#334155" stroke-width="1.2"/>
      </pattern>
    </defs>
    <!-- Background Blueprint Grid -->
    <rect width="800" height="600" fill="#0b1329"/>
    <rect width="800" height="600" fill="url(#majorgrid)"/>
    <!-- Outer Drawing Border -->
    <rect x="20" y="20" width="760" height="560" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <rect x="25" y="25" width="750" height="550" fill="none" stroke="#1e40af" stroke-width="1"/>
    
    <!-- Header banner -->
    <text x="40" y="50" fill="#38bdf8" font-size="16" font-weight="bold">${title.toUpperCase()}</text>
    <text x="40" y="68" fill="#94a3b8" font-size="12">${subtitle}</text>
    
    <!-- Drawing Graphics -->
    ${svgContent}
    
    <!-- Standard Title Block -->
    <g transform="translate(480, 480)">
      <rect x="0" y="0" width="290" height="90" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <line x1="0" y1="30" x2="290" y2="30" stroke="#38bdf8" stroke-width="1"/>
      <line x1="0" y1="60" x2="290" y2="60" stroke="#38bdf8" stroke-width="1"/>
      <line x1="145" y1="30" x2="145" y2="90" stroke="#38bdf8" stroke-width="1"/>
      <text x="10" y="20" fill="#f8fafc" font-size="12" font-weight="bold">INDUSTRIAL DWG / CAT SPEC</text>
      <text x="10" y="48" fill="#94a3b8" font-size="10">SCALE: 1:1</text>
      <text x="10" y="78" fill="#94a3b8" font-size="10">UNIT: INCH / METRIC</text>
      <text x="155" y="48" fill="#f8fafc" font-size="10" font-weight="bold">REV: B.2</text>
      <text x="155" y="78" fill="#38bdf8" font-size="10" font-weight="bold">STAMP: APPROVED</text>
    </g>
  </svg>`;

  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "hex-bolt-drawing",
    title: "Grade 8 Hex Head Cap Screw CAD Drawing",
    category: "Fasteners / Bolts",
    description: "Dimensioned engineering drawing showing 3/8-16 UNC x 2 in Hex Bolt with thread length and head dimensions.",
    type: "drawing",
    imageDataUrl: createSvgDataUrl(
      "ENGINEERING BLUEPRINT — HEX HEAD CAP SCREW",
      "3/8-16 UNC x 2.00 INCH — GRADE 8 ZINC PLATED",
      `
      <!-- Bolt Head -->
      <polygon points="120,220 180,220 210,270 180,320 120,320 90,270" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <line x1="120" y1="220" x2="180" y2="320" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,3"/>
      
      <!-- Bolt Shank -->
      <rect x="210" y="240" width="320" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <!-- Thread section -->
      <g stroke="#f59e0b" stroke-width="1.5">
        <line x1="330" y1="240" x2="330" y2="300"/>
        <line x1="350" y1="240" x2="350" y2="300"/>
        <line x1="370" y1="240" x2="370" y2="300"/>
        <line x1="390" y1="240" x2="390" y2="300"/>
        <line x1="410" y1="240" x2="410" y2="300"/>
        <line x1="430" y1="240" x2="430" y2="300"/>
        <line x1="450" y1="240" x2="450" y2="300"/>
        <line x1="470" y1="240" x2="470" y2="300"/>
        <line x1="490" y1="240" x2="490" y2="300"/>
        <line x1="510" y1="240" x2="510" y2="300"/>
        <line x1="530" y1="240" x2="530" y2="300"/>
      </g>
      
      <!-- Dimension Lines & Callouts -->
      <!-- Length Dim -->
      <line x1="210" y1="360" x2="530" y2="360" stroke="#f43f5e" stroke-width="1.5"/>
      <line x1="210" y1="310" x2="210" y2="375" stroke="#f43f5e" stroke-width="1"/>
      <line x1="530" y1="310" x2="530" y2="375" stroke="#f43f5e" stroke-width="1"/>
      <text x="330" y="380" fill="#f43f5e" font-size="14" font-weight="bold">L = 2.00 in (50.8 mm)</text>
      
      <!-- Thread Length Dim -->
      <line x1="330" y1="200" x2="530" y2="200" stroke="#f43f5e" stroke-width="1.5"/>
      <line x1="330" y1="185" x2="330" y2="230" stroke="#f43f5e" stroke-width="1"/>
      <line x1="530" y1="185" x2="530" y2="230" stroke="#f43f5e" stroke-width="1"/>
      <text x="370" y="190" fill="#f43f5e" font-size="13" font-weight="bold">THD L = 1.25 in</text>
      
      <!-- Diameter Dim -->
      <line x1="560" y1="240" x2="560" y2="300" stroke="#f43f5e" stroke-width="1.5"/>
      <line x1="520" y1="240" x2="575" y2="240" stroke="#f43f5e" stroke-width="1"/>
      <line x1="520" y1="300" x2="575" y2="300" stroke="#f43f5e" stroke-width="1"/>
      <text x="585" y="275" fill="#f43f5e" font-size="13" font-weight="bold">Ø 3/8-16 UNC</text>

      <!-- Head Across Flats -->
      <text x="100" y="180" fill="#38bdf8" font-size="12" font-weight="bold">AF = 9/16 in (14.28 mm)</text>
      <text x="40" y="420" fill="#e2e8f0" font-size="13" font-weight="bold">NOTES:</text>
      <text x="40" y="440" fill="#94a3b8" font-size="12">1. MATERIAL: ALLOY STEEL GRADE 8 (SAE J429)</text>
      <text x="40" y="458" fill="#94a3b8" font-size="12">2. FINISH: ZINC PLATED (ZP) WITH CHROMATE PASSIVATION</text>
      <text x="40" y="476" fill="#94a3b8" font-size="12">3. THREAD CLASS: 2A UNIFIED NATIONAL COARSE</text>
      `
    ),
    mockData: {
      product_metadata: {
        predicted_commercial_name: "3/8-16 UNC × 2 in Grade 8 Zinc-Plated Hex Head Cap Screw",
        industrial_category: "Fasteners / Bolts / Hex Bolts",
        unspsc_code_guess: "31161620",
      },
      extracted_technical_attributes: {
        key_dimensions: [
          "Nominal Diameter: 9.525 mm (3/8 in)",
          "Threads Per Inch: 16 TPI (UNC)",
          "Overall Length: 50.8 mm (2.00 in)",
          "Thread Length: 31.75 mm (1.25 in)",
          "Head Width Across Flats: 14.28 mm (9/16 in)",
          "Thread Class: 2A",
        ],
        materials_and_coatings: [
          "Medium Carbon Alloy Steel Grade 8 (SAE J429)",
          "Zinc Plated (ZP) with Chromate Passivation",
        ],
        performance_ratings: [
          "Tensile Strength: 150,000 PSI min",
          "Yield Strength: 130,000 PSI min",
          "Hardness: Rockwell C33 - C39",
        ],
      },
      commerce_readiness: {
        missing_critical_data: [
          "Manufacturer Name / Part Number (Generic CAD Drawing)",
          "Package Quantity",
        ],
        suggested_cross_sell_items: [
          "3/8-16 UNC Grade 8 Hex Nut Zinc Plated",
          "3/8 in Grade 8 High-Strength Flat Washer",
          "3/8 in Split Lock Washer Zinc Plated",
        ],
      },
    },
  },
  {
    id: "hydraulic-valve-label",
    title: "Hydraulic Directional Control Valve Specification Plate",
    category: "Hydraulics / Valves",
    description: "Datasheet label from a 4-Way Solenoid Operated Hydraulic Directional Control Valve with pressure and flow ratings.",
    type: "nameplate",
    imageDataUrl: createSvgDataUrl(
      "MANUFACTURER NAMEPLATE — HYDRAULIC SOLENOID VALVE",
      "MODEL: 4WE6D6X/EG24N9K4 — 315 BAR (4560 PSI)",
      `
      <!-- Nameplate Container -->
      <rect x="120" y="120" width="560" height="320" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
      <!-- Header Bar -->
      <rect x="120" y="120" width="560" height="50" fill="#0369a1"/>
      <text x="140" y="152" fill="#ffffff" font-size="20" font-weight="bold">REX-FLUID HYDRAULICS</text>
      <text x="500" y="152" fill="#bae6fd" font-size="12" font-weight="bold">MADE IN GERMANY</text>
      
      <!-- Model and Specs -->
      <text x="150" y="200" fill="#38bdf8" font-size="14" font-weight="bold">MODEL: 4WE6D6X/EG24N9K4</text>
      <text x="150" y="225" fill="#f8fafc" font-size="13">TYPE: 4-WAY 2-POSITION SOLENOID DIRECTIONAL VALVE</text>
      <text x="150" y="250" fill="#f8fafc" font-size="13">MAX OPERATING PRESSURE: 315 bar (4560 PSI)</text>
      <text x="150" y="275" fill="#f8fafc" font-size="13">MAX FLOW RATE: 80 L/min (21.1 GPM)</text>
      <text x="150" y="300" fill="#f8fafc" font-size="13">SOLENOID VOLTAGE: 24V DC / 30W</text>
      <text x="150" y="325" fill="#f8fafc" font-size="13">PORT CONNECTIONS: CETOP 03 / NG6 / ISO 4401-03</text>
      <text x="150" y="350" fill="#f8fafc" font-size="13">FLUID: MINERAL OIL (HLP, HL) ISO VG 32..46</text>
      
      <!-- Hydraulic Schematic Symbols -->
      <rect x="480" y="200" width="170" height="110" fill="#0f172a" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="505" y="220" fill="#f59e0b" font-size="11" font-weight="bold">VALVE SCHEMATIC</text>
      <rect x="500" y="235" width="60" height="60" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="560" y="235" width="60" height="60" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
      <line x1="510" y1="245" x2="550" y2="285" stroke="#f43f5e" stroke-width="1.5"/>
      <line x1="550" y1="245" x2="510" y2="285" stroke="#f43f5e" stroke-width="1.5"/>
      <text x="500" y="310" fill="#94a3b8" font-size="10">P   A   B   T</text>
      
      <text x="150" y="395" fill="#f59e0b" font-size="12" font-weight="bold">SERIAL NO: 2026-8812904-B   |   IP CODE: IP65</text>
      `
    ),
    mockData: {
      product_metadata: {
        predicted_commercial_name: "Rex-Fluid 4WE6D6X/EG24N9K4 4-Way Solenoid Directional Control Valve (24V DC, 315 Bar)",
        industrial_category: "Hydraulic Valves / Directional Control Valves",
        unspsc_code_guess: "40141600",
      },
      extracted_technical_attributes: {
        key_dimensions: [
          "Mounting Interface Pattern: CETOP 03 / NG6 / ISO 4401-03-02-0-05",
          "Port Connections: Subplate Mounted (P, A, B, T)",
        ],
        materials_and_coatings: [
          "Cast Iron Body with Phosphate Coated Surface",
          "Hardened Steel Spool and Zinc-Plated Solenoid Coil Housing",
        ],
        performance_ratings: [
          "Maximum Working Pressure: 315 bar (4560 psi)",
          "Maximum Flow Rate: 80 L/min (21.1 gpm)",
          "Control Voltage: 24V DC",
          "Power Consumption: 30 W",
          "Ingress Protection Rating: IP65",
          "Fluid Compatibility: Mineral Oil (HLP, HL) ISO VG 32 to 46",
        ],
      },
      commerce_readiness: {
        missing_critical_data: [
          "Seal Material Specification (NBR or FKM/Viton)",
          "Manual Override Type (Push-pin vs Turn lock)",
        ],
        suggested_cross_sell_items: [
          "CETOP 03 (NG6) Hydraulic Subplate G3/8 in Ports",
          "DIN 43650 Form A Solenoid Connector Plug with LED Indicator",
          "Viton / NBR O-Ring Seal Replacement Kit for NG6 Valve",
        ],
      },
    },
  },
  {
    id: "flanged-bearing-blueprint",
    title: "UCFL 205-16 2-Bolt Flanged Pillow Block Bearing Assembly",
    category: "Bearings / Mounted Bearings",
    description: "Detailed engineering drawing for a 1-inch bore 2-bolt oval flanged mounted ball bearing unit.",
    type: "blueprint",
    imageDataUrl: createSvgDataUrl(
      "BEARING ENGINEERING SPECIFICATION — UCFL 205-16",
      "2-BOLT OVAL FLANGED HOUSING — 1.000 INCH BORE",
      `
      <!-- Flange Body Oval -->
      <ellipse cx="280" cy="270" rx="140" ry="200" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <!-- Inner Bearing Rings -->
      <circle cx="280" cy="270" r="80" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
      <circle cx="280" cy="270" r="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="280" cy="270" r="35" fill="#0b1329" stroke="#f59e0b" stroke-width="1.5"/>
      
      <!-- Mounting Holes -->
      <circle cx="280" cy="110" r="16" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
      <circle cx="280" cy="430" r="16" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
      
      <!-- Dimension overlay -->
      <!-- Bolt Center distance e -->
      <line x1="430" y1="110" x2="430" y2="430" stroke="#f43f5e" stroke-width="1.5"/>
      <line x1="280" y1="110" x2="445" y2="110" stroke="#f43f5e" stroke-width="1"/>
      <line x1="280" y1="430" x2="445" y2="430" stroke="#f43f5e" stroke-width="1"/>
      <text x="455" y="275" fill="#f43f5e" font-size="13" font-weight="bold">e = 99 mm (3.898 in)</text>
      
      <!-- Bore diameter -->
      <line x1="245" y1="270" x2="315" y2="270" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="220" y="260" fill="#f59e0b" font-size="12" font-weight="bold">d = 1.000 in (25.4 mm)</text>

      <!-- Side Callout specs -->
      <rect x="510" y="100" width="240" height="340" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="525" y="130" fill="#38bdf8" font-size="14" font-weight="bold">TECHNICAL SPECS</text>
      <text x="525" y="160" fill="#e2e8f0" font-size="12">MODEL: UCFL 205-16</text>
      <text x="525" y="185" fill="#e2e8f0" font-size="12">HOUSING: HT200 CAST IRON</text>
      <text x="525" y="210" fill="#e2e8f0" font-size="12">BEARING: GCR15 CHROME STEEL</text>
      <text x="525" y="235" fill="#e2e8f0" font-size="12">MOUNTING BOLT: M10 (3/8 in)</text>
      <text x="525" y="260" fill="#e2e8f0" font-size="12">DYN LOAD C: 14.0 kN</text>
      <text x="525" y="285" fill="#e2e8f0" font-size="12">STAT LOAD C0: 7.85 kN</text>
      <text x="525" y="310" fill="#e2e8f0" font-size="12">LOCKING: SET SCREW (2x M6)</text>
      <text x="525" y="335" fill="#e2e8f0" font-size="12">SEAL: CONTACT RUBBER SLINGER</text>
      <text x="525" y="360" fill="#e2e8f0" font-size="12">GREASE NIPPLE: 1/4-28 UNF</text>
      `
    ),
    mockData: {
      product_metadata: {
        predicted_commercial_name: "UCFL 205-16 1 in Bore 2-Bolt Oval Flange Cast Iron Mounted Ball Bearing Unit",
        industrial_category: "Bearings / Mounted Bearings / Flange Mounted Bearings",
        unspsc_code_guess: "31171501",
      },
      extracted_technical_attributes: {
        key_dimensions: [
          "Bore Diameter: 25.4 mm (1.000 in)",
          "Bolt Hole Center-to-Center Distance: 99 mm (3.898 in)",
          "Overall Housing Height: 130 mm (5.118 in)",
          "Overall Housing Width: 68 mm (2.677 in)",
          "Bolt Hole Diameter: 16 mm (for 3/8 in or M10 bolts)",
          "Set Screw Size: 2 × M6 × 0.75",
        ],
        materials_and_coatings: [
          "Housing Material: HT200 Grey Cast Iron",
          "Bearing Insert Material: GCr15 High Carbon Chromium Bearing Steel",
          "Seal Material: Nitrile Rubber (NBR) with Steel Slinger",
        ],
        performance_ratings: [
          "Basic Dynamic Load Rating (Cr): 14.0 kN (3147 lbf)",
          "Basic Static Load Rating (Cor): 7.85 kN (1764 lbf)",
          "Maximum RPM: 3400 RPM (Grease Lubrication)",
          "Operating Temperature Range: -15°C to +100°C",
        ],
      },
      commerce_readiness: {
        missing_critical_data: [
          "Specific Manufacturer Name / Brand (Generic UCFL Designation)",
          "Pre-lubricated Grease Type / NLGI Grade",
        ],
        suggested_cross_sell_items: [
          "Grade 5 3/8-16 UNC x 1-1/2 in Hex Head Bolts & Lock Nuts",
          "1 in Diameter Precision Ground Keyed Carbon Steel Shaft",
          "1/4-28 UNF Grease Gun Coupler Hose",
        ],
      },
    },
  },
  {
    id: "pneumatic-cylinder-schematic",
    title: "ISO 15552 Pneumatic Air Cylinder Technical Datasheet",
    category: "Pneumatics / Cylinders",
    description: "Double acting pneumatic air cylinder drawing with adjustable end-position cushioning specifications.",
    type: "schematic",
    imageDataUrl: createSvgDataUrl(
      "PNEUMATIC CYLINDER — ISO 15552 SPECIFICATION",
      "MODEL: DNC-50-100-PPV-A — 50 MM BORE x 100 MM STROKE",
      `
      <!-- Cylinder Body -->
      <rect x="180" y="200" width="340" height="120" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <rect x="150" y="180" width="30" height="160" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
      <rect x="520" y="180" width="30" height="160" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
      
      <!-- Piston Rod -->
      <rect x="550" y="240" width="160" height="40" fill="#64748b" stroke="#e2e8f0" stroke-width="1.5"/>
      
      <!-- Port Connectors -->
      <rect x="200" y="140" width="40" height="40" fill="#f59e0b" stroke="#ffffff"/>
      <rect x="460" y="140" width="40" height="40" fill="#f59e0b" stroke="#ffffff"/>
      <text x="208" y="130" fill="#f59e0b" font-size="11" font-weight="bold">PORT A</text>
      <text x="468" y="130" fill="#f59e0b" font-size="11" font-weight="bold">PORT B</text>

      <!-- Dimension Lines -->
      <line x1="180" y1="380" x2="520" y2="380" stroke="#f43f5e" stroke-width="1.5"/>
      <line x1="180" y1="350" x2="180" y2="395" stroke="#f43f5e" stroke-width="1"/>
      <line x1="520" y1="350" x2="520" y2="395" stroke="#f43f5e" stroke-width="1"/>
      <text x="280" y="400" fill="#f43f5e" font-size="13" font-weight="bold">STROKE = 100 mm (3.937 in)</text>
      
      <line x1="100" y1="200" x2="100" y2="320" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="30" y="265" fill="#38bdf8" font-size="13" font-weight="bold">Ø 50 mm</text>

      <!-- Tech Notes -->
      <rect x="40" y="440" width="720" height="110" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
      <text x="60" y="465" fill="#f8fafc" font-size="13" font-weight="bold">SPECS: DNC-50-100-PPV-A | ISO 15552 / VDMA 24562</text>
      <text x="60" y="488" fill="#94a3b8" font-size="12">OP PRESSURE: 0.6 - 10 bar (8.7 - 145 PSI)  |  TEMP: -20°C to +80°C</text>
      <text x="60" y="508" fill="#94a3b8" font-size="12">BARREL: ANODIZED ALUMINUM  |  ROD: HIGH ALLOY STAINLESS STEEL (M16x1.5)</text>
      <text x="60" y="528" fill="#94a3b8" font-size="12">PORT THREAD: G 1/4 in BSPP  |  CUSHIONING: ADJUSTABLE BOTH ENDS (PPV)</text>
      `
    ),
    mockData: {
      product_metadata: {
        predicted_commercial_name: "DNC-50-100-PPV-A ISO 15552 Double Acting Pneumatic Cylinder (50 mm Bore x 100 mm Stroke)",
        industrial_category: "Pneumatics / Cylinders & Actuators / Tie-Rod Air Cylinders",
        unspsc_code_guess: "40141612",
      },
      extracted_technical_attributes: {
        key_dimensions: [
          "Piston Bore Diameter: 50 mm (1.968 in)",
          "Stroke Length: 100 mm (3.937 in)",
          "Piston Rod Thread: M16 × 1.5",
          "Pneumatic Port Size: G 1/4 in BSPP",
          "Mounting Standard: ISO 15552 / VDMA 24562",
        ],
        materials_and_coatings: [
          "Cylinder Barrel: Smooth Anodized Aluminum Wrought Alloy",
          "Piston Rod: High Alloy Stainless Steel (Polished)",
          "End Caps: Die-cast Aluminum Painted",
          "Seals: Polyurethane (PU) / NBR",
        ],
        performance_ratings: [
          "Operating Pressure Range: 0.6 to 10 bar (8.7 to 145 psi)",
          "Theoretical Force at 6 bar (Advance): 1178 N (265 lbf)",
          "Operating Temperature Range: -20°C to +80°C",
          "Cushioning Type: Adjustable Pneumatic End-Position Cushioning (PPV)",
          "Position Sensing: Magnetic Piston for Proximity Sensor Ring",
        ],
      },
      commerce_readiness: {
        missing_critical_data: [
          "Exact Manufacturer Brand Name (Festo/Aignep compatible generic)",
          "Mounting Foot Bracket Included or Sold Separately",
        ],
        suggested_cross_sell_items: [
          "G 1/4 in Push-to-Connect Fitting for 8 mm OD Tubing",
          "ISO 15552 Foot Mounting Bracket Cinch Kit for 50 mm Cylinder",
          "Solid-State Magnetic Cylinder Position Sensor (M8 Connector)",
        ],
      },
    },
  },
  {
    id: "ball-valve-label",
    title: "316 Stainless Steel NPT Ball Valve Nameplate",
    category: "Valves / Ball Valves",
    description: "2-Piece Full Port Stainless Steel Ball Valve rating label showing 1000 WOG and PTFE seat specifications.",
    type: "photo",
    imageDataUrl: createSvgDataUrl(
      "VALVE SPECIFICATION TAG — STAINLESS STEEL BALL VALVE",
      "1 INCH NPT — 1000 WOG (6.89 MPA) — 316 SS BODY",
      `
      <!-- Valve Tag Container -->
      <rect x="160" y="140" width="480" height="300" rx="16" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
      
      <!-- Stamped Metal Look -->
      <rect x="180" y="160" width="440" height="260" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <text x="210" y="200" fill="#10b981" font-size="18" font-weight="bold">FLOW-TECH INDUSTRIAL VALVES</text>
      
      <line x1="200" y1="215" x2="600" y2="215" stroke="#10b981" stroke-width="1"/>
      
      <text x="210" y="245" fill="#f8fafc" font-size="14" font-weight="bold">SIZE: 1 in (DN25) FULL PORT</text>
      <text x="210" y="275" fill="#f8fafc" font-size="14">PRESSURE RATING: 1000 WOG (6.89 MPa / 1000 PSI)</text>
      <text x="210" y="305" fill="#f8fafc" font-size="14">BODY MATERIAL: ASTM A351 CF8M (316 STAINLESS STEEL)</text>
      <text x="210" y="335" fill="#f8fafc" font-size="14">SEAT & PACKING: PTFE / R-PTFE (TEFLON)</text>
      <text x="210" y="365" fill="#f8fafc" font-size="14">TEMP RANGE: -20°F to 400°F (-29°C to 204°C)</text>
      <text x="210" y="395" fill="#f59e0b" font-size="13" font-weight="bold">THREAD STANDARD: ANSI B1.20.1 NPT FEMALE</text>
      `
    ),
    mockData: {
      product_metadata: {
        predicted_commercial_name: "1 in NPT 1000 WOG 316 Stainless Steel 2-Piece Full Port Ball Valve",
        industrial_category: "Valves / Ball Valves / Threaded Ball Valves",
        unspsc_code_guess: "40141607",
      },
      extracted_technical_attributes: {
        key_dimensions: [
          "Nominal Pipe Size (NPS): 1 inch (DN25)",
          "Thread Type: Female National Pipe Taper (NPT) ANSI B1.20.1",
          "Port Type: Full Port (Unrestricted Flow Path)",
        ],
        materials_and_coatings: [
          "Body & Ball Material: ASTM A351 CF8M (316 Stainless Steel)",
          "Stem Material: 316 Stainless Steel",
          "Seat & Stem Seals: Reinforced PTFE (Teflon)",
          "Handle Sleeve: Vinyl Insulated Yellow Dip",
        ],
        performance_ratings: [
          "Maximum Cold Working Pressure: 1000 WOG (1000 PSI / 6.89 MPa Water, Oil, Gas)",
          "Maximum Saturated Steam Pressure: 150 PSI WSP",
          "Operating Temperature Range: -29°C to +204°C (-20°F to +400°F)",
          "Blow-out Proof Stem Design",
          "Locking Device Handle Included",
        ],
      },
      commerce_readiness: {
        missing_critical_data: [
          "Manufacturer Model / Part Number",
          "NACE MR0175 Compliance Certification Status",
        ],
        suggested_cross_sell_items: [
          "1 in NPT Male Stainless Steel 316 Hex Nipple",
          "PTFE Industrial Thread Sealant Tape (1/2 in x 520 in)",
          "1 in NPT Female Stainless Steel 316 Y-Strainer Filter",
        ],
      },
    },
  },
];
