import { Toaster, toast } from "sonner";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Command,
  Download,
  FileBarChart2,
  FileText,
  Filter,
  Gauge,
  Grid2X2,
  HeartPulse,
  Image as ImageIcon,
  LayoutDashboard,
  ListFilter,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PanelsTopLeft,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Target,
  UserRound,
  UsersRound,
  X,
  Zap, ArrowRight, ZoomIn, Hand, ArrowDownUp, Sun, Layers, Box, CloudUpload, Play,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import "./index.css";

const TEAL = "#0c7c78";
const NAVY = "#1d3741";
const chartTooltipStyle = {
  background: "#17353d",
  border: "none",
  borderRadius: 10,
  color: "#f6f4ef",
  fontSize: 12,
};

type Icon = typeof LayoutDashboard;
type Status = "review" | "active" | "complete" | "attention" | "draft";
type CasePhase = "overview" | "before" | "surgery" | "after" | "evaluation" | "viewer" | "review";

type Patient = {
  id: string;
  initials: string;
  name: string;
  age: number;
  sex: "M" | "F";
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  procedure: string;
  status: "Active" | "Inactive" | "New" | "Follow-up";
  activeCaseCount: number;
  lastVisit: string;
  caseId: string;
  accent: string;
};

type CaseRecord = {
  id: string;
  patientId: string;
  patient: string;
  procedure: string;
  phase: string;
  score: number;
  confidence: number;
  status: Status;
  updated: string;
  priority: "Routine" | "Review today" | "Escalated";
  evaluator: string;
};

const patients: Patient[] = [
  { id: "PT-2024-001", initials: "AV", name: "Aman Verma", age: 28, sex: "M", phone: "+91 98765 43210", email: "aman.verma@email.com", address: "Bangalore, Karnataka", bloodGroup: "O+", allergies: "Not specified", procedure: "Mandibular fracture", status: "Active", activeCaseCount: 1, lastVisit: "2 hours ago", caseId: "MF-2024-001", accent: "#dcefe9" },
  { id: "PT-2024-002", initials: "PS", name: "Priya Sharma", age: 34, sex: "F", phone: "+91 87654 32109", email: "priya.sharma@email.com", address: "Mumbai, Maharashtra", bloodGroup: "B+", allergies: "Penicillin", procedure: "Zygomatic fracture", status: "Active", activeCaseCount: 2, lastVisit: "5 days ago", caseId: "MF-2024-002", accent: "#e7eeeb" },
  { id: "PT-2024-003", initials: "RK", name: "Rohit Kumar", age: 26, sex: "M", phone: "+91 99887 77665", email: "rohit.k@email.com", address: "Delhi, NCR", bloodGroup: "A+", allergies: "None", procedure: "LeFort I", status: "Inactive", activeCaseCount: 1, lastVisit: "1 week ago", caseId: "MF-2024-003", accent: "#e7eeeb" },
  { id: "PT-2024-004", initials: "SP", name: "Sneha Patel", age: 31, sex: "F", phone: "+91 91234 56780", email: "sneha.p@email.com", address: "Ahmedabad, Gujarat", bloodGroup: "AB+", allergies: "Latex", procedure: "Orbital fracture", status: "Active", activeCaseCount: 3, lastVisit: "2 hours ago", caseId: "MF-2024-004", accent: "#dcefe9" },
  { id: "PT-2024-005", initials: "VS", name: "Vikram Singh", age: 40, sex: "M", phone: "+91 88776 55443", email: "vikram.s@email.com", address: "Jaipur, Rajasthan", bloodGroup: "O-", allergies: "None", procedure: "Mandibular reconstruction", status: "Active", activeCaseCount: 1, lastVisit: "3 days ago", caseId: "MF-2024-005", accent: "#dcefe9" },
  { id: "PT-2024-006", initials: "NR", name: "Neha Reddy", age: 29, sex: "F", phone: "+91 99876 12345", email: "neha.reddy@email.com", address: "Hyderabad, Telangana", bloodGroup: "B+", allergies: "Sulfa drugs", procedure: "Nasal fracture repair", status: "Inactive", activeCaseCount: 1, lastVisit: "1 week ago", caseId: "MF-2024-006", accent: "#e7eeeb" },
  { id: "PT-2024-007", initials: "AD", name: "Arjun Das", age: 33, sex: "M", phone: "+91 87654 99887", email: "arjun.das@email.com", address: "Kolkata, West Bengal", bloodGroup: "O+", allergies: "None", procedure: "Zygomaticomaxillary complex", status: "Active", activeCaseCount: 2, lastVisit: "5 days ago", caseId: "MF-2024-007", accent: "#dcefe9" },
  { id: "PT-2024-008", initials: "KM", name: "Karan Mehta", age: 27, sex: "M", phone: "+91 98989 77654", email: "karan.mehta@email.com", address: "Pune, Maharashtra", bloodGroup: "A-", allergies: "None", procedure: "Orbital floor reconstruction", status: "Inactive", activeCaseCount: 0, lastVisit: "2 weeks ago", caseId: "MF-2024-008", accent: "#e7eeeb" },
  { id: "PT-2024-009", initials: "ST", name: "Sana Thomas", age: 32, sex: "F", phone: "+91 91234 66778", email: "sana.thomas@email.com", address: "Kochi, Kerala", bloodGroup: "B-", allergies: "Aspirin", procedure: "LeFort I", status: "Active", activeCaseCount: 1, lastVisit: "3 days ago", caseId: "MF-2024-009", accent: "#dcefe9" },
  { id: "PT-2024-010", initials: "MK", name: "Mohammed Khan", age: 36, sex: "M", phone: "+91 87876 55432", email: "m.khan@email.com", address: "Chennai, Tamil Nadu", bloodGroup: "AB-", allergies: "None", procedure: "Mandibular fracture", status: "Active", activeCaseCount: 2, lastVisit: "1 week ago", caseId: "MF-2024-010", accent: "#dcefe9" },
  { id: "PT-1048", initials: "AM", name: "Amina Mensah", age: 29, sex: "F", phone: "+44 7700 900148", email: "amina.m@email.com", address: "London, UK", bloodGroup: "O+", allergies: "None recorded", procedure: "Orbital floor reconstruction", status: "Active", activeCaseCount: 1, lastVisit: "Today, 09:42", caseId: "MX-2407", accent: "#d9a984" },
];

const cases: CaseRecord[] = [
  { id: "MF-2024-001", patientId: "PT-2024-001", patient: "Aman Verma", procedure: "Mandibular Fracture", phase: "Evaluation · Outcome", score: 8.2, confidence: 91, status: "active", updated: "2 hours ago", priority: "Routine", evaluator: "Dr. Rahul Mehta" },
  { id: "MF-2024-002", patientId: "PT-2024-002", patient: "Priya Sharma", procedure: "Zygomatic Fracture", phase: "Post-op · Verification", score: 7.8, confidence: 88, status: "active", updated: "5 hours ago", priority: "Routine", evaluator: "Dr. Rahul Mehta" },
  { id: "MF-2024-003", patientId: "PT-2024-003", patient: "Rohit Kumar", procedure: "LeFort I", phase: "Pre-op · Intake", score: 7.5, confidence: 82, status: "draft", updated: "1 day ago", priority: "Routine", evaluator: "Dr. Sarah Lee" },
  { id: "MF-2024-004", patientId: "PT-2024-004", patient: "Sneha Patel", procedure: "Orbital Fracture", phase: "Review · Attention", score: 6.8, confidence: 79, status: "attention", updated: "1 day ago", priority: "Escalated", evaluator: "Dr. Elena Okafor" },
  { id: "MF-2024-005", patientId: "PT-2024-005", patient: "Vikram Singh", procedure: "Mandibular Fracture", phase: "Evaluation · Complete", score: 9.1, confidence: 96, status: "complete", updated: "2 days ago", priority: "Routine", evaluator: "Dr. Rahul Mehta" },
  { id: "MF-2024-006", patientId: "PT-2024-006", patient: "Neha Reddy", procedure: "Zygomatic Fracture", phase: "Pre-op · Planning", score: 7.0, confidence: 80, status: "draft", updated: "2 days ago", priority: "Routine", evaluator: "Dr. Sarah Lee" },
  { id: "MF-2024-007", patientId: "PT-2024-007", patient: "Arjun Das", procedure: "LeFort I", phase: "Post-op · Outcome", score: 8.4, confidence: 93, status: "review", updated: "4 days ago", priority: "Review today", evaluator: "Dr. Elena Okafor" },
  { id: "MF-2024-008", patientId: "PT-2024-008", patient: "Karan Mehta", procedure: "Orbital Fracture", phase: "Review · Clinician input", score: 7.2, confidence: 84, status: "review", updated: "5 days ago", priority: "Review today", evaluator: "Dr. Rahul Mehta" },
  { id: "MF-2024-009", patientId: "PT-2024-009", patient: "Sana Thomas", procedure: "Mandibular Fracture", phase: "Evaluation · Complete", score: 8.8, confidence: 95, status: "complete", updated: "1 week ago", priority: "Routine", evaluator: "Dr. Elena Okafor" },
  { id: "MF-2024-010", patientId: "PT-2024-010", patient: "Mohammed Khan", procedure: "Zygomatic Fracture", phase: "Pre-op · Intake", score: 7.4, confidence: 81, status: "draft", updated: "1 week ago", priority: "Routine", evaluator: "Dr. Sarah Lee" },
  { id: "MX-2407", patientId: "PT-1048", patient: "Amina Mensah", procedure: "Orbital floor reconstruction", phase: "After · Review", score: 8.8, confidence: 94, status: "review", updated: "12 min ago", priority: "Review today", evaluator: "Dr. Elena Okafor" },
];

const scoreTrend = [
  { month: "May", score: 7.9, confidence: 84 },
  { month: "Jun", score: 8.1, confidence: 86 },
  { month: "Jul", score: 8.0, confidence: 87 },
  { month: "Aug", score: 8.4, confidence: 89 },
  { month: "Sep", score: 8.6, confidence: 92 },
  { month: "Oct", score: 8.7, confidence: 93 },
];

const scoreDistribution = [
  { name: "9.0–10.0", value: 34, color: "#0c7c78" },
  { name: "8.0–8.9", value: 41, color: "#7f9894" },
  { name: "7.0–7.9", value: 18, color: "#aebbb7" },
  { name: "< 7.0", value: 7, color: "#d3d9d5" },
];

const procedureResults = [
  { name: "Orbital", score: 8.9, cases: 38 },
  { name: "Le Fort", score: 8.5, cases: 31 },
  { name: "ZMC", score: 8.7, cases: 22 },
  { name: "Mandible", score: 8.2, cases: 17 },
  { name: "Nasal", score: 9.1, cases: 14 },
];

const navGroups: Array<{ label: string; items: Array<{ label: string; path: string; icon: Icon; badge?: string }> }> = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      { label: "Cases", path: "/cases", icon: ClipboardList, badge: "4" },
      { label: "Patients", path: "/patients", icon: UsersRound },
      { label: "Reports", path: "/reports", icon: FileText },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
      { label: "Knowledge base", path: "/knowledge", icon: BookOpen },
      { label: "Feedback", path: "/feedback", icon: MessageSquareText, badge: "7" },
    ],
  },
  {
    label: "System",
    items: [{ label: "Admin", path: "/admin", icon: Settings2 }],
  },
];

const phaseItems: Array<{ key: CasePhase; label: string; kicker: string; icon: Icon }> = [
  { key: "overview", label: "Overview", kicker: "Case context", icon: PanelsTopLeft },
  { key: "before", label: "Before", kicker: "Pre-operative", icon: ImageIcon },
  { key: "surgery", label: "Surgery / plan", kicker: "Operative record", icon: ClipboardCheck },
  { key: "after", label: "After", kicker: "Post-operative", icon: Activity },
  { key: "evaluation", label: "Evaluation", kicker: "Outcome score", icon: Gauge },
  { key: "viewer", label: "Viewer", kicker: "Compare anatomy", icon: Grid2X2 },
  { key: "review", label: "Review", kicker: "Clinician input", icon: ShieldCheck },
];

function statusLabel(status: Status) {
  return { review: "Needs review", active: "In progress", complete: "Complete", attention: "Attention", draft: "Draft" }[status];
}

function StatusPill({ status, compact = false }: { status: Status; compact?: boolean }) {
  return <span className={`status-pill status-${status} ${compact ? "status-compact" : ""}`}><span className="status-dot" />{statusLabel(status)}</span>;
}

function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`brand-lockup ${collapsed ? "brand-collapsed" : ""}`} aria-label="MaxFace-Eval">
      <div className="brand-mark" aria-hidden="true"><span /><span /></div>
      {!collapsed && <div><div className="brand-name">MaxFace-Eval</div><div className="brand-sub">AI-ASSISTED PRE / POST-OP EVALUATION</div></div>}
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const currentTitle = getPageTitle(location);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isActive = (path: string) => path === "/" ? location === "/" : location === path || location.startsWith(`${path}/`);

  return (
    <div className="app-shell">
      <aside className={`app-rail ${collapsed ? "rail-collapsed" : ""} ${mobileOpen ? "rail-mobile-open" : ""}`}>
        <div className="rail-head"><BrandMark collapsed={collapsed} /><button className="icon-button rail-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button></div>
        <div className="rail-context"><div className="context-pulse" /><span>{collapsed ? "LIVE" : "Clinical workspace live"}</span></div>
        <nav className="rail-nav" aria-label="Primary navigation">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            {!collapsed && <div className="nav-group-label">{group.label}</div>}
            {group.items.map((item) => {
              const IconComponent = item.icon;
              return <button key={item.path} className={`nav-item ${isActive(item.path) ? "nav-item-active" : ""}`} onClick={() => navigate(item.path)} title={collapsed ? item.label : undefined} aria-current={isActive(item.path) ? "page" : undefined}>
                <IconComponent size={17} strokeWidth={isActive(item.path) ? 2.2 : 1.8} /><span className="nav-item-label">{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>;
            })}
          </div>)}
        </nav>
        <div className="rail-bottom">
          <button className="nav-item" onClick={() => toast("Command palette opened", { description: "Jump to any part of the clinical workspace." })} title={collapsed ? "Command palette" : undefined}><Command size={17} /><span className="nav-item-label">Command palette</span><span className="shortcut">⌘K</span></button>
          <div className="clinician-card" onClick={() => toast("Clinician Profile", { description: "Dr. Rahul Mehta · Senior Maxillofacial Surgeon" })} style={{ cursor: "pointer" }}><div className="avatar avatar-teal">DR</div><div className="clinician-meta"><strong>Dr. Rahul Mehta</strong><span>Surgeon</span></div><ChevronDown size={14} className="clinician-more" /></div>
          {!collapsed && <div className="rail-disclaimer"><strong>Research Prototype</strong><span>Not for clinical use.</span></div>}
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <section className="app-main">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={18} /></button><div className="breadcrumb"><span>MaxFace-Eval</span><ChevronRight size={13} /><strong>{currentTitle}</strong></div></div>
          <div className="topbar-actions"><button className="search-trigger" onClick={() => setCommandOpen(true)}><Search size={15} /><span>Search patients, cases or IDs...</span><kbd>⌘ K</kbd></button><button className="icon-button notification-button" onClick={() => toast("Notifications", { description: "2 pending surgeon evaluations awaiting sign-off." })} aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button><button className="help-button" onClick={() => toast("Support centre", { description: "Clinical review guidance is available in the Knowledge base." })}><CircleHelp size={16} /><span>Help</span></button><div className="topbar-profile" onClick={() => toast("Profile menu", { description: "Signed in as Dr. Rahul Mehta (Surgeon)" })}><div className="topbar-avatar avatar avatar-ink">DR</div><span className="topbar-profile-name">Dr. Rahul Mehta</span><ChevronDown size={13} className="topbar-profile-chevron" /></div></div>
        </header>
        <main className="page-content">{children}</main>
        <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
          <button className={`mobile-nav-btn ${isActive("/") ? "active" : ""}`} onClick={() => navigate("/")}><LayoutDashboard size={18} /><span>Dashboard</span></button>
          <button className={`mobile-nav-btn ${isActive("/patients") ? "active" : ""}`} onClick={() => navigate("/patients")}><UsersRound size={18} /><span>Patients</span></button>
          <button className={`mobile-nav-btn ${isActive("/cases") ? "active" : ""}`} onClick={() => navigate("/cases")}><ClipboardList size={18} /><span>Cases</span></button>
          <button className={`mobile-nav-btn ${isActive("/reports") ? "active" : ""}`} onClick={() => navigate("/reports")}><FileText size={18} /><span>Reports</span></button>
          <button className="mobile-nav-btn" onClick={() => setMobileOpen(true)}><MoreHorizontal size={18} /><span>More</span></button>
        </nav>
      </section>
      {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} onNavigate={(path) => { navigate(path); setCommandOpen(false); }} />}
    </div>
  );
}

