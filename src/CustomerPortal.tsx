import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  CreditCard,
  Headphones,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Settings2,
  ShieldCheck,
  Ship,
  Ticket,
  UserRound,
  Users,
  X,
} from "lucide-react";
import "./portal.css";

type View =
  | "Dashboard"
  | "My Bookings"
  | "Explore Experiences"
  | "Notifications"
  | "My Profile"
  | "Help & Support";
type Status = "Confirmed" | "Pending" | "Completed" | "Cancelled";
type Tour = {
  id: number;
  name: string;
  image: string;
  duration: string;
  price: number;
  category: string;
  description: string;
};
type Booking = {
  id: string;
  tour: number;
  date: string;
  time: string;
  visitors: number;
  status: Status;
  payment: string;
  channel: string;
};
const tours: Tour[] = [
  {
    id: 1,
    name: "Old Town Heritage Tour",
    image: "/images/old-town-street.jpg",
    duration: "2–3 hours",
    price: 1500,
    category: "CULTURE & CONNECTION",
    description: "Wander winding alleys, carved doorways and centuries of Swahili stories.",
  },
  {
    id: 2,
    name: "Tudor Creek Dhow Ride",
    image: "/images/dhow-sail.jpg",
    duration: "1–2 hours",
    price: 2500,
    category: "SLOW MOMENTS, SALT AIR",
    description: "Let the tide set the pace on a traditional wooden dhow at golden hour.",
  },
  {
    id: 3,
    name: "Fort Jesus Experience",
    image: "/images/fort-jesus.jpg",
    duration: "1–2 hours",
    price: 1200,
    category: "A WINDOW INTO HISTORY",
    description: "Step inside coral-stone walls and discover the coast's extraordinary past.",
  },
];
const initialBookings: Booking[] = [
  {
    id: "MTD-2026-00125",
    tour: 2,
    date: "2026-11-21",
    time: "15:00",
    visitors: 2,
    status: "Confirmed",
    payment: "Paid",
    channel: "Website",
  },
  {
    id: "MTD-2026-00120",
    tour: 1,
    date: "2026-11-15",
    time: "09:00",
    visitors: 2,
    status: "Completed",
    payment: "Paid",
    channel: "Website",
  },
  {
    id: "MTD-2026-00118",
    tour: 3,
    date: "2026-11-10",
    time: "10:00",
    visitors: 2,
    status: "Completed",
    payment: "Paid",
    channel: "USSD",
  },
];
const nav: { name: View; icon: typeof Compass }[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "My Bookings", icon: Ticket },
  { name: "Explore Experiences", icon: Compass },
  { name: "Notifications", icon: Bell },
  { name: "My Profile", icon: UserRound },
];
const money = (amount: number) => `KES ${amount.toLocaleString("en-KE")}`;
const dateLabel = (date: string, short = false) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
  });
