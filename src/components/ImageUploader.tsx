import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Sparkles, FileText, Camera, Link as LinkIcon, AlertCircle } from "lucide-react";
import { SAMPLE_PRESETS } from "../data/samplePresets";

interface ImageUploaderProps {
  onImageSelected: (base64Data: string, mimeType: string, imageName: string) => void;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId?: string;
  isAnalyzing: boolean;
  customNotes: string;
  setCustomNotes: (notes: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onSelectPreset,
  selectedPresetId,
  isAnalyzing,
  customNotes,
  setCustomNotes,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlModal, setShowUrlModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      onImageSelected(base64Data, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    // For external URLs, we pass data URL or fetch
    onImageSelected(urlInput.trim(), "image/png", "Remote Image URL");
    setShowUrlModal(false);
    setUrlInput("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
            1. Select or Upload Industrial Source Document
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Supports Drawing, Blueprint, Datasheet, Photo & Label
        </span>
      </div>

      {/* Preset Quick Loader Row */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 font-mono flex items-center justify-between">
          <span>Quick Sample Presets (Click to Test OCR Engine):</span>
          <span className="text-[11px] text-cyan-400 font-normal">
            No image handy? Try an engineering sample
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                disabled={isAnalyzing}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                  isSelected
                    ? "bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                }`}
              >
                <div className="space-y-1">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700">
                    {preset.type}
                  </span>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug">
                    {preset.title}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{preset.category}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div className="relative">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[140px] ${
            dragActive
              ? "border-cyan-400 bg-cyan-950/30 text-cyan-300 scale-[0.99]"
              : "border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              Drag & drop mechanical drawing, blueprint, datasheet image here
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              PNG, JPG, WEBP, SVG up to 25MB • High resolution recommended for text OCR
            </p>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowUrlModal(true)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 hover:underline"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Or load from image URL</span>
          </button>
        </div>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 font-mono">Load Image from Remote URL</h3>
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/drawing.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
                >
                  Load Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Context / Notes Input for Inspector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Inspector Guidance / Specific Focus (Optional):</span>
        </label>
        <input
          type="text"
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="e.g., Focus on title block in bottom-right, or verify thread class in callouts"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
        />
      </div>
    </div>
  );
};
