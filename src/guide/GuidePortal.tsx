import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../shared/theme/theme";
import './guide.css';

type View =
  | "dashboard"
  | "assignments"
  | "availability"
  | "notifications"
  | "profile"
  | "support"
  | "assignment-detail"
  | "signed-out";

type AssignmentStatus =
  | "Confirmed"
  | "Upcoming"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Awaiting Confirmation";

type Assignment = {
  id: string;
  experience: string;
  date: string;
  shortDate: string;
  time: string;
  visitors: number;
  meetingPoint: string;
  status: AssignmentStatus;
  image: string;
  duration: string;
  customer: string;
  phone: string;
  instructions?: string;
  description: string;
};

type IconName =
  | "grid"
  | "calendar"
  | "compass"
  | "bell"
  | "user"
  | "help"
  | "logout"
  | "menu"
  | "chevron"
  | "arrow"
  | "close"
  | "mail"
  | "phone"
  | "clock"
  | "users"
  | "check"
  | "alert"
  | "pin"
  | "flag"
  | "edit"
  | "lock";

const initialAssignments: Assignment[] = [
  {
    id: "MTD-2026-00125",
    experience: "Old Town Heritage Tour",
    date: "21 November 2026",
    shortDate: "2026-11-21",
    time: "09:00 AM",
    visitors: 3,
    meetingPoint: "Fort Jesus Main Entrance",
    status: "Confirmed",
    image: "/images/old-town-street.jpg",
    duration: "2–3 hours",
    customer: "Amara Kamau",
    phone: "+254 712 345 678",
    instructions: "One guest has limited mobility. Please keep the walking pace relaxed.",
    description:
      "A guided walk through coral-stone lanes, carved doorways and the living history of Mombasa Old Town.",
  },
  {
    id: "MTD-2026-00128",
    experience: "Tudor Creek Dhow Ride",
    date: "21 November 2026",
    shortDate: "2026-11-21",
    time: "02:00 PM",
    visitors: 2,
    meetingPoint: "Tudor Creek Landing Site",
    status: "Upcoming",
    image: "/images/tudor-creek-dhow.jpg",
    duration: "1–2 hours",
    customer: "Daniel Wright",
    phone: "+44 7700 900 312",
    description: "A calm afternoon sail along Tudor Creek aboard a traditional wooden dhow.",
  },
  {
    id: "MTD-2026-00131",
    experience: "Fort Jesus Experience",
    date: "21 November 2026",
    shortDate: "2026-11-21",
    time: "05:00 PM",
    visitors: 4,
    meetingPoint: "Fort Jesus Ticket Office",
    status: "In Progress",
    image: "/images/fort-jesus.jpg",
    duration: "1–2 hours",
    customer: "Nia Okafor",
    phone: "+234 803 555 0198",
    instructions: "Guests requested additional context on Indian Ocean trade routes.",
    description:
      "An evening exploration of Fort Jesus and the layered maritime history of the coast.",
  },
  {
    id: "MTD-2026-00135",
    experience: "Old Town Heritage Tour",
    date: "23 November 2026",
    shortDate: "2026-11-23",
    time: "10:00 AM",
    visitors: 2,
    meetingPoint: "Old Port Entrance",
    status: "Awaiting Confirmation",
    image: "/images/old-town-street.jpg",
    duration: "2–3 hours",
    customer: "Sofia Martin",
    phone: "+33 6 12 34 56 78",
    description: "A private heritage walk through Old Town with a focus on Swahili architecture.",
  },
  {
    id: "MTD-2026-00118",
    experience: "Fort Jesus Experience",
    date: "18 November 2026",
    shortDate: "2026-11-18",
    time: "11:00 AM",
    visitors: 3,
    meetingPoint: "Fort Jesus Main Entrance",
    status: "Completed",
    image: "/images/fort-jesus.jpg",
    duration: "1–2 hours",
    customer: "Elias Njoroge",
    phone: "+254 722 330 104",
    description: "A guided visit exploring the fort, museum collections and harbour outlook.",
  },
  {
    id: "MTD-2026-00116",
    experience: "Tudor Creek Dhow Ride",
    date: "17 November 2026",
    shortDate: "2026-11-17",
    time: "03:30 PM",
    visitors: 2,
    meetingPoint: "Tudor Creek Landing Site",
    status: "Cancelled",
    image: "/images/dhow-sail.jpg",
    duration: "1–2 hours",
    customer: "Priya Shah",
    phone: "+91 98765 43210",
    instructions: "Cancelled by customer due to travel disruption.",
    description: "A traditional dhow journey through the sheltered waters of Tudor Creek.",
  },
];

