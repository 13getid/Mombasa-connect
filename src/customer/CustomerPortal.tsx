import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../shared/theme/theme";
import './portal.css'

type View =
  | "dashboard"
  | "bookings"
  | "explore"
  | "notifications"
  | "profile"
  | "support"
  | "booking-detail"
  | "signed-out";

type Status = "Confirmed" | "Pending" | "Completed" | "Cancelled";

type Booking = {
  id: string;
  experience: string;
  date: string;
  time: string;
  visitors: number;
  total: number;
  status: Status;
  payment: "Paid" | "Pending" | "Refunded";
  image: string;
  channel: "Website" | "USSD";
  guide?: string;
};

type Experience = {
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  location: string;
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
  | "home";

const bookings: Booking[] = [
  {
    id: "MTD-2026-00125",
    experience: "Tudor Creek Dhow Ride",
    date: "21 November 2026",
    time: "3:00 PM",
    visitors: 2,
    total: 5000,
    status: "Confirmed",
    payment: "Paid",
    image: "/images/tudor-creek-dhow.jpg",
    channel: "Website",
    guide: "Captain Ali Bakari",
  },
  {
    id: "MTD-2026-00123",
    experience: "Fort Jesus Experience",
    date: "28 November 2026",
    time: "10:00 AM",
    visitors: 2,
    total: 2400,
    status: "Pending",
    payment: "Pending",
    image: "/images/fort-jesus.jpg",
    channel: "USSD",
  },
  {
    id: "MTD-2026-00120",
    experience: "Old Town Heritage Tour",
    date: "15 November 2026",
    time: "9:00 AM",
    visitors: 2,
    total: 3000,
    status: "Completed",
    payment: "Paid",
    image: "/images/old-town-street.jpg",
    channel: "Website",
    guide: "Amina Salim",
  },
  {
    id: "MTD-2026-00118",
    experience: "Fort Jesus Experience",
    date: "10 November 2026",
    time: "2:00 PM",
    visitors: 2,
    total: 2400,
    status: "Completed",
    payment: "Paid",
    image: "/images/fort-jesus.jpg",
    channel: "Website",
    guide: "Hassan Mwidani",
  },
  {
    id: "MTD-2026-00112",
    experience: "Tudor Creek Dhow Ride",
    date: "2 November 2026",
    time: "4:00 PM",
    visitors: 1,
    total: 2500,
    status: "Cancelled",
    payment: "Refunded",
    image: "/images/dhow-sail.jpg",
    channel: "USSD",
  },
];

const experiences: Experience[] = [
  {
    name: "Old Town Heritage Tour",
    description: "Carved doors, coral-stone lanes and stories shared by an Old Town resident.",
    duration: "2–3 hours",
    price: 1500,
    image: "/images/old-town-street.jpg",
    location: "Old Town",
  },
  {
    name: "Tudor Creek Dhow Ride",
    description: "Sail the tidal creek aboard a traditional wooden dhow at golden hour.",
    duration: "1–2 hours",
    price: 2500,
    image: "/images/dhow-sail.jpg",
    location: "Tudor Creek",
  },
  {
    name: "Fort Jesus Experience",
    description: "Explore four centuries of coastal history with a licensed heritage guide.",
    duration: "1–2 hours",
    price: 1200,
    image: "/images/fort-jesus.jpg",
    location: "Fort Jesus",
  },
];

const initialNotifications = [
  {
    id: 1,
    message: "Your Tudor Creek Dhow Ride booking has been confirmed.",
    detail: "Booking MTD-2026-00125 is ready. Your guide details are now available.",
    time: "12 minutes ago",
    read: false,
  },
  {
    id: 2,
    message: "Your Fort Jesus booking request has been received.",
    detail: "We are confirming guide availability and will update you shortly.",
    time: "Yesterday, 4:18 PM",
    read: false,
  },
  {
    id: 3,
    message: "Your Old Town Heritage Tour has been completed.",
    detail: "Asante for exploring Mombasa with a local guide.",
    time: "15 November 2026",
    read: true,
  },
];

const viewNames: Record<View, string> = {
  dashboard: "Dashboard",
  bookings: "My Bookings",
  explore: "Explore Experiences",
  notifications: "Notifications",
  profile: "My Profile",
  support: "Help & Support",
  "booking-detail": "Booking Details",
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
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10M9 21v-7h6v7" />
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
        <small>Customer portal</small>
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
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "danger";
  icon?: IconName;
  type?: "button" | "submit";
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      className={`portal-button ${variant} ${full ? "full" : ""}`}
      type={type}
      onClick={onClick}
    >
      {children}
      {icon && <Icon name={icon} size={17} />}
    </button>
  );
}

