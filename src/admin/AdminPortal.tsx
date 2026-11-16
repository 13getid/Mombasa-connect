import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarRange,
  ChevronRight,
  Clock3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelsTopLeft,
  Plus,
  Search,
  Settings,
  Smartphone,
  TicketCheck,
  TriangleAlert,
  Users,
  X,
  Compass,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

const navGroups = [
  {
    label: "Workspace",
    items: [
      ["Overview", LayoutDashboard],
      ["Bookings", TicketCheck],
      ["Tours & Experiences", Compass],
      ["Guides", Users],
      ["Customers", Users],
    ],
  },
  {
    label: "Operations",
    items: [
      ["Availability & Scheduling", CalendarRange],
      ["Payments", CreditCard],
      ["USSD Activity", Smartphone],
    ],
  },
  { label: "Insights", items: [["Reports & Analytics", ChartNoAxesColumnIncreasing]] },
  {
    label: "Configuration",
    items: [
      ["Website Content", PanelsTopLeft],
      ["Settings", Settings],
      ["Activity Logs", Activity],
    ],
  },
] as const;

const kpis = [
  { label: "Total bookings", value: "248", support: "+12% compared with previous period", icon: TicketCheck, tone: "positive" },
  { label: "Pending bookings", value: "18", support: "6 require attention today", icon: Clock3, tone: "attention" },
  { label: "Active tours", value: "12", support: "Published experiences", icon: Compass, tone: "neutral" },
  { label: "Registered guides", value: "26", support: "21 currently approved", icon: Users, tone: "neutral" },
  { label: "Total customers", value: "384", support: "Registered accounts", icon: Users, tone: "neutral" },
  { label: "Revenue collected", value: "KES 486,500", support: "+8.4% compared with previous period", icon: CreditCard, tone: "positive" },
] as const;

const bookings = [
  { ref: "MTD-1024", customer: "Amina Hassan", experience: "Old Town Heritage Tour", date: "14 Nov 2026", source: "Website", amount: "KES 3,000", status: "Confirmed" },
  { ref: "MTD-1023", customer: "James Mwangi", experience: "Tudor Creek Dhow Ride", date: "14 Nov 2026", source: "USSD", amount: "KES 4,500", status: "Pending" },
  { ref: "MTD-1022", customer: "Sarah Kimani", experience: "Fort Jesus Experience", date: "15 Nov 2026", source: "Website", amount: "KES 2,000", status: "Confirmed" },
  { ref: "MTD-1021", customer: "Daniel Otieno", experience: "Old Town Heritage Tour", date: "15 Nov 2026", source: "USSD", amount: "KES 3,000", status: "Pending" },
  { ref: "MTD-1020", customer: "Grace Wanjiku", experience: "Tudor Creek Dhow Ride", date: "16 Nov 2026", source: "Website", amount: "KES 4,500", status: "Completed" },
];

const experiences = [
  { name: "Old Town Heritage Tour", bookings: 96, price: "KES 1,500", image: "/images/old-town-street.jpg" },
  { name: "Fort Jesus Experience", bookings: 71, price: "KES 1,200", image: "/images/fort-jesus.jpg" },
  { name: "Tudor Creek Dhow Ride", bookings: 81, price: "KES 2,500", image: "/images/tudor-creek-dhow.jpg" },
];

type ModalState = { title: string; description: string; isCreate?: boolean } | null;

