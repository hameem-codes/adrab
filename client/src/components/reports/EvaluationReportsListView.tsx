import React, { useState } from "react";
import { CaseReport, ReportWorkflowStatus } from "../../types/report";
import { useReports } from "../../contexts/ReportsContext";
import {
  FileText,
  Search,
  Filter,
  CalendarDays,
  Plus,
  ChevronRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  Download,
  Eye,
  ShieldCheck,
  Building,
  User,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface EvaluationReportsListViewProps {
  onSelectReport: (reportId: string) => void;
  onOpenCreateReport: () => void;
  onNavigateToCase: (caseId: string) => void;
  onNavigateToPatient: (patientId: string) => void;
  onOpenExportPdf: (report: CaseReport) => void;
  onOpenPreview: (report: CaseReport) => void;
}

export const EvaluationReportsListView: React.FC<EvaluationReportsListViewProps> = ({
  onSelectReport,
  onOpenCreateReport,
  onNavigateToCase,
  onNavigateToPatient,
  onOpenExportPdf,
  onOpenPreview,
}) => {
  const { reports } = useReports();

  // Search & Filter state (Section 7)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [procedureFilter, setProcedureFilter] = useState<string>("Procedure");
  const [dateFilter, setDateFilter] = useState<string>("Date Range");
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || "");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [mobileTab, setMobileTab] = useState<"All" | "Draft" | "Reviewed" | "Exported">("All");

  // Summary Metrics calculations (Section 6)
  const totalReports = reports.length;
  const draftReports = reports.filter((r) => r.status === "Draft" || r.status === "Pending Review").length;
  const reviewedReports = reports.filter((r) => r.status === "Reviewed" || r.status === "Exported").length;
  const exportedReports = reports.filter((r) => r.isExported || r.status === "Exported").length;

  // Filter application
  const filteredReports = reports.filter((report) => {
    // 7.1 Search by Report ID, Case ID, Patient Name, Procedure
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      report.id.toLowerCase().includes(q) ||
      report.caseId.toLowerCase().includes(q) ||
      report.patientName.toLowerCase().includes(q) ||
      report.procedure.toLowerCase().includes(q);

    // 7.2 Status filter
    let matchesStatus = true;
    if (statusFilter !== "All") {
      if (statusFilter === "Exported") {
        matchesStatus = report.isExported || report.status === "Exported";
      } else {
        matchesStatus = report.status === statusFilter;
      }
    }

    // Mobile tabs filter
    if (mobileTab === "Draft") {
      if (report.status !== "Draft" && report.status !== "Pending Review") matchesStatus = false;
    } else if (mobileTab === "Reviewed") {
      if (report.status !== "Reviewed" && report.status !== "Exported") matchesStatus = false;
    } else if (mobileTab === "Exported") {
      if (!report.isExported && report.status !== "Exported") matchesStatus = false;
    }

    // 7.3 Procedure filter
    const matchesProcedure =
      procedureFilter === "Procedure" ||
      report.procedure.toLowerCase().includes(procedureFilter.toLowerCase());

    // 7.4 Date filter
    let matchesDate = true;
    if (dateFilter === "Last 7 days") {
      matchesDate = !report.updatedRelative.includes("month");
    } else if (dateFilter === "Last 30 days") {
      matchesDate = true;
    }

    return matchesSearch && matchesStatus && matchesProcedure && matchesDate;
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setProcedureFilter("Procedure");
    setDateFilter("Date Range");
    setMobileTab("All");
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredReports.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredReports.map((r) => r.id));
    }
  };

  return (
    <div className="reports-list-container">
      {/* 5. REPORTS PAGE HEADER */}
      <div className="page-header">
        <div>
          <div className="eyebrow">Clinical Documentation</div>
          <h1>Reports</h1>
          <p>View, review and export case evaluation reports</p>
        </div>
        <div className="page-header-actions">
          <button className="button button-primary" onClick={onOpenCreateReport}>
            <Plus size={15} /> Create Report
          </button>
        </div>
      </div>

      {/* 6. SUMMARY METRICS */}
      <div className="metric-grid">
        <div className="metric-card metric-teal">
          <div className="metric-head">
            <span>Total Reports</span>
            <span className="metric-icon"><FileText size={16} /></span>
          </div>
          <div className="metric-value">{totalReports}</div>
          <div className="metric-detail">
            <ArrowUpRight size={13} />
            <span>21% vs last month</span>
          </div>
        </div>

        <div className="metric-card metric-amber">
          <div className="metric-head">
            <span>Draft Reports</span>
            <span className="metric-icon"><Clock3 size={16} /></span>
          </div>
          <div className="metric-value">{draftReports}</div>
          <div className="metric-detail">
            <ArrowDownRight size={13} />
            <span>5% vs last month</span>
          </div>
        </div>

        <div className="metric-card metric-teal">
          <div className="metric-head">
            <span>Reviewed Reports</span>
            <span className="metric-icon"><ShieldCheck size={16} /></span>
          </div>
          <div className="metric-value">{reviewedReports}</div>
          <div className="metric-detail">
            <ArrowUpRight size={13} />
            <span>18% vs last month</span>
          </div>
        </div>

        <div className="metric-card metric-coral">
          <div className="metric-head">
            <span>Exported Reports</span>
            <span className="metric-icon"><Download size={16} /></span>
          </div>
          <div className="metric-value">{exportedReports}</div>
          <div className="metric-detail">
            <ArrowUpRight size={13} />
            <span>16% vs last month</span>
          </div>
        </div>
      </div>

      {/* 7. REPORT SEARCH & FILTERS ROW */}
      <div className="panel reports-registry-panel">
        <div className="report-filter-row">
          <div className="inline-search report-search-bar">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Report ID, Case ID, patient or procedure..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">Status: All</option>
            <option value="Draft">Draft</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Exported">Exported</option>
          </select>

          <select
            value={procedureFilter}
            onChange={(e) => setProcedureFilter(e.target.value)}
            aria-label="Filter by procedure"
          >
            <option value="Procedure">Procedure</option>
            <option value="Mandibular">Mandibular Fracture</option>
            <option value="Zygomatic">Zygomatic Fracture</option>
            <option value="LeFort">LeFort I</option>
            <option value="Orbital">Orbital Fracture</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by date range"
          >
            <option value="Date Range">Date Range</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>

          <button className="button button-quiet" onClick={handleClearFilters}>
            Clear
          </button>
        </div>

        {/* 38. Mobile Tabs Bar */}
        <div className="report-mobile-tabs" role="tablist">
          <button
            className={`report-mobile-tab ${mobileTab === "All" ? "report-mobile-tab-active" : ""}`}
            onClick={() => setMobileTab("All")}
          >
            All {totalReports}
          </button>
          <button
            className={`report-mobile-tab ${mobileTab === "Draft" ? "report-mobile-tab-active" : ""}`}
            onClick={() => setMobileTab("Draft")}
          >
            Draft {draftReports}
          </button>
          <button
            className={`report-mobile-tab ${mobileTab === "Reviewed" ? "report-mobile-tab-active" : ""}`}
            onClick={() => setMobileTab("Reviewed")}
          >
            Reviewed {reviewedReports}
          </button>
          <button
            className={`report-mobile-tab ${mobileTab === "Exported" ? "report-mobile-tab-active" : ""}`}
            onClick={() => setMobileTab("Exported")}
          >
            Exported {exportedReports}
          </button>
        </div>

        {/* 8. EVALUATION REPORTS TABLE (Desktop) */}
        {filteredReports.length === 0 ? (
          <div className="empty-state-container" style={{ padding: "48px 24px", textAlign: "center" }}>
            <FileText size={32} className="text-muted" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px" }}>No reports found</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: "12px", margin: "0 0 16px" }}>
              {searchQuery || statusFilter !== "All" || procedureFilter !== "Procedure"
                ? "Try adjusting your search terms or clearing your filters."
                : "Generate a report from a completed evaluation."}
            </p>
            {searchQuery || statusFilter !== "All" || procedureFilter !== "Procedure" ? (
              <button className="button button-quiet" onClick={handleClearFilters}>
                Clear Filters
              </button>
            ) : (
              <button className="button button-primary" onClick={onOpenCreateReport}>
                <Plus size={14} /> Create Report
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrap report-desktop-table">
              <table className="clinical-table report-wire-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px" }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length === filteredReports.length && filteredReports.length > 0}
                        onChange={toggleSelectAll}
                        aria-label="Select all reports"
                      />
                    </th>
                    <th>Report ID</th>
                    <th>Case ID</th>
                    <th>Patient Name</th>
                    <th>Procedure</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const isSelected = selectedReportId === report.id;
                    const isChecked = selectedRowIds.includes(report.id);
                    return (
                      <tr
                        key={report.id}
                        className={isSelected ? "row-selected" : ""}
                        onClick={() => {
                          setSelectedReportId(report.id);
                          onSelectReport(report.id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td onClick={(e) => toggleSelectRow(report.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleSelectRow(report.id, e as unknown as React.MouseEvent)}
                            aria-label={`Select report ${report.id}`}
                          />
                        </td>
                        <td>
                          <span className="case-key mono font-semibold">{report.id}</span>
                        </td>
                        <td>
                          <button
                            className="case-key mono text-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToCase(report.caseId);
                            }}
                          >
                            {report.caseId}
                          </button>
                        </td>
                        <td>
                          <button
                            className="text-button"
                            style={{ fontWeight: 600, color: "var(--ink)", padding: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToPatient(report.patientId);
                            }}
                          >
                            {report.patientName}
                          </button>
                        </td>
                        <td>
                          <span className="procedure-cell">{report.procedure}</span>
                        </td>
                        <td>
                          <strong className="mono text-teal" style={{ fontSize: "12px" }}>
                            {report.overallScore}
                          </strong>
                        </td>
                        <td>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <span className={`status-pill status-${report.status.toLowerCase().replace(" ", "-")}`}>
                              <span className="status-dot" />
                              {report.status}
                            </span>
                            {report.isExported && (
                              <span className="status-pill status-complete status-compact" title="Exported PDF ready">
                                <Download size={10} /> PDF
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="updated-cell">{report.updatedRelative}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "4px" }}>
                            <button
                              className="icon-button small"
                              title="Preview Document"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPreview(report);
                              }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="icon-button small"
                              title="Export PDF"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenExportPdf(report);
                              }}
                            >
                              <Download size={14} />
                            </button>
                            <button
                              className="icon-button small"
                              title="Open Report Detail"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectReport(report.id);
                              }}
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 38. Mobile Reports List Representation */}
            <div className="report-mobile-list">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="report-mobile-card"
                  onClick={() => onSelectReport(report.id)}
                >
                  <div className="report-mobile-card-head">
                    <span className="case-key mono font-bold">{report.id}</span>
                    <span className={`status-pill status-${report.status.toLowerCase().replace(" ", "-")} status-compact`}>
                      {report.status}
                    </span>
                  </div>

                  <strong className="report-mobile-patient">{report.patientName}</strong>
                  <span className="report-mobile-sub">
                    {report.caseId} · {report.procedure}
                  </span>

                  <div className="report-mobile-card-foot">
                    <div className="mobile-score-wrap">
                      <span>Score:</span>
                      <strong className="mono text-teal">{report.overallScore}</strong>
                    </div>
                    <span className="updated-text">{report.updatedRelative}</span>
                    <ChevronRight size={15} className="text-muted" />
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer with Pagination */}
            <div className="table-footer report-table-footer">
              <span>Showing 1–{filteredReports.length} of {totalReports} reports</span>
              <span className="pagination">
                <button className="icon-button small" aria-label="Previous page">
                  <ChevronLeft size={14} />
                </button>
                <span className="pagination-current">1</span>
                <span>2</span>
                <span>3</span>
                <span>…</span>
                <span>10</span>
                <button className="icon-button small" aria-label="Next page">
                  <ChevronRight size={14} />
                </button>
                <span>
                  10 / page <ChevronDown size={12} />
                </span>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions (Wireframe Section 5 / standard layout) */}
      <section className="case-quick-actions" style={{ marginTop: "16px" }}>
        <div>
          <strong>Quick Actions</strong>
          <span>Common report workflows</span>
        </div>
        <button
          className="quick-action"
          onClick={onOpenCreateReport}
        >
          <span className="quick-icon"><Plus size={17} /></span>
          <span><strong>New Report</strong><small>Generate from case</small></span>
          <ChevronRight size={14} />
        </button>
        <button
          className="quick-action"
          onClick={() => {
            const first = reports[0];
            if (first) onOpenPreview(first);
          }}
        >
          <span className="quick-icon"><Eye size={17} /></span>
          <span><strong>Report Preview</strong><small>Document layout</small></span>
          <ChevronRight size={14} />
        </button>
        <button
          className="quick-action"
          onClick={() => {
            const first = reports[0];
            if (first) onOpenExportPdf(first);
          }}
        >
          <span className="quick-icon"><Download size={17} /></span>
          <span><strong>Batch Export</strong><small>Save signed PDFs</small></span>
          <ChevronRight size={14} />
        </button>
        <button
          className="quick-action"
          onClick={() => toast("Audit Trail", { description: "Viewing immutable cryptographic audit log for all signed reports." })}
        >
          <span className="quick-icon"><ShieldCheck size={17} /></span>
          <span><strong>Audit Verification</strong><small>Verify digital signatures</small></span>
          <ChevronRight size={14} />
        </button>
      </section>
    </div>
  );
};