function StatusBadge({ status }: { status: Status | Booking["payment"] }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status}</span>;
}

function Sidebar({
  view,
  unread,
  open,
  onNavigate,
  onClose,
}: {
  view: View;
  unread: number;
  open: boolean;
  onNavigate: (view: View) => void;
  onClose: () => void;
}) {
  const primary: { view: View; label: string; icon: IconName }[] = [
    { view: "dashboard", label: "Dashboard", icon: "grid" },
    { view: "bookings", label: "My Bookings", icon: "calendar" },
    { view: "explore", label: "Explore Experiences", icon: "compass" },
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
        <nav className="portal-nav" aria-label="Customer portal">
          <p className="nav-label">Your journey</p>
          {primary.map((item) => (
            <button
              key={item.view}
              className={
                view === item.view || (view === "booking-detail" && item.view === "bookings")
                  ? "active"
                  : ""
              }
              onClick={() => go(item.view)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.view === "notifications" && unread > 0 && <small>{unread}</small>}
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
          <span>Need help?</span>
          <p>Our Mombasa team is available daily, 07:00–19:00 EAT.</p>
          <button onClick={() => go("support")}>Contact local support</button>
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
  const [profileOpen, setProfileOpen] = useState(false);
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
        <span>Customer portal</span>
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
            onClick={() => setProfileOpen((current) => !current)}
            aria-expanded={profileOpen}
          >
            <span className="avatar">AK</span>
            <span className="profile-name">
              <b>Amara Kamau</b>
              <small>Customer</small>
            </span>
            <Icon name="chevron" size={15} />
          </button>
          {profileOpen && (
            <div className="profile-menu">
              <div>
                <span className="avatar large">AK</span>
                <p>
                  <b>Amara Kamau</b>
                  <small>amara.kamau@example.com</small>
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigate("profile");
                  setProfileOpen(false);
                }}
              >
                <Icon name="user" size={17} />
                Manage profile
              </button>
              <button
                onClick={() => {
                  onNavigate("notifications");
                  setProfileOpen(false);
                }}
              >
                <Icon name="bell" size={17} />
                Notifications
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

function BookingRow({ booking, onView }: { booking: Booking; onView: (booking: Booking) => void }) {
  return (
    <article className="booking-row">
      <img src={booking.image} alt="" />
      <div className="booking-row-name">
        <h3>{booking.experience}</h3>
        <span>{booking.id}</span>
      </div>
      <div className="booking-row-fact">
        <small>Date</small>
        <span>{booking.date}</span>
      </div>
      <div className="booking-row-fact">
        <small>Amount</small>
        <span>KES {booking.total.toLocaleString()}</span>
      </div>
      <StatusBadge status={booking.status} />
      <button
        className="row-action"
        onClick={() => onView(booking)}
        aria-label={`View ${booking.experience} details`}
      >
        <span>View details</span>
        <Icon name="arrow" size={18} />
      </button>
    </article>
  );
}

function ExperienceCard({
  experience,
  onExplore,
}: {
  experience: Experience;
  onExplore: (experience: Experience) => void;
}) {
  return (
    <article className="portal-experience">
      <div className="portal-experience-image">
        <img src={experience.image} alt="" />
        <span>{experience.location}</span>
      </div>
      <div className="portal-experience-copy">
        <h3>{experience.name}</h3>
        <p>{experience.description}</p>
        <div>
          <span>{experience.duration}</span>
          <strong>From KES {experience.price.toLocaleString()}</strong>
        </div>
        <button onClick={() => onExplore(experience)}>
          Explore experience <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  );
}

function UpcomingExperience({
  booking,
  onView,
}: {
  booking: Booking;
  onView: (booking: Booking) => void;
}) {
  return (
    <section className="upcoming-feature">
      <div className="upcoming-photo">
        <img src={booking.image} alt="A traditional dhow sailing on Tudor Creek" />
        <div className="photo-caption">
          <span>Tudor Creek · Mombasa</span>
          <small>Next departure</small>
        </div>
      </div>
      <div className="upcoming-content">
        <div className="upcoming-heading">
          <div>
            <p className="portal-eyebrow">Your next experience</p>
            <h2>{booking.experience}</h2>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <p className="booking-reference">
          Booking reference <b>{booking.id}</b>
        </p>
        <div className="upcoming-facts">
          <div>
            <Icon name="calendar" />
            <span>
              <small>Date</small>
              <b>{booking.date}</b>
            </span>
          </div>
          <div>
            <Icon name="clock" />
            <span>
              <small>Time</small>
              <b>{booking.time}</b>
            </span>
          </div>
          <div>
            <Icon name="users" />
            <span>
              <small>Visitors</small>
              <b>{booking.visitors} guests</b>
            </span>
          </div>
        </div>
        <div className="upcoming-footer">
          <span>
            <small>Total paid</small>
            <strong>KES {booking.total.toLocaleString()}</strong>
          </span>
          <Button onClick={() => onView(booking)} icon="arrow">
            View booking details
          </Button>
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  onNavigate,
  onViewBooking,
}: {
  onNavigate: (view: View) => void;
  onViewBooking: (booking: Booking) => void;
}) {
  return (
    <div className="page-content dashboard-page">
      <section className="welcome-row">
        <div>
          <p className="portal-eyebrow">Saturday, 21 November 2026</p>
          <h2>
            Welcome back, <em>Amara.</em>
          </h2>
          <p>Your next Mombasa experience is just around the corner.</p>
        </div>
        <Button onClick={() => onNavigate("explore")} icon="compass">
          Explore experiences
        </Button>
      </section>
      <UpcomingExperience booking={bookings[0]} onView={onViewBooking} />
      <section className="overview-section">
        <div className="overview-label">
          <p className="portal-eyebrow">Booking overview</p>
          <small>Demonstration data · 2026</small>
        </div>
        <div className="overview-items">
          <div>
            <strong>02</strong>
            <span>Upcoming bookings</span>
            <small>One confirmed</small>
          </div>
          <div>
            <strong>01</strong>
            <span>Pending bookings</span>
            <small>Awaiting guide</small>
          </div>
          <div>
            <strong>02</strong>
            <span>Completed experiences</span>
            <small>This month</small>
          </div>
        </div>
      </section>
      <section className="dashboard-section">
        <SectionIntro
          eyebrow="Recent journeys"
          title="Your booking history."
          action={
            <Button variant="text" icon="arrow" onClick={() => onNavigate("bookings")}>
              View all bookings
            </Button>
          }
        />
        <div className="booking-list compact-list">
          {bookings.slice(2, 4).map((booking) => (
            <BookingRow key={booking.id} booking={booking} onView={onViewBooking} />
          ))}
        </div>
      </section>
      <section className="dashboard-section discover-section">
        <SectionIntro
          eyebrow="Continue exploring"
          title="More of Mombasa Awaits."
          detail="Locally guided experiences, reserved directly."
        />
        <div className="experience-grid">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.name}
              experience={experience}
              onExplore={() => onNavigate("explore")}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function BookingsPage({
  onViewBooking,
  onExplore,
}: {
  onViewBooking: (booking: Booking) => void;
  onExplore: () => void;
}) {
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [previewEmpty, setPreviewEmpty] = useState(false);
  const filtered = previewEmpty
    ? []
    : bookings.filter((booking) => filter === "All" || booking.status === filter);
  return (
    <div className="page-content">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Your journeys</p>
          <h2>Bookings, past and present.</h2>
          <p>Review trip details, payment status and meeting information.</p>
        </div>
        <Button variant="secondary" onClick={() => setPreviewEmpty((current) => !current)}>
          {previewEmpty ? "Restore demo bookings" : "Preview empty state"}
        </Button>
      </section>
      <div className="filter-tabs" role="tablist" aria-label="Booking status">
        {(["All", "Confirmed", "Pending", "Completed", "Cancelled"] as const).map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
            <span>
              {item === "All"
                ? bookings.length
                : bookings.filter((booking) => booking.status === item).length}
            </span>
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="booking-list all-bookings">
          {filtered.map((booking) => (
            <BookingRow key={booking.id} booking={booking} onView={onViewBooking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="calendar"
          title="No bookings here yet."
          copy={
            previewEmpty
              ? "When you reserve a Mombasa experience, its details will appear here."
              : `You have no ${filter.toLowerCase()} bookings.`
          }
          action="Explore experiences"
          onAction={onExplore}
        />
      )}
    </div>
  );
}

function ExplorePage({ onBook }: { onBook: (experience: Experience) => void }) {
  return (
    <div className="page-content">
      <section className="explore-hero">
        <div>
          <p className="portal-eyebrow">Coastal field notes · Volume I</p>
          <h2>
            See Mombasa through <em>local eyes.</em>
          </h2>
          <p>
            Unhurried encounters led by the people who know the coast, its stories and its tides.
          </p>
        </div>
        <div className="explore-hero-photo">
          <img src="/images/tudor-creek-dhow.jpg" alt="" />
          <span>Curated in Mombasa</span>
        </div>
      </section>
      <section className="explore-list">
        {experiences.map((experience, index) => (
          <article className="explore-feature" key={experience.name}>
            <div className="explore-number">0{index + 1}</div>
            <img src={experience.image} alt="" />
            <div>
              <p className="portal-eyebrow">
                {experience.location} · {experience.duration}
              </p>
              <h3>{experience.name}</h3>
              <p>{experience.description}</p>
              <div className="explore-price">
                <span>Per guest</span>
                <b>KES {experience.price.toLocaleString()}</b>
              </div>
              <Button icon="arrow" onClick={() => onBook(experience)}>
                Explore experience
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function NotificationsPage({
  notifications,
  onMarkAll,
  onMark,
  onClear,
}: {
  notifications: typeof initialNotifications;
  onMarkAll: () => void;
  onMark: (id: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="page-content narrow-page">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Trip updates</p>
          <h2>Notifications.</h2>
          <p>Confirmation, payment and guide updates from our Mombasa team.</p>
        </div>
        <div className="notification-actions">
          <Button variant="text" onClick={onMarkAll}>
            Mark all as read
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
                <Icon name={notification.read ? "check" : "bell"} size={18} />
              </span>
              <div>
                <h3>{notification.message}</h3>
                <p>{notification.detail}</p>
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
          title="You’re all caught up."
          copy="New booking and guide updates will appear here."
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
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "");
    const email = String(data.get("email") || "");
    const nextErrors: Record<string, string> = {};
    if (!email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a complete mobile number.";
    setErrors(nextErrors);
    setSaved(Object.keys(nextErrors).length === 0);
  };
  return (
    <div className="page-content profile-page">
      <section className="page-lead">
        <div>
          <p className="portal-eyebrow">Account settings</p>
          <h2>Your profile.</h2>
          <p>Keep your contact details current so guides can reach you before an experience.</p>
        </div>
      </section>
      {saved && (
        <div className="success-banner">
          <Icon name="check" />
          <span>
            <b>Profile saved.</b> Your account information is up to date.
          </span>
          <button onClick={() => setSaved(false)}>
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
      <div className="profile-layout">
        <aside className="profile-summary">
          <span className="avatar profile-avatar">AK</span>
          <h3>Amara Kamau</h3>
          <p>Customer since October 2026</p>
          <label className="photo-upload">
            Change profile photograph
            <input type="file" accept="image/*" onChange={() => setSaved(true)} />
          </label>
          <dl>
            <div>
              <dt>Account ID</dt>
              <dd>MTD-C-2048</dd>
            </div>
            <div>
              <dt>Preferred language</dt>
              <dd>English</dd>
            </div>
            <div>
              <dt>Home country</dt>
              <dd>Kenya</dd>
            </div>
          </dl>
        </aside>
        <div className="profile-forms">
          <form className="settings-form" onSubmit={submit} noValidate>
            <div className="form-heading">
              <h3>Personal information</h3>
              <p>Used for bookings and guide communication.</p>
            </div>
            <div className="field-grid">
              <Field label="Full name" name="name" defaultValue="Amara Kamau" />
              <Field
                label="Email address"
                name="email"
                type="email"
                defaultValue="amara.kamau@example.com"
                error={errors.email}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                defaultValue="+254 712 345 678"
                error={errors.phone}
              />
              <Field label="Country" name="country" defaultValue="Kenya" />
            </div>
            <div className="form-actions">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
          <form
            className="settings-form"
            onSubmit={(event) => {
              event.preventDefault();
              setPasswordSaved(true);
            }}
          >
            <div className="form-heading">
              <h3>Password & security</h3>
              <p>Choose a password you do not use elsewhere.</p>
            </div>
            {passwordSaved && (
              <div className="inline-success">
                <Icon name="check" size={16} /> Password updated for this demonstration.
              </div>
            )}
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

function SupportPage() {
  const faqs = [
    [
      "How do I change my booking date?",
      "Contact our local support team at least 24 hours before departure. Changes are subject to guide availability.",
    ],
    [
      "What is your cancellation policy?",
      "Cancel 48 hours before departure for a full refund. Later cancellations may incur guide and transport costs.",
    ],
    [
      "Where will I meet my guide?",
      "Your booking details include the exact meeting point. Most Old Town experiences begin at the Old Port or Fort Jesus gate.",
    ],
    [
      "Can I book without mobile data?",
      "Yes. Dial *384*123# from a Safaricom or Airtel line to reserve through our USSD service.",
    ],
  ];
  return (
    <div className="page-content support-page">
      <section className="support-hero">
        <div>
          <p className="portal-eyebrow">Local help, every day</p>
          <h2>
            How can we help, <em>Amara?</em>
          </h2>
          <p>Real support from our Mombasa team—before, during and after your experience.</p>
        </div>
        <div className="support-contact">
          <span>
            <Icon name="phone" />
            <div>
              <small>Call us</small>
              <a href="tel:+254700123456">+254 700 123 456</a>
            </div>
          </span>
          <span>
            <Icon name="mail" />
            <div>
              <small>Email us</small>
              <a href="mailto:support@mombasadirect.ke">support@mombasadirect.ke</a>
            </div>
          </span>
          <p>Available daily · 07:00–19:00 EAT</p>
        </div>
      </section>
      <section className="support-content">
        <div className="faq-list">
          <SectionIntro eyebrow="Frequently asked" title="Answers for your journey." />
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
            <Icon name="help" />
          </span>
          <p className="portal-eyebrow">Booking assistance</p>
          <h3>Still need a hand?</h3>
          <p>Tell us your booking reference and our local team will help resolve your request.</p>
          <Button
            full
            icon="arrow"
            onClick={() => {
              window.location.href = "mailto:support@mombasadirect.ke";
            }}
          >
            Contact support
          </Button>
          <small>Typical reply within 30 minutes during support hours.</small>
        </aside>
      </section>
    </div>
  );
}

function BookingDetail({
  booking,
  onBack,
  onSupport,
}: {
  booking: Booking;
  onBack: () => void;
  onSupport: () => void;
}) {
  return (
    <div className="page-content booking-detail-page">
      <button className="back-link" onClick={onBack}>
        <span>←</span> Back to bookings
      </button>
      <section className="detail-hero">
        <div className="detail-photo">
          <img src={booking.image} alt="" />
          <span>Mombasa · Kenya</span>
        </div>
        <div className="detail-heading">
          <div>
            <p className="portal-eyebrow">Booking {booking.id}</p>
            <h2>{booking.experience}</h2>
            <p>Your confirmed experience details and meeting information.</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </section>
      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section">
            <h3>Experience details</h3>
            <div className="detail-facts">
              <div>
                <Icon name="calendar" />
                <span>
                  <small>Date</small>
                  <b>{booking.date}</b>
                </span>
              </div>
              <div>
                <Icon name="clock" />
                <span>
                  <small>Time</small>
                  <b>{booking.time}</b>
                </span>
              </div>
              <div>
                <Icon name="users" />
                <span>
                  <small>Visitors</small>
                  <b>{booking.visitors} guests</b>
                </span>
              </div>
              <div>
                <Icon name="compass" />
                <span>
                  <small>Meeting point</small>
                  <b>Old Port dhow landing</b>
                </span>
              </div>
            </div>
          </section>
          <section className="guide-section">
            <div className="guide-avatar">AB</div>
            <div>
              <p className="portal-eyebrow">Your assigned guide</p>
              <h3>{booking.guide || "Guide confirmation pending"}</h3>
              <p>
                {booking.guide
                  ? "Licensed dhow captain and Tudor Creek storyteller. Captain Ali will meet you 15 minutes before departure."
                  : "Our team will add your guide here once availability is confirmed."}
              </p>
            </div>
            {booking.guide && (
              <Button
                variant="secondary"
                icon="phone"
                onClick={() => {
                  window.location.href = "tel:+254700123456";
                }}
              >
                Contact guide
              </Button>
            )}
          </section>
          <section className="detail-section cancellation">
            <h3>Cancellation information</h3>
            <p>
              Free cancellation is available until 3:00 PM on 19 November 2026. After that time,
              guide and vessel reservation costs may apply.
            </p>
            <button onClick={onSupport}>Read the full cancellation policy</button>
          </section>
        </div>
        <aside className="booking-summary">
          <h3>Booking summary</h3>
          <dl>
            <div>
              <dt>{booking.experience}</dt>
              <dd>KES {(booking.total / booking.visitors).toLocaleString()}</dd>
            </div>
            <div>
              <dt>Visitors × {booking.visitors}</dt>
              <dd>KES {booking.total.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Booking fee</dt>
              <dd>KES 0</dd>
            </div>
          </dl>
          <div className="summary-total">
            <span>Total</span>
            <strong>KES {booking.total.toLocaleString()}</strong>
          </div>
          <div className="summary-status">
            <span>
              <small>Booking status</small>
              <StatusBadge status={booking.status} />
            </span>
            <span>
              <small>Payment status</small>
              <StatusBadge status={booking.payment} />
            </span>
          </div>
          <div className="summary-meta">
            <span>
              Booking channel <b>{booking.channel}</b>
            </span>
            <span>
              Payment method <b>M-Pesa</b>
            </span>
          </div>
          <Button full variant="secondary" icon="help" onClick={onSupport}>
            Contact support
          </Button>
        </aside>
      </div>
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

function LoadingState() {
  return (
    <div className="page-content loading-state" aria-label="Loading dashboard">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-feature" />
      <div className="skeleton-row">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      <span>Preparing your coastal journey…</span>
    </div>
  );
}

function SignedOut({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="signed-out-page">
      <div className="signed-out-photo">
        <img src="/images/tudor-creek-dhow.jpg" alt="" />
        <span>Tudor Creek · Mombasa</span>
      </div>
      <div className="signed-out-panel">
        <Brand />
        <p className="portal-eyebrow">Session complete</p>
        <h1>
          Until your next <em>Mombasa story.</em>
        </h1>
        <p>
          You have signed out of your customer portal. Your bookings remain safe and ready when you
          return.
        </p>
        <Button full onClick={onSignIn}>
          Sign back in
        </Button>
        <small>Need help? support@mombasadirect.ke</small>
      </div>
    </div>
  );
}

function BookingModal({
  experience,
  onClose,
}: {
  experience: Experience | null;
  onClose: () => void;
}) {
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    setComplete(false);
  }, [experience]);
  if (!experience) return null;
  return (
    <div className="modal-scrim" onMouseDown={onClose}>
      <section
        className="portal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        {!complete ? (
          <>
            <img className="modal-photo" src={experience.image} alt="" />
            <div className="modal-content">
              <p className="portal-eyebrow">Reserve an experience</p>
              <h2 id="modal-title">{experience.name}</h2>
              <p>{experience.description}</p>
              <div className="modal-facts">
                <span>
                  <small>Duration</small>
                  <b>{experience.duration}</b>
                </span>
                <span>
                  <small>From</small>
                  <b>KES {experience.price.toLocaleString()}</b>
                </span>
              </div>
              <div className="modal-actions">
                <Button variant="secondary" onClick={onClose}>
                  Not now
                </Button>
                <Button icon="arrow" onClick={() => setComplete(true)}>
                  Start booking
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="modal-success">
            <span>
              <Icon name="check" size={30} />
            </span>
            <p className="portal-eyebrow">Request started</p>
            <h2 id="modal-title">Let’s plan your experience.</h2>
            <p>
              A booking form would connect here to the FastAPI reservation endpoint. Your selected
              experience is ready.
            </p>
            <Button onClick={onClose}>Return to experiences</Button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function CustomerPortal() {
  const [view, setView] = useState<View>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking>(bookings[0]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [notifications, setNotifications] = useState(initialNotifications);
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

  const viewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    navigate("booking-detail");
  };

  const main = useMemo(() => {
    if (loading) return <LoadingState />;
    switch (view) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} onViewBooking={viewBooking} />;
      case "bookings":
        return <BookingsPage onViewBooking={viewBooking} onExplore={() => navigate("explore")} />;
      case "explore":
        return <ExplorePage onBook={setSelectedExperience} />;
      case "notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            onMarkAll={() =>
              setNotifications((items) => items.map((item) => ({ ...item, read: true })))
            }
            onMark={(id) =>
              setNotifications((items) =>
                items.map((item) => (item.id === id ? { ...item, read: true } : item)),
              )
            }
            onClear={() => setNotifications([])}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "support":
        return <SupportPage />;
      case "booking-detail":
        return (
          <BookingDetail
            booking={selectedBooking}
            onBack={() => navigate("bookings")}
            onSupport={() => navigate("support")}
          />
        );
      default:
        return null;
    }
  }, [loading, view, notifications, selectedBooking]);

  if (view === "signed-out") return <SignedOut onSignIn={() => navigate("dashboard")} />;

  return (
    <div className="portal-app">
      <Sidebar
        view={view}
        unread={unread}
        open={drawerOpen}
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
        <main>{main}</main>
      </div>
      <BookingModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />
    </div>
  );
}
