import React, { useState } from "react";
import { CaseReport } from "../../types/report";
import { useReports } from "../../contexts/ReportsContext";
import {
  ChevronLeft,
  Download,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  Calendar,
  Pencil,
  FileText,
  ExternalLink,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Layers,
  ArrowUpRight,
  Check,
  Building,
  User,
  Activity,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CaseReportDetailViewProps {
  report: CaseReport;
  onBack: () => void;
  onOpenPreview: () => void;
  onOpenExportPdf: () => void;
  onOpenClinicianReview: () => void;
  onNavigateToCase: (caseId: string) => void;
  onNavigateToPatient: (patientId: string) => void;
}

export const CaseReportDetailView: React.FC<CaseReportDetailViewProps> = ({
  report,
  onBack,
  onOpenPreview,
  onOpenExportPdf,
  onOpenClinicianReview,
  onNavigateToCase,
  onNavigateToPatient,
}) => {
  const { updateFindingStatus } = useReports();

  return (
    <div className="case-report-detail-layout">
      {/* Back button */}
      <div className="back-link" onClick={onBack} style={{ cursor: "pointer", marginBottom: "16px" }}>
        <ChevronLeft size={16} /> Back to Reports
      </div>

      {/* CASE REPORT HEADER (Sections 12 & 13) */}
      <div className="case-report-header panel">
        <div className="report-header-identity">
          <div className="report-header-icon-box">
            <FileText size={22} className="text-teal" />
          </div>
          <div>
            <div className="report-header-keys">
              <span className="case-key mono">{report.id}</span>
              <span className="dot-separator">·</span>
              <button
                className="case-key mono text-button"
                onClick={() => onNavigateToCase(report.caseId)}
                title="Open Case Workspace"
              >
                Case {report.caseId} <ExternalLink size={11} />
              </button>
            </div>
            <h1 className="report-header-title">{report.procedure}</h1>
            <div className="report-header-patient-line">
              <button
                className="text-button"
                style={{ fontWeight: 600, color: "var(--ink)", padding: 0 }}
                onClick={() => onNavigateToPatient(report.patientId)}
                title="Open Patient Profile"
              >
                {report.patientName} ({report.patientId}) <ExternalLink size={11} />
              </button>
              <span className="dot-separator">·</span>
              <span>Surgery: {report.surgeryDate}</span>
              <span className="dot-separator">·</span>
              <span>Report Date: {report.reportDate}</span>
            </div>
          </div>
        </div>

        <div className="report-header-actions-area">
          <div className="report-status-badges">
            <span className={`status-pill status-${report.status.toLowerCase().replace(" ", "-")}`}>
              <span className="status-dot" />
              {report.status}
            </span>
            {report.isExported && (
              <span className="status-pill status-complete status-compact" title="Report has been exported to PDF">
                <Check size={11} /> Exported
              </span>
            )}
          </div>

          <div className="report-action-buttons">
            {report.status === "Draft" || report.status === "Pending Review" ? (
              <button className="button button-quiet" onClick={onOpenClinicianReview}>
                <Pencil size={14} /> Review & Sign
              </button>
            ) : null}

            <button className="button button-quiet" onClick={onOpenPreview}>
              <Eye size={14} /> Preview
            </button>
            <button className="button button-primary" onClick={onOpenExportPdf}>
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN STRUCTURED CONTENT GRID */}
      <div className="case-report-grid">
        {/* Left Column: Clinical Data, Findings, Breakdown */}
        <div className="report-main-column">
          {/* Section 14: Case & Patient Information */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Patient / Case Information</h2>
                <span>Demographics and operative metadata</span>
              </div>
              <button
                className="text-button"
                onClick={() => onNavigateToPatient(report.patientId)}
              >
                View Patient Profile <ChevronRight size={13} />
              </button>
            </div>

            <div className="report-info-two-col">
              <div className="info-cell">
                <span className="info-cell-lbl">Patient Name</span>
                <strong className="info-cell-val">{report.patientName}</strong>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Patient ID</span>
                <span className="info-cell-val mono">{report.patientId}</span>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Case ID</span>
                <span className="info-cell-val mono">{report.caseId}</span>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Procedure</span>
                <strong className="info-cell-val">{report.procedure}</strong>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Surgery Date</span>
                <span className="info-cell-val">{report.surgeryDate}</span>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Surgeon</span>
                <span className="info-cell-val">{report.surgeon}</span>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Report Date</span>
                <span className="info-cell-val">{report.reportDate}</span>
              </div>
              <div className="info-cell">
                <span className="info-cell-lbl">Audit Timestamp</span>
                <span className="info-cell-val mono text-muted">{report.updatedRelative}</span>
              </div>
            </div>
          </section>

          {/* Section 16: Before / After Summary */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Before / After Summary</h2>
                <span>Registered multi-planar diagnostic imaging</span>
              </div>
              <button
                className="text-button"
                onClick={() => onNavigateToCase(report.caseId)}
              >
                Open 3D Viewer <ChevronRight size={13} />
              </button>
            </div>

            <div className="report-imaging-comparison">
              <div className="imaging-card-half">
                <div className="imaging-card-header">
                  <span className="phase-pill">BEFORE</span>
                  <strong>{report.imaging.preOpLabel}</strong>
                </div>
                <div className="imaging-visual-container">
                  <div className="imaging-simulation-view">
                    <span className="scan-slice-label">AXIAL 42 / 86</span>
                    <div className="scan-defect-indicator">Pre-op defect</div>
                  </div>
                </div>
                <div className="imaging-card-meta">
                  <span>{report.imaging.preOpDate} · CT Bone Window</span>
                </div>
              </div>

              <div className="imaging-card-half">
                <div className="imaging-card-header">
                  <span className="phase-pill phase-after">AFTER</span>
                  <strong>{report.imaging.postOpLabel}</strong>
                </div>
                <div className="imaging-visual-container">
                  <div className="imaging-simulation-view post-op">
                    <span className="scan-slice-label">AXIAL 42 / 86</span>
                    <div className="scan-defect-indicator post-op-indicator">Rigid reduction verified</div>
                  </div>
                </div>
                <div className="imaging-card-meta">
                  <span>{report.imaging.postOpDate} · Rigid Registration RMSE {report.imaging.registrationRMSE}</span>
                </div>
              </div>
            </div>

            <div className="imaging-narrative-note">
              <Sparkles size={14} className="text-teal" />
              <p>{report.imaging.interpretationNotes}</p>
            </div>
          </section>

          {/* Section 17: Findings */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Findings</h2>
                <span>Grouped anatomical reduction and hardware verification checkpoints</span>
              </div>
            </div>

            <div className="findings-grouped-list">
              {report.findings.map((f) => (
                <div key={f.id} className="finding-row-item">
                  <div className="finding-item-left">
                    <span className="category-tag">{f.category}</span>
                    <div className="finding-copy">
                      <strong>{f.title}</strong>
                      <p>{f.detail}</p>
                    </div>
                  </div>
                  <div className="finding-item-right">
                    <span className="confidence-label">Confidence {f.confidence}%</span>
                    <button
                      className={`status-pill status-${f.status.toLowerCase().replace(" ", "-")} status-interactive`}
                      onClick={() => {
                        const nextStatus =
                          f.status === "Confirmed" ? "Needs review" : "Confirmed";
                        updateFindingStatus(report.id, f.id, nextStatus);
                        toast(`Finding updated to ${nextStatus}`, {
                          description: f.title,
                        });
                      }}
                      title="Click to toggle finding verification status"
                    >
                      <span className="status-dot" />
                      {f.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 18: Score Breakdown */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Score Breakdown</h2>
                <span>Quantitative scoring domains and tolerances</span>
              </div>
            </div>

            <div className="table-wrap">
              <table className="clinical-table score-breakdown-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Target</th>
                    <th>Measured</th>
                    <th>Score</th>
                    <th>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {report.scoreBreakdown.map((row) => (
                    <tr key={row.id}>
                      <td><strong>{row.name}</strong></td>
                      <td><span className="mono">{row.target}</span></td>
                      <td><span className="mono">{row.deviation || "Achieved"}</span></td>
                      <td>
                        <strong className="mono text-teal" style={{ fontSize: "13px" }}>
                          {row.score} / 100
                        </strong>
                      </td>
                      <td>
                        <span className={`score-badge score-${row.interpretation.toLowerCase() === "excellent" || row.interpretation.toLowerCase() === "good" ? "good" : "fair"}`}>
                          {row.interpretation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Evaluation Summary Card, Clinician Review, References, Exports */}
        <div className="report-side-column">
          {/* Section 15: Evaluation Summary */}
          <section className="panel report-panel summary-hero-panel">
            <div className="panel-heading">
              <div>
                <h2>Evaluation Summary</h2>
                <span>Model outcome index</span>
              </div>
            </div>

            <div className="overall-score-display">
              <div className="score-number-large mono">
                {report.overallScore}
                <span>/ 100</span>
              </div>
              <div className="score-summary-title">{report.interpretation}</div>
              <div className="score-confidence-pill">
                <ShieldCheck size={14} className="text-teal" />
                <span>Confidence: <strong>{report.confidence} ({report.confidencePct}%)</strong></span>
              </div>
              <div className="score-date-tag">Evaluation Date: {report.reportDate}</div>
            </div>
          </section>

          {/* Section 19: Clinician Review */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Clinician Review</h2>
                <span>Independent surgeon sign-off</span>
              </div>
              <button className="text-button" onClick={onOpenClinicianReview}>
                Edit Review <Pencil size={13} />
              </button>
            </div>

            <div className="clinician-review-sidebar-content">
              <div className="review-meta-item">
                <span>Review Status</span>
                <span className={`status-pill status-${report.clinicianReview.status.toLowerCase().replace(" ", "-")}`}>
                  {report.clinicianReview.status}
                </span>
              </div>
              <div className="review-meta-item">
                <span>Reviewed By</span>
                <strong>{report.clinicianReview.reviewerName}</strong>
                <small className="text-muted">{report.clinicianReview.reviewerRole}</small>
              </div>
              <div className="review-meta-item">
                <span>Reviewed On</span>
                <span>{report.clinicianReview.reviewedAt || "Pending review"}</span>
              </div>

              <div className="review-notes-container">
                <span className="notes-lbl">Clinician Notes</span>
                <p>
                  {report.clinicianReview.notes ||
                    "Draft report awaiting attending surgeon verification."}
                </p>
              </div>

              <div className="review-override-container">
                <span className="notes-lbl">Score Override</span>
                {report.clinicianReview.hasOverride ? (
                  <div className="override-active-box">
                    <div>AI Score: <strong className="mono">{report.clinicianReview.aiScore}</strong></div>
                    <div>Clinician Score: <strong className="mono text-teal">{report.clinicianReview.clinicianScore}</strong></div>
                    <small>Reason: {report.clinicianReview.overrideReason}</small>
                  </div>
                ) : (
                  <div className="override-none-text">None (AI evaluation accepted without override)</div>
                )}
              </div>
            </div>
          </section>

          {/* Section 20: References */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>References</h2>
                <span>Evidence guidelines linked</span>
              </div>
            </div>

            <div className="report-references-list">
              {report.references.map((ref) => (
                <div key={ref.id} className="reference-sidebar-item">
                  <strong>{ref.title}</strong>
                  <span>{ref.source}</span>
                  <small className="mono">{ref.citation}</small>
                </div>
              ))}
            </div>
          </section>

          {/* Export History */}
          <section className="panel report-panel">
            <div className="panel-heading">
              <div>
                <h2>Export History</h2>
                <span>Auditable generated files</span>
              </div>
              <button className="button button-quiet button-small" onClick={onOpenExportPdf}>
                <Download size={13} /> New Export
              </button>
            </div>

            <div className="export-history-list">
              {report.exports.length > 0 ? (
                report.exports.map((exp) => (
                  <div key={exp.id} className="export-item-card">
                    <FileText size={18} className="text-teal" />
                    <div className="export-item-details">
                      <strong>{exp.fileReference}</strong>
                      <span>{exp.exportedAt} · {exp.fileSize}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="export-empty-hint">
                  <p>No exports generated yet. Click "Export PDF" above to generate a document.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
