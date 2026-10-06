import React, { createContext, useContext, useState, useEffect } from "react";
import { CaseReport, ReportWorkflowStatus } from "../types/report";
import { initialMockReports } from "../data/reportsMockData";

interface ReportsContextType {
  reports: CaseReport[];
  getReportById: (id: string) => CaseReport | undefined;
  getReportByCaseId: (caseId: string) => CaseReport | undefined;
  createReportForCase: (caseId: string, customOptions?: { sections?: string[] }) => CaseReport;
  updateReportReview: (reportId: string, review: {
    reviewerName: string;
    reviewerRole: string;
    notes?: string;
    hasOverride: boolean;
    clinicianScore?: number;
    overrideReason?: string;
  }) => void;
  recordReportExport: (reportId: string, exportRecord: {
    format: "PDF" | "JSON";
    includedSections: string[];
  }) => string; // returns download reference
  updateFindingStatus: (reportId: string, findingId: string, newStatus: "Confirmed" | "Needs review" | "Expected contour") => void;
  deleteReport: (reportId: string) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "maxface_eval_reports_state_v1";

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<CaseReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return initialMockReports;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  const getReportById = (id: string) => {
    return reports.find(
      (r) => r.id.toLowerCase() === id.toLowerCase() || r.caseId.toLowerCase() === id.toLowerCase()
    );
  };

  const getReportByCaseId = (caseId: string) => {
    return reports.find((r) => r.caseId.toLowerCase() === caseId.toLowerCase());
  };

  const createReportForCase = (caseId: string, customOptions?: { sections?: string[] }) => {
    // Check if an existing report exists
    const existing = reports.find((r) => r.caseId.toLowerCase() === caseId.toLowerCase());
    if (existing) {
      return existing;
    }

    const nextNumber = reports.length + 1;
    const reportId = `RP-2024-${String(nextNumber).padStart(3, "0")}`;
    
    // Create new draft report
    const newReport: CaseReport = {
      id: reportId,
      caseId: caseId,
      patientId: "PT-2024-001",
      patientName: "Aman Verma",
      patientAgeSex: "28 / M",
      procedure: "Mandibular Fracture",
      surgeryDate: "10 Jul 2024",
      surgeon: "Dr. Rahul Mehta",
      reportDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedRelative: "Just now",
      status: "Draft",
      isExported: false,
      overallScore: 82,
      interpretation: "Initial evaluation draft generated",
      confidence: "High",
      confidencePct: 91,
      imaging: {
        preOpLabel: "Pre-op CT",
        preOpDate: "10 Jul 2024",
        preOpThumbAccent: "slate",
        postOpLabel: "Post-op CT",
        postOpDate: "12 Jul 2024",
        postOpThumbAccent: "teal",
        interpretationNotes: "Computed CT alignment registered. Good structural reduction.",
        registrationRMSE: "0.45 mm",
      },
      findings: [
        {
          id: "F-NEW-1",
          category: "Alignment",
          title: "Good overall alignment",
          detail: "Fracture segments adapted within 1.0mm tolerance.",
          confidence: 94,
          status: "Needs review",
          tone: "amber",
        },
        {
          id: "F-NEW-2",
          category: "Hardware",
          title: "Hardware position stable",
          detail: "Fixation plates positioned without nerve canal compromise.",
          confidence: 92,
          status: "Confirmed",
          tone: "teal",
        },
      ],
      scoreBreakdown: [
        { id: "SC-1", name: "Alignment", score: 85, interpretation: "Excellent", target: "< 1.5 mm" },
        { id: "SC-2", name: "Symmetry", score: 78, interpretation: "Good", target: "≥ 90%" },
        { id: "SC-3", name: "Hardware", score: 80, interpretation: "Excellent", target: "Flush seating" },
        { id: "SC-4", name: "Occlusion", score: 75, interpretation: "Good", target: "Class I" },
      ],
      clinicianReview: {
        status: "Draft",
        reviewerName: "Dr. Rahul Mehta",
        reviewerRole: "Attending Maxillofacial Surgeon",
        notes: "Draft report auto-generated from registered evaluation data.",
        hasOverride: false,
      },
      references: [
        {
          id: "REF-01",
          title: "AO CMF Principles of Internal Fixation in Facial Trauma",
          source: "AO Surgery Reference",
          criterion: "Hardware adaptation",
          citation: "AO CMF 2024",
        },
      ],
      exports: [],
      defaultSections: customOptions?.sections || [
        "Patient / Case Information",
        "Evaluation Summary",
        "Before / After Imaging",
        "Findings",
        "Score Breakdown",
        "Clinician Review",
        "References",
      ],
    };

    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const updateReportReview = (
    reportId: string,
    review: {
      reviewerName: string;
      reviewerRole: string;
      notes?: string;
      hasOverride: boolean;
      clinicianScore?: number;
      overrideReason?: string;
    }
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const nowStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        return {
          ...r,
          status: "Reviewed" as ReportWorkflowStatus,
          updatedAt: new Date().toISOString(),
          updatedRelative: "Just now",
          clinicianReview: {
            status: "Reviewed",
            reviewerName: review.reviewerName,
            reviewerRole: review.reviewerRole,
            reviewedAt: `${nowStr} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            notes: review.notes,
            hasOverride: review.hasOverride,
            aiScore: r.overallScore,
            clinicianScore: review.hasOverride ? review.clinicianScore : r.overallScore,
            overrideReason: review.overrideReason,
          },
        };
      })
    );
  };

  const recordReportExport = (
    reportId: string,
    exportRecord: {
      format: "PDF" | "JSON";
      includedSections: string[];
    }
  ) => {
    const exportId = `EXP-${reportId}-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const filename = `${reportId}_Export_${Date.now().toString().slice(-4)}.pdf`;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const updatedExports = [
          {
            id: exportId,
            exportedAt: `${nowStr} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            format: exportRecord.format,
            fileReference: filename,
            fileSize: "2.4 MB",
            includedSections: exportRecord.includedSections,
          },
          ...r.exports,
        ];
        return {
          ...r,
          isExported: true,
          status: r.status === "Reviewed" ? "Exported" : r.status, // preserve or set Exported
          updatedAt: new Date().toISOString(),
          updatedRelative: "Just now",
          exports: updatedExports,
        };
      })
    );

    return filename;
  };

  const updateFindingStatus = (
    reportId: string,
    findingId: string,
    newStatus: "Confirmed" | "Needs review" | "Expected contour"
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const updatedFindings = r.findings.map((f) => {
          if (f.id !== findingId) return f;
          return {
            ...f,
            status: newStatus,
            tone: newStatus === "Confirmed" ? ("teal" as const) : ("amber" as const),
          };
        });
        return {
          ...r,
          findings: updatedFindings,
          updatedAt: new Date().toISOString(),
          updatedRelative: "Just now",
        };
      })
    );
  };

  const deleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        getReportById,
        getReportByCaseId,
        createReportForCase,
        updateReportReview,
        recordReportExport,
        updateFindingStatus,
        deleteReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
};
