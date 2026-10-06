import React, { useState } from "react";
import { CaseReport } from "../../types/report";
import { ReportPaperDocument } from "./ReportPaperDocument";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Printer,
  Sparkles,
  Layers,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface ReportPreviewSurfaceProps {
  report: CaseReport;
  onBackToReport: () => void;
  onOpenExportPdf: () => void;
}

export const ReportPreviewSurface: React.FC<ReportPreviewSurfaceProps> = ({
  report,
  onBackToReport,
  onOpenExportPdf,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const totalPages = 4;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 70));
  };

  const handleFitToPage = () => {
    setZoomLevel(100);
    toast("Zoom reset", { description: "Report zoom fitted to 100% standard view." });
  };

  return (
    <div className="report-preview-surface">
      {/* Top Preview Controls Bar */}
      <div className="report-preview-topbar">
        <div className="preview-top-left">
          <button className="button button-quiet button-small" onClick={onBackToReport}>
            <ArrowLeft size={14} /> Back to Report
          </button>
          <div className="preview-doc-identity">
            <span className="eyebrow" style={{ margin: 0 }}>Document Preview</span>
            <strong>
              {report.id} · {report.patientName} ({report.caseId})
            </strong>
          </div>
        </div>

        <div className="preview-top-center">
          {/* Zoom controls */}
          <div className="zoom-controls-cluster">
            <button
              className="icon-button small"
              onClick={handleZoomOut}
              title="Zoom out"
              disabled={zoomLevel <= 70}
            >
              <ZoomOut size={14} />
            </button>
            <span className="zoom-indicator-text">{zoomLevel}%</span>
            <button
              className="icon-button small"
              onClick={handleZoomIn}
              title="Zoom in"
              disabled={zoomLevel >= 150}
            >
              <ZoomIn size={14} />
            </button>
            <button
              className="button button-quiet button-small"
              onClick={handleFitToPage}
              title="Fit to page"
            >
              <Maximize2 size={12} /> Fit
            </button>
          </div>
        </div>

        <div className="preview-top-right">
          <button
            className="button button-quiet button-small"
            onClick={() => window.print()}
            title="Print document"
          >
            <Printer size={14} /> Print
          </button>
          <button className="button button-primary button-small" onClick={onOpenExportPdf}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Preview Workbench Layout */}
      <div className="report-preview-layout">
        {/* Left Thumbnails Rail (Desktop) */}
        <aside className="preview-thumbnail-rail" aria-label="Page navigation thumbnails">
          <div className="thumbnail-rail-head">
            <span>Pages ({totalPages})</span>
          </div>
          <div className="thumbnail-list">
            {[1, 2, 3, 4].map((p) => {
              const pageTitles = [
                "1. Overview & Summary",
                "2. Pre/Post Imaging",
                "3. Findings & Scores",
                "4. Clinician Sign-Off",
              ];
              const isSelected = currentPage === p;
              return (
                <button
                  key={p}
                  type="button"
                  className={`thumbnail-card ${isSelected ? "active" : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  <div className="thumbnail-mini-sheet">
                    <div className="mini-sheet-line head" />
                    <div className="mini-sheet-line block" />
                    <div className="mini-sheet-line" />
                    <div className="mini-sheet-line" />
                    <div className="mini-sheet-num">{p}</div>
                  </div>
                  <span className="thumbnail-title">{pageTitles[p - 1]}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Document Stage */}
        <main className="preview-document-stage">
          <div className="document-sheet-viewport">
            <ReportPaperDocument
              report={report}
              page={currentPage}
              scale={zoomLevel}
            />
          </div>

          {/* Bottom Floating Page Switcher */}
          <div className="preview-floating-pager">
            <button
              className="icon-button small"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pager-text">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className="icon-button small"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
