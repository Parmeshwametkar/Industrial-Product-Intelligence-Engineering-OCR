import React, { useState } from "react";
import {
  IndustrialProductData,
  ProductMetadata,
  ExtractedTechnicalAttributes,
  CommerceReadiness,
} from "../types";
import {
  Check,
  Copy,
  Download,
  AlertTriangle,
  ShoppingCart,
  FileCode,
  Tag,
  Ruler,
  Shield,
  Gauge,
  PackageCheck,
  Edit3,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ExtractionResultsViewProps {
  data: IndustrialProductData;
  onUpdateData?: (updated: IndustrialProductData) => void;
  extractedAt?: string;
  modelUsed?: string;
}

export const ExtractionResultsView: React.FC<ExtractionResultsViewProps> = ({
  data,
  onUpdateData,
  extractedAt,
  modelUsed,
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "json" | "edit" | "export">("catalog");
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [editState, setEditState] = useState<IndustrialProductData>(data);

  // Keep local edit state in sync if data changes
  React.useEffect(() => {
    setEditState(data);
  }, [data]);

  const handleCopyJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catalog_item_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const md = `
# ${data.product_metadata.predicted_commercial_name}

**Industrial Category:** ${data.product_metadata.industrial_category}
**UNSPSC Code:** ${data.product_metadata.unspsc_code_guess || "N/A"}

## Technical Attributes

### Key Dimensions
${data.extracted_technical_attributes.key_dimensions.map((d) => `- ${d}`).join("\n")}

### Materials & Coatings
${data.extracted_technical_attributes.materials_and_coatings.map((m) => `- ${m}`).join("\n")}

### Performance Ratings
${data.extracted_technical_attributes.performance_ratings.map((p) => `- ${p}`).join("\n")}

## Commerce Readiness
### Missing Critical Attributes
${data.commerce_readiness.missing_critical_data.map((m) => `- ${m}`).join("\n")}

### Suggested Cross-Sell Accessories
${data.commerce_readiness.suggested_cross_sell_items.map((c) => `- ${c}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ["Commercial Title", data.product_metadata.predicted_commercial_name],
      ["Category", data.product_metadata.industrial_category],
      ["UNSPSC Code", data.product_metadata.unspsc_code_guess],
      ["Key Dimensions", data.extracted_technical_attributes.key_dimensions.join(" | ")],
      ["Materials & Coatings", data.extracted_technical_attributes.materials_and_coatings.join(" | ")],
      ["Performance Ratings", data.extracted_technical_attributes.performance_ratings.join(" | ")],
      ["Missing Critical Data", data.commerce_readiness.missing_critical_data.join(" | ")],
      ["Cross Sell Items", data.commerce_readiness.suggested_cross_sell_items.join(" | ")],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `catalog_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEdits = () => {
    if (onUpdateData) {
      onUpdateData(editState);
    }
    setActiveTab("catalog");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Extracted E-Commerce Catalog Specification</span>
          </span>
          <h2 className="text-base font-bold text-slate-100 font-mono mt-0.5">
            Structured Product Data Output
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "catalog"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Catalog View
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "json"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Raw JSON
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "edit"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Edit / Override
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "export"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Export
          </button>
        </div>
      </div>

      {/* TAB 1: E-COMMERCE CATALOG CARD VIEW */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Main Title & Metadata Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80 text-xs font-mono font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" />
                {data.product_metadata.industrial_category}
              </span>

              {data.product_metadata.unspsc_code_guess && (
                <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
                  UNSPSC: <strong className="text-cyan-400">{data.product_metadata.unspsc_code_guess}</strong>
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-100 font-mono leading-snug">
              {data.product_metadata.predicted_commercial_name}
            </h3>
          </div>

          {/* Technical Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Key Dimensions */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <Ruler className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Key Dimensions
                </h4>
              </div>
              {data.extracted_technical_attributes.key_dimensions.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No dimensions extracted from image</p>
              ) : (
                <ul className="space-y-2">
                  {data.extracted_technical_attributes.key_dimensions.map((dim, idx) => {
                    const parts = dim.split(":");
                    return (
                      <li key={idx} className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800/60 font-mono">
                        {parts.length > 1 ? (
                          <>
                            <span className="text-slate-400 font-semibold">{parts[0].trim()}: </span>
                            <span className="text-cyan-300 font-bold">{parts.slice(1).join(":").trim()}</span>
                          </>
                        ) : (
                          <span className="text-slate-200">{dim}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 2. Materials & Coatings */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Materials & Coatings
                </h4>
              </div>
              {data.extracted_technical_attributes.materials_and_coatings.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No material/coating visible in image</p>
              ) : (
                <ul className="space-y-2">
                  {data.extracted_technical_attributes.materials_and_coatings.map((mat, idx) => (
                    <li key={idx} className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800/60 font-mono text-slate-200">
                      • {mat}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 3. Performance Ratings */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Performance Ratings
                </h4>
              </div>
              {data.extracted_technical_attributes.performance_ratings.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No explicit ratings visible in image</p>
              ) : (
                <ul className="space-y-2">
                  {data.extracted_technical_attributes.performance_ratings.map((rate, idx) => {
                    const parts = rate.split(":");
                    return (
                      <li key={idx} className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800/60 font-mono">
                        {parts.length > 1 ? (
                          <>
                            <span className="text-slate-400 font-semibold">{parts[0].trim()}: </span>
                            <span className="text-emerald-300 font-bold">{parts.slice(1).join(":").trim()}</span>
                          </>
                        ) : (
                          <span className="text-slate-200">{rate}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Commerce Readiness Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Missing Critical Data Warnings */}
            <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-amber-900/40 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-200 uppercase font-mono tracking-wider">
                  Missing Critical Buyer Data
                </h4>
              </div>
              {data.commerce_readiness.missing_critical_data.length === 0 ? (
                <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> All critical buyer attributes successfully identified!
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.commerce_readiness.missing_critical_data.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs bg-slate-950/80 p-2.5 rounded-lg border border-amber-900/40 text-amber-300 font-mono flex items-start gap-2"
                    >
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Suggested Cross-Sell Items */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Suggested Cross-Sell Items
                </h4>
              </div>
              {data.commerce_readiness.suggested_cross_sell_items.length === 0 ? (
                <p className="text-xs text-slate-500 italic font-mono">No cross-sell recommendations</p>
              ) : (
                <ul className="space-y-2">
                  {data.commerce_readiness.suggested_cross_sell_items.map((cross, idx) => (
                    <li
                      key={idx}
                      className="text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800/60 font-mono text-slate-200 flex items-center justify-between gap-2"
                    >
                      <span>{cross}</span>
                      <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
                        Related
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RAW JSON VIEW */}
      {activeTab === "json" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Valid JSON output matching requested schema specification
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-mono font-bold text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* TAB 3: EDIT / OVERRIDE MODE */}
      {activeTab === "edit" && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Override / Refine Extracted Attributes</span>
            </h4>

            {/* Commercial Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Predicted Commercial Title:</label>
              <input
                type="text"
                value={editState.product_metadata.predicted_commercial_name}
                onChange={(e) =>
                  setEditState({
                    ...editState,
                    product_metadata: {
                      ...editState.product_metadata,
                      predicted_commercial_name: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>

            {/* Category & UNSPSC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Industrial Category:</label>
                <input
                  type="text"
                  value={editState.product_metadata.industrial_category}
                  onChange={(e) =>
                    setEditState({
                      ...editState,
                      product_metadata: {
                        ...editState.product_metadata,
                        industrial_category: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">UNSPSC Code:</label>
                <input
                  type="text"
                  value={editState.product_metadata.unspsc_code_guess}
                  onChange={(e) =>
                    setEditState({
                      ...editState,
                      product_metadata: {
                        ...editState.product_metadata,
                        unspsc_code_guess: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditState(data)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300"
              >
                Reset
              </button>
              <button
                onClick={handleSaveEdits}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
              >
                Save Overrides
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CATALOG EXPORT SUITE */}
      {activeTab === "export" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>CSV Catalog Sheet</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Export product attributes into standard CSV for Excel or ERP import
                </p>
              </div>
              <button
                onClick={handleDownloadCsv}
                className="w-full mt-3 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export to CSV</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>Markdown Catalog Spec</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Copy pre-formatted Markdown for e-commerce product descriptions
                </p>
              </div>
              <button
                onClick={handleCopyMarkdown}
                className="w-full mt-3 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedMarkdown ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Markdown Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Markdown Spec</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>JSON Specification</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Download exact schema JSON object for API & database sync
                </p>
              </div>
              <button
                onClick={handleDownloadJson}
                className="w-full mt-3 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-mono font-bold text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON Object</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
