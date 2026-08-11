import React, { useState } from "react";
import { QAReport } from "../types";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Copy,
  Check,
  Download,
  AlertOctagon,
  FileSearch,
  CheckSquare,
  Wrench,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface QAReportViewProps {
  report: QAReport;
  onReRunAudit?: () => void;
  isAuditing?: boolean;
}

export const QAReportView: React.FC<QAReportViewProps> = ({
  report,
  onReRunAudit,
  isAuditing = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const getResultBadge = (result: string) => {
    switch (result) {
      case "PASS":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold font-mono text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>AUDIT PASS</span>
          </div>
        );
      case "PASS_WITH_WARNINGS":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-700 text-amber-400 font-bold font-mono text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>PASS WITH WARNINGS</span>
          </div>
        );
      case "FAIL":
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-700 text-rose-400 font-bold font-mono text-xs">
            <XCircle className="w-4 h-4" />
            <span>AUDIT FAIL</span>
          </div>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/40 bg-emerald-950/20";
    if (score >= 75) return "text-amber-400 border-amber-500/40 bg-amber-950/20";
    return "text-rose-400 border-rose-500/40 bg-rose-950/20";
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `qa_adversarial_report_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ocrScore = report.ocr_fidelity_score ?? report.ocr_score ?? 0;
  const engineeringScore = report.engineering_spec_score ?? report.engineering_score ?? 0;
  const taxonomyScore = report.taxonomy_score ?? report.classification_score ?? 0;
  const antiHallucinationScore = report.anti_hallucination_score ?? report.hallucination_score ?? 0;
  const missingData = report.missing_critical_data ?? report.missing_information ?? [];
  const ocrErrList = report.ocr_errors ?? report.ocr_issues ?? [];
  const engErrList = report.engineering_errors ?? report.engineering_issues ?? [];

  const scores = [
    { label: "Accuracy", value: report.accuracy_score },
    { label: "OCR Fidelity", value: ocrScore },
    { label: "Engineering Spec", value: engineeringScore },
    { label: "Taxonomy Class", value: taxonomyScore },
    { label: "Anti-Hallucination", value: antiHallucinationScore },
    { label: "Commerce Readiness", value: report.commerce_readiness_score },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight uppercase">
              Adversarial QA Audit & Verification Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Stress-test report evaluating hallucination risks, OCR precision, and engineering compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {getResultBadge(report.overall_result)}

          {onReRunAudit && (
            <button
              onClick={onReRunAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono inline-flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAuditing ? "Auditing..." : "Re-Run QA Audit"}</span>
            </button>
          )}

          <button
            onClick={handleCopyJson}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono inline-flex items-center gap-1"
            title="Copy QA JSON"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownloadJson}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono inline-flex items-center gap-1"
            title="Download QA JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Identified Under Audit */}
      {report.detected_product && (
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Detected Product Identity
            </span>
            <p className="text-sm font-bold text-slate-100 font-mono">{report.detected_product}</p>
          </div>
          <FileSearch className="w-5 h-5 text-slate-500 shrink-0" />
        </div>
      )}

      {/* Metric Dials Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {scores.map((s, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-3 text-center space-y-1 transition-all ${getScoreColor(
              s.value
            )}`}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold truncate">
              {s.label}
            </span>
            <div className="text-xl font-black font-mono tracking-tight">{s.value}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  s.value >= 90
                    ? "bg-emerald-400"
                    : s.value >= 75
                    ? "bg-amber-400"
                    : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, s.value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Critical Failures & Hallucinations Alert Box */}
      {(report.critical_failures?.length > 0 || report.hallucinated_attributes?.length > 0) && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold font-mono text-xs uppercase">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Adversarial Flags & Hallucination Warnings Detected</span>
          </div>

          {report.critical_failures?.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-rose-400 font-semibold uppercase">
                Critical Failures:
              </span>
              <ul className="list-disc list-inside text-xs font-mono text-rose-200 space-y-0.5">
                {report.critical_failures.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {report.hallucinated_attributes?.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-rose-900/50">
              <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                Unsupported / Hallucinated Attributes:
              </span>
              <ul className="list-disc list-inside text-xs font-mono text-amber-200 space-y-0.5">
                {report.hallucinated_attributes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Breakdown Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verified Attributes */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase">
            <CheckSquare className="w-4 h-4" />
            <span>Verified Image Evidence ({report.verified_attributes?.length || 0})</span>
          </div>
          {report.verified_attributes?.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 italic">No attributes verified.</p>
          ) : (
            <ul className="space-y-1.5 text-xs font-mono text-slate-300">
              {report.verified_attributes?.map((attr, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{attr}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Missing Buyer Data */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>Missing Buyer Info ({missingData.length})</span>
          </div>
          {missingData.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 italic">No missing information noted.</p>
          ) : (
            <ul className="space-y-1.5 text-xs font-mono text-slate-300">
              {missingData.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Specific QA Issues & Recommended Fixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OCR & Engineering Issues */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>OCR & Engineering Discrepancies</span>
          </div>

          {ocrErrList.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">OCR Misread Risks:</span>
              <ul className="text-xs font-mono text-slate-300 space-y-1">
                {ocrErrList.map((iss, i) => (
                  <li key={i} className="bg-slate-900 p-1.5 rounded border border-slate-800">• {iss}</li>
                ))}
              </ul>
            </div>
          )}

          {engErrList.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Engineering Spec Warnings:</span>
              <ul className="text-xs font-mono text-slate-300 space-y-1">
                {engErrList.map((iss, i) => (
                  <li key={i} className="bg-slate-900 p-1.5 rounded border border-slate-800">• {iss}</li>
                ))}
              </ul>
            </div>
          )}

          {ocrErrList.length === 0 && engErrList.length === 0 && (
            <p className="text-xs font-mono text-slate-500 italic">No OCR or engineering discrepancies identified.</p>
          )}
        </div>

        {/* Recommended Fixes */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs uppercase">
            <Wrench className="w-4 h-4" />
            <span>Recommended QA Fixes ({report.recommended_fixes?.length || 0})</span>
          </div>
          {report.recommended_fixes?.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 italic">No recommended fixes needed.</p>
          ) : (
            <ul className="space-y-1.5 text-xs font-mono text-slate-300">
              {report.recommended_fixes?.map((fix, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
