import React from "react";
import { ExtractionHistoryItem } from "../types";
import { X, Layers, Trash2, Download, Eye } from "lucide-react";

interface BatchHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ExtractionHistoryItem[];
  onSelectHistoryItem: (item: ExtractionHistoryItem) => void;
  onClearHistory: () => void;
}

export const BatchHistoryDrawer: React.FC<BatchHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const handleExportBatchCsv = () => {
    if (history.length === 0) return;

    const rows = [
      ["Timestamp", "Image Name", "Commercial Title", "Category", "UNSPSC", "Dimensions", "Materials", "Ratings"],
      ...history.map((item) => [
        item.timestamp,
        item.imageName,
        item.data.product_metadata.predicted_commercial_name,
        item.data.product_metadata.industrial_category,
        item.data.product_metadata.unspsc_code_guess,
        item.data.extracted_technical_attributes.key_dimensions.join(" | "),
        item.data.extracted_technical_attributes.materials_and_coatings.join(" | "),
        item.data.extracted_technical_attributes.performance_ratings.join(" | "),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `batch_catalog_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              Extraction History ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        {history.length > 0 && (
          <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={handleExportBatchCsv}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono inline-flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Batch CSV</span>
            </button>
            <button
              onClick={onClearHistory}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-400 text-xs font-mono inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Layers className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-mono">No extraction history yet.</p>
              <p className="text-[11px] text-slate-400">
                Processed drawings and datasheets will appear here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-3 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold truncate max-w-[180px]">
                    {item.data.product_metadata.industrial_category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 font-mono line-clamp-2 leading-snug">
                  {item.data.product_metadata.predicted_commercial_name}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                  <span className="truncate max-w-[180px]">{item.imageName}</span>
                  <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold">
                    <Eye className="w-3 h-3" /> View Data
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
