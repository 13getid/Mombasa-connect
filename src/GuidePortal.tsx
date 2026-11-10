import { ArrowLeft, CalendarDays, ChevronDown, Clock3, Compass, MapPin, Users } from "lucide-react";
import { ThemeToggle } from "./theme";

const assignments = [
  {
    reference: "MTD-G-00120",
    name: "Old Town Heritage Tour",
    date: "21 November 2026",
    time: "9:00 AM",
    duration: "2–3 hours",
    visitors: 4,
    image: "/images/old-town-street.jpg",
    meeting: "Old Port gate, Old Town, Mombasa",
    briefing:
      "Meet the group 15 minutes before departure. Brief guests on the walking route, respectful photography and sun protection. Confirm any mobility needs with the operator before departure.",
  },
  {
    reference: "MTD-G-00128",
    name: "Fort Jesus Experience",
    date: "22 November 2026",
    time: "10:00 AM",
    duration: "1–2 hours",
    visitors: 2,
    image: "/images/fort-jesus.jpg",
    meeting: "Fort Jesus main entrance, Mombasa",
    briefing:
      "Arrive 15 minutes early and confirm entry arrangements with the operator. Carry drinking water and review any site restrictions before the group enters.",
  },
];

export default function GuidePortal() {
  return (
    <div className="guide-app">
      <header className="guide-header">
        <a className="guide-brand" href="/home">
          <img src="/assets/logo.png" alt="" />
          <span>
            Mombasa Connect<small>GUIDE ASSIGNMENTS</small>
          </span>
        </a>
        <div>
          <ThemeToggle />
          <a className="guide-back" href="/home" aria-label="Return to website">
            <ArrowLeft size={16} />
            <span>Return to website</span>
          </a>
        </div>
      </header>
      <main className="guide-main">
        <div className="guide-preview-banner">
          Demonstration workspace · Sample guide and assignments · Preview date: 20 November 2026.
          No authenticated session or live assignment data.
        </div>
        <section className="guide-welcome">
          <div>
            <p className="guide-eyebrow">YOUR LOCAL KNOWLEDGE, THEIR NEXT MEMORY</p>
            <h1>Karibu, Amina.</h1>
            <p>Your current assignments, with the details you need before setting out.</p>
          </div>
          <span className="guide-role">
            <Compass size={18} />
            Tour guide · Read-only preview
          </span>
        </section>
        <div className="guide-section-heading">
          <h2>Current assignments</h2>
          <span>{assignments.length} assigned experiences · All times EAT</span>
        </div>
        <div className="guide-assignments">
          {assignments.map((assignment) => (
            <article className="guide-assignment" key={assignment.reference}>
              <img src={assignment.image} alt={assignment.name} />
              <div className="guide-assignment-content">
                <div className="guide-assignment-heading">
                  <div>
                    <span className="guide-eyebrow">{assignment.reference}</span>
                    <h3>{assignment.name}</h3>
                  </div>
                  <span className="guide-assigned">Assigned</span>
                </div>
                <div className="guide-facts">
                  <span>
                    <CalendarDays size={16} />
                    {assignment.date}
                  </span>
                  <span>
                    <Clock3 size={16} />
                    {assignment.time} · {assignment.duration}
                  </span>
                  <span>
                    <Users size={16} />
                    {assignment.visitors} visitors
                  </span>
                </div>
                <p className="guide-meeting">
                  <MapPin size={16} />
                  {assignment.meeting}
                </p>
                <details className="guide-briefing">
                  <summary>
                    View assignment briefing
                    <ChevronDown size={16} />
                  </summary>
                  <p>{assignment.briefing}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
        <section className="guide-scope-note">
          <h2>A focused workspace.</h2>
          <p>
            Only current assigned tours appear here. Customer account management, payment details
            and other guides' assignments are not included. Live access must be restricted by the
            backend to the authenticated guide.
          </p>
        </section>
        <footer className="guide-footer">Mombasa Connect · Guide assignment preview</footer>
      </main>
    </div>
  );
}