function CommandPalette({ onClose, onNavigate }: { onClose: () => void; onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState("");
  const actions = [{ label: "Go to dashboard", hint: "Overview", path: "/", icon: LayoutDashboard }, { label: "Open cases", hint: "4 need review", path: "/cases", icon: ClipboardList }, { label: "Find patient Amina Mensah", hint: "PT-1048", path: "/patients/PT-1048", icon: UserRound }, { label: "View analytics", hint: "Score trends", path: "/analytics", icon: BarChart3 }, { label: "Open knowledge base", hint: "References", path: "/knowledge", icon: BookOpen }];
  const filtered = actions.filter((action) => `${action.label} ${action.hint}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="command-overlay" onMouseDown={onClose}><div className="command-panel" onMouseDown={(event) => event.stopPropagation()}><div className="command-search"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the workspace..." /><kbd>ESC</kbd></div><div className="command-list">{filtered.map((action) => { const IconComponent = action.icon; return <button className="command-row" key={action.label} onClick={() => onNavigate(action.path)}><span className="command-icon"><IconComponent size={16} /></span><span><strong>{action.label}</strong><small>{action.hint}</small></span><ChevronRight size={15} className="command-arrow" /></button>; })}</div><div className="command-footer"><span><kbd>↑↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>ESC</kbd> Close</span></div></div></div>;
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-header-actions">{actions}</div>}</div>;
}

function MetricCard({ label, value, detail, trend, tone = "teal", icon: IconComponent }: { label: string; value: string; detail: string; trend?: "up" | "down"; tone?: "teal" | "amber" | "coral" | "ink"; icon: Icon }) {
  return <div className={`metric-card metric-${tone}`}><div className="metric-head"><span>{label}</span><span className="metric-icon"><IconComponent size={16} /></span></div><div className="metric-value">{value}</div><div className="metric-detail">{trend && (trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />)}<span>{detail}</span></div></div>;
}

function DashboardPage() {
  const [, navigate] = useLocation();
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>("MF-2024-001");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const recentCases = [
    { id: "MF-2024-001", patient: "Aman Verma", procedure: "Mandibular Fracture", stage: "Evaluation", tone: "evaluation", updated: "2 hours ago", target: "/cases/MX-2407" },
    { id: "MF-2024-002", patient: "Priya Sharma", procedure: "Zygomatic Fracture", stage: "Post-op", tone: "postop", updated: "5 hours ago", target: "/cases/MX-2399" },
    { id: "MF-2024-003", patient: "Rohit Kumar", procedure: "LeFort I", stage: "Pre-op", tone: "preop", updated: "1 day ago", target: "/cases/MX-2374" },
    { id: "MF-2024-004", patient: "Sneha Patel", procedure: "Orbital Fracture", stage: "Review", tone: "review", updated: "1 day ago", target: "/cases/MX-2361" },
    { id: "MF-2024-005", patient: "Vikram Singh", procedure: "Mandibular Fracture", stage: "Completed", tone: "completed", updated: "2 days ago", target: "/cases/MX-2310" },
  ];
  const pendingReviews = [
    { id: "MF-2024-004", patient: "Sneha Patel", procedure: "Orbital Fracture", accent: "coral", target: "/cases/MX-2407/review" },
    { id: "MF-2024-007", patient: "Arjun Das", procedure: "Zygomatic Fracture", accent: "teal", target: "/cases/MX-2407/review" },
    { id: "MF-2024-010", patient: "Neha Reddy", procedure: "Mandibular Fracture", accent: "amber", target: "/cases/MX-2407/review" },
    { id: "MF-2024-011", patient: "Karan Mehta", procedure: "LeFort I", accent: "slate", target: "/cases/MX-2407/review" },
  ];
  const recentEvaluations = [
    ["MF-2024-001", "Aman Verma", "Mandibular Fracture", "82", "Good alignment", "2 hours ago", "good", "/cases/MX-2407/evaluation"],
    ["MF-2024-002", "Priya Sharma", "Zygomatic Fracture", "68", "Minor asymmetry", "5 hours ago", "fair", "/cases/MX-2399/evaluation"],
    ["MF-2024-003", "Rohit Kumar", "LeFort I", "91", "Excellent reduction", "1 day ago", "good", "/cases/MX-2374/evaluation"],
    ["MF-2024-004", "Sneha Patel", "Orbital Fracture", "74", "Hardware prominent", "1 day ago", "fair", "/cases/MX-2361/evaluation"],
    ["MF-2024-005", "Vikram Singh", "Mandibular Fracture", "88", "Good functional outcome", "2 days ago", "good", "/cases/MX-2310/evaluation"],
  ];
  const recentImaging = [
    { id: "MF-2024-001", label: "Pre-op CT", accent: "slate", target: "/cases/MX-2407/viewer" },
    { id: "MF-2024-002", label: "Segmentation", accent: "teal", target: "/cases/MX-2399/viewer" },
    { id: "MF-2024-003", label: "Post-op CT", accent: "coral", target: "/cases/MX-2374/viewer" },
    { id: "MF-2024-004", label: "Pre-op CT", accent: "amber", target: "/cases/MX-2361/viewer" },
  ];

  return (
    <div className="dashboard-page wireframe-dashboard">
      <PageHeader
        eyebrow="Research prototype · not for clinical decision-making"
        title="Dashboard"
        description="Overview of cases, evaluations and system activity"
        actions={
          <div style={{ position: "relative" }}>
            <button className="button button-quiet" onClick={() => setDateMenuOpen(!dateMenuOpen)}>
              <CalendarDays size={15} /> {dateRange} <ChevronDown size={13} />
            </button>
            {dateMenuOpen && (
              <div className="date-range-dropdown">
                {["Last 7 days", "Last 30 days", "Last 90 days", "Custom range"].map((range) => (
                  <button
                    key={range}
                    className={`date-range-item ${dateRange === range ? "active" : ""}`}
                    onClick={() => {
                      setDateRange(range);
                      setDateMenuOpen(false);
                      toast("Date range updated", { description: `Filtering workspace by ${range}` });
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />
      <div className="metric-grid">
        <MetricCard label="Active Cases" value="24" detail="12% vs last month" trend="up" icon={ClipboardList} />
        <MetricCard label="Pending Reviews" value="12" detail="8% vs last month" trend="down" tone="amber" icon={ShieldCheck} />
        <MetricCard label="Evaluations Completed" value="97" detail="21% vs last month" trend="up" tone="ink" icon={BarChart3} />
        <MetricCard label="Total Patients" value="86" detail="10% vs last month" trend="up" tone="coral" icon={UsersRound} />
      </div>

      <div className="dashboard-wire-grid">
        <section className="panel wire-panel recent-cases-panel">
          <PanelHeading
            title="Recent Cases"
            meta="Latest activity across the workspace"
            action={<button className="text-button" onClick={() => navigate("/cases")}>View all <ChevronRight size={14} /></button>}
          />
          <div className="table-wrap dashboard-desktop-table">
            <table className="clinical-table wire-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Patient Name</th>
                  <th>Procedure</th>
                  <th>Stage</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((item) => (
                  <tr
                    key={item.id}
                    className={selectedCaseId === item.id ? "row-selected" : ""}
                    onClick={() => {
                      setSelectedCaseId(item.id);
                      navigate(item.target);
                    }}
                  >
                    <td><span className="case-key">{item.id}</span></td>
                    <td><strong>{item.patient}</strong></td>
                    <td><span className="procedure-cell">{item.procedure}</span></td>
                    <td><StageBadge label={item.stage} tone={item.tone} /></td>
                    <td><span className="updated-cell">{item.updated}</span></td>
                    <td>
                      <button
                        className="icon-button small"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCaseId(item.id);
                          navigate(item.target);
                        }}
                        title="Open Case"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile compact representation */}
          <div className="dashboard-mobile-list">
            {recentCases.map((item) => (
              <button
                key={item.id}
                className="dashboard-mobile-card"
                onClick={() => navigate(item.target)}
              >
                <div className="dashboard-mobile-card-head">
                  <span className="case-key">{item.id}</span>
                  <StageBadge label={item.stage} tone={item.tone} />
                </div>
                <strong>{item.patient}</strong>
                <span className="procedure-text">{item.procedure}</span>
                <div className="dashboard-mobile-card-foot">
                  <span>{item.updated}</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel wire-panel pending-panel">
          <PanelHeading
            title="Pending Surgeon Reviews"
            meta="Cases flagged for review"
            action={<button className="text-button" onClick={() => navigate("/cases")}>View all <ChevronRight size={14} /></button>}
          />
          <div className="pending-review-list">
            {pendingReviews.map((item) => (
              <button
                className="pending-review-row"
                key={item.id}
                onClick={() => navigate(item.target)}
              >
                <ImagingMini label="" accent={item.accent} />
                <span className="pending-review-copy">
                  <strong>{item.id}</strong>
                  <span>{item.patient}</span>
                  <small>{item.procedure}</small>
                </span>
                <span className="button button-quiet button-small pending-review-badge">Review</span>
                <MoreHorizontal size={15} className="pending-more" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-wire-bottom">
        <section className="panel wire-panel">
          <PanelHeading
            title="Recent Evaluations"
            meta="Completed evaluations with score and key findings"
            action={<button className="text-button" onClick={() => navigate("/reports")}>View all <ChevronRight size={14} /></button>}
          />
          <div className="table-wrap dashboard-desktop-table">
            <table className="clinical-table wire-table evaluation-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Patient Name</th>
                  <th>Procedure</th>
                  <th>Score</th>
                  <th>Key Findings</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEvaluations.map(([id, patient, procedure, score, finding, date, tone, target]) => (
                  <tr key={id} onClick={() => navigate(target)} style={{ cursor: "pointer" }}>
                    <td><span className="case-key">{id}</span></td>
                    <td><strong>{patient}</strong></td>
                    <td><span className="procedure-cell">{procedure}</span></td>
                    <td><ScoreBadge score={score} tone={tone} /></td>
                    <td><span className="finding-text">{finding}</span></td>
                    <td><span className="updated-cell">{date}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Evaluations List */}
          <div className="dashboard-mobile-list">
            {recentEvaluations.map(([id, patient, procedure, score, finding, date, tone, target]) => (
              <button
                key={id}
                className="dashboard-mobile-card"
                onClick={() => navigate(target)}
              >
                <div className="dashboard-mobile-card-head">
                  <span className="case-key">{id}</span>
                  <ScoreBadge score={score} tone={tone} />
                </div>
                <strong>{patient}</strong>
                <span className="procedure-text">{procedure}</span>
                <p className="finding-mobile-text">{finding}</p>
                <div className="dashboard-mobile-card-foot">
                  <span>{date}</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel wire-panel imaging-panel">
          <PanelHeading
            title="Recent Imaging"
            meta="Quick preview of recent scans"
            action={<button className="text-button" onClick={() => navigate("/cases/MX-2407/viewer")}>View all <ChevronRight size={14} /></button>}
          />
          <div className="recent-imaging-grid">
            {recentImaging.map((item, idx) => (
              <button
                className={`imaging-tile ${carouselIndex === idx ? "imaging-tile-active" : ""}`}
                key={item.id}
                onClick={() => {
                  setCarouselIndex(idx);
                  navigate(item.target);
                }}
              >
                <ImagingMini label={item.label} accent={item.accent} large />
                <span className="imaging-tile-id">{item.id}</span>
                <small>{item.label}</small>
              </button>
            ))}
          </div>
          <div className="carousel-dots">
            {recentImaging.map((_, idx) => (
              <span
                key={idx}
                className={carouselIndex === idx ? "active" : ""}
                onClick={() => setCarouselIndex(idx)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-quick-actions">
        <div className="quick-actions-heading">
          <strong>Quick Actions</strong>
          <span>Primary actions for common tasks</span>
        </div>
        <QuickAction
          icon={UserRound}
          label="New Patient"
          detail="Create a new patient record"
          onClick={() => navigate("/patients")}
        />
        <QuickAction
          icon={ClipboardList}
          label="New Case"
          detail="Start a new case"
          onClick={() => navigate("/cases")}
        />
        <QuickAction
          icon={ImageIcon}
          label="Upload Imaging"
          detail="Upload DICOM or images"
          onClick={() => toast("Upload Imaging", { description: "DICOM upload modal is staged for the full application." })}
        />
        <QuickAction
          icon={FileBarChart2}
          label="Generate Report"
          detail="Create evaluation report"
          onClick={() => navigate("/reports/new")}
        />
      </section>
    </div>
  );
}

function StageBadge({ label, tone }: { label: string; tone: string }) {
  return <span className={`stage-badge stage-${tone}`}>{label}</span>;
}

function ScoreBadge({ score, tone }: { score: string; tone: string }) {
  const numeric = Number.parseFloat(score);
  const interpretation = numeric >= 80 ? "Excellent" : numeric >= 60 ? "Good" : numeric >= 40 ? "Fair" : "Poor";
  return (
    <span className={`score-badge score-${tone}`} title={`${score} — ${interpretation}`}>
      {score}
    </span>
  );
}

function PanelHeading({ title, meta, action }: { title: string; meta?: string; action?: React.ReactNode }) {
  return <div className="panel-heading"><div><h2>{title}</h2>{meta && <span>{meta}</span>}</div>{action}</div>;
}

function ActivityRow({ initials, color, name, detail, time, score, icon }: { initials: string; color: string; name: string; detail: string; time: string; score: string; icon: React.ReactNode }) {
  return <div className="activity-row"><div className="avatar" style={{ background: color }}>{initials}</div><div className="activity-copy"><strong>{name}</strong><span>{detail}</span><small>{time}</small></div><div className="activity-score"><span>{icon}</span><strong>{score}</strong></div></div>;
}

function QuickAction({ icon: IconComponent, label, detail, onClick }: { icon: Icon; label: string; detail: string; onClick: () => void }) {
  return <button className="quick-action" onClick={onClick}><span className="quick-icon"><IconComponent size={17} /></span><span><strong>{label}</strong><small>{detail}</small></span><ChevronRight size={14} /></button>;
}

function PatientsPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [procedureFilter, setProcedureFilter] = useState("Procedure");
  const [dateFilter, setDateFilter] = useState("Date Range");
  const [selectedId, setSelectedId] = useState("PT-2024-001");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [mobileStatusTab, setMobileStatusTab] = useState<"All" | "Active" | "Inactive">("All");

  const registryRows = patients.map((p) => ({
    id: p.id,
    initials: p.initials,
    name: p.name,
    ageSex: `${p.age} / ${p.sex}`,
    phone: p.phone,
    email: p.email,
    address: p.address,
    bloodGroup: p.bloodGroup,
    allergies: p.allergies,
    cases: p.activeCaseCount,
    lastVisit: p.lastVisit,
    status: p.status,
    procedure: p.procedure,
    caseId: p.caseId,
    accent: p.accent,
  }));

  const filtered = registryRows.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.id} ${patient.phone} ${patient.procedure} ${patient.email}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || patient.status === statusFilter;
    const matchesMobileStatus = mobileStatusTab === "All" || patient.status === mobileStatusTab;
    const matchesProcedure = procedureFilter === "Procedure" || patient.procedure.toLowerCase().includes(procedureFilter.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter === "Last 7 days") {
      matchesDate = !patient.lastVisit.includes("week") || patient.lastVisit.includes("1 week");
    } else if (dateFilter === "Last 30 days") {
      matchesDate = !patient.lastVisit.includes("month");
    }

    return matchesQuery && matchesStatus && matchesMobileStatus && matchesProcedure && matchesDate;
  });

  const selected = registryRows.find((patient) => patient.id === selectedId) ?? registryRows[0];
  const selectPatient = (id: string) => setSelectedId(id);

  const toggleSelectRow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map((p) => p.id));
    }
  };

  const handleClear = () => {
    setQuery("");
    setStatusFilter("All");
    setProcedureFilter("Procedure");
    setDateFilter("Date Range");
    setMobileStatusTab("All");
  };

  return (
    <div className="patients-wireframe">
      <PageHeader
        eyebrow="Patient management"
        title="Patients"
        description="Manage patient records, view history and associated cases"
        actions={
          <button
            className="button button-primary"
            onClick={() => toast("New Patient", { description: "Patient intake flow initiated. Enter clinical demographics to begin." })}
          >
            <Plus size={15} /> New Patient
          </button>
        }
      />

      <div className="patient-summary-grid">
        <PatientSummaryCard icon={UsersRound} label="Total Patients" value="86" detail="10%" />
        <PatientSummaryCard icon={UserRound} label="New Patients" value="12" detail="20%" />
        <PatientSummaryCard icon={HeartPulse} label="With Active Cases" value="34" detail="6%" />
        <PatientSummaryCard icon={CheckCircle2} label="Completed Cases" value="52" detail="18%" />
      </div>

      <div className="patients-main-grid">
        <section className="panel patient-registry-panel">
          <div className="patient-filter-row">
            <div className="inline-search patient-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search patients by name, ID, phone or email..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="New">New</option>
              <option value="Follow-up">Follow-up</option>
            </select>
            <select
              value={procedureFilter}
              onChange={(event) => setProcedureFilter(event.target.value)}
              aria-label="Filter by procedure"
            >
              <option value="Procedure">Procedure</option>
              <option value="Orbital">Orbital fracture</option>
              <option value="Mandibular">Mandibular fracture</option>
              <option value="Zygomatic">Zygomatic fracture</option>
              <option value="LeFort">LeFort I</option>
            </select>
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter by date range"
            >
              <option value="Date Range">Date Range</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
            </select>
            <button className="button button-quiet patient-clear" onClick={handleClear}>
              Clear
            </button>
          </div>

          {/* Mobile status tabs */}
          <div className="patient-mobile-tabs" role="tablist" aria-label="Filter by status mobile">
            <button
              className={`patient-mobile-tab ${mobileStatusTab === "All" ? "patient-mobile-tab-active" : ""}`}
              onClick={() => setMobileStatusTab("All")}
            >
              All 86
            </button>
            <button
              className={`patient-mobile-tab ${mobileStatusTab === "Active" ? "patient-mobile-tab-active" : ""}`}
              onClick={() => setMobileStatusTab("Active")}
            >
              Active 34
            </button>
            <button
              className={`patient-mobile-tab ${mobileStatusTab === "Inactive" ? "patient-mobile-tab-active" : ""}`}
              onClick={() => setMobileStatusTab("Inactive")}
            >
              Inactive 52
            </button>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px" }}>
              <EmptyState
                icon={UsersRound}
                title="No patients found"
                description="No patient records match the currently applied search and filters."
              />
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <button className="button button-quiet" onClick={handleClear}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="patient-table-scroll">
                <table className="clinical-table patient-wire-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedRows.length === filtered.length && filtered.length > 0}
                          onChange={toggleSelectAll}
                          aria-label="Select all patients"
                        />
                      </th>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Age / Sex</th>
                      <th>Contact</th>
                      <th>Active Cases</th>
                      <th>Last Visit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((patient) => (
                      <tr
                        key={patient.id}
                        className={selectedId === patient.id ? "patient-row-selected" : ""}
                        onClick={() => selectPatient(patient.id)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(patient.id)}
                            onChange={() => toggleSelectRow(patient.id)}
                            onClick={(event) => event.stopPropagation()}
                            aria-label={`Select ${patient.name}`}
                          />
                        </td>
                        <td>
                          <button
                            className="case-key text-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/patients/${patient.id}`);
                            }}
                          >
                            {patient.id}
                          </button>
                        </td>
                        <td>
                          <button
                            className="text-button"
                            style={{ fontWeight: 600, color: "var(--navy-dark)" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/patients/${patient.id}`);
                            }}
                          >
                            {patient.name}
                          </button>
                        </td>
                        <td>{patient.ageSex}</td>
                        <td>
                          <span className="patient-contact">{patient.phone}</span>
                        </td>
                        <td>{patient.cases}</td>
                        <td>
                          <span className="updated-cell">{patient.lastVisit}</span>
                        </td>
                        <td>
                          <span className={`patient-status patient-status-${patient.status.toLowerCase().replace(" ", "-")}`}>
                            <span />
                            {patient.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="icon-button small"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/patients/${patient.id}`);
                            }}
                            title="Open Patient Profile"
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile patient list representation */}
              <div className="patient-mobile-list">
                {filtered.map((patient) => (
                  <button
                    className={`patient-mobile-row ${selectedId === patient.id ? "patient-mobile-row-selected" : ""}`}
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <span className="avatar patient-mobile-avatar" style={{ background: patient.accent }}>
                      {patient.initials}
                    </span>
                    <span className="patient-mobile-copy">
                      <strong>{patient.name}</strong>
                      <small>
                        {patient.id} · {patient.ageSex}
                      </small>
                      <em>{patient.cases ? `${patient.cases} active case${patient.cases > 1 ? "s" : ""}` : "No active cases"}</em>
                    </span>
                    <span className={`patient-status patient-status-${patient.status.toLowerCase().replace(" ", "-")}`}>
                      {patient.status}
                    </span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>

              <div className="table-footer patient-table-footer">
                <span>Showing 1–{filtered.length} of 86 patients</span>
                <span className="pagination">
                  <button className="icon-button small">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="pagination-current">1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>…</span>
                  <span>9</span>
                  <button className="icon-button small">
                    <ChevronRight size={14} />
                  </button>
                  <span>
                    10 / page <ChevronDown size={12} />
                  </span>
                </span>
              </div>
            </>
          )}
        </section>

        {selected && (
          <PatientDetailPanel
            patient={selected}
            onOpen={() => navigate(`/patients/${selected.id}`)}
            onOpenCase={(caseId) => navigate(`/cases/${caseId}`)}
          />
        )}
      </div>

      <section className="patient-quick-actions">
        <div>
          <strong>Quick Actions</strong>
          <span>Common tasks for this section</span>
        </div>
        <QuickAction
          icon={Plus}
          label="New Patient"
          detail="Create a new patient record"
          onClick={() => toast("New Patient", { description: "Patient intake flow initialized." })}
        />
        <QuickAction
          icon={Download}
          label="Import Patients"
          detail="Upload from CSV"
          onClick={() => toast("Import Patients", { description: "CSV upload modal ready for patient batch import." })}
        />
        <QuickAction
          icon={UsersRound}
          label="Merge Records"
          detail="Merge duplicate patients"
          onClick={() => toast("Merge Records", { description: "Select duplicate records to reconcile patient files." })}
        />
        <QuickAction
          icon={Target}
          label="Manage Tags"
          detail="Organize patient groups"
          onClick={() => toast("Manage Tags", { description: "Cohort tag management opened." })}
        />
      </section>
    </div>
  );
}