function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-status ${status.toLowerCase()}`}>{status}</span>;
}

function Sidebar({ onNavigate, onLogout, mobileNavOpen }: { onNavigate: (label: string) => void; onLogout: () => void; mobileNavOpen: boolean }) {
  return (
    <aside className={mobileNavOpen ? "admin-sidebar nav-open" : "admin-sidebar"}>
      <a className="admin-brand" href="/admin" aria-label="Mombasa Connect administration">
        <span className="admin-brand-mark"><img src="/assets/ea4a6.svg" alt="" /></span>
        <span><strong>Mombasa Connect</strong><small>Administration</small></span>
      </a>
      <nav aria-label="Administration navigation">
        {navGroups.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map(([label, Icon]) => (
              <button key={label} type="button" className={label === "Overview" ? "active" : ""} onClick={() => label !== "Overview" && onNavigate(label)}>
                <Icon size={17} strokeWidth={1.7} /><span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-profile">
        <span className="admin-avatar">PA</span>
        <div><b>Platform Administrator</b><small>Super Admin</small></div>
        <button type="button" onClick={onLogout} aria-label="Log out"><LogOut size={17} /></button>
      </div>
    </aside>
  );
}

function Topbar({ query, onQuery, onNotifications, onToggleMenu, mobileNavOpen }: { query: string; onQuery: (value: string) => void; onNotifications: () => void; onToggleMenu: () => void; mobileNavOpen: boolean }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="admin-topbar">
      <button className="admin-mobile-menu" type="button" onClick={onToggleMenu} aria-label="Toggle navigation" aria-expanded={mobileNavOpen}><Menu size={19} /></button>
      <div className="admin-breadcrumb"><span>Administration</span><i>/</i><b>Overview</b></div>
      <label className="admin-search">
        <Search size={17} />
        <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search bookings, tours or customers..." />
        {query && <button type="button" onClick={() => onQuery("")} aria-label="Clear search"><X size={15} /></button>}
      </label>
      <button className="admin-notification" type="button" onClick={onNotifications} aria-label="Open notifications"><Bell size={18} /><span>3</span></button>
      <div className="admin-profile-control">
        <button type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
          <span className="admin-avatar">PA</span>
          <span><b>Platform Administrator</b><small>Super Admin</small></span>
          <ChevronRight className="profile-chevron" size={14} />
        </button>
        {profileOpen && <div className="admin-profile-menu"><p><b>Platform Administrator</b><small>admin@mombasaconnect.ke</small></p><button type="button" onClick={() => setProfileOpen(false)}>Account settings</button><button type="button" onClick={() => setProfileOpen(false)}>Security preferences</button></div>}
      </div>
    </header>
  );
}

function BookingChart({ period, onPeriod }: { period: "7 days" | "30 days"; onPeriod: (period: "7 days" | "30 days") => void }) {
  const labels = period === "7 days" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["1 Nov", "6 Nov", "11 Nov", "16 Nov", "21 Nov", "26 Nov", "30 Nov"];
  return (
    <section className="analytics-panel booking-chart-panel">
      <div className="panel-heading"><div><h2>Booking Activity</h2><p>Booking volume over the selected period.</p></div><div className="chart-filter"><button type="button" className={period === "7 days" ? "active" : ""} onClick={() => onPeriod("7 days")}>7 days</button><button type="button" className={period === "30 days" ? "active" : ""} onClick={() => onPeriod("30 days")}>30 days</button></div></div>
      <div className="chart-legend"><span><i className="website" />Website bookings</span><span><i className="ussd" />USSD bookings</span></div>
      <div className="line-chart">
        <div className="axis-labels"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
        <div className="chart-canvas"><div className="grid-lines"><i /><i /><i /><i /><i /></div>
          <svg viewBox="0 0 700 210" preserveAspectRatio="none" role="img" aria-label="Booking activity chart">
            <defs><linearGradient id="adminWebsiteFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#168c83" stopOpacity=".18" /><stop offset="1" stopColor="#168c83" stopOpacity="0" /></linearGradient></defs>
            <path className="area" d="M0 160 C75 146 115 102 175 116 S265 72 350 91 S450 47 525 64 S620 31 700 43 L700 210 L0 210Z" />
            <path className="website-line" d="M0 160 C75 146 115 102 175 116 S265 72 350 91 S450 47 525 64 S620 31 700 43" />
            <path className="ussd-line" d="M0 182 C70 171 122 150 175 158 S270 132 350 144 S450 107 525 121 S621 88 700 101" />
            {[ ["0", "160"], ["175", "116"], ["350", "91"], ["525", "64"], ["700", "43"] ].map(([x, y]) => <circle key={x} className="website-dot" cx={x} cy={y} r="4" />)}
          </svg>
          <div className="x-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

function ChannelChart() {
  return (
    <section className="analytics-panel channel-panel">
      <div className="panel-heading"><div><h2>Booking Channels</h2><p>Where customers are making their reservations.</p></div></div>
      <div className="channel-visual"><div className="donut" role="img" aria-label="68 percent website, 32 percent USSD"><div><strong>248</strong><span>Total bookings</span></div></div>
        <div className="channel-stats"><div><span><i className="website" />Website bookings</span><strong>68%</strong><small>169 reservations</small></div><div><span><i className="ussd" />USSD bookings</span><strong>32%</strong><small>79 reservations</small></div></div>
      </div><p className="demo-note">Demonstration values · Selected period</p>
    </section>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const items = [
    ["Booking requires review", "MTD-1023 was submitted through USSD.", "8 minutes ago"],
    ["Guide verification submitted", "Fatuma Noor uploaded new credentials.", "32 minutes ago"],
    ["Tour capacity reached", "Saturday’s Tudor Creek departure is full.", "1 hour ago"],
  ];
  return <><div className="panel-scrim" onClick={onClose} /><aside className="notification-panel"><div className="notification-panel-header"><div><p>Notifications</p><span>3 unread updates</span></div><button type="button" onClick={onClose} aria-label="Close notifications"><X size={18} /></button></div><div className="notification-panel-list">{items.map(([title, copy, time]) => <article key={title}><span><Bell size={15} /></span><div><b>{title}</b><p>{copy}</p><small>{time}</small></div></article>)}</div><button className="notification-footer" type="button" onClick={onClose}>Mark all as read</button></aside></>;
}

export default function AdminPortal() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<"7 days" | "30 days">("7 days");
  const [modal, setModal] = useState<ModalState>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const filteredBookings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return bookings;
    return bookings.filter((booking) => Object.values(booking).join(" ").toLowerCase().includes(normalized));
  }, [query]);
  const openFuture = (label: string) => setModal({ title: label, description: `The ${label} management screen is reserved for a future implementation.` });
  const createTour = () => setModal({ title: "Create a new tour.", description: "The complete Create Tour workflow will be designed in a later step. This overview prototype preserves the intended entry point.", isCreate: true });

  return (
    <div className="admin-app">
      <Sidebar onNavigate={openFuture} onLogout={() => openFuture("Secure Logout")} mobileNavOpen={mobileNavOpen} />
      <div className="admin-shell">
        <Topbar query={query} onQuery={setQuery} onNotifications={() => setNotificationsOpen(true)} onToggleMenu={() => setMobileNavOpen((value) => !value)} mobileNavOpen={mobileNavOpen} />
        <main className="admin-content">
          <section className="admin-welcome"><div><p className="admin-eyebrow">Platform overview</p><h1>Good morning, Administrator.</h1><p>Here’s what’s happening across Mombasa Connect today.</p></div><div className="welcome-actions"><span><b>Monday</b><small>16 November 2026</small></span><button className="admin-primary-button" type="button" onClick={createTour}><Plus size={16} />Create New Tour</button></div></section>
          <section className="kpi-section"><div className="section-label"><span>Key performance indicators</span><small>Demonstration data · Current period</small></div><div className="kpi-grid">{kpis.map(({ label, value, support, icon: Icon, tone }) => <article className="kpi-card" key={label}><div className="kpi-heading"><span>{label}</span><i><Icon size={17} /></i></div><strong className={value.length > 8 ? "compact" : ""}>{value}</strong><p className={tone}>{tone === "positive" && <ArrowRight size={12} />}{tone === "attention" && <TriangleAlert size={12} />}{support}</p></article>)}</div></section>
          <section className="analytics-grid"><BookingChart period={period} onPeriod={setPeriod} /><ChannelChart /></section>
          <section className="table-panel"><div className="panel-heading"><div><h2>Recent Bookings</h2><p>Latest reservations received across all booking channels.</p></div><button className="panel-link" type="button" onClick={() => openFuture("Bookings")}>View All Bookings <ArrowRight size={14} /></button></div>
            <div className="admin-table-wrap"><table><thead><tr><th>Booking ref</th><th>Customer</th><th>Experience</th><th>Date</th><th>Source</th><th>Amount</th><th>Status</th></tr></thead><tbody>{filteredBookings.map((row) => <tr key={row.ref}><td><b>{row.ref}</b></td><td>{row.customer}</td><td>{row.experience}</td><td>{row.date}</td><td><span className={`source ${row.source.toLowerCase()}`}>{row.source}</span></td><td><b>{row.amount}</b></td><td><StatusBadge status={row.status} /></td></tr>)}</tbody></table></div>
            {filteredBookings.length === 0 && <div className="table-empty"><Search size={20} /><b>No matching bookings</b><span>Try a customer name, reference or experience.</span></div>}
          </section>
          <section className="admin-bottom-grid">
            <section className="attention-panel"><div className="panel-heading"><div><h2>Needs Your Attention</h2><p>Operational items awaiting administrator action.</p></div></div><div className="attention-list">{[{ count: 18, text: "bookings awaiting review", icon: TicketCheck, target: "Bookings" }, { count: 5, text: "guides awaiting verification", icon: Users, target: "Guides" }, { count: 3, text: "bookings requiring guide assignment", icon: TriangleAlert, target: "Availability & Scheduling" }].map(({ count, text, icon: Icon, target }) => <article key={text}><span className="attention-icon"><Icon size={17} /></span><strong>{count}</strong><p>{text}</p><button type="button" onClick={() => openFuture(target)}>Review <ArrowRight size={13} /></button></article>)}</div></section>
            <section className="popular-panel"><div className="panel-heading"><div><h2>Popular Experiences</h2><p>Booking volume across published tours.</p></div></div><div className="popular-list">{experiences.map((experience) => <article key={experience.name}><img src={experience.image} alt="" /><div><h3>{experience.name}</h3><p>{experience.bookings} bookings</p></div><span><b>{experience.price}</b><StatusBadge status="Published" /></span></article>)}</div></section>
          </section>
        </main>
      </div>
      {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}
      {modal && <div className="modal-scrim" onMouseDown={() => setModal(null)}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button><span className="modal-symbol">{modal.isCreate ? <Compass size={25} /> : <ArrowRight size={23} />}</span><p className="admin-eyebrow">{modal.isCreate ? "Tour management" : "Future admin module"}</p><h2 id="admin-modal-title">{modal.title}</h2><p>{modal.description}</p>{modal.isCreate && <div className="modal-form-preview"><label>Tour name<input placeholder="Enter experience name" /></label><label>Location<input placeholder="Mombasa location" /></label></div>}<button className="admin-primary-button" type="button" onClick={() => setModal(null)}>{modal.isCreate ? "Close preview" : "Return to overview"}</button></section></div>}
    </div>
  );
}