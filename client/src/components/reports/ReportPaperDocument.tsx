import React, { useState } from "react";
import { CaseReport } from "../../types/report";
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  Download,
  ShieldCheck,
  Building,
  User,
  Scale,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ReportPaperDocumentProps {
  report: CaseReport;
  page?: number; // 1 to 4
  includedSections?: string[];
  scale?: number; // zoom percentage (e.g. 100)
  onOpenCase?: () => void;
  onOpenPatient?: () => void;
}

export const ReportPaperDocument: React.FC<ReportPaperDocumentProps> = ({
  report,
  page,
  includedSections,
  scale = 100,
  onOpenCase,
  onOpenPatient,
}) => {
  // If includedSections provided, check if section is active; otherwise true
  const isIncluded = (sectionName: string) => {
    if (!includedSections) return true;
    return includedSections.includes(sectionName);
  };

  const zoomFactor = scale / 100;

  return (
    <div
      className="report-paper-container"
      style={{
        transform: zoomFactor !== 1 ? `scale(${zoomFactor})` : undefined,
        transformOrigin: "top center",
      }}
    >
      {/* PAGE 1: Overview & Case Information + Evaluation Summary */}
      {(!page || page === 1) && (
        <div className="report-paper-sheet" id="report-sheet-page-1">
          {/* Header */}
          <div className="report-doc-header">
            <div className="report-doc-brand">
              <div className="brand-mark" aria-hidden="true">
                <span />
                <span />
              </div>
              <div>
                <div className="brand-name" style={{ fontSize: "16px" }}>MaxFace-Eval</div>
                <div className="brand-sub">POST-OPERATIVE EVALUATION REPORT</div>
              </div>
            </div>
            <div className="report-doc-stamp-box">
              <span className={`report-doc-status-badge status-${report.status.toLowerCase().replace(" ", "-")}`}>
                {report.status.toUpperCase()}
              </span>
              <div className="report-doc-stamp-meta">
                <span>DOC ID: <strong>{report.id}</strong></span>
                <span>DATE: {report.reportDate}</span>
              </div>
            </div>
          </div>

          <div className="report-doc-disclaimer-banner">
            <ShieldCheck size={14} className="text-teal" />
            <span>
              <strong>RESEARCH PROTOTYPE:</strong> Generated for research evaluation and clinical audit only. Not for standalone clinical diagnosis or decision-making.
            </span>
          </div>

          {/* Title Area */}
          <div className="report-doc-title-block">
            <div className="report-doc-kicker">MAXFACE-EVAL · CLINICAL CASE REPORT</div>
            <h1 className="report-doc-h1">Evaluation Report: {report.procedure}</h1>
            <p className="report-doc-lead">
              Automated 3D anatomical alignment, hardware stability index, and clinician review record.
            </p>
          </div>

          {/* Section: Patient & Case Information */}
          {isIncluded("Patient / Case Information") && (
            <div className="report-doc-section">
              <div className="report-doc-section-head">
                <span className="section-num">01</span>
                <h3>Patient & Case Information</h3>
              </div>
              <div className="report-doc-meta-table">
                <div className="meta-cell">
                  <span className="meta-lbl">Patient Name</span>
                  <strong className="meta-val">{report.patientName}</strong>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Patient ID (MRN)</span>
                  <span className="meta-val mono">{report.patientId}</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Age / Sex</span>
                  <span className="meta-val">{report.patientAgeSex}</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Case ID</span>
                  <span className="meta-val mono">{report.caseId}</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Procedure</span>
                  <strong className="meta-val">{report.procedure}</strong>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Surgery Date</span>
                  <span className="meta-val">{report.surgeryDate}</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Attending Surgeon</span>
                  <span className="meta-val">{report.surgeon}</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-lbl">Report Generated</span>
                  <span className="meta-val">{report.reportDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Overall Evaluation Summary */}
          {isIncluded("Evaluation Summary") && (
            <div className="report-doc-section">
              <div className="report-doc-section-head">
                <span className="section-num">02</span>
                <h3>Evaluation Summary</h3>
              </div>
              <div className="report-doc-eval-card">
                <div className="eval-score-orb">
                  <div className="orb-val">{report.overallScore}</div>
                  <div className="orb-max">/ 100</div>
                  <span className="orb-lbl">OVERALL SCORE</span>
                </div>
                <div className="eval-score-narrative">
                  <div className="eval-interpretation-badge">
                    <span>Interpretation:</span>
                    <strong>{report.interpretation}</strong>
                  </div>
                  <p className="eval-notes">
                    Quantitative multi-planar registration reveals sound anatomical contour restoration. Confidence metric reflects robust landmark correspondence across pre- and post-operative CT data volumes.
                  </p>
                  <div className="eval-metrics-row">
                    <div>
                      <span>Confidence Level:</span>
                      <strong>{report.confidence} ({report.confidencePct}%)</strong>
                    </div>
                    <div>
                      <span>Registration Error:</span>
                      <strong className="mono">{report.imaging.registrationRMSE} RMSE</strong>
                    </div>
                    <div>
                      <span>Workflow State:</span>
                      <strong>{report.status}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="report-doc-footer">
            <span>MAXFACE-EVAL · {report.id} · Case {report.caseId}</span>
            <span>Page 1 of {page ? 4 : 4}</span>
          </div>
        </div>
      )}

      {/* PAGE 2: Before / After Imaging Comparison */}
      {(!page || page === 2) && (
        <div className="report-paper-sheet" id="report-sheet-page-2">
          <div className="report-doc-mini-header">
            <span>MAXFACE-EVAL CASE REPORT · {report.id}</span>
            <span>Patient: {report.patientName} ({report.patientId})</span>
          </div>

          {isIncluded("Before / After Imaging") && (
            <div className="report-doc-section">
              <div className="report-doc-section-head">
                <span className="section-num">03</span>
                <h3>Before / After Imaging Summary</h3>
              </div>

              <p className="section-subtext">
                Rigid registration between pre-operative diagnostic CT and post-operative outcome imaging.
              </p>

              <div className="report-doc-imaging-grid">
                {/* Pre-Op Panel */}
                <div className="imaging-box">
                  <div className="imaging-box-tag">BEFORE · {report.imaging.preOpLabel.toUpperCase()}</div>
                  <div className="imaging-frame">
                    <div className="imaging-simulated-scan pre-op-scan">
                      <div className="scan-anatomy-marker">Pre-Op Fracture Line</div>
                      <div className="scan-crosshair" />
                      <div className="scan-legend-tag">PRE-OP AXIAL</div>
                    </div>
                  </div>
                  <div className="imaging-caption">
                    <strong>{report.imaging.preOpLabel}</strong>
                    <span>Acquisition: {report.imaging.preOpDate} · Bone Window</span>
                  </div>
                </div>

                {/* Post-Op Panel */}
                <div className="imaging-box">
                  <div className="imaging-box-tag">AFTER · {report.imaging.postOpLabel.toUpperCase()}</div>
                  <div className="imaging-frame">
                    <div className="imaging-simulated-scan post-op-scan">
                      <div className="scan-anatomy-marker post-op-marker">Rigid Fixation Plate</div>
                      <div className="scan-crosshair" />
                      <div className="scan-legend-tag scan-tag-after">POST-OP ALIGNED</div>
                    </div>
                  </div>
                  <div className="imaging-caption">
                    <strong>{report.imaging.postOpLabel}</strong>
                    <span>Acquisition: {report.imaging.postOpDate} · Reconstructed</span>
                  </div>
                </div>
              </div>

              <div className="imaging-analysis-box">
                <div className="analysis-box-title">
                  <Sparkles size={14} className="text-teal" />
                  <strong>Computer-Assisted Imaging Interpretation</strong>
                </div>
                <p>{report.imaging.interpretationNotes}</p>
                <div className="analysis-box-meta">
                  <span>Volumetric Rigid Registration: <strong>{report.imaging.registrationRMSE}</strong></span>
                  <span>Anatomy Window: <strong>Hounsfield Unit [300 – 1800 HU]</strong></span>
                </div>
              </div>
            </div>
          )}

          <div className="report-doc-footer">
            <span>MAXFACE-EVAL · {report.id} · Case {report.caseId}</span>
            <span>Page 2 of 4</span>
          </div>
        </div>
      )}

      {/* PAGE 3: Findings & Score Breakdown */}
      {(!page || page === 3) && (
        <div className="report-paper-sheet" id="report-sheet-page-3">
          <div className="report-doc-mini-header">
            <span>MAXFACE-EVAL CASE REPORT · {report.id}</span>
            <span>Patient: {report.patientName} ({report.patientId})</span>
          </div>

          {/* Section: Findings */}
          {isIncluded("Findings") && (
            <div className="report-doc-section">
              <div className="report-doc-section-head">
                <span className="section-num">04</span>
                <h3>Clinical Evaluation Findings</h3>
              </div>
              <p className="section-subtext">
                Grouped anatomical checkpoint findings evaluated against standard craniomaxillofacial reduction benchmarks.
              </p>

              <div className="report-doc-findings-list">
                {report.findings.map((f, idx) => (
                  <div key={f.id} className="report-doc-finding-card">
                    <div className="finding-card-head">
                      <div className="finding-category-pill">{f.category}</div>
                      <strong className="finding-title">{f.title}</strong>
                      <span className={`finding-status-tag status-${f.status.toLowerCase().replace(" ", "-")}`}>
                        {f.status}
                      </span>
                    </div>
                    <p className="finding-desc">{f.detail}</p>
                    <div className="finding-card-foot">
                      <span>Model Confidence: <strong>{f.confidence}%</strong></span>
                      <span className="mono">ID: {f.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Score Breakdown */}
          {isIncluded("Score Breakdown") && (
            <div className="report-doc-section" style={{ marginTop: "24px" }}>
              <div className="report-doc-section-head">
                <span className="section-num">05</span>
                <h3>Objective Score Breakdown</h3>
              </div>
              <table className="report-doc-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Target Threshold</th>
                    <th>Measured Outcome</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.scoreBreakdown.map((row) => (
                    <tr key={row.id}>
                      <td><strong>{row.name}</strong></td>
                      <td>{row.target}</td>
                      <td>{row.deviation || "Within limit"}</td>
                      <td className="mono font-bold">{row.score} / 100</td>
                      <td>
                        <span className={`score-interp-pill interp-${row.interpretation.toLowerCase()}`}>
                          {row.interpretation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="report-doc-footer">
            <span>MAXFACE-EVAL · {report.id} · Case {report.caseId}</span>
            <span>Page 3 of 4</span>
          </div>
        </div>
      )}

      {/* PAGE 4: Clinician Review & Scientific References */}
      {(!page || page === 4) && (
        <div className="report-paper-sheet" id="report-sheet-page-4">
          <div className="report-doc-mini-header">
            <span>MAXFACE-EVAL CASE REPORT · {report.id}</span>
            <span>Patient: {report.patientName} ({report.patientId})</span>
          </div>

          {/* Section: Clinician Review */}
          {isIncluded("Clinician Review") && (
            <div className="report-doc-section">
              <div className="report-doc-section-head">
                <span className="section-num">06</span>
                <h3>Clinician Review & Sign-Off</h3>
              </div>
              <p className="section-subtext">
                Clinician validation audit trail, independent score confirmation, and surgical sign-off.
              </p>

              <div className="clinician-review-box">
                <div className="review-meta-row">
                  <div>
                    <span>Review Status</span>
                    <strong className={`review-badge-highlight status-${report.clinicianReview.status.toLowerCase().replace(" ", "-")}`}>
                      {report.clinicianReview.status}
                    </strong>
                  </div>
                  <div>
                    <span>Reviewed By</span>
                    <strong>{report.clinicianReview.reviewerName}</strong>
                    <small>{report.clinicianReview.reviewerRole}</small>
                  </div>
                  <div>
                    <span>Review Date</span>
                    <strong>{report.clinicianReview.reviewedAt || "Pending Sign-off"}</strong>
                  </div>
                </div>

                <div className="review-notes-block">
                  <div className="review-notes-title">Clinician Observations & Notes</div>
                  <p>
                    {report.clinicianReview.notes ||
                      "No clinical override remarks registered. Automated scoring accepted by attending surgical staff."}
                  </p>
                </div>

                {report.clinicianReview.hasOverride ? (
                  <div className="review-override-banner">
                    <div className="override-row">
                      <span>Automated AI Score: <strong className="mono">{report.clinicianReview.aiScore}</strong></span>
                      <span>Clinician Override Score: <strong className="mono text-teal">{report.clinicianReview.clinicianScore}</strong></span>
                    </div>
                    <div className="override-reason">
                      <strong>Override Justification:</strong> {report.clinicianReview.overrideReason || "Clinical adjustment following physical exam."}
                    </div>
                  </div>
                ) : (
                  <div className="review-audit-clear">
                    <CheckCircle2 size={15} className="text-teal" />
                    <span>No score override recorded. AI model evaluation concordant with surgeon assessment.</span>
                  </div>
                )}

                <div className="review-signature-row">
                  <div className="signature-slot">
                    <div className="sig-line" />
                    <span>Digital Signature: {report.clinicianReview.reviewerName}</span>
                    <small>Verified via MaxFace-Eval Clinical Workspace RBAC</small>
                  </div>
                  <div className="signature-slot text-right">
                    <div className="sig-line" />
                    <span>Audit Token: {report.id}-AUTH-VERIFIED</span>
                    <small>Timestamp: {report.updatedAt}</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Scientific References */}
          {isIncluded("References") && (
            <div className="report-doc-section" style={{ marginTop: "24px" }}>
              <div className="report-doc-section-head">
                <span className="section-num">07</span>
                <h3>Evidence & Scientific References</h3>
              </div>
              <div className="report-doc-refs-list">
                {report.references.map((ref, idx) => (
                  <div key={ref.id} className="report-ref-item">
                    <span className="ref-idx">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="ref-body">
                      <strong>{ref.title}</strong>
                      <div className="ref-source">{ref.source} · Relevant Criterion: <em>{ref.criterion}</em></div>
                      <div className="ref-citation mono">{ref.citation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formal disclaimer footer */}
          <div className="report-formal-signoff-banner">
            <p>
              MAXFACE-EVAL is a research prototype developed for automated pre- and post-operative craniomaxillofacial outcome evaluation. All anatomical measurements, score reductions, and automated findings must be verified by licensed medical practitioners prior to clinical decision-making.
            </p>
          </div>

          <div className="report-doc-footer">
            <span>MAXFACE-EVAL · {report.id} · Case {report.caseId}</span>
            <span>Page 4 of 4</span>
          </div>
        </div>
      )}
    </div>
  );
};
