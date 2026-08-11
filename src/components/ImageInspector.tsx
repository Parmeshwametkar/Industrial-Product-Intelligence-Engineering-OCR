import React, { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sun, Contrast, Maximize2, Sparkles, Loader2, Grid } from "lucide-react";

interface ImageInspectorProps {
  imageDataUrl: string | null;
  imageName: string;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const ImageInspector: React.FC<ImageInspectorProps> = ({
  imageDataUrl,
  imageName,
  onAnalyze,
  isAnalyzing,
}) => {
  const [zoom, setZoom] = useState(1);
  const [invert, setInvert] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [showGrid, setShowGrid] = useState(false);

  if (!imageDataUrl) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[360px] text-slate-400">
        <Eye className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-300">No Image Loaded for Forensic Inspection</p>
        <p className="text-xs text-slate-400 mt-1">
          Select a sample preset above or upload an engineering drawing to inspect
        </p>
      </div>
    );
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setInvert(false);
    setHighContrast(false);
    setBrightness(100);
    setShowGrid(false);
  };

  // Filter style calculation
  const filterStyle = `
    ${invert ? "invert(1) hue-rotate(180deg)" : ""}
    ${highContrast ? "contrast(180%)" : "contrast(100%)"}
    brightness(${brightness}%)
  `.trim();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header Bar with Image Name & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
            Source Image Inspection Stage
          </span>
          <h3 className="text-sm font-semibold text-slate-200 truncate max-w-md font-mono">
            {imageName}
          </h3>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-1 min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setInvert(!invert)}
            title="Invert Blueprint Colors (Dark/Light)"
            className={`p-1.5 rounded-lg border transition-colors ${
              invert
                ? "bg-cyan-950 border-cyan-500 text-cyan-300"
                : "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            title="High Contrast for Reading Faint OCR Text"
            className={`p-1.5 rounded-lg border transition-colors ${
              highContrast
                ? "bg-cyan-950 border-cyan-500 text-cyan-300"
                : "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Inspection Grid Overlay"
            className={`p-1.5 rounded-lg border transition-colors ${
              showGrid
                ? "bg-cyan-950 border-cyan-500 text-cyan-300"
                : "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            title="Reset Filters & Zoom"
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[380px] max-h-[500px] flex items-center justify-center p-4">
        {/* Optional Inspection Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-10"
            style={{
              backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        )}

        <div className="relative overflow-auto max-w-full max-h-full flex items-center justify-center">
          <img
            src={imageDataUrl}
            alt={imageName}
            style={{
              transform: `scale(${zoom})`,
              filter: filterStyle,
              transition: "transform 0.15s ease-out, filter 0.2s ease",
            }}
            className="max-h-[440px] w-auto object-contain rounded shadow-2xl"
          />
        </div>
      </div>

      {/* Primary OCR Extraction Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Click below to initiate high-accuracy engineering OCR and catalog extraction
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Analyzing Image Forensics & OCR...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Convert Image to Industrial Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