function PatientSummaryCard({
  icon: IconComponent,
  label,
  value,
  detail,
}: {
  icon: Icon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="patient-summary-card">
      <span className="patient-summary-icon">
        <IconComponent size={18} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>
          <ArrowUpRight size={11} /> {detail}
        </small>
        <em>vs last month</em>
      </div>
    </div>
  );
}

function PatientDetailPanel({
  patient,
  onOpen,
  onOpenCase,
}: {
  patient: {
    id: string;
    initials: string;
    name: string;
    ageSex: string;
    phone: string;
    email: string;
    address: string;
    bloodGroup: string;
    allergies: string;
    cases: number;
    status: string;
    procedure: string;
    caseId: string;
    accent: string;
  };
  onOpen: () => void;
  onOpenCase: (caseId: string) => void;
}) {
  const [subtab, setSubtab] = useState<"Overview" | "Cases" | "Scans" | "Evaluations" | "Reports">("Overview");

  return (
    <aside className="panel patient-detail-panel">
      <div className="patient-detail-head">
        <div className="patient-detail-identity">
          <div className="avatar patient-detail-avatar" style={{ background: patient.accent }}>
            {patient.initials}
          </div>
          <div>
            <strong>{patient.name}</strong>
            <small>
              {patient.id} · {patient.ageSex}
            </small>
          </div>
        </div>
        <span className={`patient-status patient-status-${patient.status.toLowerCase().replace(" ", "-")}`}>
          <span />
          {patient.status}
        </span>
        <button className="icon-button small" onClick={onOpen} title="More actions">
          <MoreHorizontal size={15} />
        </button>
      </div>

      <div className="patient-detail-tabs">
        {(["Overview", "Cases", "Scans", "Evaluations", "Reports"] as const).map((t) => (
          <button
            key={t}
            className={`patient-detail-tab ${subtab === t ? "patient-detail-tab-active" : ""}`}
            onClick={() => setSubtab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {subtab === "Overview" && (
        <>
          <div className="patient-info-block">
            <div className="patient-info-heading">
              <strong>Patient Information</strong>
              <button
                className="text-button"
                onClick={() => toast("Edit Patient", { description: `Editing details for ${patient.name}` })}
              >
                Edit
              </button>
            </div>
            <div className="patient-info-list">
              <InfoPair label="Full Name" value={patient.name} />
              <InfoPair label="Patient ID" value={patient.id} mono />
              <InfoPair label="Age / Sex" value={patient.ageSex} />
              <InfoPair label="Phone" value={patient.phone} />
              <InfoPair label="Email" value={patient.email} />
              <InfoPair label="Address" value={patient.address} />
              <InfoPair label="Blood Group" value={patient.bloodGroup} />
              <InfoPair label="Allergies" value={patient.allergies} />
            </div>
          </div>

          <div className="patient-scans-block">
            <div className="patient-info-heading">
              <strong>Recent Scans</strong>
              <button className="text-button" onClick={() => setSubtab("Scans")}>
                View all →
              </button>
            </div>
            <div className="patient-scan-grid">
              <div onClick={() => toast("DICOM Viewer", { description: "Opening Pre-op CT in 3D volume viewer" })} style={{ cursor: "pointer" }}>
                <ImagingMini label="Pre-op CT" accent="slate" />
              </div>
              <div onClick={() => toast("DICOM Viewer", { description: "Opening Post-op CT in 3D volume viewer" })} style={{ cursor: "pointer" }}>
                <ImagingMini label="Post-op CT" accent="teal" after />
              </div>
              <div onClick={() => toast("DICOM Viewer", { description: "Opening 3D Reconstruction mesh" })} style={{ cursor: "pointer" }}>
                <ImagingMini label="3D Recon." accent="slate" after />
              </div>
            </div>
          </div>

          <div className="patient-active-case">
            <div className="patient-info-heading">
              <strong>Active Cases ({patient.cases})</strong>
              <button className="text-button" onClick={() => setSubtab("Cases")}>
                View all →
              </button>
            </div>
            {patient.cases > 0 ? (
              <button className="patient-case-card" onClick={() => onOpenCase(patient.caseId)}>
                <span className="patient-case-thumb">
                  <ImagingMini label="" accent="teal" />
                </span>
                <span>
                  <strong>{patient.caseId}</strong>
                  <small>{patient.procedure}</small>
                  <em>Created 10 Jul 2024 · Last updated 2 hours ago</em>
                </span>
                <StageBadge label="Evaluation" tone="evaluation" />
              </button>
            ) : (
              <div style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: "11px" }}>
                No active trauma cases currently staged.
              </div>
            )}
          </div>
        </>
      )}

      {subtab === "Cases" && (
        <div className="patient-info-block">
          <div className="patient-info-heading">
            <strong>Case History ({cases.filter((c) => c.patientId === patient.id).length})</strong>
            <button
              className="text-button"
              onClick={() => toast("New Case", { description: `Linking new case to ${patient.name}` })}
            >
              + Add Case
            </button>
          </div>
          {cases.filter((c) => c.patientId === patient.id).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cases.filter((c) => c.patientId === patient.id).map((item) => (
                <button key={item.id} className="patient-case-card" onClick={() => onOpenCase(item.id)}>
                  <span className="patient-case-thumb">
                    <ImagingMini label="" accent="teal" />
                  </span>
                  <span>
                    <strong>{item.id}</strong>
                    <small>{item.procedure}</small>
                    <em>Last updated {item.updated}</em>
                  </span>
                  <StageBadge label={item.phase.split("·")[0].trim()} tone={item.status === "attention" ? "review" : item.status === "draft" ? "preop" : "evaluation"} />
                </button>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>No previous surgical cases recorded.</p>
          )}
        </div>
      )}

      {subtab === "Scans" && (
        <div className="patient-info-block">
          <div className="patient-info-heading">
            <strong>Diagnostic Series</strong>
            <button className="text-button" onClick={() => toast("Upload DICOM", { description: "Select scan directory" })}>
              + Upload
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div onClick={() => toast("DICOM Viewer", { description: "Pre-op Axial scan (0.625mm)" })} style={{ cursor: "pointer" }}>
              <ImagingMini label="Pre-op Axial" accent="slate" />
            </div>
            <div onClick={() => toast("DICOM Viewer", { description: "Pre-op Coronal slice" })} style={{ cursor: "pointer" }}>
              <ImagingMini label="Pre-op Coronal" accent="teal" />
            </div>
            <div onClick={() => toast("DICOM Viewer", { description: "Post-op Helical CT" })} style={{ cursor: "pointer" }}>
              <ImagingMini label="Post-op CT" accent="teal" after />
            </div>
            <div onClick={() => toast("DICOM Viewer", { description: "3D Surface Model STL" })} style={{ cursor: "pointer" }}>
              <ImagingMini label="3D Volume" accent="slate" after />
            </div>
          </div>
        </div>
      )}

      {subtab === "Evaluations" && (
        <div className="patient-info-block">
          <div className="patient-info-heading">
            <strong>Outcome Evaluations</strong>
          </div>
          <div style={{ background: "#f8fbfa", border: "1px solid #dcefe9", borderRadius: "6px", padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "11px", color: "#16594d" }}>AI Surgical Evaluation</strong>
              <span className="patient-status patient-status-active">82/100</span>
            </div>
            <p style={{ fontSize: "9px", color: "#5d736f", margin: "4px 0 8px" }}>Case {patient.caseId} · Automated assessment</p>
            <button className="button button-quiet button-small" style={{ width: "100%", justifyContent: "center" }} onClick={() => onOpenCase(patient.caseId)}>
              View Clinical Breakdown
            </button>
          </div>
        </div>
      )}

      {subtab === "Reports" && (
        <div className="patient-info-block">
          <div className="patient-info-heading">
            <strong>Clinical Reports</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", border: "1px solid #e2e8eb", borderRadius: "5px" }}>
              <div>
                <strong style={{ fontSize: "10px", display: "block" }}>Operative Evaluation Report</strong>
                <span style={{ fontSize: "8px", color: "var(--text-muted)" }}>PDF · Generated 12 Jul 2024</span>
              </div>
              <button className="icon-button small" onClick={() => toast("Report download", { description: "Downloading operative report PDF" })}>
                <Download size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "12px", borderTop: "1px solid #e9edef" }}>
        <button className="button button-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onOpen}>
          Open Patient Profile <ChevronRight size={15} />
        </button>
      </div>
    </aside>
  );
}

function PatientProfilePage({ patientId }: { patientId: string }) {
  const [, navigate] = useLocation();
  const [profileTab, setProfileTab] = useState<"Overview" | "Cases" | "Scans" | "Evaluations" | "Reports">("Overview");

  const patient = patients.find((item) => item.id.toLowerCase() === patientId.toLowerCase());
  if (!patient) {
    return (
      <div style={{ padding: "40px 20px" }}>
        <EmptyState
          icon={UserRound}
          title="Patient not found"
          description={`No patient record matches ${patientId}. Return to the patient registry to choose a valid record.`}
        />
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button className="button button-primary" onClick={() => navigate("/patients")}>
            <ChevronLeft size={15} /> Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const patientCases = cases.filter((item) => item.patientId === patient.id);

  return (
    <div className="patient-profile-page">
      <div className="back-link" onClick={() => navigate("/patients")}>
        <ChevronLeft size={15} /> Back to patients
      </div>

      <div className="profile-header">
        <div className="profile-identity">
          <div className="avatar avatar-xl" style={{ background: patient.accent }}>
            {patient.initials}
          </div>
          <div>
            <div className="eyebrow">Patient profile · {patient.id}</div>
            <h1>{patient.name}</h1>
            <p>
              {patient.age} years · {patient.sex === "F" ? "Female" : "Male"} · {patient.procedure}
            </p>
          </div>
        </div>
        <div className="profile-actions">
          <button
            className="button button-quiet"
            onClick={() => toast("Profile export", { description: `PDF profile export generated for ${patient.name} (${patient.id}).` })}
          >
            <Download size={15} /> Export profile
          </button>
          <button
            className="button button-primary"
            onClick={() => navigate(`/cases/${patient.caseId}`)}
          >
            <ClipboardList size={15} /> Open latest case
          </button>
        </div>
      </div>

      {/* Wireframe Section 12 & 23 Subtabs */}
      <div className="patient-profile-tabs" role="tablist" aria-label="Patient profile sections">
        {(["Overview", "Cases", "Scans", "Evaluations", "Reports"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={profileTab === tab}
            className={`patient-profile-tab ${profileTab === tab ? "patient-profile-tab-active" : ""}`}
            onClick={() => setProfileTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {profileTab === "Overview" && (
        <>
          <div className="profile-grid">
            <section className="panel profile-summary">
              <PanelHeading
                title="Patient information"
                meta="Primary demographics"
                action={
                  <button
                    className="text-button"
                    onClick={() => toast("Edit demographics", { description: "Demographics editor opened." })}
                  >
                    Edit
                  </button>
                }
              />
              <div className="info-grid">
                <InfoPair label="Full Name" value={patient.name} />
                <InfoPair label="Patient ID" value={patient.id} mono />
                <InfoPair label="Age / Sex" value={`${patient.age} / ${patient.sex === "M" ? "Male" : "Female"}`} />
                <InfoPair label="Phone" value={patient.phone} />
                <InfoPair label="Email" value={patient.email} />
                <InfoPair label="Address" value={patient.address} />
                <InfoPair label="Blood Group" value={patient.bloodGroup} />
                <InfoPair label="Allergies" value={patient.allergies} />
              </div>
            </section>

            <section className="panel profile-score">
              <div className="profile-score-top">
                <div>
                  <div className="eyebrow">Active Case Summary</div>
                  <h2>{patient.caseId}</h2>
                  <span>{patient.procedure}</span>
                </div>
                <span className={`patient-status patient-status-${patient.status.toLowerCase().replace(" ", "-")}`}>
                  <span />
                  {patient.status}
                </span>
              </div>
              <div className="score-row">
                <ScoreRing score={8.2} label="alignment" size="small" />
                <div className="score-notes">
                  <div>
                    <span>Confidence</span>
                    <strong>91%</strong>
                  </div>
                  <div>
                    <span>Review status</span>
                    <strong>Ready for review</strong>
                  </div>
                  <div>
                    <span>Next action</span>
                    <strong>Confirm reduction</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="profile-grid profile-grid-lower">
            <section className="panel">
              <PanelHeading
                title="Recent Scans"
                meta="Diagnostic imaging"
                action={
                  <button className="text-button" onClick={() => setProfileTab("Scans")}>
                    View all scans <ChevronRight size={14} />
                  </button>
                }
              />
              <div className="patient-scan-grid" style={{ padding: "16px", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <div onClick={() => toast("DICOM Viewer", { description: "Opening Pre-op CT in 3D viewer" })} style={{ cursor: "pointer" }}>
                  <ImagingMini label="Pre-op CT" accent="slate" />
                  <span style={{ fontSize: "8px", color: "var(--text-muted)", display: "block", marginTop: "4px", textAlign: "center" }}>10 Jul 2024</span>
                </div>
                <div onClick={() => toast("DICOM Viewer", { description: "Opening Post-op CT in 3D viewer" })} style={{ cursor: "pointer" }}>
                  <ImagingMini label="Post-op CT" accent="teal" after />
                  <span style={{ fontSize: "8px", color: "var(--text-muted)", display: "block", marginTop: "4px", textAlign: "center" }}>12 Jul 2024</span>
                </div>
                <div onClick={() => toast("DICOM Viewer", { description: "Opening 3D Reconstruction in 3D viewer" })} style={{ cursor: "pointer" }}>
                  <ImagingMini label="3D Recon." accent="slate" after />
                  <span style={{ fontSize: "8px", color: "var(--text-muted)", display: "block", marginTop: "4px", textAlign: "center" }}>12 Jul 2024</span>
                </div>
              </div>
            </section>

            <section className="panel">
              <PanelHeading
                title="Active Cases"
                meta={`${patientCases.length} linked case${patientCases.length === 1 ? "" : "s"}`}
                action={
                  <button className="text-button" onClick={() => setProfileTab("Cases")}>
                    View all <ChevronRight size={14} />
                  </button>
                }
              />
              <div style={{ padding: "12px" }}>
                {patientCases.length ? (
                  patientCases.map((item) => (
                    <button
                      className="linked-case"
                      key={item.id}
                      onClick={() => navigate(`/cases/${item.id}`)}
                    >
                      <div>
                        <span className="case-key">{item.id}</span>
                        <strong>{item.procedure}</strong>
                        <small>Updated {item.updated}</small>
                      </div>
                      <div className="linked-case-score">
                        <strong>{item.score.toFixed(1)}</strong>
                        <StatusPill status={item.status} compact />
                      </div>
                      <ChevronRight size={15} />
                    </button>
                  ))
                ) : (
                  <EmptyState
                    icon={ClipboardList}
                    title="No linked cases"
                    description="Cases will appear here once the patient is admitted."
                  />
                )}
              </div>
            </section>
          </div>
        </>
      )}

      {profileTab === "Cases" && (
        <section className="panel" style={{ padding: "20px" }}>
          <PanelHeading
            title="Complete Case History"
            meta={`${patientCases.length} recorded surgical episode${patientCases.length === 1 ? "" : "s"}`}
            action={
              <button
                className="button button-primary button-small"
                onClick={() => toast("New Case", { description: `Linking new case record to ${patient.name}` })}
              >
                <Plus size={14} /> New Case
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
            {patientCases.map((item) => (
              <button
                className="linked-case"
                key={item.id}
                onClick={() => navigate(`/cases/${item.id}`)}
                style={{ padding: "14px", border: "1px solid #dce5ea" }}
              >
                <div>
                  <span className="case-key">{item.id}</span>
                  <strong>{item.procedure}</strong>
                  <small>Evaluator: {item.evaluator} · Updated {item.updated}</small>
                </div>
                <div className="linked-case-score">
                  <span className="eyebrow" style={{ marginRight: "8px" }}>Score</span>
                  <strong>{item.score.toFixed(1)}/10</strong>
                  <StatusPill status={item.status} compact />
                </div>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </section>
      )}

      {profileTab === "Scans" && (
        <section className="panel" style={{ padding: "20px" }}>
          <PanelHeading
            title="DICOM Imaging & Scans"
            meta="Multislice CT series and 3D surface files"
            action={
              <button
                className="button button-primary button-small"
                onClick={() => toast("Upload DICOM", { description: "Select local DICOM folder" })}
              >
                <Plus size={14} /> Upload Scan
              </button>
            }
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginTop: "16px" }}>
            {[
              { label: "Pre-op Axial Slice", date: "10 Jul 2024", accent: "slate" },
              { label: "Pre-op Coronal View", date: "10 Jul 2024", accent: "teal" },
              { label: "Post-op Helical CT", date: "12 Jul 2024", accent: "teal", after: true },
              { label: "3D Bone Reconstruction", date: "12 Jul 2024", accent: "slate", after: true },
              { label: "Automated Segmentation", date: "12 Jul 2024", accent: "teal", after: true },
            ].map((scan) => (
              <div
                key={scan.label}
                className="panel"
                style={{ padding: "10px", cursor: "pointer", border: "1px solid #e1e7ea" }}
                onClick={() => toast("DICOM Viewer", { description: `Loading ${scan.label} into interactive viewer.` })}
              >
                <ImagingMini label={scan.label} accent={scan.accent} after={scan.after} />
                <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                  <strong>{scan.label}</strong>
                  <span style={{ color: "var(--text-muted)" }}>{scan.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {profileTab === "Evaluations" && (
        <section className="panel" style={{ padding: "20px" }}>
          <PanelHeading
            title="AI Evaluations & Clinical Scores"
            meta="Surgical plan comparison"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            <div style={{ padding: "16px", border: "1px solid #dcebe6", borderRadius: "8px", background: "#fbfdfc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span className="eyebrow">Case {patient.caseId}</span>
                  <h3 style={{ margin: "4px 0", fontSize: "16px", color: "var(--navy-dark)" }}>Post-Operative Reduction Evaluation</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>Evaluated on 12 Jul 2024 by AI Module · Confirmed by Dr. Rahul Mehta</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--teal)", fontFamily: "JetBrains Mono, monospace" }}>8.2 / 10</div>
                  <span className="patient-status patient-status-active">High Confidence (91%)</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #edf2f0" }}>
                <div><span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Orbital Floor Alignment</span><strong style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>8.5 / 10 (Good)</strong></div>
                <div><span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Facial Symmetry Index</span><strong style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>7.8 / 10 (Within 2mm)</strong></div>
                <div><span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Hardware Stability</span><strong style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>8.0 / 10 (Optimal)</strong></div>
                <div><span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Occlusion Preservation</span><strong style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>7.5 / 10 (Satisfactory)</strong></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {profileTab === "Reports" && (
        <section className="panel" style={{ padding: "20px" }}>
          <PanelHeading
            title="Generated Clinical Reports"
            meta="Formal documentation"
            action={
              <button
                className="button button-primary button-small"
                onClick={() => navigate("/reports/new")}
              >
                <Plus size={14} /> New Report
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", border: "1px solid #dce3e8", borderRadius: "6px" }}>
              <div>
                <strong style={{ fontSize: "12px", color: "var(--navy-dark)" }}>Post-Operative Trauma Evaluation Report — Case {patient.caseId}</strong>
                <p style={{ margin: "3px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>Author: Dr. Rahul Mehta · Generated 12 Jul 2024 · Format: PDF (Signed)</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="button button-quiet button-small"
                  onClick={() => navigate("/reports/MX-2407")}
                >
                  <FileText size={14} /> Preview
                </button>
                <button
                  className="button button-quiet button-small"
                  onClick={() => toast("Download PDF", { description: `Downloading formal report for ${patient.name}` })}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoPair({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="info-pair"><span>{label}</span><strong className={mono ? "mono" : ""}>{value}</strong></div>;
}

function CasesPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [procedureFilter, setProcedureFilter] = useState("Procedure");
  const [dateFilter, setDateFilter] = useState("Date Range");
  const [selectedId, setSelectedId] = useState("MF-2024-001");
  const caseRows = [
    { id: "MF-2024-001", patient: "Aman Verma", patientId: "PT-2024-001", ageSex: "28 / M", procedure: "Mandibular Fracture", stage: "Evaluation", surgeryDate: "10 Jul 2024", updated: "2 hours ago", accent: "slate", score: "82", tone: "teal" },
    { id: "MF-2024-002", patient: "Priya Sharma", patientId: "PT-2024-002", ageSex: "34 / F", procedure: "Zygomatic Fracture", stage: "Post-op", surgeryDate: "08 Jul 2024", updated: "5 hours ago", accent: "teal", score: "78", tone: "slate" },
    { id: "MF-2024-003", patient: "Rohit Kumar", patientId: "PT-2024-003", ageSex: "26 / M", procedure: "LeFort I", stage: "Pre-op", surgeryDate: "05 Jul 2024", updated: "1 day ago", accent: "slate", score: "—", tone: "slate" },
    { id: "MF-2024-004", patient: "Sneha Patel", patientId: "PT-2024-004", ageSex: "31 / F", procedure: "Orbital Fracture", stage: "Review", surgeryDate: "03 Jul 2024", updated: "1 day ago", accent: "teal", score: "68", tone: "slate" },
    { id: "MF-2024-005", patient: "Vikram Singh", patientId: "PT-2024-005", ageSex: "40 / M", procedure: "Mandibular Fracture", stage: "Completed", surgeryDate: "30 Jun 2024", updated: "2 days ago", accent: "slate", score: "91", tone: "teal" },
    { id: "MF-2024-006", patient: "Neha Reddy", patientId: "PT-2024-006", ageSex: "29 / F", procedure: "Zygomatic Fracture", stage: "Pre-op", surgeryDate: "28 Jun 2024", updated: "2 days ago", accent: "slate", score: "—", tone: "slate" },
    { id: "MF-2024-007", patient: "Arjun Das", patientId: "PT-2024-007", ageSex: "33 / M", procedure: "LeFort I", stage: "Post-op", surgeryDate: "25 Jun 2024", updated: "4 days ago", accent: "teal", score: "84", tone: "teal" },
    { id: "MF-2024-008", patient: "Karan Mehta", patientId: "PT-2024-008", ageSex: "27 / M", procedure: "Orbital Fracture", stage: "Review", surgeryDate: "22 Jun 2024", updated: "5 days ago", accent: "slate", score: "72", tone: "slate" },
    { id: "MF-2024-009", patient: "Sana Thomas", patientId: "PT-2024-009", ageSex: "32 / F", procedure: "Mandibular Fracture", stage: "Completed", surgeryDate: "20 Jun 2024", updated: "1 week ago", accent: "slate", score: "88", tone: "teal" },
    { id: "MF-2024-010", patient: "Mohammed Khan", patientId: "PT-2024-010", ageSex: "36 / M", procedure: "Zygomatic Fracture", stage: "Pre-op", surgeryDate: "18 Jun 2024", updated: "1 week ago", accent: "teal", score: "—", tone: "slate" },
  ];
  const filtered = caseRows.filter((item) => `${item.id} ${item.patient} ${item.procedure}`.toLowerCase().includes(query.toLowerCase()) && (stageFilter === "All" || item.stage === stageFilter) && (procedureFilter === "Procedure" || item.procedure === procedureFilter));
  const selected = caseRows.find((item) => item.id === selectedId) ?? caseRows[0];
  const openCase = (id: string) => navigate(id === "MF-2024-001" ? "/cases/MX-2407" : "/cases/MX-2407");
  return <div className="cases-wireframe"><PageHeader eyebrow="Case management" title="Cases" description="Manage surgical cases, track progress and view AI evaluations" actions={<button className="button button-primary" onClick={() => toast("New case", { description: "Case creation is staged for the full application." })}><Plus size={15} /> New Case</button>} /><div className="case-summary-grid"><CaseSummaryCard icon={FileText} label="Total Cases" value="124" detail="12%" /><CaseSummaryCard icon={Clock3} label="Pre-op Cases" value="28" detail="8%" /><CaseSummaryCard icon={ClipboardList} label="Post-op Cases" value="46" detail="14%" /><CaseSummaryCard icon={CheckCircle2} label="Completed Cases" value="52" detail="20%" /></div><div className="cases-main-grid"><section className="panel case-registry-panel"><div className="case-filter-row case-wire-filter-row"><div className="inline-search case-wire-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases..." /></div><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} aria-label="Filter by stage"><option>All</option><option>Pre-op</option><option>Post-op</option><option>Evaluation</option><option>Review</option><option>Completed</option></select><select value={procedureFilter} onChange={(event) => setProcedureFilter(event.target.value)} aria-label="Filter by procedure"><option>Procedure</option><option>Mandibular Fracture</option><option>Zygomatic Fracture</option><option>Orbital Fracture</option><option>LeFort I</option></select><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} aria-label="Filter by date range"><option>Date Range</option><option>Last 7 days</option><option>Last 30 days</option></select><button className="button button-quiet case-clear" onClick={() => { setQuery(""); setStageFilter("All"); setProcedureFilter("Procedure"); setDateFilter("Date Range"); }}>Clear</button></div><div className="case-table-scroll"><table className="clinical-table case-wire-table"><thead><tr><th><input type="checkbox" aria-label="Select all cases" /></th><th>Case ID</th><th>Patient Name</th><th>Procedure</th><th>Stage</th><th>Surgery Date</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className={selectedId === item.id ? "case-row-selected" : ""} onClick={() => setSelectedId(item.id)}><td><input type="checkbox" checked={selectedId === item.id} onChange={() => setSelectedId(item.id)} onClick={(event) => event.stopPropagation()} aria-label={`Select ${item.id}`} /></td><td><span className="case-key">{item.id}</span></td><td><strong>{item.patient}</strong></td><td><span className="procedure-cell">{item.procedure}</span></td><td><span className={`case-stage case-stage-${item.stage.toLowerCase().replaceAll("-", "")}`}>{item.stage}</span></td><td>{item.surgeryDate}</td><td><span className="updated-cell">{item.updated}</span></td><td><button className="icon-button small" onClick={(event) => { event.stopPropagation(); openCase(item.id); }}><MoreHorizontal size={15} /></button></td></tr>)}</tbody></table></div><div className="case-mobile-list">{filtered.map((item) => <button className={`case-mobile-row ${selectedId === item.id ? "case-mobile-row-selected" : ""}`} key={item.id} onClick={() => setSelectedId(item.id)}><ImagingMini label="" accent={item.accent} /><span className="case-mobile-copy"><strong>{item.id}</strong><span>{item.patient} · {item.ageSex}</span><small>{item.procedure}</small><em>{item.surgeryDate}</em></span><span className={`case-stage case-stage-${item.stage.toLowerCase().replaceAll("-", "")}`}>{item.stage}</span><MoreHorizontal size={15} /></button>)}</div><div className="table-footer case-table-footer"><span>Showing 1–{filtered.length} of 124 cases</span><span className="pagination"><button className="icon-button small"><ChevronLeft size={14} /></button><span className="pagination-current">1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>…</span><span>13</span><button className="icon-button small"><ChevronRight size={14} /></button><span>10 / page <ChevronDown size={12} /></span></span></div></section><CaseDetailPanel item={selected} onOpen={() => openCase(selected.id)} /></div><section className="case-quick-actions"><div><strong>Quick Actions</strong><span>Common tasks for this section</span></div><QuickAction icon={FileText} label="New Case" detail="Start a new case" onClick={() => toast("New case", { description: "Case creation is staged for the full application." })} /><QuickAction icon={Download} label="Import DICOM" detail="Upload imaging files" onClick={() => toast("Import DICOM", { description: "DICOM import is staged for the full application." })} /><QuickAction icon={UserRound} label="Link to Patient" detail="Attach to existing patient" onClick={() => toast("Link to patient", { description: "Patient linking is staged for the full application." })} /><QuickAction icon={FileBarChart2} label="Generate Evaluation" detail="Run AI evaluation" onClick={() => toast("Generate evaluation", { description: "Evaluation generation is staged for the full application." })} /><QuickAction icon={FileText} label="Create Report" detail="Generate case report" onClick={() => navigate("/reports/new")} /></section></div>;
}

function CaseSummaryCard({ icon: IconComponent, label, value, detail }: { icon: Icon; label: string; value: string; detail: string }) {
  return <div className="case-summary-card"><span className="case-summary-icon"><IconComponent size={18} /></span><div><span>{label}</span><strong>{value}</strong><small><ArrowUpRight size={11} /> {detail}%</small><em>vs last month</em></div></div>;
}

function CaseDetailPanel({ item, onOpen }: { item: { id: string; patient: string; patientId: string; ageSex: string; procedure: string; stage: string; surgeryDate: string; updated: string; accent: string; score: string; tone: string }; onOpen: () => void }) {
  const [tab, setTab] = useState<"Overview" | "Timeline" | "Evaluations" | "Scans" | "Reports">("Overview");
  return <aside className="panel case-detail-panel-wire"><div className="case-detail-wire-head"><div className="case-detail-wire-identity"><div className="avatar case-detail-avatar">AV</div><div><strong>{item.id}</strong><small>{item.patient} · {item.ageSex}</small></div></div><span className={`case-stage case-stage-${item.stage.toLowerCase().replaceAll("-", "")}`}>{item.stage}</span><button className="icon-button small" onClick={onOpen}><MoreHorizontal size={15} /></button></div><div className="case-detail-wire-tabs">{(["Overview", "Timeline", "Evaluations", "Scans", "Reports"] as const).map((t) => <button key={t} className={`case-detail-wire-tab ${tab === t ? "case-detail-wire-tab-active" : ""}`} onClick={() => setTab(t)}>{t}</button>)}</div>{tab === "Overview" && <><div className="case-info-block"><div className="case-info-heading"><strong>Case Information</strong><button className="text-button" onClick={onOpen}>Edit</button></div><div className="case-info-list"><InfoPair label="Case ID" value={item.id} mono /><InfoPair label="Patient" value={`${item.patient} (${item.patientId})`} /><InfoPair label="Age / Sex" value={item.ageSex} /><InfoPair label="Procedure" value={item.procedure} /><InfoPair label="Stage" value={item.stage} /><InfoPair label="Surgery Date" value={item.surgeryDate} /><InfoPair label="Surgeon" value="Dr. Rahul Mehta" /><InfoPair label="Last Updated" value={item.updated} /></div></div><div className="case-key-images"><div className="case-info-heading"><strong>Key Images</strong><button className="text-button" onClick={() => setTab("Scans")}>View all <ChevronRight size={12} /></button></div><div className="case-scan-grid"><ImagingMini label="Pre-op CT" accent="slate" /><ImagingMini label="Post-op CT" accent="teal" after /><ImagingMini label="3D Reconstruction" accent="slate" after /><ImagingMini label="Segmentation" accent="teal" /></div><div className="case-scan-meta"><span>10 Jul 2024</span><span>12 Jul 2024</span><span>12 Jul 2024</span><span>12 Jul 2024</span></div></div><div className="case-evaluation-summary"><div className="case-info-heading"><strong>Evaluation Summary</strong><button className="text-button" onClick={() => setTab("Evaluations")}>Details <ChevronRight size={12} /></button></div><div className="case-eval-content"><div><strong>{item.score}</strong><span>/ 100</span><small>Good alignment</small><em>Generated 12 Jul 2024</em></div><ul><li><span />Alignment <b>85</b></li><li><span />Symmetry <b>78</b></li><li><span />Hardware <b>80</b></li><li><span />Occlusion <b>75</b></li></ul></div></div></>}{tab === "Timeline" && <div className="case-info-block" style={{ padding: "16px" }}><div className="case-info-heading"><strong>Trauma Timeline</strong></div><div className="case-timeline-row" style={{ marginTop: "12px" }}>{[["10 Jul", "Intake"], ["10 Jul", "Pre-op CT"], ["11 Jul", "Surgery"], ["12 Jul", "Post-op CT"], ["Today", "Evaluation"]].map(([d, t]) => <div key={t} className="case-milestone milestone-current" style={{ minWidth: "55px" }}><div className="milestone-dot"><Check size={10} /></div><span>{d}</span><strong>{t}</strong></div>)}</div></div>}{tab === "Evaluations" && <div className="case-evaluation-summary" style={{ margin: "14px" }}><div className="case-info-heading"><strong>AI Evaluation Breakdown</strong></div><div className="case-eval-content"><div><strong>{item.score}</strong><span>/ 100</span><small>Optimal reduction</small><em>Automated score</em></div><ul><li><span />Alignment <b>85%</b></li><li><span />Symmetry <b>78%</b></li><li><span />Hardware <b>80%</b></li><li><span />Occlusion <b>75%</b></li></ul></div></div>}{tab === "Scans" && <div className="case-key-images" style={{ margin: "14px" }}><div className="case-info-heading"><strong>All Imaging Series</strong></div><div className="case-scan-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "8px" }}><ImagingMini label="Pre-op Axial" accent="slate" /><ImagingMini label="Pre-op Coronal" accent="teal" /><ImagingMini label="Post-op Axial" accent="teal" after /><ImagingMini label="3D Volume" accent="amber" after /></div></div>}{tab === "Reports" && <div className="case-info-block" style={{ padding: "16px" }}><div className="case-info-heading"><strong>Case Reports</strong></div><p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "8px 0 12px" }}>Evaluation summary ready for clinician sign-off.</p><button className="button button-quiet" style={{ width: "100%", justifyContent: "center" }} onClick={onOpen}><FileText size={14} /> Open Operative Report</button></div>}<div style={{ padding: "12px", borderTop: "1px solid #e9edef" }}><button className="button button-primary" style={{ width: "100%" }} onClick={onOpen}>Open Case Workspace <ChevronRight size={15} /></button></div></aside>;
}

function CaseWorkspacePage({ caseId, requestedPhase }: { caseId: string; requestedPhase?: string }) {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<CasePhase>((requestedPhase as CasePhase) || "overview");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [findingStatus, setFindingStatus] = useState("Needs review");
  const record = cases.find((item) => item.id.toLowerCase() === caseId.toLowerCase());
  if (!record) return <EmptyState icon={ClipboardList} title="Case not found" description={`No case record matches ${caseId}. Return to active cases to choose a valid workspace.`} />;
  const patient = patients.find((item) => item.id === record.patientId);
  if (!patient) return <EmptyState icon={UserRound} title="Patient record unavailable" description={`The patient linked to ${caseId} is not available in the local demo registry.`} />;
  useEffect(() => { if (requestedPhase && phaseItems.some((item) => item.key === requestedPhase)) setPhase(requestedPhase as CasePhase); }, [requestedPhase]);
  const choosePhase = (next: CasePhase) => { setPhase(next); navigate(`/cases/${record.id}/${next}`); };
  return <div className="case-workspace"><div className="back-link" onClick={() => navigate("/cases")}><ChevronLeft size={15} /> Back to active cases</div><div className="case-header"><div className="case-header-identity"><div className="case-header-mark"><Stethoscope size={21} /></div><div><div className="eyebrow">Case workspace · <span className="mono">{record.id}</span></div><h1>{record.patient}</h1><p>{record.procedure} <span className="dot-separator">·</span> {patient.id} <span className="dot-separator">·</span> Updated {record.updated}</p></div></div><div className="case-header-actions"><StatusPill status={record.status} /><button className="button button-quiet" onClick={() => toast("Case actions", { description: "Archive, duplicate, and assign actions are available in the full app." })}><MoreHorizontal size={15} /> Actions</button><button className="button button-primary" onClick={() => setReviewOpen(true)}><ClipboardCheck size={15} /> Review case</button></div></div><div className="workspace-tabs" role="tablist" aria-label="Case workspace phases">{phaseItems.map((item) => { const IconComponent = item.icon; return <button key={item.key} role="tab" aria-selected={phase === item.key} className={`workspace-tab ${phase === item.key ? "workspace-tab-active" : ""}`} onClick={() => choosePhase(item.key)}><IconComponent size={14} /><span><strong>{item.label}</strong><small>{item.kicker}</small></span></button>; })}</div><div className="case-layout"><aside className="phase-nav"><div className="phase-nav-head"><span>Evaluation pathway</span><span className="mono">01 / 07</span></div><div className="phase-list">{phaseItems.map((item, index) => { const IconComponent = item.icon; const active = phase === item.key; const complete = index < phaseItems.findIndex((candidate) => candidate.key === phase); return <button key={item.key} className={`phase-item ${active ? "phase-item-active" : ""} ${complete ? "phase-item-complete" : ""}`} onClick={() => choosePhase(item.key)}><span className="phase-index">{complete ? <Check size={12} /> : String(index + 1).padStart(2, "0")}</span><span className="phase-icon"><IconComponent size={15} /></span><span className="phase-copy"><strong>{item.label}</strong><small>{item.kicker}</small></span>{active && <span className="phase-current" />}</button>; })}</div><div className="phase-nav-note"><Sparkles size={15} /><div><strong>AI-assisted review</strong><span>Findings are ready for clinician confirmation.</span></div></div></aside><section className="case-detail"><div className="case-detail-top"><div><span className="eyebrow">{phaseItems.find((item) => item.key === phase)?.kicker}</span><h2>{phaseItems.find((item) => item.key === phase)?.label}</h2></div><div className="case-detail-tools"><button className="icon-button small" onClick={() => toast("Case notes", { description: "Notes panel is available from the review workflow." })}><MessageSquareText size={15} /></button><button className="icon-button small" onClick={() => toast("Case share", { description: "Secure sharing is disabled in this demo." })}><Download size={15} /></button></div></div>{phase === "overview" && <OverviewPhase record={record} patient={patient} onPhase={choosePhase} />}{phase === "before" && <BeforePhase onReview={() => setReviewOpen(true)} findingStatus={findingStatus} />}{phase === "surgery" && <SurgeryPhase />}{phase === "after" && <AfterPhase findingStatus={findingStatus} />}{phase === "evaluation" && <EvaluationPhase onReview={() => setReviewOpen(true)} />}{phase === "viewer" && <ViewerPhase />}{phase === "review" && <ReviewPhase onEdit={() => setReviewOpen(true)} findingStatus={findingStatus} />}</section></div>{reviewOpen && <ReviewDialog onClose={() => setReviewOpen(false)} onSave={(scoreOverride) => { setReviewOpen(false); setFindingStatus("Confirmed"); toast("Finding updated", { description: scoreOverride ? `The clinician review was saved with a ${scoreOverride}/10 score override.` : "The clinician review was saved to the case." }); }} />}</div>;
}

function OverviewPhase({ record, patient, onPhase }: { record: CaseRecord; patient: Patient; onPhase: (phase: CasePhase) => void }) {
  return <div className="phase-content"><div className="overview-stat-grid"><div className="overview-stat"><span>Case status</span><strong>Post-operative review</strong><StatusPill status={record.status} compact /></div><div className="overview-stat"><span>Procedure date</span><strong>30 Sep 2026</strong><small>Day 6 post-op</small></div><div className="overview-stat"><span>Evaluator</span><strong>{record.evaluator}</strong><small>Primary reviewer</small></div><div className="overview-stat"><span>Evaluation score</span><strong className="score-emphasis">{record.score.toFixed(1)}<small>/10</small></strong><small>{record.confidence}% confidence</small></div></div><div className="case-content-grid"><section className="panel"><PanelHeading title="Case Information" meta="Structured record" action={<button className="icon-button small"><Pencil size={14} /></button>} /><div className="info-grid info-grid-dense"><InfoPair label="Case ID" value={record.id} mono /><InfoPair label="MRN" value={patient.id} mono /><InfoPair label="Admitting Surgeon" value="Dr. Rahul Mehta" /><InfoPair label="Attending Rad." value="Dr. Sarah Lee" /><InfoPair label="Department" value="Maxillofacial" /><InfoPair label="Trauma Date" value="23 Sep 2026" /><InfoPair label="Admission Date" value="24 Sep 2026" /></div></section><section className="panel"><PanelHeading title="Clinical Encounter Details" meta="Intake assessment" /><div className="info-grid info-grid-dense"><InfoPair label="Mechanism" value="Road Traffic Accident" /><InfoPair label="Trauma Notes" value="Blunt force trauma to left midface" /><InfoPair label="Soft Tissue" value="Moderate periorbital edema, intact" /></div><div className="summary-tags" style={{ marginTop: "16px" }}><span className="evidence-tag tag-teal"><CheckCircle2 size={13} />Vitals stable</span><span className="evidence-tag tag-slate"><ShieldCheck size={13} />No C-spine injury</span></div></section></div><section className="panel"><PanelHeading title="Milestone Timeline" meta="Interactive tracking" action={<button className="text-button" onClick={() => onPhase("review")}>Open review <ChevronRight size={14} /></button>} /><div className="case-timeline-row">{[["24 Sep", "Intake", "complete"], ["25 Sep", "Pre-op Scans", "complete"], ["27 Sep", "Virtual Plan", "complete"], ["30 Sep", "Surgery", "complete"], ["05 Oct", "Post-op Scans", "complete"], ["Today", "AI Evaluation", "review"], ["Pending", "Surgeon Sign-off", "pending"]].map(([date, title, state], index) => <div className={`case-milestone ${index === 5 ? "milestone-current" : ""}`} key={title}><div className="milestone-line" /><div className="milestone-dot">{state === "complete" ? <Check size={11} /> : state === "review" ? <Clock3 size={11} /> : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ccc" }}/>}</div><span>{date}</span><strong>{title}</strong></div>)}</div></section></div>;
}

function BeforePhase({ onReview, findingStatus = "Needs review" }: { onReview: () => void, findingStatus?: string }) {
  return <div className="phase-content"><div className="evidence-grid"><EvidenceCard title="Pre-op imaging" meta="CT · 27 Sep 2026" icon={ImageIcon} tone="teal"><ImagingMini label="Coronal CT" accent="teal" /></EvidenceCard><EvidenceCard title="Fracture map" meta="3 mapped findings" icon={Target} tone="amber"><div className="fracture-map"><span className="fracture-point point-a" /><span className="fracture-point point-b" /><span className="fracture-point point-c" /><div className="face-outline" /></div></EvidenceCard><EvidenceCard title="Image analysis" meta="Model confidence 92%" icon={BrainCircuit} tone="slate"><div className="analysis-list"><AnalysisLine label="Orbital floor defect" value="Present" /><AnalysisLine label="Enophthalmos risk" value="Low" /><AnalysisLine label="ZMC displacement" value="0.8 mm" /></div></EvidenceCard></div><div className="case-content-grid"><section className="panel"><PanelHeading title="Pre-operative findings" meta="3 findings · 2 confirmed" action={<button className="text-button" onClick={onReview}>Review findings <ChevronRight size={14} /></button>} /><div className="finding-list"><FindingRow label="Left orbital floor defect" detail="18 × 14 mm · inferomedial" status="Confirmed" confidence="98%" tone="teal" /><FindingRow label="Mild enophthalmos" detail="Estimated 1.2 mm · left" status="Confirmed" confidence="87%" tone="teal" /><FindingRow label="Inferior rim step-off" detail="3.6 mm · anterior segment" status={findingStatus} confidence="72%" tone={findingStatus === "Confirmed" ? "teal" : "amber"} /></div></section><section className="panel"><PanelHeading title="Surgical checkpoints" meta="Planned before incision" /><div className="checkpoint-list"><Checkpoint label="Restore orbital volume" state="complete" detail="Implant contour selected" /><Checkpoint label="Confirm infraorbital nerve" state="complete" detail="No entrapment noted" /><Checkpoint label="Verify rim continuity" state="pending" detail="Requires post-op comparison" /></div></section></div></div>;
}

function SurgeryPhase() {
  return <div className="phase-content"><div className="overview-stat-grid"><div className="overview-stat"><span>Procedure</span><strong>Mandibular Fracture Repair</strong><small>Bilateral sagittal split</small></div><div className="overview-stat"><span>Plan followed</span><strong className="inline-positive"><CheckCircle2 size={16} /> Yes</strong><small>3 / 4 checkpoints</small></div><div className="overview-stat"><span>Duration</span><strong>01:48:22</strong><small>Within expected range</small></div><div className="overview-stat"><span>Implant</span><strong>2.0mm Locking Miniplates</strong><small>Champy's Ideal Line</small></div></div><div className="case-content-grid"><section className="panel"><PanelHeading title="Surgical Checkpoints Tracker" meta="Recorded intraoperatively" /><div className="checkpoint-list"><Checkpoint label="Occlusal registration check" state="complete" detail="Passed · 09:12" /><Checkpoint label="Fracture reduction anatomically aligned" state="complete" detail="Passed · 09:46" /><Checkpoint label="Minimum 2 screws per fragment" state="complete" detail="Passed · 10:31" /><Checkpoint label="Plate adaptation flush with cortical bone" state="pending" detail="Flagged · Minor gap on right ramus" /></div></section><section className="panel operative-note"><PanelHeading title="Operative Notes" meta="Dr. Elena Okafor" action={<button className="icon-button small"><Pencil size={14} /></button>} /><p>Access achieved via intraoral vestibular incision. Fracture reduced and rigidly fixated using 2.0mm locking miniplates according to Champy's principles. Good cortical engagement on all screws. Occlusion checked and stable before closure. No nerve entrapment.</p><div className="note-footer"><span className="evidence-tag tag-slate"><FileText size={13} /> Signed 30 Sep · 11:42</span><span className="mono">NOTE-30-0926</span></div></section></div></div>;
}

function AfterPhase({ findingStatus = "Needs review" }: { findingStatus?: string }) {
  return <div className="phase-content"><div className="evidence-grid after-grid"><EvidenceCard title="Post-op Imaging Feed" meta="CT · 05 Oct 2026" icon={ImageIcon} tone="teal"><ImagingMini label="Coronal CT" accent="teal" after /></EvidenceCard><EvidenceCard title="3D Rigid Registration" meta="Rigid · 0.42 mm RMSE" icon={PanelsTopLeft} tone="slate"><div className="registration-graphic"><div className="registration-line" /><span>94.2%</span><small>surface overlap</small></div></EvidenceCard><EvidenceCard title="Alignment" meta="Within target" icon={Target} tone="amber"><div className="alignment-meter"><div className="meter-label"><span>Target range</span><strong>0–2 mm</strong></div><div className="meter-track"><span /></div><div className="meter-value"><strong>1.8 mm</strong><small>residual offset</small></div></div></EvidenceCard></div><section className="panel"><PanelHeading title="Post-operative Anatomical Measurements" meta="Compared with planned anatomy" action={<button className="filter-chip"><SlidersHorizontal size={13} /> Measurement set <ChevronDown size={13} /></button>} /><div className="measurement-grid"><Measurement label="Zygomatic Projection" value="98.2%" detail="Bilateral symmetry" state="good" /><Measurement label="Gonial Angle" value="1.2° Diff" detail="Within 2° tolerance" state="good" /><Measurement label="Ramus Height" value="0.8 mm" detail="Target < 2.0 mm" state="good" /><Measurement label="Screw Trajectory" value="Stable" detail="Cortical bone engagement" state="good" /><Measurement label="Condylar Position" value="Centered" detail="In glenoid fossa" state="good" /><Measurement label="Midline Restoration" value="0.5 mm" detail="Class I Occlusion" state="good" /></div></section><div className="case-content-grid"><section className="panel"><PanelHeading title="Residual defects" meta="1 item requires confirmation" /><FindingRow label="Inferior border step-off" detail="1.2 mm · mandibular parasymphysis" status={findingStatus} confidence="72%" tone={findingStatus === "Confirmed" ? "teal" : "amber"} /></section><section className="panel"><PanelHeading title="What changed" meta="Since pre-op" /><div className="change-list"><div><CheckCircle2 size={14} /><span>Condylar neck length</span><strong>Restored</strong></div><div><CheckCircle2 size={14} /><span>Implant seating</span><strong>Stable</strong></div><div><ArrowDownRight size={14} /><span>Occlusal deviation</span><strong>Resolved</strong></div></div></section></div></div>;
}

function EvaluationPhase({ onReview }: { onReview: () => void }) {
  return <div className="phase-content"><div className="evaluation-hero"><div className="evaluation-score"><ScoreRing score={8.2} label="out of 100" /><div><div className="eyebrow">Overall score</div><h3>Good Surgical Alignment</h3><p>The post-operative anatomy aligns with the surgical plan. Alignment, symmetry, and hardware seating are optimal. One finding requires clinician confirmation.</p><div className="evaluation-meta"><span><ShieldCheck size={14} />AI Model Confidence: 94.2%</span><span><Clock3 size={14} />Drafted 12 min ago</span></div></div></div><button className="button button-primary" onClick={onReview}><ClipboardCheck size={15} /> Review finding</button></div><div className="case-content-grid evaluation-grid"><section className="panel"><PanelHeading title="Criterion breakdown" meta="Visual Progress Bars" /><div className="criterion-list"><Criterion label="Anatomical Alignment" score="85" state="good" detail="Reduction gap < 1.0mm" /><Criterion label="Bilateral Symmetry" score="78" state="good" detail="Slight 1.8mm deviation on right ramus" /><Criterion label="Hardware Placement" score="80" state="good" detail="Plate stable, screw #3 near molar apex" /><Criterion label="Occlusal Realignment" score="75" state="watch" detail="Pre-trauma occlusion largely restored" /></div></section><section className="panel"><PanelHeading title="Clinician readout" meta="Draft recommendation" /><div className="readout-block readout-positive"><CheckCircle2 size={16} /><div><strong>What went well</strong><p>Condylar neck length fully restored within 0.8mm of healthy contralateral side.</p></div></div><div className="readout-block readout-watch"><AlertCircle size={16} /><div><strong>What needs attention</strong><p>1.2mm step-off observed at inferior border of the mandibular parasymphysis.</p></div></div><div className="aftercare-note"><span className="eyebrow">Recommended aftercare & Protocols</span><p>Soft diet for 4 weeks. No MMF required (Rigid fixation achieved). Jaw stretching exercises starting Week 2.</p></div></section></div><section className="panel references-panel"><PanelHeading title="Scientific References & Clinical Guidelines" meta="Scoring validation studies" action={<button className="text-button">View knowledge base <ChevronRight size={14} /></button>} /><div className="reference-row"><span className="reference-index">01</span><div><strong>AO CMF Trauma Guidelines</strong><small>Standard protocols for rigid internal fixation.</small></div><span className="reference-score">Relevant</span><ChevronRight size={15} /></div><div className="reference-row"><span className="reference-index">02</span><div><strong>Symmetry Index Validation</strong><small>Published criteria for acceptable facial asymmetry (1.5mm tolerance).</small></div><span className="reference-score">Relevant</span><ChevronRight size={15} /></div></section></div>;
}

function ViewerPhase() {
  const [mode, setMode] = useState("Side-by-side");
  const [showPlanned, setShowPlanned] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  return <div className="phase-content"><div className="viewer-context"><div><div className="eyebrow">Registered imaging · series 03</div><strong>Orbital floor reconstruction</strong><span>CT-05-1026 · 0.42 mm registration RMSE · bone window</span></div><div className="viewer-context-tags"><span>Axial</span><span>Slice 42 / 86</span><span className="viewer-context-live"><span className="live-dot" />Synced</span></div></div><div className="viewer-toolbar"><div className="viewer-modes">{["Pre-op", "Post-op", "Side-by-side", "Overlay"].map((item) => <button key={item} className={`viewer-mode ${mode === item ? "viewer-mode-active" : ""}`} onClick={() => setMode(item)}>{item}</button>)}</div><div className="viewer-tools"><button className={`filter-chip ${showPlanned ? "filter-chip-active" : ""}`} onClick={() => setShowPlanned((value) => !value)}><Target size={13} /> Planned anatomy</button><button className={`filter-chip ${showMeasurements ? "filter-chip-active" : ""}`} onClick={() => setShowMeasurements((value) => !value)}><SlidersHorizontal size={13} /> Measurements</button><button className="icon-button small" title="Download frame"><Download size={15} /></button></div></div><div className="viewer-workbench"><div className="viewer-canvas"><div className="viewer-canvas-head"><span><span className="live-dot" />{mode} comparison</span><span className="mono">CT-05-1026 · axial 42 / 86</span></div><div className={`scan-stage scan-${mode.toLowerCase().replaceAll("-", "")}`}><div className="scan-panel"><div className="scan-label">{mode === "Post-op" ? "POST-OP" : "PRE-OP"}</div><ImagingMini label="" accent="teal" large after={mode === "Post-op" || mode === "Side-by-side"} /></div>{mode === "Side-by-side" && <div className="scan-divider" />}{mode === "Overlay" && showPlanned && <div className="overlay-outline" />}{mode === "Side-by-side" && <div className="scan-panel"><div className="scan-label">POST-OP</div><ImagingMini label="" accent="amber" large after /></div>}{showMeasurements && <div className="measurement-overlay"><span><i />1.8 mm offset</span><span><i />96.4% symmetry</span><span><i />+0.6 cm³ volume</span></div>}</div><div className="viewer-canvas-foot"><span><span className="legend-dot legend-teal" />Planned anatomy</span><span><span className="legend-dot legend-amber" />Post-op surface</span><span>Scroll to zoom · Drag to pan</span></div></div><aside className="viewer-side-panel"><div className="viewer-panel-section"><div className="viewer-panel-heading"><strong>Series</strong><span>03</span></div><button className="viewer-series-item viewer-series-active"><ImagingMini label="" accent="teal" /><span><strong>Post-op CT</strong><small>05 Oct · Axial</small></span><span className="viewer-series-count">86</span></button><button className="viewer-series-item"><ImagingMini label="" accent="slate" /><span><strong>Pre-op CT</strong><small>27 Sep · Axial</small></span><span className="viewer-series-count">92</span></button></div><div className="viewer-panel-section"><div className="viewer-panel-heading"><strong>Measurements</strong><span>3</span></div><div className="viewer-measurement"><span className="measure-dot measure-teal" /><span><strong>Symmetry</strong><small>Surface match</small></span><b>96.4%</b></div><div className="viewer-measurement"><span className="measure-dot measure-amber" /><span><strong>Rim offset</strong><small>Anterior segment</small></span><b>1.8 mm</b></div><div className="viewer-measurement"><span className="measure-dot measure-slate" /><span><strong>Volume</strong><small>Compared with plan</small></span><b>+0.6 cm³</b></div></div></aside></div></div>;
}
function ReviewPhase({ onEdit, findingStatus = "Needs review" }: { onEdit: () => void, findingStatus?: string }) {
  return <div className="phase-content"><div className="review-banner"><div className="review-banner-icon"><ShieldCheck size={18} /></div><div><strong>Clinician review is the final step</strong><p>Confirm or correct model findings before signing this evaluation. Your input improves future case labels.</p></div><span className="review-progress">2 / 3 resolved</span></div><section className="panel"><PanelHeading title="Findings review" meta="3 AI-assisted findings" action={<button className="filter-chip"><Filter size={13} /> Show unresolved <ChevronDown size={13} /></button>} /><div className="review-list"><ReviewRow label="Orbital floor defect repaired" detail="Pre-op defect no longer visible in post-op registration" confidence="98%" state="Confirmed" /><ReviewRow label="Implant seating is stable" detail="Hardware remains within planned contour" confidence="96%" state="Confirmed" /><ReviewRow label="Inferior rim step-off" detail="1.8 mm residual offset at anterior segment" confidence="72%" state={findingStatus} tone={findingStatus === "Confirmed" ? "teal" : "amber"} onEdit={onEdit} /></div></section><section className="panel review-thread-panel"><PanelHeading title="Review thread" meta="Clinician comments and score overrides" action={<button className="text-button" onClick={() => toast("Comment box", { description: "A threaded comment composer is ready in the full application." })}><Plus size={14} /> Add comment</button>} /><div className="review-thread"><div className="thread-item"><div className="mini-avatar thread-avatar">EO</div><div className="thread-body"><div className="thread-meta"><strong>Dr. Elena Okafor</strong><span>Today · 09:42</span></div><p>Alignment is within target. I want to confirm the inferior rim step-off against the operative contour before signing.</p><div className="thread-tag"><AlertCircle size={12} /> Finding needs confirmation</div></div></div><div className="thread-item thread-item-system"><div className="thread-system-icon"><ShieldCheck size={13} /></div><div className="thread-body"><div className="thread-meta"><strong>MAXFACE-EVAL</strong><span>Model note · 94% confidence</span></div><p>Suggested score remains 8.8 / 10. A clinician override can be added with an audit note.</p><button className="text-button" onClick={onEdit}>Open override <ChevronRight size={13} /></button></div></div><div className="thread-composer"><MessageSquareText size={14} /><span>Add a clinical note or explain an override…</span><button className="button button-quiet button-small" onClick={() => toast("Comment added", { description: "The comment composer is staged for the full application." })}>Comment</button></div></div></section><div className="review-actions"><div><span className="eyebrow">Ready to submit?</span><p>2 findings confirmed · {findingStatus === "Confirmed" ? "0" : "1"} finding needs clinician input</p></div><div><button className="button button-quiet" onClick={onEdit}><Pencil size={15} /> Edit finding</button><button className="button button-primary" onClick={() => toast("Review saved", { description: "Case remains in review until all findings are resolved." })}><CheckCircle2 size={15} /> Submit feedback</button></div></div></div>;
}
function ReviewDialog({ onClose, onSave }: { onClose: () => void; onSave: (scoreOverride?: string) => void }) {
  const [selection, setSelection] = useState("Confirm finding");
  const [scoreOverride, setScoreOverride] = useState("8.8");
  return <div className="dialog-backdrop" onMouseDown={onClose}><div className="review-dialog" onMouseDown={(event) => event.stopPropagation()}><div className="dialog-header"><div><div className="eyebrow">Clinician override · MX-2407</div><h2>Inferior orbital rim step-off</h2></div><button className="icon-button" onClick={onClose} aria-label="Close review"><X size={18} /></button></div><div className="dialog-body"><div className="dialog-finding"><div className="dialog-finding-head"><span className="evidence-tag tag-amber"><AlertCircle size={13} /> Needs review</span><span className="mono">Model confidence 72%</span></div><p>1.8 mm residual offset at the left anterior orbital rim. The model is uncertain whether the measurement represents a clinically relevant defect or expected contour.</p><div className="dialog-measurements"><InfoPair label="Pre-op" value="3.6 mm" mono /><InfoPair label="Post-op" value="1.8 mm" mono /><InfoPair label="Target" value="< 2.0 mm" mono /></div></div><div className="dialog-options"><button className={`review-option ${selection === "Confirm finding" ? "review-option-active" : ""}`} onClick={() => setSelection("Confirm finding")}><span className="option-radio" /> <span><strong>Confirm finding</strong><small>The offset is clinically relevant and should remain in the report.</small></span></button><button className={`review-option ${selection === "Mark as expected" ? "review-option-active" : ""}`} onClick={() => setSelection("Mark as expected")}><span className="option-radio" /> <span><strong>Mark as expected contour</strong><small>The offset is acceptable and does not require correction.</small></span></button></div><div className="dialog-score-override"><div><strong>Overall score override</strong><small>Adjust only if your review changes the evaluation.</small></div><label><input type="number" min="0" max="10" step="0.1" value={scoreOverride} onChange={(event) => setScoreOverride(event.target.value)} /><span>/ 10</span></label></div><div className="dialog-note"><label htmlFor="review-note">Clinician note <span>Optional</span></label><textarea id="review-note" placeholder="Add context for the next reviewer..." /></div></div><div className="dialog-footer"><span>Changed by <strong>Dr. Elena Okafor</strong> · just now</span><div><button className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={() => onSave(scoreOverride)}><Check size={15} /> Save review</button></div></div></div></div>;
}

function EvidenceCard({ title, meta, icon: IconComponent, tone, children }: { title: string; meta: string; icon: Icon; tone: string; children: React.ReactNode }) {
  return <div className="evidence-card"><div className="evidence-card-head"><div><span className={`evidence-icon evidence-${tone}`}><IconComponent size={15} /></span><div><strong>{title}</strong><small>{meta}</small></div></div><button className="icon-button small"><MoreHorizontal size={15} /></button></div><div className="evidence-card-body">{children}</div></div>;
}

function ImagingMini({ label, accent, large = false, after = false }: { label: string; accent: string; large?: boolean; after?: boolean }) {
  return <div className={`imaging-mini imaging-${accent} ${large ? "imaging-large" : ""} ${after ? "imaging-after" : ""}`}><div className="imaging-grid-lines" /><div className="imaging-head-shape" /><div className="imaging-orbit left" /><div className="imaging-orbit right" /><div className="imaging-jaw" /><div className="imaging-scanline" /><span className="imaging-label">{label}</span>{after && <span className="imaging-pin">1.8 mm</span>}</div>;
}

function AnalysisLine({ label, value }: { label: string; value: string }) {
  return <div className="analysis-line"><span>{label}</span><strong>{value}</strong></div>;
}

function FindingRow({ label, detail, status, confidence, tone }: { label: string; detail: string; status: string; confidence: string; tone: string }) {
  return <div className="finding-row"><span className={`finding-icon finding-${tone}`}>{tone === "teal" ? <Check size={14} /> : <AlertCircle size={14} />}</span><div><strong>{label}</strong><small>{detail}</small></div><div className="finding-status"><span className={`status-text text-${tone}`}>{status}</span><small>{confidence}</small></div><ChevronRight size={15} className="row-chevron" /></div>;
}

function Checkpoint({ label, state, detail }: { label: string; state: "complete" | "pending"; detail: string }) {
  return <div className="checkpoint-row"><span className={`checkpoint-box checkpoint-${state}`}>{state === "complete" ? <Check size={12} /> : <Clock3 size={12} />}</span><div><strong>{label}</strong><small>{detail}</small></div><span className={`checkpoint-state ${state}`}>{state === "complete" ? "Complete" : "Pending"}</span></div>;
}

function Measurement({ label, value, detail, state }: { label: string; value: string; detail: string; state: "good" | "watch" }) {
  return <div className="measurement-card"><div className="measurement-card-top"><span>{label}</span><span className={`measurement-state measurement-${state}`}>{state === "good" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}</span></div><strong>{value}</strong><small>{detail}</small></div>;
}

function ScoreRing({ score, label, size = "large" }: { score: number; label: string; size?: "small" | "large" }) {
  const radius = size === "small" ? 35 : 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (score / 10);
  return <div className={`score-ring score-ring-${size}`}><svg viewBox="0 0 140 140" aria-label={`${score} out of 10 ${label}`}><circle className="score-ring-track" cx="70" cy="70" r={radius} /><circle className="score-ring-progress" cx="70" cy="70" r={radius} strokeDasharray={`${progress} ${circumference}`} /></svg><div className="score-ring-center"><strong>{score.toFixed(1)}</strong><span>{label}</span></div></div>;
}

function Criterion({ label, score, state, detail }: { label: string; score: string; state: "good" | "watch"; detail: string }) {
  return <div className="criterion-row"><div><strong>{label}</strong><small>{detail}</small></div><div className="criterion-meter"><div className="criterion-track"><span className={state === "watch" ? "meter-watch" : ""} style={{ width: `${Number(score) * 10}%` }} /></div><strong>{score}</strong></div></div>;
}

function ReviewRow({ label, detail, confidence, state, tone, onEdit }: { label: string; detail: string; confidence: string; state: string; tone?: string; onEdit?: () => void }) {
  const needsReview = state === "Needs review";
  return <div className="review-row"><div className={`review-check ${needsReview ? "review-check-open" : ""}`}>{needsReview ? <AlertCircle size={15} /> : <Check size={15} />}</div><div><strong>{label}</strong><small>{detail}</small></div><span className={`confidence-chip ${needsReview ? "confidence-chip-amber" : ""}`}>{confidence}</span><span className={`review-state ${needsReview ? "review-state-open" : ""}`}>{state}</span>{needsReview ? <button className="button button-quiet button-small" onClick={onEdit}><Pencil size={13} /> Review</button> : <CheckCircle2 size={16} className="review-done" />}</div>;
}

function AnalyticsPage() {
  return <><PageHeader eyebrow="Performance intelligence" title="Analytics" description="See how evaluation quality and reviewer confidence are moving across the service." actions={<button className="button button-quiet"><CalendarDays size={15} /> Last 6 months <ChevronDown size={13} /></button>} /><div className="metric-grid"><MetricCard label="Evaluations completed" value="122" detail="18% more than prior period" trend="up" icon={ClipboardCheck} /><MetricCard label="Mean score" value="8.7" detail="Across 5 procedures" tone="ink" icon={Target} /><MetricCard label="High confidence" value="93%" detail="+5.2% since May" trend="up" tone="teal" icon={ShieldCheck} /><MetricCard label="Correction rate" value="6.4%" detail="Within target < 8%" tone="amber" icon={Pencil} /></div><div className="analytics-grid"><section className="panel chart-panel analytics-wide"><PanelHeading title="Score and confidence trend" meta="May–October 2026" action={<button className="filter-chip"><Filter size={13} /> All procedures <ChevronDown size={13} /></button>} /><div className="chart-legend"><span><i className="chart-line chart-line-teal" />Mean score</span><span><i className="chart-line chart-line-slate" />Confidence</span></div><div className="area-chart area-chart-tall"><ResponsiveContainer width="100%" height="100%"><AreaChart data={scoreTrend} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={TEAL} stopOpacity={0.2} /><stop offset="100%" stopColor={TEAL} stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e6e3db" strokeDasharray="3 4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a928d", fontSize: 11 }} /><YAxis yAxisId="score" domain={[7, 10]} axisLine={false} tickLine={false} tick={{ fill: "#8a928d", fontSize: 11 }} /><YAxis yAxisId="confidence" orientation="right" domain={[70, 100]} hide /><Tooltip contentStyle={chartTooltipStyle} /><Area yAxisId="score" type="monotone" dataKey="score" stroke={TEAL} strokeWidth={2.5} fill="url(#analyticsFill)" dot={{ fill: "#fff", stroke: TEAL, strokeWidth: 2, r: 3 }} isAnimationActive={false} /><Area yAxisId="confidence" type="monotone" dataKey="confidence" stroke="#9aa7ab" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div></section><section className="panel procedure-panel"><PanelHeading title="By procedure" meta="Mean outcome score" action={<button className="icon-button small"><MoreHorizontal size={15} /></button>} /><div className="procedure-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={procedureResults} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#e6e3db" /><XAxis type="number" domain={[7, 10]} hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={62} tick={{ fill: "#6d7976", fontSize: 11 }} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "#f3f1ea" }} /><Bar dataKey="score" fill={TEAL} radius={[0, 5, 5, 0]} barSize={13} isAnimationActive={false} /></BarChart></ResponsiveContainer></div><div className="procedure-foot"><span>Highest performing</span><strong>Nasal · 9.1</strong></div></section></div><div className="analytics-lower"><section className="panel"><PanelHeading title="Review throughput" meta="Last 30 days" /><div className="throughput-grid"><InfoPair label="Median review time" value="18 min" /><InfoPair label="First-pass acceptance" value="87%" /><InfoPair label="Feedback returned" value="7 cases" /><InfoPair label="Open escalations" value="2 cases" /></div><div className="throughput-progress"><div><span>Weekly target</span><strong>31 / 36 reviews</strong></div><div className="progress-track"><span style={{ width: "86%" }} /></div></div></section><section className="panel"><PanelHeading title="Quality signal" meta="Model vs clinician" /><div className="quality-signal"><div className="quality-orbit"><Gauge size={21} /><strong>0.86</strong><span>agreement index</span></div><div className="quality-notes"><div><span className="legend-dot legend-teal" />High agreement <strong>104</strong></div><div><span className="legend-dot legend-amber" />Clinician correction <strong>8</strong></div><div><span className="legend-dot legend-coral" />Escalated <strong>2</strong></div></div></div></section></div></>;
}

function SectionPage({ kind }: { kind: "reports" | "knowledge" | "feedback" | "admin" }) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const config = {
    reports: { eyebrow: "Clinical documentation", title: "Reports", description: "Generate, review, and export evaluation reports from signed cases.", icon: FileText, actions: "New report", overview: "Evaluation reports", note: "Every case report carries its source evidence and review history." },
    knowledge: { eyebrow: "Reference library", title: "Knowledge base", description: "The criteria, guidelines, and citations behind every evaluation decision.", icon: BookOpen, actions: "Add reference", overview: "Trusted source material", note: "12 criteria · 28 citations · 6 surgical protocols" },
    feedback: { eyebrow: "Learning loop", title: "Feedback", description: "Track clinician corrections and labelled cases that improve the evaluation system.", icon: MessageSquareText, actions: "Review queue", overview: "7 items need attention", note: "Corrections are linked directly back to their source case." },
    admin: { eyebrow: "Workspace controls", title: "Admin", description: "Manage access, audit trails, and retention rules for the clinical workspace.", icon: Settings2, actions: "Invite user", overview: "3 active users", note: "Role-based access is enabled for the current workspace." },
  }[kind];
  const data = kind === "reports" ? [
    { title: "Evaluation reports", detail: "All signed and draft outcome evaluations", status: "122 cases", score: "8.7", route: "/reports/MX-2407" },
    { title: "Case report", detail: "Amina Mensah · MX-2407 · drafted 12 min ago", status: "Draft", score: "8.8", route: "/reports/MX-2407" },
    { title: "Report preview", detail: "Review layout and clinician sign-off before export", status: "Ready", score: "PDF", route: "/reports/MX-2407" },
    { title: "Export PDF", detail: "3 reports queued for export this week", status: "Queued", score: "03", route: "/reports/MX-2407" },
  ] : kind === "knowledge" ? [
    { title: "References", detail: "28 linked sources used across evaluation criteria", status: "28", score: "REF", route: "/knowledge/references" },
    { title: "Guidelines", detail: "MAXFACE guideline v2.4 · Updated Aug 2026", status: "12", score: "GUIDE", route: "/knowledge/guidelines" },
    { title: "Surgical checkpoints", detail: "Internal protocol library · 34 checkpoints", status: "34", score: "PROTO", route: "/knowledge/surgical-checkpoints" },
    { title: "Evaluation criteria", detail: "Weighted scoring definitions and thresholds", status: "Active", score: "CRIT", route: "/knowledge/evaluation-criteria" },
    { title: "Citations", detail: "AO CMF consensus and evidence notes", status: "2025", score: "CITE", route: "/knowledge/citations" },
  ] : kind === "feedback" ? [
    { title: "Clinician feedback", detail: "7 open items across the current review queue", status: "Open", score: "07", route: "/feedback" },
    { title: "Corrected findings", detail: "Findings changed by a clinician after model review", status: "8", score: "FIND", route: "/feedback" },
    { title: "Corrected scores", detail: "Scores with a clinician override or note", status: "3", score: "SCORE", route: "/feedback" },
    { title: "Labelled cases", detail: "Cases ready to join the quality improvement set", status: "186", score: "LABEL", route: "/feedback" },
  ] : [
    { title: "Users", detail: "3 active clinicians · 1 pending invitation", status: "Active", score: "03", route: "/admin" },
    { title: "Roles & permissions", detail: "Admin, reviewer, and observer access levels", status: "RBAC", score: "03", route: "/admin" },
    { title: "Audit log", detail: "Review every change to case evidence and scores", status: "Live", score: "LOG", route: "/admin" },
    { title: "Data management", detail: "Import, export, and integrity checks", status: "Healthy", score: "DATA", route: "/admin" },
    { title: "Retention & deletion", detail: "Clinical records · 7 year retention policy", status: "Policy", score: "07Y", route: "/admin" },
    { title: "System settings", detail: "Workspace defaults, notifications, and thresholds", status: "Managed", score: "SET", route: "/admin" },
  ];
  const filtered = data.filter((item) => `${item.title} ${item.detail} ${item.status}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} actions={<><button className="button button-quiet" onClick={() => toast(`${config.title} filters`, { description: "Use the search and module rows to narrow this workspace." })}><Filter size={15} /> Filters</button><button className="button button-primary" onClick={() => toast(config.actions, { description: "This action is staged for the full clinical application." })}><Plus size={15} /> {config.actions}</button></>} /><section className="section-overview"><div className="section-overview-copy"><div className="section-icon"><config.icon size={21} /></div><div><strong>{config.overview}</strong><span>{config.note}</span></div></div><div className="section-overview-stat"><span>Last activity</span><strong>{kind === "admin" ? "Today · 09:42" : "12 min ago"}</strong></div></section><section className="panel registry-panel"><div className="registry-toolbar"><div className="inline-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} /></div><div className="toolbar-meta"><span><span className="legend-dot legend-teal" />Updated today</span><button className="icon-button small"><SlidersHorizontal size={15} /></button></div></div><div className="section-list">{filtered.map((item, index) => <button key={item.title} className="section-list-row" onClick={() => item.route ? navigate(item.route) : toast(item.title, { description: item.detail })}><span className="section-row-index">{String(index + 1).padStart(2, "0")}</span><span className="section-row-icon"><config.icon size={16} /></span><span className="section-row-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className={`section-row-status ${item.status.toLowerCase()}`}>{item.status}</span><span className="section-row-score">{item.score}</span><ChevronRight size={15} className="row-chevron" /></button>)}</div><div className="table-footer"><span>Showing {filtered.length} of {data.length} modules</span><span className="pagination"><button className="icon-button small"><ChevronLeft size={14} /></button><span>1 / 1</span><button className="icon-button small"><ChevronRight size={14} /></button></span></div></section>{kind === "feedback" && <FeedbackThread />}{kind === "admin" && <AdminSettings />} </>;
}

function FeedbackThread() {
  return <section className="panel feedback-thread-panel"><PanelHeading title="Clinician feedback thread" meta="Corrections linked to labelled cases" action={<button className="text-button" onClick={() => toast("Feedback filters", { description: "Showing open corrections and score overrides." })}><Filter size={13} /> Open corrections</button>} /><div className="review-thread"><div className="thread-item"><div className="mini-avatar thread-avatar">RS</div><div className="thread-body"><div className="thread-meta"><strong>Dr. Rahul Sen</strong><span>MF-2024-004 · 18 min ago</span></div><p>Adjusted the residual defect label from “confirmed” to “needs review” after comparing the post-op registration.</p><div className="thread-tag"><Pencil size={12} /> Corrected finding · labelled case</div></div></div><div className="thread-item thread-item-system"><div className="thread-system-icon"><ShieldCheck size={13} /></div><div className="thread-body"><div className="thread-meta"><strong>MAXFACE-EVAL</strong><span>Feedback captured · audit linked</span></div><p>Score changed from 8.4 to 7.2 with the clinician rationale preserved for model evaluation.</p><button className="text-button" onClick={() => toast("Case opened", { description: "Opening the source case review thread." })}>Open source case <ChevronRight size={13} /></button></div></div><div className="thread-composer"><MessageSquareText size={14} /><span>Add a correction note or label rationale…</span><button className="button button-quiet button-small" onClick={() => toast("Feedback note", { description: "The feedback composer is staged for the full application." })}>Comment</button></div></div></section>;
}

function AdminSettings() {
  const roles = ["Admin", "Reviewer", "Observer"];
  const permissions = [["Users", [true, false, false]], ["Cases", [true, true, true]], ["Reports", [true, true, true]], ["Override scores", [true, true, false]], ["System settings", [true, false, false]]];
  return <div className="admin-settings-grid"><section className="panel settings-panel"><PanelHeading title="Workspace settings" meta="Cal.com-style controls" /><div className="settings-list"><div className="settings-row"><span><strong>Default review queue</strong><small>Route new cases to the clinical reviewer group</small></span><button className="setting-value" onClick={() => toast("Review queue", { description: "Clinical reviewer group is selected." })}>Clinical reviewers <ChevronDown size={13} /></button></div><div className="settings-row"><span><strong>Notification digest</strong><small>Send a daily summary of pending surgeon reviews</small></span><button className="setting-toggle setting-toggle-on" onClick={() => toast("Digest updated", { description: "Daily digest remains enabled." })}><span />On</button></div><div className="settings-row"><span><strong>Require override note</strong><small>Every clinician score override must include rationale</small></span><button className="setting-toggle setting-toggle-on" onClick={() => toast("Policy updated", { description: "Override notes remain required." })}><span />On</button></div><div className="settings-row"><span><strong>Retention policy</strong><small>Clinical records and audit history</small></span><button className="setting-value" onClick={() => toast("Retention policy", { description: "7 year retention policy is active." })}>7 years <ChevronDown size={13} /></button></div></div></section><section className="panel role-matrix-panel"><PanelHeading title="Roles & permissions" meta="Access matrix · updated today" action={<button className="button button-quiet button-small" onClick={() => toast("Role editor", { description: "Role editing is staged for the full application." })}><Pencil size={13} /> Edit roles</button>} /><div className="role-matrix-wrap"><table className="role-matrix"><thead><tr><th>Permission</th>{roles.map((role) => <th key={role}>{role}</th>)}</tr></thead><tbody>{permissions.map(([label, values]) => <tr key={label as string}><td>{label}</td>{(values as boolean[]).map((allowed, index) => <td key={`${label}-${index}`}><span className={`role-check ${allowed ? "role-check-on" : ""}`}>{allowed ? <Check size={13} /> : "—"}</span></td>)}</tr>)}</tbody></table></div><div className="role-matrix-foot"><span><span className="role-check role-check-on"><Check size={11} /></span>Allowed</span><span><span className="role-check">—</span>Restricted</span></div></section></div>;
}

function KnowledgeTopicPage({ topic }: { topic: string }) {
  const [, navigate] = useLocation();
  const topics: Record<string, { title: string; kicker: string; description: string; measures: Array<[string, string]> }> = {
    references: { title: "References", kicker: "Knowledge base · source library", description: "The source material linked to MAXFACE-EVAL criteria and clinician review decisions.", measures: [["Active references", "28"], ["Updated this quarter", "06"], ["Citation coverage", "94%"], ["Review owner", "Clinical board"]] },
    guidelines: { title: "Guidelines", kicker: "Knowledge base · clinical guidance", description: "Current evaluation guidance for post-operative maxillofacial outcomes.", measures: [["Active guidelines", "12"], ["Latest revision", "v2.4"], ["Next review", "Dec 2026"], ["Applies to", "5 procedures"]] },
    "surgical-checkpoints": { title: "Surgical checkpoints", kicker: "Knowledge base · operative protocol", description: "The before, during, and after checkpoints used to compare plan with outcome.", measures: [["Total checkpoints", "34"], ["Orbital pathway", "08"], ["Last updated", "Aug 2026"], ["Owner", "Theatre team"]] },
    "evaluation-criteria": { title: "Evaluation criteria", kicker: "Knowledge base · scoring system", description: "Weighted scoring definitions, confidence thresholds, and review rules for clinical evaluation.", measures: [["Criteria", "12"], ["Weighted domains", "05"], ["Confidence floor", "72%"], ["Score range", "0–10"]] },
    citations: { title: "Citations", kicker: "Knowledge base · evidence notes", description: "Evidence notes from AO CMF consensus and internal review of outcome thresholds.", measures: [["Citations", "28"], ["Consensus sources", "11"], ["Latest source", "2025"], ["Coverage", "Orbital / ZMC"]] },
  };
  const detail = topics[topic] ?? topics["evaluation-criteria"];
  return <><div className="back-link" onClick={() => navigate("/knowledge")}><ChevronLeft size={15} /> Back to knowledge base</div><PageHeader eyebrow={detail.kicker} title={detail.title} description={detail.description} actions={<button className="button button-quiet" onClick={() => toast("Reference copied", { description: "A shareable reference link was copied." })}><Download size={15} /> Share reference</button>} /><div className="metric-grid knowledge-metric-grid">{detail.measures.map(([label, value]) => <div className="metric-card metric-ink" key={label}><div className="metric-head"><span>{label}</span><span className="metric-icon"><BookOpen size={16} /></span></div><div className="metric-value">{value}</div><div className="metric-detail"><CheckCircle2 size={13} /><span>Verified in current policy set</span></div></div>)}</div><div className="knowledge-detail-grid"><section className="panel"><PanelHeading title="Reference summary" meta="Current working definition" /><div className="knowledge-copy"><p>MAXFACE-EVAL uses this reference set to keep evaluation language consistent across clinicians, procedures, and post-operative review. Every linked case stores the source version that informed its score.</p><div className="knowledge-callout"><ShieldCheck size={16} /><div><strong>Evidence-linked by default</strong><span>Changes to a criterion are versioned and visible in the audit trail.</span></div></div></div></section><section className="panel"><PanelHeading title="Linked criteria" meta="Used in 38 cases" /><div className="linked-criteria"><div><span className="case-key">CRIT-01</span><strong>Alignment · mean deviation</strong><small>Target &lt; 2.0 mm</small></div><div><span className="case-key">CRIT-04</span><strong>Symmetry · surface match</strong><small>Target ≥ 94%</small></div><div><span className="case-key">CRIT-07</span><strong>Clinician confidence</strong><small>Review below 80%</small></div></div></section></div></>;
}

function ReportPreviewPage() {
  return <><div className="back-link"><ChevronLeft size={15} /> Back to reports</div><PageHeader eyebrow="Report preview · MX-2407" title="Post-operative evaluation" description="Amina Mensah · Orbital floor reconstruction · Draft report" actions={<><button className="button button-quiet" onClick={() => toast("Report saved", { description: "The draft report was saved locally." })}><Check size={15} /> Save draft</button><button className="button button-primary" onClick={() => toast("Export queued", { description: "PDF export is staged for the full application." })}><Download size={15} /> Export PDF</button></>} /><div className="report-export-bar"><div><span className="eyebrow">Preview mode</span><strong>Clinician summary · Draft 06 Oct 2026</strong><small>Source evidence linked · 4 criteria · 1 finding pending</small></div><div className="report-export-controls"><span className="report-format">PDF · A4</span><span className="report-format">Evidence linked</span><button className="button button-quiet button-small" onClick={() => toast("Preview refreshed", { description: "The report preview is up to date." })}>Refresh preview</button></div></div><div className="report-preview"><div className="report-paper"><div className="report-paper-head"><BrandMark /><div className="report-stamp">DRAFT<br /><span>06 OCT 2026</span></div></div><div className="report-kicker">MAXFACE-EVAL / CLINICAL OUTCOME REPORT</div><h2>Post-operative evaluation</h2><p className="report-lead">A structured review of surgical plan adherence, post-operative anatomy, and clinician-confirmed outcome.</p><div className="report-meta-grid"><InfoPair label="Patient" value="Amina Mensah · PT-1048" /><InfoPair label="Case" value="MX-2407" mono /><InfoPair label="Procedure" value="Orbital floor reconstruction" /><InfoPair label="Evaluator" value="Dr. Elena Okafor" /></div><div className="report-score-block"><ScoreRing score={8.8} label="overall score" size="small" /><div><span className="eyebrow">Summary</span><h3>Strong outcome with one finding to confirm</h3><p>Alignment, hardware position, and orbital volume are within target range. One residual rim measurement is awaiting clinician confirmation.</p></div></div><div className="report-section"><div className="report-section-head"><span>01</span><strong>Criterion breakdown</strong></div><Criterion label="Alignment" score="9.2" state="good" detail="0.8 mm mean deviation" /><Criterion label="Symmetry" score="9.0" state="good" detail="96.4% surface match" /><Criterion label="Hardware" score="9.4" state="good" detail="Stable seating" /><Criterion label="Residual defect" score="7.2" state="watch" detail="1 item to confirm" /></div><div className="report-signature"><span>Prepared by <strong>MAXFACE-EVAL</strong></span><span>Clinician sign-off <strong>Pending review</strong></span></div></div></div></>;
}

function EmptyState({ icon: IconComponent, title, description }: { icon: Icon; title: string; description: string }) {
  return <div className="empty-state"><span><IconComponent size={18} /></span><strong>{title}</strong><p>{description}</p></div>;
}

function getPageTitle(location: string) {
  if (location === "/") return "Dashboard";
  if (location.startsWith("/patients")) return location.split("/").length > 2 ? "Patient profile" : "Patients";
  if (location.startsWith("/cases")) return location.split("/").length > 2 ? "Case workspace" : "Active cases";
  if (location.startsWith("/reports")) return "Reports";
  if (location.startsWith("/analytics")) return "Analytics";
  if (location.startsWith("/knowledge")) return "Knowledge base";
  if (location.startsWith("/feedback")) return "Feedback";
  if (location.startsWith("/admin")) return "Admin";
  return "Overview";
}

function App() {
  const [location] = useLocation();
  let page: React.ReactNode;
  if (location === "/" || location === "/dashboard") page = <DashboardPage />;
  else if (location === "/patients") page = <PatientsPage />;
  else if (location.startsWith("/patients/")) page = <PatientProfilePage patientId={location.split("/")[2] ?? "PT-1048"} />;
  else if (location === "/cases") page = <CasesPage />;
  else if (location.startsWith("/cases/")) { const segments = location.split("/").filter(Boolean); page = <CaseWorkspacePage caseId={segments[1] ?? "MX-2407"} requestedPhase={segments[2]} />; }
  else if (location === "/analytics") page = <AnalyticsPage />;
  else if (location.startsWith("/reports/")) page = <ReportPreviewPage />;
  else if (location === "/reports") page = <SectionPage kind="reports" />;
  else if (location.startsWith("/knowledge/")) page = <KnowledgeTopicPage topic={location.split("/")[2] ?? "evaluation-criteria"} />;
  else if (location === "/knowledge") page = <SectionPage kind="knowledge" />;
  else if (location.startsWith("/feedback")) page = <SectionPage kind="feedback" />;
  else if (location.startsWith("/admin")) page = <SectionPage kind="admin" />;
  else page = <DashboardPage />;
  return <><AppShell>{page}</AppShell><Toaster position="bottom-right" toastOptions={{ className: "toast-card" }} /></>;
}

export default App;
