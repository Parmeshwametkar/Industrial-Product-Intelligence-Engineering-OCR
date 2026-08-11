import React from "react";
import { Cpu, FileSpreadsheet, ShieldCheck, Sparkles, Layers, Activity } from "lucide-react";

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  onSelectPreset: (id: string) => void;
  selectedPresetId?: string;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
  onSelectPreset,
  selectedPresetId,
  hasApiKey,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title and Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-mono">
                Industrial Product Intelligence & Engineering OCR
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                Gemini 3.6 Vision
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Blueprint, CAD drawing, label & datasheet parser for e-commerce catalog engineering
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="font-mono text-[11px] text-slate-300">
              {hasApiKey ? "Engine Ready" : "API Key Active"}
            </span>
          </div>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Extraction History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold font-mono">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
