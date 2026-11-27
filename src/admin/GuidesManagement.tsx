import { useState } from "react";
import { CheckCircle2, Clock3, Search, ShieldAlert, UserCheck, Users, XCircle } from "lucide-react";
import type { BookingRecord } from "./BookingsManagement";
import { guideInitials, type GuideRecord } from "./guides";
import GuideStatusBadge from "./GuideStatusBadge";
import "./guides-management.css";

const filters = ["All Guides", "Approved", "Pending Verification", "Rejected", "Suspended"] as const;

export default function GuidesManagement({ guides, records, onViewGuide }: {
  guides: GuideRecord[];
  records: BookingRecord[];
  onViewGuide: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof filters)[number]>("All Guides");
  const count = (value: GuideRecord["status"]) => guides.filter((guide) => guide.status === value).length;
  const filtered = guides.filter((guide) =>
    [guide.name, guide.id, guide.phone, guide.email ?? ""].some((value) => value.toLowerCase().includes(query.trim().toLowerCase()))
    && (status === "All Guides" || guide.status === status));

  return (
    <div className="bookings-page guides-page">
      <section className="bookings-page-header">
        <div>
          <p className="admin-eyebrow">Guide operations</p>
          <h1>Guides Management</h1>
          <p>Review the guides and verification status in the demo directory.</p>
          <p className="bookings-demo-note">Demo data only. Changes reset on reload and do not update the guide portal.</p>
        </div>
      </section>

      <section className="booking-stats-grid guides-stats-grid" aria-label="Demo guide summary">
        {([
          ["Total Guides", guides.length, Users],
          ["Approved Guides", count("Approved"), UserCheck],
          ["Pending Verification", count("Pending Verification"), Clock3],
          ["Rejected Guides", count("Rejected"), XCircle],
          ["Suspended Guides", count("Suspended"), ShieldAlert],
        ] as const).map(([label, total, Icon]) => (
          <article key={label}><span><Icon size={18} /></span><div><p>{label}</p><strong>{total}</strong><small>Demo guides</small></div></article>
        ))}
      </section>

      <nav className="booking-status-tabs" aria-label="Guide verification status">
        {filters.map((filter) => (
          <button key={filter} type="button" className={status === filter ? "active" : ""} aria-pressed={status === filter} onClick={() => setStatus(filter)}>
            {filter}<span>{filter === "All Guides" ? guides.length : count(filter)}</span>
          </button>
        ))}
      </nav>

      <section className="booking-filter-panel guides-filter-panel" aria-label="Search guides">
        <label className="booking-search">
          <span>Search guides</span>
          <div><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, guide ID, phone or email" /></div>
        </label>
        <button type="button" className="clear-filters" onClick={() => { setQuery(""); setStatus("All Guides"); }}>Clear filters</button>
      </section>

      <section className="reservations-panel">
        <div className="panel-heading"><div><h2>Guide Directory</h2><p>Assignments count pending and confirmed demo bookings.</p></div><p>Showing {filtered.length} of {guides.length} demo guides</p></div>
        <div className="admin-table-wrap guides-table-wrap">
          <table>
            <thead><tr><th>Guide</th><th>Contact</th><th>Verification</th><th>Tour specialities</th><th>Active assignments</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map((guide) => (
              <tr key={guide.id}>
                <td><div className="guides-directory-person"><span className="admin-avatar">{guideInitials(guide.name)}</span><div><button className="guides-name-button" type="button" onClick={() => onViewGuide(guide.id)}>{guide.name}</button><small>{guide.id}</small></div></div></td>
                <td>{guide.phone}<small className="guides-cell-secondary">{guide.email ?? "Email not recorded"}</small></td>
                <td><GuideStatusBadge status={guide.status} /></td>
                <td><span className="guides-specialities-cell">{guide.tours.length ? guide.tours.join(", ") : "None recorded"}</span></td>
                <td>{records.filter((record) => record.assignedGuideId === guide.id && (record.status === "Pending" || record.status === "Confirmed")).length}</td>
                <td><button className="guides-view-button" type="button" onClick={() => onViewGuide(guide.id)} aria-label={`View ${guide.name}`}>View details</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="table-empty"><Search size={20} /><b>No guides match these filters</b><span>Adjust or clear the filters to see the directory.</span><button type="button" className="clear-filters" onClick={() => { setQuery(""); setStatus("All Guides"); }}>Clear filters</button></div>}
      </section>
      <p className="guides-directory-note"><CheckCircle2 size={15} /> Only approved guides can receive new booking assignments.</p>
    </div>
  );
}