const timeLabel = (time: string) =>
  new Date(`2026-11-21T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
function Badge({ status }: { status: Status }) {
  return (
    <span className={`p-badge ${status.toLowerCase()}`}>
      <span />
      {status}
    </span>
  );
}
function Avatar({ small = false, name = "Amelia Bennett" }: { small?: boolean; name?: string }) {
  return (
    <span className={`p-avatar ${small ? "small" : ""}`} aria-label={name}>
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="p-empty">
      <Compass size={32} strokeWidth={1.3} />
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="p-modal"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="p-modal-heading">
        <h2>{title}</h2>
        <button className="p-icon" onClick={close} aria-label="Close dialog">
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export default function CustomerPortal() {
  const [view, setView] = useState<View>("Dashboard");
  const [drawer, setDrawer] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [modal, setModal] = useState<"logout" | "cancel" | "support" | null>(null);
  const [filter, setFilter] = useState("All bookings");
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useState({
    name: "Amelia Bennett",
    email: "amelia.bennett@email.com",
    phone: "+44 7700 900123",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scenario, setScenario] = useState("default");
  const [demoOpen, setDemoOpen] = useState(false);
  const [notices, setNotices] = useState([
    {
      id: 1,
      message: "Your Tudor Creek booking has been confirmed.",
      detail: "Your afternoon on the water is all set. We look forward to welcoming you aboard.",
      time: "Today, 9:41 AM",
      unread: true,
    },
    {
      id: 2,
      message: "Your booking request has been received.",
      detail: "We've received your request for the Tudor Creek Dhow Ride.",
      time: "Yesterday, 4:20 PM",
      unread: true,
    },
    {
      id: 3,
      message: "Your Old Town Heritage Tour has been completed.",
      detail: "Thank you for discovering our city with a local.",
      time: "15 November 2026",
      unread: false,
    },
  ]);
  const unread = notices.filter((notice) => notice.unread).length;
  const visibleBookings = scenario === "empty" ? [] : bookings;
  const upcoming = visibleBookings.find(
    (booking) => booking.status === "Confirmed" || booking.status === "Pending",
  );
  const notify = (message: string) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawer(false);
        setDropdown(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  function navigate(next: View) {
    setView(next);
    setSelected(null);
    setDrawer(false);
    setDropdown(false);
    setErrors({});
    window.scrollTo({ top: 0 });
  }
  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const password = String(data.get("password") || "");
    const validation: Record<string, string> = {};
    if (name.length < 2) validation.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      validation.email = "Enter a valid email address.";
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) validation.phone = "Enter a valid phone number.";
    if (password && password.length < 8) validation.password = "Use at least 8 characters.";
    if (password && password !== data.get("confirm"))
      validation.confirm = "Passwords do not match.";
    if (password && !data.get("current")) validation.current = "Enter your current password.";
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setProfile({ name, email, phone });
    event.currentTarget.reset();
    notify("Profile updated for this demo session. No account data was sent.");
  }
  function BookingList({ items }: { items: Booking[] }) {
    return (
      <div className="p-booking-list">
        {items.length ? (
          items.map((booking) => {
            const experience = tours.find((item) => item.id === booking.tour)!;
            return (
              <button
                className="p-booking-row"
                key={booking.id}
                onClick={() => setSelected(booking)}
                aria-label={`View ${experience.name} booking ${booking.id}`}
              >
                <img src={experience.image} alt="" />
                <span className="p-booking-name">
                  <strong>{experience.name}</strong>
                  <small>{booking.id}</small>
                </span>
                <span className="p-booking-date">{dateLabel(booking.date, true)}</span>
                <strong className="p-booking-amount">
                  {money(experience.price * booking.visitors)}
                </strong>
                <Badge status={booking.status} />
                <ArrowRight size={18} />
              </button>
            );
          })
        ) : (
          <Empty
            title="Your story starts here"
            action={
              <button className="p-button" onClick={() => navigate("Explore Experiences")}>
                Explore experiences <ArrowRight size={16} />
              </button>
            }
          >
            You haven't booked an experience yet. Find a little inspiration below.
          </Empty>
        )}
      </div>
    );
  }
  function Discover() {
    return (
      <div className="p-tour-grid">
        {tours.map((experience) => (
          <article className="p-tour" key={experience.id}>
            <button
              className="p-tour-image"
              onClick={() => setTour(experience)}
              aria-label={`Explore ${experience.name}`}
            >
              <img src={experience.image} alt={experience.name} />
              <span>
                <Clock3 size={13} />
                {experience.duration}
              </span>
              <span className="p-image-arrow">
                <ArrowRight size={20} />
              </span>
            </button>
            <div className="p-tour-category">{experience.category}</div>
            <h3>
              <button onClick={() => setTour(experience)}>{experience.name}</button>
            </h3>
            <p>{experience.description}</p>
            <div className="p-tour-bottom">
              <span>
                <strong>{money(experience.price)}</strong> / person
              </span>
              <button
                onClick={() => setTour(experience)}
                aria-label={`Explore ${experience.name}`}
                title="Explore experience"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }
  const title = selected ? "Booking Details" : view;
  return (
    <div className="portal">
      {drawer && (
        <button
          className="p-drawer-shade"
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside className={`p-sidebar ${drawer ? "open" : ""}`} aria-label="Customer navigation">
        <a className="p-brand" href="/home">
          <img src="/assets/logo.png" alt="" />
          <span>
            <strong>MOMBASA</strong>
            <small>CONNECT</small>
          </span>
        </a>
        <button
          className="p-drawer-close p-icon"
          onClick={() => setDrawer(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <div className="p-sidebar-label">YOUR COASTAL COMPANION</div>
        <nav>
          {nav.map((item) => (
            <button
              key={item.name}
              className={view === item.name ? "active" : ""}
              onClick={() => navigate(item.name)}
              aria-current={view === item.name ? "page" : undefined}
            >
              <item.icon size={19} strokeWidth={1.6} />
              <span>{item.name}</span>
              {item.name === "Notifications" && unread > 0 && <b>{unread}</b>}
            </button>
          ))}
        </nav>
        <div className="p-sidebar-bottom">
          <div className="p-local-note">
            <span className="p-local-icon">
              <Ship size={27} strokeWidth={1.1} />
            </span>
            <h3>A little closer to local.</h3>
            <p>
              Real places. Local people.
              <br />
              Unforgettable moments.
            </p>
            <a href="/home">
              Our story <ArrowRight size={14} />
            </a>
          </div>
          <button
            className={view === "Help & Support" ? "p-side-action active" : "p-side-action"}
            onClick={() => navigate("Help & Support")}
          >
            <CircleHelp size={19} />
            Help & Support
          </button>
          <button className="p-side-action p-logout" onClick={() => setModal("logout")}>
            <LogOut size={18} />
            Log out
          </button>
          <div className="p-sidebar-footer">
            Made with care, in Mombasa.<span>© 2026 Mombasa Tour Direct</span>
          </div>
        </div>
      </aside>
      <div className="p-workspace">
        <header className="p-header">
          <div className="p-breadcrumb">
            <button
              className="p-mobile-menu p-icon"
              onClick={() => setDrawer(true)}
              aria-label="Open navigation"
              aria-expanded={drawer}
            >
              <Menu size={22} />
            </button>
            <span>My account</span>
            <ChevronRight size={13} />
            <strong>{title}</strong>
          </div>
          <div className="p-header-actions">
            <span className="p-demo-tag">DEMO ACCOUNT</span>
            <button
              className="p-icon p-bell"
              onClick={() => navigate("Notifications")}
              aria-label={`Notifications, ${unread} unread`}
            >
              <Bell size={20} />
              {unread > 0 && <i />}
            </button>
            <div className="p-profile-menu">
              <button
                className="p-profile-trigger"
                onClick={() => setDropdown(!dropdown)}
                aria-expanded={dropdown}
                aria-label="Account menu"
              >
                <Avatar small name={profile.name} />
                <span>
                  {profile.name}
                  <small>Explorer</small>
                </span>
                <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="p-dropdown">
                  <button onClick={() => navigate("My Profile")}>
                    <UserRound size={16} />
                    My profile
                  </button>
                  <button onClick={() => navigate("My Bookings")}>
                    <Ticket size={16} />
                    My bookings
                  </button>
                  <button
                    onClick={() => {
                      setModal("logout");
                      setDropdown(false);
                    }}
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-main" id="main-content">
          {selected ? (
            (() => {
              const experience = tours.find((item) => item.id === selected.tour)!;
              return (
                <>
                  <button className="p-back" onClick={() => setSelected(null)}>
                    <ArrowLeft size={16} />
                    Back to {view.toLowerCase()}
                  </button>
                  <div className="p-page-heading">
                    <div>
                      <div className="p-eyebrow">YOUR RESERVATION</div>
                      <h1>{experience.name}</h1>
                      <p>{selected.id}</p>
                    </div>
                    <Badge status={selected.status} />
                  </div>
                  <div className="p-detail-grid">
                    <div>
                      <img
                        className="p-detail-image"
                        src={experience.image}
                        alt={experience.name}
                      />
                      <section className="p-detail-section">
                        <h2>Your experience, at a glance</h2>
                        <p>{experience.description}</p>
                        <div className="p-detail-facts">
                          <div>
                            <CalendarDays size={19} />
                            <span>
                              Date<strong>{dateLabel(selected.date)}</strong>
                            </span>
                          </div>
                          <div>
                            <Clock3 size={19} />
                            <span>
                              Start time<strong>{timeLabel(selected.time)}</strong>
                            </span>
                          </div>
                          <div>
                            <Users size={19} />
                            <span>
                              Visitors<strong>{selected.visitors} adults</strong>
                            </span>
                          </div>
                          <div>
                            <UserRound size={19} />
                            <span>
                              Your local guide
                              <strong>
                                {selected.status === "Confirmed"
                                  ? "Hassan Ali"
                                  : "Assigned after confirmation"}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </section>
                      <section className="p-detail-section">
                        <h2>Where we'll meet</h2>
                        <p>
                          <MapPin size={16} />
                          {selected.tour === 2
                            ? "Tudor Creek jetty, Mombasa"
                            : selected.tour === 1
                              ? "Old Port gate, Old Town, Mombasa"
                              : "Fort Jesus main entrance, Mombasa"}
                        </p>
                        <p>
                          Please arrive 15 minutes before your experience. Your guide will meet you
                          at the entrance.
                        </p>
                      </section>
                      <section className="p-detail-section">
                        <h2>A little flexibility</h2>
                        <p>
                          For this demonstration, cancellation is available up to 24 hours before
                          the experience. Actual cancellation and refund terms must be confirmed
                          with the operator.
                        </p>
                        {(selected.status === "Confirmed" || selected.status === "Pending") && (
                          <button className="p-danger-link" onClick={() => setModal("cancel")}>
                            Request cancellation
                          </button>
                        )}
                      </section>
                    </div>
                    <aside className="p-price-panel">
                      <h2>Booking summary</h2>
                      <div className="p-price-line">
                        <span>
                          {money(experience.price)} × {selected.visitors} visitors
                        </span>
                        <strong>{money(experience.price * selected.visitors)}</strong>
                      </div>
                      <div className="p-price-line">
                        <span>Booking fee</span>
                        <span>KES 0</span>
                      </div>
                      <div className="p-price-total">
                        <span>Total</span>
                        <strong>{money(experience.price * selected.visitors)}</strong>
                      </div>
                      <div className="p-payment">
                        <CreditCard size={19} />
                        <span>
                          Payment status<strong>{selected.payment}</strong>
                        </span>
                      </div>
                      <div className="p-price-line">
                        <span>Booking status</span>
                        <Badge status={selected.status} />
                      </div>
                      <div className="p-price-line">
                        <span>Booking channel</span>
                        <strong>{selected.channel}</strong>
                      </div>
                      <button className="p-button full" onClick={() => setModal("support")}>
                        <MessageCircle size={16} />
                        Get booking assistance
                      </button>
                      <small>Demonstration reservation. No real payment has been taken.</small>
                    </aside>
                  </div>
                </>
              );
            })()
          ) : view === "Dashboard" ? (
            <>
              <section className="p-welcome">
                <div>
                  <div className="p-eyebrow">
                    <span /> A LITTLE CLOSER TO THE COAST
                  </div>
                  <h1>
                    Welcome back, {profile.name.split(" ")[0]}
                    <em>.</em>
                  </h1>
                  <p>Your next Mombasa experience is just around the corner.</p>
                </div>
                <button
                  className="p-button p-explore-cta"
                  onClick={() => navigate("Explore Experiences")}
                >
                  Explore Experiences <ArrowRight size={17} />
                </button>
              </section>
              {scenario === "loading" ? (
                <div className="p-loading" role="status" aria-label="Loading dashboard">
                  <div />
                  <span>Gathering your next adventure…</span>
                </div>
              ) : scenario === "error" ? (
                <div className="p-error" role="alert">
                  <CircleHelp size={28} />
                  <h2>We couldn't load your experiences.</h2>
                  <p>Your bookings haven't changed. Please try again.</p>
                  <button className="p-button" onClick={() => setScenario("default")}>
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <section className="p-upcoming-section">
                    <div className="p-section-heading">
                      <h2>Your next adventure</h2>
                      <span className="p-section-aside">A moment worth looking forward to</span>
                    </div>
                    {upcoming ? (
                      <article className="p-feature">
                        <div className="p-feature-photo">
                          <img
                            src={tours.find((item) => item.id === upcoming.tour)!.image}
                            alt="Traditional wooden dhow sailing along the Mombasa coast"
                          />
                          <span className="p-photo-tag">
                            <MapPin size={13} />
                            TUDOR CREEK, MOMBASA
                          </span>
                          <div className="p-photo-caption">
                            A slower kind
                            <br />
                            of adventure.
                          </div>
                          <span className="p-photo-bottom">
                            THE COAST IS CALLING <ArrowRight size={16} />
                          </span>
                        </div>
                        <div className="p-feature-content">
                          <div className="p-feature-top">
                            <span className="p-eyebrow">YOUR UPCOMING EXPERIENCE</span>
                            <Badge status={upcoming.status} />
                          </div>
                          <h2>{tours.find((item) => item.id === upcoming.tour)!.name}</h2>
                          <p className="p-feature-copy">
                            Salt in the air. The sun on the water.
                            <br />A little Mombasa magic, just for you.
                          </p>
                          <div className="p-feature-facts">
                            <div>
                              <CalendarDays size={18} />
                              <span>
                                Date<strong>{dateLabel(upcoming.date)}</strong>
                              </span>
                            </div>
                            <div>
                              <Clock3 size={18} />
                              <span>
                                Time<strong>{timeLabel(upcoming.time)}</strong>
                              </span>
                            </div>
                            <div>
                              <Users size={18} />
                              <span>
                                Visitors<strong>{upcoming.visitors} adults</strong>
                              </span>
                            </div>
                            <div>
                              <Ticket size={18} />
                              <span>
                                Booking reference<strong>{upcoming.id}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="p-feature-footer">
                            <div>
                              <span>Total amount</span>
                              <strong>
                                {money(
                                  tours.find((item) => item.id === upcoming.tour)!.price *
                                    upcoming.visitors,
                                )}
                              </strong>
                            </div>
                            <button className="p-button" onClick={() => setSelected(upcoming)}>
                              View Booking Details <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ) : (
                      <Empty
                        title="Something wonderful is waiting"
                        action={
                          <button
                            className="p-button"
                            onClick={() => navigate("Explore Experiences")}
                          >
                            Find your next experience <ArrowRight size={16} />
                          </button>
                        }
                      >
                        No upcoming adventures just yet. Make a little room for Mombasa.
                      </Empty>
                    )}
                  </section>
                  <section className="p-overview" aria-label="Booking overview">
                    <div>
                      <span className="p-stat-icon">
                        <CalendarDays size={20} strokeWidth={1.5} />
                      </span>
                      <span>
                        <strong>
                          {String(
                            visibleBookings.filter((item) => item.status === "Confirmed").length,
                          ).padStart(2, "0")}
                        </strong>
                        <small>Upcoming bookings</small>
                      </span>
                      <span className="p-stat-hint">Something to look forward to</span>
                    </div>
                    <div>
                      <span className="p-stat-icon amber">
                        <Clock3 size={20} strokeWidth={1.5} />
                      </span>
                      <span>
                        <strong>
                          {String(
                            visibleBookings.filter((item) => item.status === "Pending").length,
                          ).padStart(2, "0")}
                        </strong>
                        <small>Pending bookings</small>
                      </span>
                      <span className="p-stat-hint">All caught up</span>
                    </div>
                    <div>
                      <span className="p-stat-icon teal">
                        <CheckCheck size={20} strokeWidth={1.5} />
                      </span>
                      <span>
                        <strong>
                          {String(
                            visibleBookings.filter((item) => item.status === "Completed").length,
                          ).padStart(2, "0")}
                        </strong>
                        <small>Completed experiences</small>
                      </span>
                      <span className="p-stat-hint">Memories made</span>
                    </div>
                  </section>
                  <section className="p-recent">
                    <div className="p-section-heading">
                      <div>
                        <h2>Your recent journeys</h2>
                        <p>A little look back at where you've been.</p>
                      </div>
                      <button className="p-text-button" onClick={() => navigate("My Bookings")}>
                        View all bookings <ArrowRight size={15} />
                      </button>
                    </div>
                    <BookingList
                      items={visibleBookings
                        .filter((item) => item.status === "Completed")
                        .slice(0, 2)}
                    />
                  </section>
                </>
              )}
              <section className="p-discover">
                <div className="p-section-heading">
                  <div>
                    <div className="p-eyebrow">THERE'S ALWAYS MORE TO DISCOVER</div>
                    <h2>
                      More of Mombasa awaits<em>.</em>
                    </h2>
                  </div>
                  <button className="p-text-button" onClick={() => navigate("Explore Experiences")}>
                    Explore all experiences <ArrowRight size={15} />
                  </button>
                </div>
                <Discover />
              </section>
              <section className="p-help-band">
                <span className="p-help-symbol">
                  <Headphones size={25} strokeWidth={1.4} />
                </span>
                <div>
                  <h3>A real person, just a message away.</h3>
                  <p>Questions about your trip? Our Mombasa team is here for you.</p>
                </div>
                <button className="p-text-button" onClick={() => navigate("Help & Support")}>
                  Let's talk <ArrowRight size={16} />
                </button>
              </section>
            </>
          ) : view === "My Bookings" ? (
            <>
              <div className="p-page-heading">
                <div>
                  <div className="p-eyebrow">PLANS & MEMORIES</div>
                  <h1>
                    My bookings<em>.</em>
                  </h1>
                  <p>Every experience, all in one place.</p>
                </div>
                <button className="p-button" onClick={() => navigate("Explore Experiences")}>
                  Find an experience <ArrowRight size={16} />
                </button>
              </div>
              <div className="p-tabs" role="tablist" aria-label="Filter bookings">
                {["All bookings", "Confirmed", "Pending", "Completed", "Cancelled"].map(
                  (status) => (
                    <button
                      role="tab"
                      aria-selected={filter === status}
                      className={filter === status ? "active" : ""}
                      key={status}
                      onClick={() => setFilter(status)}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
              <BookingList
                items={visibleBookings.filter(
                  (item) => filter === "All bookings" || item.status === filter,
                )}
              />
            </>
          ) : view === "Explore Experiences" ? (
            <>
              <div className="p-page-heading">
                <div>
                  <div className="p-eyebrow">LOCALLY GUIDED. PERSONALLY REMEMBERED.</div>
                  <h1>
                    Find your Mombasa<em>.</em>
                  </h1>
                  <p>Three ways to discover a coast with a thousand stories.</p>
                </div>
                <span className="p-locally">
                  <MapPin size={16} />
                  Mombasa, Kenya
                </span>
              </div>
              <Discover />
              <div className="p-explore-note">
                <ShieldCheck size={22} />
                <div>
                  <strong>Good experiences start with good people.</strong>
                  <p>
                    Local guides. Transparent prices in Kenyan shillings. A warm coastal welcome.
                  </p>
                </div>
              </div>
            </>
          ) : view === "Notifications" ? (
            <>
              <div className="p-page-heading">
                <div>
                  <div className="p-eyebrow">YOU'RE IN THE KNOW</div>
                  <h1>
                    Your notifications<em>.</em>
                  </h1>
                  <p>Little updates for your next big memory.</p>
                </div>
                <button
                  className="p-text-button"
                  onClick={() => setNotices(notices.map((item) => ({ ...item, unread: false })))}
                  disabled={!unread}
                >
                  <CheckCheck size={17} />
                  Mark all as read
                </button>
              </div>
              {scenario === "empty-notifications" || !notices.length ? (
                <Empty title="A quiet moment">
                  You're all caught up. New booking updates will appear here.
                </Empty>
              ) : (
                <div className="p-notifications">
                  {notices.map((notice) => (
                    <article key={notice.id} className={notice.unread ? "unread" : ""}>
                      <span className="p-notice-icon">
                        {notice.id === 1 ? <Check size={21} /> : <Ticket size={21} />}
                      </span>
                      <div>
                        <h3>{notice.message}</h3>
                        <p>{notice.detail}</p>
                        <small>{notice.time}</small>
                      </div>
                      <button
                        className="p-icon"
                        aria-label={
                          notice.unread
                            ? `Mark notification ${notice.id} as read`
                            : `Mark notification ${notice.id} as unread`
                        }
                        title={notice.unread ? "Mark as read" : "Mark as unread"}
                        onClick={() =>
                          setNotices(
                            notices.map((item) =>
                              item.id === notice.id ? { ...item, unread: !item.unread } : item,
                            ),
                          )
                        }
                      >
                        {notice.unread ? (
                          <span className="p-unread-dot" />
                        ) : (
                          <CheckCheck size={17} />
                        )}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </>
          ) : view === "My Profile" ? (
            <>
              <div className="p-page-heading">
                <div>
                  <div className="p-eyebrow">MAKE YOURSELF AT HOME</div>
                  <h1>
                    My profile<em>.</em>
                  </h1>
                  <p>A few details to make every journey more personal.</p>
                </div>
              </div>
              <form className="p-profile-form" noValidate onSubmit={saveProfile}>
                <div className="p-profile-intro">
                  <Avatar name={profile.name} />
                  <div>
                    <h2>{profile.name}</h2>
                    <p>Coastal explorer · Member since November 2026</p>
                  </div>
                </div>
                <section className="p-form-section">
                  <div>
                    <h2>Personal information</h2>
                    <p>How we can reach you about your experiences.</p>
                  </div>
                  <div className="p-fields">
                    {[
                      { key: "name", label: "Full name", type: "text" },
                      { key: "email", label: "Email address", type: "email" },
                      { key: "phone", label: "Phone number", type: "tel" },
                    ].map((field) => (
                      <label key={field.key}>
                        {field.label}
                        <input
                          name={field.key}
                          type={field.type}
                          defaultValue={profile[field.key as keyof typeof profile]}
                          autoComplete={
                            field.key === "name" ? "name" : field.key === "email" ? "email" : "tel"
                          }
                          aria-invalid={!!errors[field.key]}
                          aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                        />
                        {errors[field.key] && (
                          <small id={`${field.key}-error`} className="p-field-error">
                            {errors[field.key]}
                          </small>
                        )}
                      </label>
                    ))}
                  </div>
                </section>
                <section className="p-form-section">
                  <div>
                    <h2>Change password</h2>
                    <p>Leave these fields blank to keep your current password.</p>
                  </div>
                  <div className="p-fields">
                    {[
                      { key: "current", label: "Current password" },
                      { key: "password", label: "New password" },
                      { key: "confirm", label: "Confirm new password" },
                    ].map((field) => (
                      <label key={field.key}>
                        {field.label}
                        <input
                          name={field.key}
                          type="password"
                          autoComplete={
                            field.key === "current" ? "current-password" : "new-password"
                          }
                          aria-invalid={!!errors[field.key]}
                          aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                        />
                        {errors[field.key] && (
                          <small id={`${field.key}-error`} className="p-field-error">
                            {errors[field.key]}
                          </small>
                        )}
                      </label>
                    ))}
                  </div>
                </section>
                <div className="p-form-footer">
                  <span>
                    <ShieldCheck size={16} />
                    Demo session only. Changes are not stored on a server.
                  </span>
                  <button className="p-button" type="submit">
                    Save changes <Check size={16} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="p-page-heading">
                <div>
                  <div className="p-eyebrow">A WARM WELCOME, ALWAYS</div>
                  <h1>
                    We're here for you<em>.</em>
                  </h1>
                  <p>A question, a change of plans, or a little local advice. Let's talk.</p>
                </div>
              </div>
              <div className="p-support-grid">
                <section>
                  <h2>A little help along the way</h2>
                  {[
                    {
                      q: "Where can I find my booking confirmation?",
                      a: "Open My Bookings, choose your experience and check its booking status. Confirmed reservations show your date, time and meeting point. Payment status is shown separately.",
                    },
                    {
                      q: "Can I change my date or visitor count?",
                      a: "Contact our team with your booking reference and preferred changes. Availability and any price difference must be confirmed before a change is made.",
                    },
                    {
                      q: "How do cancellations and refunds work?",
                      a: "This demo allows cancellation requests up to 24 hours before your tour. Your operator must confirm the actual policy and any refund eligibility. A cancellation does not automatically mean a refund has been issued.",
                    },
                    {
                      q: "What should I bring on my experience?",
                      a: "Bring drinking water, sun protection and comfortable footwear. For the dhow ride, a light layer is helpful in the evening. Your local guide can answer any accessibility questions before you book.",
                    },
                    {
                      q: "Can I book without an internet connection?",
                      a: "Yes. Our public website offers an offline USSD booking option. Visit the Offline access section for the current dialing instructions.",
                    },
                  ].map((item) => (
                    <details className="p-faq" key={item.q}>
                      <summary>
                        {item.q}
                        <ChevronDown size={16} />
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </section>
                <aside className="p-contact-panel">
                  <Headphones size={30} strokeWidth={1.3} />
                  <h2>People, not chatbots.</h2>
                  <p>
                    Our local team can help you with bookings, accessibility and your time in
                    Mombasa.
                  </p>
                  <div>
                    <MapPin size={17} />
                    <span>Mombasa, Kenya</span>
                  </div>
                  <div>
                    <Clock3 size={17} />
                    <span>Monday–Saturday, 8 AM–6 PM EAT</span>
                  </div>
                  <button className="p-button full" onClick={() => setModal("support")}>
                    Contact support <ArrowRight size={16} />
                  </button>
                  <small>
                    Demonstration support form. Live contact details will be provided by the
                    operator.
                  </small>
                </aside>
              </div>
            </>
          )}
          <footer className="p-footer">
            <span>A coast full of stories. A journey that's yours.</span>
            <span>
              Mombasa Tour Direct <i>·</i> Customer portal
            </span>
          </footer>
          <div className="p-demo-controls">
            <button onClick={() => setDemoOpen(!demoOpen)} aria-expanded={demoOpen}>
              <Settings2 size={13} />
              Demonstration data & states <ChevronDown size={12} />
            </button>
            {demoOpen && (
              <label>
                Preview state
                <select
                  value={scenario}
                  onChange={(event) => {
                    const next = event.target.value;
                    setScenario(next);
                    setSelected(null);
                    if (next === "empty-notifications") setView("Notifications");
                    else setView("Dashboard");
                  }}
                >
                  <option value="default">Customer with bookings</option>
                  <option value="empty">No bookings</option>
                  <option value="empty-notifications">Empty notifications</option>
                  <option value="loading">Loading dashboard</option>
                  <option value="error">Dashboard error</option>
                </select>
              </label>
            )}
            <span>Sample customer and reservations · Preview date: 18 November 2026</span>
          </div>
        </main>
      </div>
      {toast && (
        <div className="p-toast" role="status">
          <Check size={18} />
          <span>{toast}</span>
          <button className="p-icon" onClick={() => setToast("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}
      {tour && (
        <Modal title={tour.name} close={() => setTour(null)}>
          <img className="p-modal-photo" src={tour.image} alt={tour.name} />
          <p className="p-modal-copy">{tour.description}</p>
          <div className="p-modal-tour-meta">
            <span>
              <Clock3 size={16} />
              {tour.duration}
            </span>
            <strong>{money(tour.price)} / person</strong>
          </div>
          <form
            className="p-reserve-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const booking: Booking = {
                id: `MTD-2026-${String(126 + bookings.length).padStart(5, "0")}`,
                tour: tour.id,
                date: String(data.get("date")),
                time: String(data.get("time")),
                visitors: Number(data.get("visitors")),
                status: "Pending",
                payment: "Not paid",
                channel: "Website",
              };
              setBookings([booking, ...bookings]);
              setNotices([
                {
                  id: Date.now(),
                  message: "Your booking request has been received.",
                  detail: `${tour.name}: your request is awaiting confirmation. No payment has been taken.`,
                  time: "Just now",
                  unread: true,
                },
                ...notices,
              ]);
              setTour(null);
              setScenario("default");
              setView("My Bookings");
              setFilter("All bookings");
              setSelected(booking);
              notify("Demo booking requested. No payment has been taken.");
            }}
          >
            <label>
              Experience date
              <input required name="date" type="date" min="2026-11-19" defaultValue="2026-11-22" />
            </label>
            <div className="p-form-two">
              <label>
                Preferred time
                <select name="time">
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="15:00">3:00 PM</option>
                </select>
              </label>
              <label>
                Visitors
                <input required name="visitors" type="number" min="1" max="8" defaultValue="2" />
              </label>
            </div>
            <p className="p-demo-disclaimer">
              Demonstration request only. Availability and payment are not connected to a live
              service.
            </p>
            <button className="p-button full" type="submit">
              Request booking <ArrowRight size={16} />
            </button>
          </form>
        </Modal>
      )}
      {modal === "logout" && (
        <Modal title="Leaving for now?" close={() => setModal(null)}>
          <p className="p-modal-copy">You can return to this demonstration portal any time.</p>
          <div className="p-modal-actions">
            <button className="p-button secondary" onClick={() => setModal(null)}>
              Stay here
            </button>
            <button
              className="p-button"
              onClick={() => {
                setModal(null);
                window.location.assign("/home");
              }}
            >
              Log out <LogOut size={16} />
            </button>
          </div>
        </Modal>
      )}
      {modal === "cancel" && selected && (
        <Modal title="Request a cancellation" close={() => setModal(null)}>
          <p className="p-modal-copy">
            Cancel demo reservation {selected.id}? No live reservation will be changed. A paid
            booking remains marked as paid until a refund is processed.
          </p>
          <div className="p-modal-actions">
            <button className="p-button secondary" onClick={() => setModal(null)}>
              Keep booking
            </button>
            <button
              className="p-button danger"
              onClick={() => {
                if (
                  new Date(`${selected.date}T${selected.time}`).getTime() -
                    new Date("2026-11-18T12:00:00").getTime() <
                  86400000
                ) {
                  notify("This booking is within 24 hours. Please contact support.");
                  setModal("support");
                  return;
                }
                const updated = { ...selected, status: "Cancelled" as Status };
                setBookings(bookings.map((item) => (item.id === selected.id ? updated : item)));
                setSelected(updated);
                setModal(null);
                notify("Demo booking cancelled. Payment status is unchanged.");
              }}
            >
              Cancel booking
            </button>
          </div>
        </Modal>
      )}
      {modal === "support" && (
        <Modal title="Let's talk about your trip" close={() => setModal(null)}>
          <form
            className="p-reserve-form"
            onSubmit={(event) => {
              event.preventDefault();
              setModal(null);
              notify("Demo message received locally. No support message was sent.");
            }}
          >
            <p className="p-modal-copy">Tell our Mombasa team what you need a hand with.</p>
            <label>
              Your email
              <input type="email" name="email" required defaultValue={profile.email} />
            </label>
            <label>
              Booking reference (optional)
              <input name="reference" defaultValue={selected?.id || ""} />
            </label>
            <label>
              How can we help?
              <textarea name="message" required minLength={10} rows={4} />
            </label>
            <p className="p-demo-disclaimer">
              This is a demonstration form, not a live support channel.
            </p>
            <button className="p-button full" type="submit">
              Send demo message <ArrowRight size={16} />
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
