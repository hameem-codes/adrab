import React, { useState } from "react";
import { useReports } from "../../contexts/ReportsContext";
import {
  X,
  Plus,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (reportId: string) => void;
  preselectedCaseId?: string;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onReportCreated,
  preselectedCaseId,
}) => {
  const { createReportForCase, getReportByCaseId } = useReports();

  // Available clinical cases in the system
  const availableCases = [
    {
      id: "MF-2024-001",
      patient: "Aman Verma",
      patientId: "PT-2024-001",
      procedure: "Mandibular Fracture",
      hasEvaluation: true,
      score: 82,
      evaluationDate: "12 Jul 2024",
      status: "Evaluation Completed",
    },
    {
      id: "MF-2024-002",
      patient: "Priya Sharma",
      patientId: "PT-2024-002",
      procedure: "Zygomatic Fracture",
      hasEvaluation: true,
      score: 74,
      evaluationDate: "09 Jul 2024",
      status: "Evaluation Completed",
    },
    {
      id: "MF-2024-003",
      patient: "Rohit Kumar",
      patientId: "PT-2024-003",
      procedure: "LeFort I",
      hasEvaluation: true,
      score: 91,
      evaluationDate: "07 Jul 2024",
      status: "Evaluation Completed",
    },
    {
      id: "MF-2024-004",
      patient: "Sneha Patel",
      patientId: "PT-2024-004",
      procedure: "Orbital Fracture",
      hasEvaluation: true,
      score: 68,
      evaluationDate: "05 Jul 2024",
      status: "Attention Required",
    },
    {
      id: "MF-2024-005",
      patient: "Vikram Singh",
      patientId: "PT-2024-005",
      procedure: "Mandibular Fracture",
      hasEvaluation: true,
      score: 88,
      evaluationDate: "02 Jul 2024",
      status: "Evaluation Completed",
    },
    {
      id: "MF-2024-006",
      patient: "Neha Reddy",
      patientId: "PT-2024-006",
      procedure: "Zygomatic Fracture",
      hasEvaluation: false, // Wireframe condition: case without evaluation
      score: null,
      evaluationDate: null,
      status: "Pre-op Planning",
    },
    {
      id: "MX-2407",
      patient: "Amina Mensah",
      patientId: "PT-1048",
      procedure: "Orbital floor reconstruction",
      hasEvaluation: true,
      score: 88,
      evaluationDate: "06 Oct 2026",
      status: "Evaluation Completed",
    },
  ];

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    preselectedCaseId || availableCases[0].id
  );

  if (!isOpen) return null;

  const currentCase = availableCases.find((c) => c.id === selectedCaseId) || availableCases[0];
  const existingReport = getReportByCaseId(currentCase.id);

  const handleGenerateReport = () => {
    if (!currentCase.hasEvaluation) {
      toast.error("Evaluation required", {
        description: "This case does not have an available evaluation yet. Please run AI evaluation first.",
      });
      return;
    }

    const report = createReportForCase(currentCase.id);
    toast.success("Draft Report Created", {
      description: `Report ${report.id} generated for Case ${currentCase.id}.`,
    });
    onReportCreated(report.id);
    onClose();
  };

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div className="create-report-modal panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="export-modal-head">
          <div>
            <div className="eyebrow" style={{ margin: 0 }}>Clinical Documentation</div>
            <h2>Create New Evaluation Report</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="create-report-body">
          <p className="create-lead">
            Select an active case with completed 3D registration and AI evaluation metrics to generate a structured evaluation report.
          </p>

          <div className="case-selection-group">
            <label className="export-group-title">1. Select Surgical Case</label>
            <div className="case-picker-list">
              {availableCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`case-picker-item ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedCaseId(c.id)}
                  >
                    <div className="picker-left">
                      <div className="case-key mono">{c.id}</div>
                      <div className="picker-info">
                        <strong>{c.patient}</strong>
                        <span>{c.procedure} · {c.patientId}</span>
                      </div>
                    </div>
                    <div className="picker-right">
                      {c.hasEvaluation ? (
                        <span className="evaluation-tag eval-ready">
                          <CheckCircle2 size={12} /> Score: {c.score}/100
                        </span>
                      ) : (
                        <span className="evaluation-tag eval-missing">
                          <AlertCircle size={12} /> No Evaluation
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="evaluation-review-preview">
            <label className="export-group-title">2. Available Evaluation Data</label>
            {currentCase.hasEvaluation ? (
              <div className="eval-available-box">
                <div className="eval-summary-row">
                  <div>
                    <span>Selected Case:</span>
                    <strong>{currentCase.id} ({currentCase.patient})</strong>
                  </div>
                  <div>
                    <span>Evaluation Score:</span>
                    <strong className="text-teal mono font-bold" style={{ fontSize: "16px" }}>
                      {currentCase.score} / 100
                    </strong>
                  </div>
                  <div>
                    <span>Evaluation Date:</span>
                    <strong>{currentCase.evaluationDate}</strong>
                  </div>
                </div>

                <div className="eval-readiness-notes">
                  <CheckCircle2 size={15} className="text-teal" />
                  <span>
                    Pre- and post-op CT series registered with rigid transformation. 4 score domains and clinical checkpoints available.
                  </span>
                </div>

                {existingReport && (
                  <div className="existing-report-note">
                    <FileText size={14} className="text-teal" />
                    <span>
                      Note: An existing report ({existingReport.id} · {existingReport.status}) is already registered for this case. Opening will link to the existing document.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="eval-missing-box">
                <AlertCircle size={20} className="text-coral" />
                <div>
                  <strong>Evaluation Required</strong>
                  <p>
                    This case does not have an available evaluation yet. A report cannot be generated from missing evaluation data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="export-modal-foot">
          <button className="button button-quiet" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button button-primary"
            disabled={!currentCase.hasEvaluation}
            onClick={handleGenerateReport}
          >
            <Plus size={15} /> Generate Draft Report
          </button>
        </div>
      </div>
    </div>
  );
};
