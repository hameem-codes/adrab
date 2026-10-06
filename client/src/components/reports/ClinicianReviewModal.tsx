import React, { useState } from "react";
import { CaseReport } from "../../types/report";
import { useReports } from "../../contexts/ReportsContext";
import {
  X,
  ShieldCheck,
  Check,
  AlertCircle,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ClinicianReviewModalProps {
  report: CaseReport;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ClinicianReviewModal: React.FC<ClinicianReviewModalProps> = ({
  report,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { updateReportReview } = useReports();

  const [reviewerName, setReviewerName] = useState(
    report.clinicianReview.reviewerName || "Dr. Rahul Mehta"
  );
  const [reviewerRole, setReviewerRole] = useState(
    report.clinicianReview.reviewerRole || "Attending Maxillofacial Surgeon"
  );
  const [notes, setNotes] = useState(
    report.clinicianReview.notes ||
      "Anatomical reduction verified on post-operative CT volume. Hardware positioned flush with cortical bone without impingement. Approved for clinical archival."
  );
  const [hasOverride, setHasOverride] = useState(report.clinicianReview.hasOverride);
  const [clinicianScore, setClinicianScore] = useState<number>(
    report.clinicianReview.clinicianScore || report.overallScore
  );
  const [overrideReason, setOverrideReason] = useState(
    report.clinicianReview.overrideReason || ""
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasOverride && !overrideReason.trim()) {
      toast.error("Please enter a clinical justification for the score override.");
      return;
    }

    updateReportReview(report.id, {
      reviewerName,
      reviewerRole,
      notes,
      hasOverride,
      clinicianScore: hasOverride ? clinicianScore : report.overallScore,
      overrideReason: hasOverride ? overrideReason : undefined,
    });

    toast.success("Clinician review recorded", {
      description: `Report ${report.id} marked as Reviewed by ${reviewerName}.`,
    });

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div className="clinician-review-modal panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="export-modal-head">
          <div>
            <div className="eyebrow" style={{ margin: 0 }}>Review & Sign-Off Workflow</div>
            <h2>Clinician Evaluation Review</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close review dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-modal-body">
          <div className="review-case-badge">
            <div>
              <span>Report & Case</span>
              <strong>{report.id} · Case {report.caseId}</strong>
            </div>
            <div>
              <span>Patient</span>
              <strong>{report.patientName} ({report.patientId})</strong>
            </div>
            <div>
              <span>AI Evaluation Score</span>
              <strong className="mono font-bold text-teal">{report.overallScore} / 100</strong>
            </div>
          </div>

          <div className="review-form-grid">
            <div className="form-field">
              <label>Reviewing Clinician Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Clinical Role / Title</label>
              <input
                type="text"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Clinician Evaluation Notes & Observations</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record your clinical rationale, surgical observations, and post-operative progress notes..."
              required
            />
          </div>

          {/* Override Section */}
          <div className="override-toggle-box">
            <div className="override-toggle-header">
              <div>
                <strong>Clinician Score Override</strong>
                <small>Check if your clinical physical assessment differs from the automated 3D model score</small>
              </div>
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={hasOverride}
                  onChange={(e) => setHasOverride(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>

            {hasOverride && (
              <div className="override-inputs-panel">
                <div className="override-scores-compare">
                  <div className="compare-col">
                    <span>AI Model Score</span>
                    <strong className="mono">{report.overallScore} / 100</strong>
                  </div>
                  <ArrowRight size={18} className="text-muted" />
                  <div className="compare-col">
                    <span>Clinician Score Override</span>
                    <div className="override-score-input-wrap">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={clinicianScore}
                        onChange={(e) => setClinicianScore(Number(e.target.value))}
                        required
                      />
                      <span>/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="form-field" style={{ marginTop: "12px" }}>
                  <label>Override Justification (Required for audit log)</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Clinical assessment notes minor occlusal premature contact not captured in CT."
                    required={hasOverride}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="review-modal-foot">
            <div className="review-disclaimer">
              <ShieldCheck size={14} className="text-teal" />
              <span>Review audit trail will be permanently associated with {report.id}</span>
            </div>
            <div className="review-modal-buttons">
              <button type="button" className="button button-quiet" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <Check size={15} /> Finalize & Sign Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
