export interface ReportFinding {
  id: string;
  category: "Alignment" | "Symmetry" | "Hardware" | "Occlusion" | "Residual Defects";
  title: string;
  detail: string;
  confidence: number; // e.g. 98%
  status: "Confirmed" | "Needs review" | "Expected contour";
  referenceTag?: string;
  tone: "teal" | "amber" | "coral" | "slate";
}

export interface ReportScoreCriterion {
  id: string;
  name: string;
  score: number; // 0 - 100
  interpretation: "Excellent" | "Good" | "Fair" | "Poor";
  target: string;
  deviation?: string;
}

export interface ReportReference {
  id: string;
  title: string;
  source: string;
  criterion: string;
  citation: string;
  url?: string;
}

export interface ReportExportRecord {
  id: string;
  exportedAt: string;
  format: "PDF" | "JSON";
  fileReference: string;
  fileSize: string;
  includedSections: string[];
}

export interface ReportClinicianReview {
  status: "Draft" | "Pending Review" | "Reviewed";
  reviewerName: string;
  reviewerRole: string;
  reviewedAt?: string;
  notes?: string;
  hasOverride: boolean;
  aiScore?: number;
  clinicianScore?: number;
  overrideReason?: string;
}

export type ReportWorkflowStatus = "Draft" | "Pending Review" | "Reviewed" | "Exported";

export interface CaseReport {
  id: string; // e.g. RP-2024-001
  caseId: string; // e.g. MF-2024-001
  patientId: string; // PT-2024-001
  patientName: string;
  patientAgeSex: string;
  procedure: string;
  surgeryDate: string;
  surgeon: string;
  reportDate: string;
  createdAt: string;
  updatedAt: string;
  updatedRelative: string;
  
  // Status flags
  status: ReportWorkflowStatus;
  isExported: boolean;
  
  // Summary evaluation
  overallScore: number;
  interpretation: string;
  confidence: "High" | "Medium" | "Low";
  confidencePct: number;
  
  // Imaging comparison
  imaging: {
    preOpLabel: string;
    preOpDate: string;
    preOpThumbAccent: string;
    postOpLabel: string;
    postOpDate: string;
    postOpThumbAccent: string;
    interpretationNotes: string;
    registrationRMSE: string;
  };

  // Section collections
  findings: ReportFinding[];
  scoreBreakdown: ReportScoreCriterion[];
  clinicianReview: ReportClinicianReview;
  references: ReportReference[];
  
  // Export tracking
  exports: ReportExportRecord[];
  
  // Selected sections default configuration
  defaultSections: string[];
}