const initialNotifications = [
  {
    id: 1,
    title: "New Old Town assignment",
    message: "You have been assigned booking MTD-2026-00125 for 09:00 AM today.",
    time: "18 minutes ago",
    read: false,
    tone: "assignment",
  },
  {
    id: 2,
    title: "Tudor Creek assignment updated",
    message: "The meeting point for booking MTD-2026-00128 has been confirmed.",
    time: "Yesterday, 5:42 PM",
    read: false,
    tone: "update",
  },
  {
    id: 3,
    title: "Tomorrow’s booking cancelled",
    message: "Booking MTD-2026-00116 was cancelled by the customer. No action is required.",
    time: "17 November 2026",
    read: true,
    tone: "cancelled",
  },
  {
    id: 4,
    title: "Availability received",
    message: "Your November availability submission has been received by operations.",
    time: "15 November 2026",
    read: true,
    tone: "availability",
  },
];

const viewNames: Record<View, string> = {
  dashboard: "Guide Dashboard",
  assignments: "My Assignments",
  availability: "Availability",
  notifications: "Notifications",
  profile: "My Profile",
  support: "Help & Support",
  "assignment-detail": "Assignment Details",
  "signed-out": "Signed Out",
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="1" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.6-4.2 3.3-6 8-6s7.4 1.8 8 6" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.7 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.2.9-1.2 1.7M12 17h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    phone: (
      <path d="M6.6 3h3l1.5 5-2 1.4a15 15 0 0 0 5.5 5.5l1.4-2 5 1.5v3c0 2-1.6 3.6-3.6 3.4C9.6 20.1 3.9 14.4 3.2 7.6 3 5.6 4.6 3 6.6 3Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="9" r="3" />
        <circle cx="17" cy="10" r="2" />
        <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M15 15c3 0 4.5 1.5 5 4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
      <>
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    flag: <path d="M5 21V4m0 1h11l-2 4 2 4H5" />,
    edit: (
      <>
        <path d="m14 5 5 5M4 20l3.5-.8L19 7.7 16.3 5 4.8 16.5 4 20Z" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="1" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Brand() {
  return (
    <div className="portal-brand">
      <span className="portal-brand-mark">
        <img src="/assets/logo.png" alt="" />
      </span>
      <span>
        <strong>Mombasa Connect</strong>
        <small>Guide operations</small>
      </span>
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  icon,
  type = "button",
  onClick,
  full = false,
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "danger";
  icon?: IconName;
  type?: "button" | "submit";
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className={`portal-button ${variant} ${full ? "full" : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon && <Icon name={icon} size={17} />}
    </button>
  );
}

function StatusBadge({
  status,
}: {
  status: AssignmentStatus | "Available" | "Unavailable" | "Assigned" | "Approved";
}) {
  return (
    <span className={`status status-${status.toLowerCase().replace(/ /g, "-")}`}>{status}</span>
  );
}

function Sidebar({
  view,
  open,
  unread,
  onNavigate,
  onClose,
}: {
  view: View;
  open: boolean;
  unread: number;
  onNavigate: (view: View) => void;
  onClose: () => void;
}) {
  const links: { view: View; label: string; icon: IconName }[] = [
    { view: "dashboard", label: "Dashboard", icon: "grid" },
    { view: "assignments", label: "My Assignments", icon: "calendar" },
    { view: "availability", label: "Availability", icon: "clock" },
    { view: "notifications", label: "Notifications", icon: "bell" },
    { view: "profile", label: "My Profile", icon: "user" },
  ];
  const go = (next: View) => {
    onNavigate(next);
    onClose();
  };
  return (
    <>
      <div className={open ? "drawer-scrim visible" : "drawer-scrim"} onClick={onClose} />
      <aside className={open ? "portal-sidebar open" : "portal-sidebar"}>
        <div className="sidebar-top">
          <Brand />
          <button className="drawer-close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <div className="guide-identity">
          <span className="avatar guide-avatar">AB</span>
          <div>
            <b>Ali Bakari</b>
            <small>Approved local guide</small>
          </div>
          <span className="guide-online" aria-label="Online" />
        </div>
        <nav className="portal-nav" aria-label="Guide portal">
          <p className="nav-label">Operations</p>
          {links.map((link) => (
            <button
              key={link.view}
              className={
                view === link.view || (view === "assignment-detail" && link.view === "assignments")
                  ? "active"
                  : ""
              }
              onClick={() => go(link.view)}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
              {link.view === "notifications" && unread > 0 && <small>{unread}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-lower">
          <button className={view === "support" ? "active" : ""} onClick={() => go("support")}>
            <Icon name="help" />
            <span>Help & Support</span>
          </button>
          <button onClick={() => go("signed-out")}>
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
        <div className="sidebar-note">
          <span>Operations desk</span>
          <p>Assignment help is available daily, 06:30–20:00 EAT.</p>
          <button onClick={() => go("support")}>Contact operations</button>
        </div>
      </aside>
    </>
  );
}

function TopHeader({
  view,
  unread,
  menuOpen,
  onMenu,
  onNavigate,
  onLogout,
}: {
  view: View;
  unread: number;
  menuOpen: boolean;
  onMenu: () => void;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="portal-header">
      <div className="mobile-brand">
        <Brand />
      </div>
      <button
        className="mobile-menu"
        onClick={onMenu}
        aria-expanded={menuOpen}
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>
      <div className="page-identity">
        <span>Saturday, 21 November 2026</span>
        <h1>{viewNames[view]}</h1>
      </div>
      <div className="header-actions">
        <ThemeToggle />
        <button
          className="notification-button"
          onClick={() => onNavigate("notifications")}
          aria-label={`${unread} unread notifications`}
        >
          <Icon name="bell" />
          {unread > 0 && <span>{unread}</span>}
        </button>
        <div className="profile-control">
          <button
            className="profile-trigger"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
          >
            <span className="avatar">AB</span>
            <span className="profile-name">
              <b>Ali Bakari</b>
              <small>Local guide</small>
            </span>
            <Icon name="chevron" size={15} />
          </button>
          {open && (
            <div className="profile-menu">
              <div>
                <span className="avatar large">AB</span>
                <p>
                  <b>Ali Bakari</b>
                  <small>Guide ID · MTD-G-0117</small>
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigate("profile");
                  setOpen(false);
                }}
              >
                <Icon name="user" size={17} />
                Manage profile
              </button>
              <button
                onClick={() => {
                  onNavigate("availability");
                  setOpen(false);
                }}
              >
                <Icon name="clock" size={17} />
                Update availability
              </button>
              <button onClick={onLogout}>
                <Icon name="logout" size={17} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SectionIntro({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-intro">
      <div>
        {eyebrow && <p className="portal-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  );
}

function ScheduleItem({
  assignment,
  index,
  onView,
}: {
  assignment: Assignment;
  index: number;
  onView: (assignment: Assignment) => void;
}) {
  return (
    <article
      className={`schedule-item schedule-${assignment.status.toLowerCase().replace(/ /g, "-")}`}
    >
      <div className="schedule-time">
        <strong>{assignment.time.split(" ")[0]}</strong>
        <span>{assignment.time.split(" ")[1]}</span>
      </div>
      <div className="timeline-node">
        <span>{index + 1}</span>
      </div>
      <div className="schedule-content">
        <div className="schedule-top">
          <div>
            <h3>{assignment.experience}</h3>
            <p>{assignment.id}</p>
          </div>
          <StatusBadge status={assignment.status} />
        </div>
        <div className="schedule-facts">
          <span>
            <Icon name="users" size={17} />
            {assignment.visitors} visitors
          </span>
          <span>
            <Icon name="pin" size={17} />
            {assignment.meetingPoint}
          </span>
        </div>
        <button onClick={() => onView(assignment)}>
          View assignment <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  );
}

function Dashboard({
  assignments,
  onNavigate,
  onView,
}: {
  assignments: Assignment[];
  onNavigate: (view: View) => void;
  onView: (assignment: Assignment) => void;
}) {
  const today = assignments.filter((assignment) => assignment.shortDate === "2026-11-21");
  return (
    <div className="page-content guide-dashboard">
      <section className="welcome-row guide-welcome">
        <div>
          <p className="portal-eyebrow">Your day · Saturday, 21 November</p>
          <h2>
            Good morning, <em>Ali.</em>
          </h2>
          <p>Here is your schedule and everything you need for today’s experiences.</p>
        </div>
        <Button onClick={() => onNavigate("availability")} icon="clock">
          Update availability
        </Button>
      </section>
      <section className="guide-summary" aria-label="Illustrative operational summary">
        <div>
          <strong>03</strong>
          <span>Today’s assignments</span>
          <small>Illustrative figure</small>
        </div>
        <div>
          <strong>05</strong>
          <span>Upcoming tours</span>
          <small>Next 14 days</small>
        </div>
        <div>
          <strong>12</strong>
          <span>Completed experiences</span>
          <small>This season</small>
        </div>
        <div>
          <strong>02</strong>
          <span>Pending updates</span>
          <small>Action requested</small>
        </div>
      </section>
      <section className="today-schedule">
        <SectionIntro
          eyebrow="Today’s tour schedule"
          title="Your day, in order."
          detail="Times shown in East Africa Time."
          action={
            <Button variant="text" icon="arrow" onClick={() => onNavigate("assignments")}>
              All assignments
            </Button>
          }
        />
        {today.length ? (
          <div className="schedule-list">
            {today.map((assignment, index) => (
              <ScheduleItem
                key={assignment.id}
                assignment={assignment}
                index={index}
                onView={onView}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="calendar"
            title="No tours assigned today."
            copy="Your schedule is clear. New assignments will appear here when operations confirms them."
          />
        )}
      </section>
      <section className="guide-briefing">
        <div className="briefing-photo">
          <img src="/images/tudor-creek-dhow.jpg" alt="" />
          <span>Tudor Creek · Field note</span>
        </div>
        <div>
          <p className="portal-eyebrow">Guide briefing</p>
          <h2>Prepare for the afternoon tide.</h2>
          <p>
            The Tudor Creek tide begins turning at 2:35 PM. Meet guests at the marked landing site
            15 minutes early and confirm life jackets before boarding.
          </p>
          <button onClick={() => onView(assignments[1])}>
            Open afternoon assignment <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function AssignmentRow({
  assignment,
  onView,
}: {
  assignment: Assignment;
  onView: (assignment: Assignment) => void;
}) {
  return (
    <article className="assignment-row">
      <div className="assignment-date">
        <strong>{assignment.date.split(" ")[0]}</strong>
        <span>NOV</span>
      </div>
      <div className="assignment-name">
        <h3>{assignment.experience}</h3>
        <span>{assignment.id}</span>
      </div>
      <div className="assignment-fact">
        <small>Start time</small>
        <b>{assignment.time}</b>
      </div>
      <div className="assignment-fact meeting">
        <small>Meeting point</small>
        <b>{assignment.meetingPoint}</b>
      </div>
      <div className="assignment-fact visitors">
        <small>Visitors</small>
        <b>{assignment.visitors}</b>
      </div>
      <StatusBadge status={assignment.status} />
      <button
        className="row-action"
        onClick={() => onView(assignment)}
        aria-label={`View ${assignment.experience}`}
      >
        <span>View details</span>
        <Icon name="arrow" size={18} />
      </button>
    </article>
  );
}

function AssignmentsPage({
  assignments,
  onView,
  onNavigate,
}: {
  assignments: Assignment[];
  onView: (assignment: Assignment) => void;
  onNavigate: (view: View) => void;
}) {
  const [filter, setFilter] = useState("All Assignments");
  const [date, setDate] = useState("");
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const filtered = empty
    ? []
    : assignments.filter((assignment) => {
        if (date && assignment.shortDate !== date) return false;
        if (filter === "All Assignments") return true;
        if (filter === "Today") return assignment.shortDate === "2026-11-21";
        return assignment.status === filter;
      });
  return (
    <div className="page-content">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Assigned to you</p>
          <h2>My assignments.</h2>
          <p>Only experiences assigned to your guide account are shown here.</p>
        </div>
        <div className="state-preview-actions">
          <Button variant="text" onClick={() => setEmpty((value) => !value)}>
            {empty ? "Restore data" : "Preview empty"}
          </Button>
          <Button variant="secondary" onClick={() => setError((value) => !value)}>
            {error ? "Dismiss error" : "Preview error"}
          </Button>
        </div>
      </section>
      <div className="assignment-controls">
        <div className="filter-tabs">
          {["All Assignments", "Upcoming", "Today", "In Progress", "Completed", "Cancelled"].map(
            (item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <label className="date-filter">
          <span>Tour date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>
      {error ? (
        <ErrorState onRetry={() => setError(false)} />
      ) : filtered.length ? (
        <div className="assignment-list">
          {filtered.map((assignment) => (
            <AssignmentRow key={assignment.id} assignment={assignment} onView={onView} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="calendar"
          title={filter === "Upcoming" ? "No upcoming tours." : "No tours assigned yet."}
          copy="Your upcoming assignments will appear here once the administrator schedules your experiences."
          action="Update availability"
          onAction={() => onNavigate("availability")}
        />
      )}
    </div>
  );
}

function AssignmentDetail({
  assignment,
  onBack,
  onUpdate,
  onReport,
}: {
  assignment: Assignment;
  onBack: () => void;
  onUpdate: (status: AssignmentStatus) => void;
  onReport: () => void;
}) {
  const cancelled = assignment.status === "Cancelled";
  const completed = assignment.status === "Completed";
  return (
    <div className="page-content assignment-detail-page">
      <button className="back-link" onClick={onBack}>
        <span>←</span> Back to assignments
      </button>
      {cancelled && (
        <div className="cancellation-banner">
          <Icon name="alert" />
          <div>
            <b>This assignment was cancelled.</b>
            <p>{assignment.instructions || "No operational action is required."}</p>
          </div>
        </div>
      )}
      <section className="assignment-hero">
        <div className="detail-photo">
          <img src={assignment.image} alt="" />
          <span>Mombasa · Assigned experience</span>
        </div>
        <div className="assignment-hero-copy">
          <div>
            <p className="portal-eyebrow">Assignment {assignment.id}</p>
            <h2>{assignment.experience}</h2>
            <p>{assignment.description}</p>
          </div>
          <StatusBadge status={assignment.status} />
          <div className="assignment-hero-facts">
            <span>
              <Icon name="calendar" />
              <small>Date</small>
              <b>{assignment.date}</b>
            </span>
            <span>
              <Icon name="clock" />
              <small>Start</small>
              <b>{assignment.time}</b>
            </span>
            <span>
              <Icon name="compass" />
              <small>Duration</small>
              <b>{assignment.duration}</b>
            </span>
          </div>
        </div>
      </section>
      <div className="assignment-detail-layout">
        <div className="assignment-detail-main">
          <section className="visitor-section">
            <div className="visitor-heading">
              <div>
                <p className="portal-eyebrow">Visitor information</p>
                <h3>Details needed for this tour.</h3>
              </div>
              <span>
                <Icon name="lock" size={16} />
                Private · Assignment only
              </span>
            </div>
            <div className="visitor-grid">
              <div>
                <small>Primary customer</small>
                <b>{assignment.customer}</b>
              </div>
              <div>
                <small>Visitor count</small>
                <b>{assignment.visitors} guests</b>
              </div>
              <div>
                <small>Contact number</small>
                <a href={`tel:${assignment.phone}`}>{assignment.phone}</a>
              </div>
              <div>
                <small>Meeting point</small>
                <b>{assignment.meetingPoint}</b>
              </div>
            </div>
            <div className="visitor-note">
              <Icon name="alert" />
              <span>
                <small>Special instructions</small>
                <p>{assignment.instructions || "No special visitor instructions were provided."}</p>
              </span>
            </div>
          </section>
          <section className="operations-note">
            <p className="portal-eyebrow">Operational reminder</p>
            <h3>Meet guests 15 minutes before the listed start time.</h3>
            <p>
              Confirm the primary customer’s booking reference before beginning. Only use visitor
              contact information for this assignment.
            </p>
          </section>
        </div>
        <aside className="assignment-actions">
          <h3>Assignment status</h3>
          <StatusBadge status={assignment.status} />
          <p>Update progress as the experience moves through the day.</p>
          <div className="status-flow">
            <span
              className={
                ["Confirmed", "Upcoming", "In Progress", "Completed"].includes(assignment.status)
                  ? "done"
                  : ""
              }
            >
              <i>1</i>Confirmed
            </span>
            <span
              className={["In Progress", "Completed"].includes(assignment.status) ? "done" : ""}
            >
              <i>2</i>Started
            </span>
            <span className={assignment.status === "Completed" ? "done" : ""}>
              <i>3</i>Completed
            </span>
          </div>
          <Button
            full
            icon="flag"
            disabled={
              cancelled ||
              completed ||
              assignment.status === "In Progress" ||
              assignment.status === "Awaiting Confirmation"
            }
            onClick={() => onUpdate("In Progress")}
          >
            Mark as started
          </Button>
          <Button
            full
            variant="secondary"
            icon="check"
            disabled={cancelled || completed || assignment.status !== "In Progress"}
            onClick={() => onUpdate("Completed")}
          >
            Mark as completed
          </Button>
          <Button full variant="text" icon="alert" disabled={cancelled} onClick={onReport}>
            Report an issue
          </Button>
          {cancelled && <small>Operational actions are disabled for cancelled assignments.</small>}
        </aside>
      </div>
    </div>
  );
}

const calendarDays = Array.from({ length: 35 }, (_, index) => {
  const day = index - 1;
  return day > 0 && day <= 30 ? day : null;
});

function AvailabilityPage() {
  const assigned = new Set([5, 12, 18, 21, 23, 28]);
  const [available, setAvailable] = useState(
    new Set([2, 3, 4, 6, 9, 10, 11, 13, 16, 17, 19, 20, 24, 25, 26, 27, 30]),
  );
  const [unavailable, setUnavailable] = useState(new Set([7, 14, 22, 29]));
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const setDay = (mode: "available" | "unavailable") => {
    if (!selected || assigned.has(selected)) return;
    if (mode === "available") {
      setAvailable((days) => new Set([...days, selected]));
      setUnavailable((days) => new Set([...days].filter((day) => day !== selected)));
    } else {
      setUnavailable((days) => new Set([...days, selected]));
      setAvailable((days) => new Set([...days].filter((day) => day !== selected)));
    }
  };
  return (
    <div className="page-content availability-page">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Planning with operations</p>
          <h2>Your availability.</h2>
          <p>
            Share when you can guide. Confirmed assignments remain locked and cannot be overridden.
          </p>
        </div>
        <div className="availability-page-actions">
          <Button
            variant="text"
            onClick={() => {
              setAvailable(new Set());
              setUnavailable(new Set());
              setSelected(null);
            }}
          >
            Preview no availability
          </Button>
          <Button onClick={() => setSaved(true)}>Submit availability changes</Button>
        </div>
      </section>
      {saved && (
        <div className="success-banner">
          <Icon name="check" />
          <span>
            <b>Availability updated.</b> Your November submission has been sent to operations.
          </span>
          <button onClick={() => setSaved(false)}>
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
      {available.size === 0 && unavailable.size === 0 && (
        <div className="availability-empty-note">
          <Icon name="calendar" />
          <span>
            <b>No availability submitted for November.</b>
            Select dates below so operations knows when you can accept assignments.
          </span>
        </div>
      )}
      <div className="availability-layout">
        <section className="calendar-panel">
          <div className="calendar-heading">
            <button disabled aria-label="Previous month unavailable in demonstration">
              ←
            </button>
            <div>
              <p className="portal-eyebrow">Monthly calendar</p>
              <h3>November 2026</h3>
            </div>
            <button disabled aria-label="Next month unavailable in demonstration">
              →
            </button>
          </div>
          <div className="calendar-legend">
            <span>
              <i className="available" />
              Available
            </span>
            <span>
              <i className="unavailable" />
              Unavailable
            </span>
            <span>
              <i className="assigned" />
              Assigned tour
            </span>
          </div>
          <div className="calendar-grid">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
              <b key={day}>{day}</b>
            ))}
            {calendarDays.map((day, index) => {
              const state =
                day && assigned.has(day)
                  ? "assigned"
                  : day && available.has(day)
                    ? "available"
                    : day && unavailable.has(day)
                      ? "unavailable"
                      : "";
              return (
                <button
                  key={`${day}-${index}`}
                  className={`${state} ${selected === day ? "selected" : ""}`}
                  disabled={!day}
                  onClick={() => day && setSelected(day)}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {assigned.has(day) && <small>Tour</small>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </section>
        <aside className="availability-editor">
          <p className="portal-eyebrow">Date selection</p>
          <h3>{selected ? `${selected} November 2026` : "Select a date"}</h3>
          {!selected ? (
            <p>Choose an unassigned date in the calendar to set your availability.</p>
          ) : assigned.has(selected) ? (
            <div className="locked-date">
              <Icon name="lock" />
              <b>Confirmed assignment</b>
              <p>This date is locked. Contact operations if your circumstances change.</p>
            </div>
          ) : (
            <>
              <p>Tell operations whether you can accept assignments on this date.</p>
              <div className="availability-options">
                <button
                  className={available.has(selected) ? "active" : ""}
                  onClick={() => setDay("available")}
                >
                  <Icon name="check" />
                  Available
                </button>
                <button
                  className={unavailable.has(selected) ? "active unavailable" : ""}
                  onClick={() => setDay("unavailable")}
                >
                  <Icon name="close" />
                  Unavailable
                </button>
              </div>
            </>
          )}
          <div className="availability-rule">
            <Icon name="help" />
            <p>
              Availability helps administrators plan assignments. It does not change tour capacity
              or guarantee an assignment.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NotificationsPage({
  notifications,
  onMark,
  onMarkAll,
  onClear,
}: {
  notifications: typeof initialNotifications;
  onMark: (id: number) => void;
  onMarkAll: () => void;
  onClear: () => void;
}) {
  return (
    <div className="page-content narrow-page">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Operations updates</p>
          <h2>Notifications.</h2>
          <p>Assignment changes, cancellations and availability confirmations.</p>
        </div>
        <div className="notification-actions">
          <Button variant="text" onClick={onMarkAll}>
            Mark all read
          </Button>
          <Button variant="secondary" onClick={onClear}>
            Clear all
          </Button>
        </div>
      </section>
      {notifications.length ? (
        <div className="notification-list">
          {notifications.map((notification) => (
            <article
              className={notification.read ? "notification-item" : "notification-item unread"}
              key={notification.id}
            >
              <span className="notification-mark">
                <Icon
                  name={
                    notification.tone === "cancelled"
                      ? "alert"
                      : notification.tone === "availability"
                        ? "check"
                        : "bell"
                  }
                  size={18}
                />
              </span>
              <div>
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <small>{notification.time}</small>
              </div>
              {!notification.read && (
                <button onClick={() => onMark(notification.id)}>Mark as read</button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bell"
          title="No new operations updates."
          copy="Assignment changes and availability confirmations will appear here."
        />
      )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className={error ? "portal-field has-error" : "portal-field"}>
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} aria-invalid={Boolean(error)} />
      {error && (
        <small>
          <Icon name="alert" size={14} />
          {error}
        </small>
      )}
    </label>
  );
}

function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const next: Record<string, string> = {};
    if (!email.includes("@")) next.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Enter a complete phone number.";
    setErrors(next);
    setSaved(Object.keys(next).length === 0);
  };
  return (
    <div className="page-content profile-page">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Professional account</p>
          <h2>Your guide profile.</h2>
          <p>Keep operational contact details and professional information current.</p>
        </div>
      </section>
      {saved && (
        <div className="success-banner">
          <Icon name="check" />
          <span>
            <b>Profile saved.</b> Your professional information is up to date.
          </span>
          <button onClick={() => setSaved(false)}>
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
      <div className="profile-layout guide-profile-layout">
        <aside className="profile-summary">
          <span className="avatar profile-avatar">AB</span>
          <h3>Ali Bakari</h3>
          <p>Heritage guide & dhow captain</p>
          <StatusBadge status="Approved" />
          <dl>
            <div>
              <dt>Guide ID</dt>
              <dd>MTD-G-0117</dd>
            </div>
            <div>
              <dt>Account role</dt>
              <dd>Local Guide</dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>March 2024</dd>
            </div>
          </dl>
          <div className="approval-note">
            <Icon name="lock" />
            <p>Approval status and account role are managed by the administrator.</p>
          </div>
        </aside>
        <div className="profile-forms">
          <form className="settings-form" onSubmit={submit} noValidate>
            <div className="form-heading">
              <h3>Professional information</h3>
              <p>Visible to operations and assigned customers where appropriate.</p>
            </div>
            <div className="field-grid">
              <Field label="Full name" name="name" defaultValue="Ali Bakari" />
              <Field
                label="Email address"
                name="email"
                type="email"
                defaultValue="ali.bakari@mombasadirect.ke"
                error={errors.email}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                defaultValue="+254 722 471 125"
                error={errors.phone}
              />
              <Field
                label="Languages spoken"
                name="languages"
                defaultValue="Kiswahili, English, Arabic"
              />
              <Field
                label="Areas of experience"
                name="areas"
                defaultValue="Old Town, Tudor Creek, Fort Jesus"
              />
            </div>
            <label className="portal-field biography">
              <span>Short biography</span>
              <textarea defaultValue="Mombasa-born heritage guide and dhow captain with over eight years of experience sharing the coast’s maritime and Swahili history." />
            </label>
            <div className="form-actions">
              <Button type="submit">Save profile changes</Button>
            </div>
          </form>
          <form
            className="settings-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
          >
            <div className="form-heading">
              <h3>Password & security</h3>
              <p>Update the password used to access your guide portal.</p>
            </div>
            <div className="field-grid">
              <Field label="Current password" name="current" type="password" />
              <Field label="New password" name="new" type="password" />
            </div>
            <div className="form-actions">
              <Button variant="secondary" type="submit">
                Update password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SupportPage({ onReport }: { onReport: () => void }) {
  const faqs = [
    [
      "What should I do if a guest is late?",
      "Wait 15 minutes at the confirmed meeting point, then call the listed customer number. Contact operations if you cannot reach the guest.",
    ],
    [
      "How do I report that I cannot conduct a tour?",
      "Contact operations immediately. Guides cannot cancel or reassign confirmed experiences themselves.",
    ],
    [
      "A customer has requested a route change. What do I do?",
      "Keep the approved itinerary unless the change is safe, within the assigned duration and confirmed by operations.",
    ],
    [
      "When should I mark an assignment complete?",
      "Mark it complete once all guests have safely finished the experience and any operational notes have been shared.",
    ],
  ];
  return (
    <div className="page-content support-page">
      <section className="support-hero">
        <div>
          <p className="portal-eyebrow">Guide operations support</p>
          <h2>
            Help for the day <em>in front of you.</em>
          </h2>
          <p>
            Speak with the Mombasa operations team about assignments, cancellations or guest
            concerns.
          </p>
        </div>
        <div className="support-contact">
          <span>
            <Icon name="phone" />
            <div>
              <small>Operations line</small>
              <a href="tel:+254700123456">+254 700 123 456</a>
            </div>
          </span>
          <span>
            <Icon name="mail" />
            <div>
              <small>Email</small>
              <a href="mailto:guides@mombasadirect.ke">guides@mombasadirect.ke</a>
            </div>
          </span>
          <p>Available daily · 06:30–20:00 EAT</p>
        </div>
      </section>
      <section className="support-content">
        <div className="faq-list">
          <SectionIntro eyebrow="Guide questions" title="Operational guidance." />
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <aside className="support-card">
          <span className="support-icon">
            <Icon name="alert" />
          </span>
          <p className="portal-eyebrow">Assignment assistance</p>
          <h3>Report an issue.</h3>
          <p>
            Share an assignment reference and a concise description. Operations will follow up
            directly.
          </p>
          <Button full icon="arrow" onClick={onReport}>
            Report to operations
          </Button>
          <small>Urgent safety concerns should be reported by phone.</small>
        </aside>
      </section>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  copy,
  action,
  onAction,
}: {
  icon: IconName;
  title: string;
  copy: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty-state">
      <span>
        <Icon name={icon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>{copy}</p>
      {action && (
        <Button icon="arrow" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="empty-state error-state">
      <span>
        <Icon name="alert" size={28} />
      </span>
      <h3>We couldn’t load your assignments.</h3>
      <p>Check your connection and try again. If this continues, contact the operations desk.</p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="page-content loading-state" aria-label="Loading schedule">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-feature" />
      <div className="skeleton-row">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      <span>Loading today’s schedule…</span>
    </div>
  );
}

function ActionModal({
  type,
  assignment,
  targetStatus,
  onClose,
  onConfirm,
}: {
  type: "status" | "report";
  assignment: Assignment;
  targetStatus: AssignmentStatus | null;
  onClose: () => void;
  onConfirm: (note?: string) => void;
}) {
  const [note, setNote] = useState("");
  const completing = targetStatus === "Completed";
  return (
    <div className="modal-scrim" onMouseDown={onClose}>
      <section
        className="portal-modal action-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        <div className="action-modal-content">
          <span className={type === "report" ? "action-modal-icon warning" : "action-modal-icon"}>
            <Icon name={type === "report" ? "alert" : "check"} size={28} />
          </span>
          <p className="portal-eyebrow">
            {type === "report" ? "Operations report" : "Confirm status update"}
          </p>
          <h2 id="action-title">
            {type === "report"
              ? "Report an assignment issue."
              : completing
                ? "Mark this tour completed?"
                : "Start this experience?"}
          </h2>
          <p>
            {type === "report"
              ? `Operations will receive your note with assignment ${assignment.id}.`
              : `This updates ${assignment.id} for operations and the assigned customer.`}
          </p>
          {type === "report" && (
            <label className="portal-field report-field">
              <span>What happened?</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Describe the issue and any action already taken."
              />
            </label>
          )}
          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={type === "report" ? "danger" : "primary"}
              onClick={() => onConfirm(note)}
              disabled={type === "report" && note.trim().length < 8}
            >
              {type === "report" ? "Send report" : "Confirm update"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SignedOut({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="signed-out-page">
      <div className="signed-out-photo">
        <img src="/images/old-town-street.jpg" alt="" />
        <span>Old Town · Mombasa</span>
      </div>
      <div className="signed-out-panel">
        <Brand />
        <p className="portal-eyebrow">Guide session complete</p>
        <h1>
          Your next assignment <em>starts here.</em>
        </h1>
        <p>
          You have signed out of the guide portal. Your schedule remains protected and ready when
          you return.
        </p>
        <Button full onClick={onSignIn}>
          Sign back in
        </Button>
        <small>Need help? guides@mombasadirect.ke</small>
      </div>
    </div>
  );
}

export default function GuidePortal() {
  const [view, setView] = useState<View>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selected, setSelected] = useState<Assignment>(initialAssignments[0]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [modal, setModal] = useState<"status" | "report" | null>(null);
  const [pendingStatus, setPendingStatus] = useState<AssignmentStatus | null>(null);
  const unread = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const navigate = (next: View) => {
    if (next === view) return;
    if (next === "signed-out") {
      window.location.assign("/home");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setView(next);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 240);
  };

  const viewAssignment = (assignment: Assignment) => {
    setSelected(assignment);
    navigate("assignment-detail");
  };

  const requestStatus = (status: AssignmentStatus) => {
    setPendingStatus(status);
    setModal("status");
  };

  const confirmAction = (note?: string) => {
    if (modal === "status") {
      const updated = { ...selected, status: pendingStatus || selected.status };
      setSelected(updated);
      setAssignments((items) => items.map((item) => (item.id === selected.id ? updated : item)));
    } else if (note) {
      setNotifications((items) => [
        {
          id: Date.now(),
          title: "Issue report submitted",
          message: `Operations received your report for ${selected.id}.`,
          time: "Just now",
          read: false,
          tone: "update",
        },
        ...items,
      ]);
    }
    setPendingStatus(null);
    setModal(null);
  };

  const content = useMemo(() => {
    if (loading) return <LoadingState />;
    switch (view) {
      case "dashboard":
        return (
          <Dashboard assignments={assignments} onNavigate={navigate} onView={viewAssignment} />
        );
      case "assignments":
        return (
          <AssignmentsPage
            assignments={assignments}
            onView={viewAssignment}
            onNavigate={navigate}
          />
        );
      case "assignment-detail":
        return (
          <AssignmentDetail
            assignment={selected}
            onBack={() => navigate("assignments")}
            onUpdate={requestStatus}
            onReport={() => setModal("report")}
          />
        );
      case "availability":
        return <AvailabilityPage />;
      case "notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            onMark={(id) =>
              setNotifications((items) =>
                items.map((item) => (item.id === id ? { ...item, read: true } : item)),
              )
            }
            onMarkAll={() =>
              setNotifications((items) => items.map((item) => ({ ...item, read: true })))
            }
            onClear={() => setNotifications([])}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "support":
        return <SupportPage onReport={() => setModal("report")} />;
      default:
        return null;
    }
  }, [loading, view, assignments, selected, notifications]);

  if (view === "signed-out") return <SignedOut onSignIn={() => navigate("dashboard")} />;

  return (
    <div className="portal-app guide-portal">
      <Sidebar
        view={view}
        open={drawerOpen}
        unread={unread}
        onNavigate={navigate}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="portal-shell">
        <TopHeader
          view={view}
          unread={unread}
          menuOpen={drawerOpen}
          onMenu={() => setDrawerOpen(true)}
          onNavigate={navigate}
          onLogout={() => navigate("signed-out")}
        />
        <main>{content}</main>
      </div>
      {modal && (
        <ActionModal
          type={modal}
          assignment={selected}
          targetStatus={pendingStatus}
          onClose={() => {
            setPendingStatus(null);
            setModal(null);
          }}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
}
