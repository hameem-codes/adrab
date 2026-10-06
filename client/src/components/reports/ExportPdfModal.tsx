import React, { useState, useEffect } from "react";
import { CaseReport } from "../../types/report";
import { useReports } from "../../contexts/ReportsContext";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Check,
  RefreshCw,
  Eye,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

interface ExportPdfModalProps {
  report: CaseReport;
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: () => void;
}

type ExportState = "configure" | "generating" | "success" | "error";

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  report,
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  const { recordReportExport } = useReports();

  const allAvailableSections = [
    "Patient / Case Information",
    "Evaluation Summary",
    "Before / After Imaging",
    "Findings",
    "Score Breakdown",
    "Clinician Review",
    "References",
  ];

  const [selectedSections, setSelectedSections] = useState<string[]>(allAvailableSections);
  const [exportState, setExportState] = useState<ExportState>("configure");
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedFilename, setGeneratedFilename] = useState("");

  const generationSteps = [
    "Preparing report metadata...",
    "Rendering anatomical CT imaging volumes...",
    "Building document layout & vector typography...",
    "Finalizing signed PDF document...",
  ];

  useEffect(() => {
    if (isOpen) {
      setExportState("configure");
      setGenerationStep(0);
      setSelectedSections(allAvailableSections);
    }
  }, [isOpen, report.id]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleStartExport = () => {
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section to include in the report.");
      return;
    }

    setExportState("generating");
    setGenerationStep(0);

    // Multi-step simulated progressive PDF generation
    const timer1 = setTimeout(() => setGenerationStep(1), 600);
    const timer2 = setTimeout(() => setGenerationStep(2), 1200);
    const timer3 = setTimeout(() => setGenerationStep(3), 1800);
    const timer4 = setTimeout(() => {
      try {
        const filename = recordReportExport(report.id, {
          format: "PDF",
          includedSections: selectedSections,
        });
        setGeneratedFilename(filename);
        setExportState("success");
        toast.success("PDF generated successfully", {
          description: `${filename} is ready for download or clinical distribution.`,
        });
      } catch (err) {
        setExportState("error");
      }
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleDownloadFile = () => {
    // Generate a simulated client-side download blob
    const element = document.createElement("a");
    const file = new Blob(
      [
        `MAXFACE-EVAL CASE EVALUATION REPORT\nReport ID: ${report.id}\nCase ID: ${report.caseId}\nPatient: ${report.patientName} (${report.patientId})\nScore: ${report.overallScore}/100\nProcedure: ${report.procedure}\nDate: ${report.reportDate}\n\nSections Included:\n${selectedSections.map((s) => `- ${s}`).join("\n")}\n\nClinician Review: ${report.clinicianReview.reviewerName} (${report.clinicianReview.status})\nDisclaimer: Research prototype not for clinical decision making.`
      ],
      { type: "text/plain;charset=utf-8" }
    );
    element.href = URL.createObjectURL(file);
    element.download = generatedFilename || `${report.id}_Evaluation_Report.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Download started", { description: element.download });
  };

  return (
    <div className="dialog-backdrop" onMouseDown={exportState === "generating" ? undefined : onClose}>
      <div className="export-pdf-modal panel" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="export-modal-head">
          <div>
            <div className="eyebrow" style={{ margin: 0 }}>Document Export Flow</div>
            <h2>Export Case Report as PDF</h2>
          </div>
          {exportState !== "generating" && (
            <button className="icon-button" onClick={onClose} aria-label="Close export dialog">
              <X size={18} />
            </button>
          )}
        </div>

        {/* BODY - State: CONFIGURE */}
        {exportState === "configure" && (
          <div className="export-modal-body">
            <div className="export-meta-strip">
              <div>
                <span>Target Report</span>
                <strong>{report.id} · {report.procedure}</strong>
              </div>
              <div>
                <span>Patient</span>
                <strong>{report.patientName} ({report.patientId})</strong>
              </div>
              <div>
                <span>Current Status</span>
                <span className={`status-pill status-${report.status.toLowerCase().replace(" ", "-")} status-compact`}>
                  {report.status}
                </span>
              </div>
            </div>

            <div className="export-config-group">
              <label className="export-group-title">Export Format</label>
              <div className="export-format-options">
                <label className="export-format-card active">
                  <input type="radio" name="format" checked readOnly />
                  <div>
                    <strong>PDF Document (.pdf)</strong>
                    <small>High-resolution vector document ready for print and PACS archival</small>
                  </div>
                  <FileText size={18} className="text-teal" />
                </label>
              </div>
            </div>

            <div className="export-config-group">
              <div className="export-sections-head">
                <label className="export-group-title">Included Report Sections</label>
                <div className="export-sections-actions">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setSelectedSections(allAvailableSections)}
                  >
                    Select All
                  </button>
                  <span className="dot-separator">·</span>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setSelectedSections(["Patient / Case Information", "Evaluation Summary"])}
                  >
                    Minimal
                  </button>
                </div>
              </div>

              <div className="export-checkbox-grid">
                {allAvailableSections.map((sec) => {
                  const checked = selectedSections.includes(sec);
                  return (
                    <label key={sec} className={`export-checkbox-item ${checked ? "checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSection(sec)}
                      />
                      <span>{sec}</span>
                      {checked && <Check size={13} className="check-icon" />}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="export-modal-foot">
              <div className="export-notice">
                <small>Research Prototype · Document watermark preserved on export</small>
              </div>
              <div className="export-buttons">
                <button className="button button-quiet" onClick={onClose}>
                  Cancel
                </button>
                <button className="button button-primary" onClick={handleStartExport}>
                  <Download size={15} /> Export PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BODY - State: GENERATING */}
        {exportState === "generating" && (
          <div className="export-modal-body export-state-generating">
            <div className="export-spinner-wrap">
              <Loader2 size={38} className="spinner-rotating text-teal" />
            </div>
            <h3>Generating PDF...</h3>
            <p className="generation-step-text">{generationSteps[generationStep]}</p>

            <div className="generation-progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
              />
            </div>

            <div className="generation-step-indicators">
              {generationSteps.map((step, idx) => (
                <div
                  key={step}
                  className={`step-tick ${idx <= generationStep ? "step-active" : ""}`}
                >
                  <span className="tick-dot" />
                  <span className="tick-label">{step.split(" ")[0]}</span>
                </div>
              ))}
            </div>

            <p className="export-hint-text">
              Please wait while MaxFace-Eval compiles high-resolution multiplanar imaging and clinical metrics into an auditable document.
            </p>
          </div>
        )}

        {/* BODY - State: SUCCESS */}
        {exportState === "success" && (
          <div className="export-modal-body export-state-success">
            <div className="success-badge-orb">
              <CheckCircle2 size={36} className="text-teal" />
            </div>
            <h3>PDF Ready</h3>
            <p className="success-report-title">
              Evaluation Report: <strong>{report.id}</strong>
            </p>
            <div className="generated-file-card">
              <FileCheck size={24} className="text-teal" />
              <div>
                <strong>{generatedFilename || `${report.id}_Report.pdf`}</strong>
                <span>Format: PDF · Size: 2.4 MB · {selectedSections.length} sections included</span>
              </div>
            </div>

            <div className="success-actions-row">
              <button className="button button-primary" onClick={handleDownloadFile}>
                <Download size={15} /> Download PDF
              </button>
              <button
                className="button button-quiet"
                onClick={() => {
                  onClose();
                  onOpenPreview();
                }}
              >
                <Eye size={15} /> Open Preview
              </button>
              <button className="button button-quiet" onClick={() => setExportState("configure")}>
                <RefreshCw size={14} /> Export Again
              </button>
            </div>
            
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button className="text-button" onClick={onClose}>
                Done & Close
              </button>
            </div>
          </div>
        )}

        {/* BODY - State: ERROR */}
        {exportState === "error" && (
          <div className="export-modal-body export-state-error">
            <div className="error-badge-orb">
              <AlertCircle size={36} className="text-coral" />
            </div>
            <h3>PDF export failed</h3>
            <p>
              We couldn’t generate this evaluation report due to a temporary rendering timeout. Your report data remains intact.
            </p>
            <div className="error-actions-row">
              <button className="button button-quiet" onClick={onClose}>
                Dismiss
              </button>
              <button className="button button-primary" onClick={handleStartExport}>
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
