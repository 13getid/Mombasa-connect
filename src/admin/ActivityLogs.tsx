import { useState } from "react";
import { Activity as ActivityIcon, BookOpen, Download, Search, Settings, TicketCheck } from "lucide-react";
import { activitiesCsv, activityModules, activitySummary, activityTypes, filterActivities, initialActivityFilters, type Activity } from "./activity";
import "./bookings.css";
import "./booking-details.css";
import "./activity-logs.css";

function displayTime(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" });
}

export default function ActivityLogs({ activities }: { activities: Activity[] }) {
  const [filters, setFilters] = useState(initialActivityFilters);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const filtered = filterActivities(activities, filters);
  const summary = activitySummary(activities);
  const selected = filtered.find((item) => item.id === selectedId);
  const update = (next: typeof filters) => { setFilters(next); setSelectedId(null); };
  const exportRows = () => {
    const url = URL.createObjectURL(new Blob([activitiesCsv(filtered)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mombasa-connect-demo-activity.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="bookings-page activity-page">
    <section className="bookings-page-header">
      <div><p className="admin-eyebrow">Session history</p><h1>Activity Logs</h1>
        <p>Review supported actions performed in this Admin demo session.</p>
        <p className="bookings-demo-note">Starts empty and resets on reload. This is not a secure or persistent audit trail.</p></div>
      <button type="button" className="admin-primary-button" onClick={exportRows}><Download size={16} /> Export CSV</button>
    </section>
    <section className="booking-stats-grid" aria-label="Session activity summary">
      {([
        ["Total recorded activities", summary.total, ActivityIcon],
        ["Booking-related activities", summary.bookings, TicketCheck],
        ["Content and catalogue", summary.content, BookOpen],
        ["Administrative activities", summary.administrative, Settings],
      ] as const).map(([label, count, Icon]) => <article key={label}><span><Icon size={18} /></span><div><p>{label}</p><strong>{count}</strong><small>Current session</small></div></article>)}
    </section>
    <section className="booking-filter-panel activity-filters" aria-label="Activity filters">
      <label className="booking-search"><span>Search activities</span><div><Search size={16} /><input value={filters.search} onChange={(event) => update({ ...filters, search: event.target.value })} placeholder="Action, actor, module or reference" /></div></label>
      <label><span>Module</span><select value={filters.module} onChange={(event) => update({ ...filters, module: event.target.value })}><option value="All">All modules</option>{activityModules.map((module) => <option key={module}>{module}</option>)}</select></label>
      <label><span>Activity type</span><select value={filters.type} onChange={(event) => update({ ...filters, type: event.target.value })}><option value="All">All types</option>{activityTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label><span>Order</span><select value={filters.order} onChange={(event) => update({ ...filters, order: event.target.value === "oldest" ? "oldest" : "newest" })}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
      <button type="button" className="clear-filters" onClick={() => update(initialActivityFilters)}>Clear filters</button>
    </section>
    <section className="reservations-panel">
      <div className="panel-heading"><div><h2>Session activity</h2><p>Times use your browser's local timezone. Counts above cover the entire session.</p></div><p>Showing {filtered.length} of {activities.length}</p></div>
      <div className="admin-table-wrap activity-table"><table><thead><tr><th>Action</th><th>Module</th><th>Actor</th><th>Reference</th><th>Recorded at</th><th>Type</th><th>Details</th></tr></thead><tbody>
        {filtered.map((item) => <tr key={item.id}><td><b>{item.action}</b></td><td>{item.module}</td><td>{item.actor}</td><td>{item.reference || "Not recorded"}</td><td><time dateTime={item.timestamp}>{displayTime(item.timestamp)}</time></td><td>{item.type}</td><td><button type="button" className="activity-link" onClick={() => setSelectedId(item.id)} aria-label={`View activity details: ${item.action}${item.reference ? ` ${item.reference}` : ""}`}>Details</button></td></tr>)}
      </tbody></table></div>
      {!filtered.length && <div className="table-empty" role="status"><Search size={20} /><b>{activities.length ? "No activities match these filters" : "No activities recorded yet"}</b><span>{activities.length ? "Adjust or clear the filters to see session activity." : "Supported actions will appear here when performed in this session."}</span>{activities.length > 0 && <button type="button" className="clear-filters" onClick={() => update(initialActivityFilters)}>Clear filters</button>}</div>}
    </section>
    {selected && <section className="booking-panel" aria-label="Activity details">
      <div className="panel-heading"><div><h2>Activity details</h2><p>Information recorded at the time of this demo action.</p></div><button type="button" className="clear-filters" onClick={() => setSelectedId(null)}>Close details</button></div>
      <dl className="activity-details"><div><dt>Action</dt><dd>{selected.action}</dd></div><div><dt>Module</dt><dd>{selected.module}</dd></div><div><dt>Type</dt><dd>{selected.type}</dd></div><div><dt>Actor</dt><dd>{selected.actor}</dd></div><div><dt>Reference</dt><dd>{selected.reference || "Not recorded"}</dd></div><div><dt>Recorded at</dt><dd><time dateTime={selected.timestamp}>{displayTime(selected.timestamp)}</time></dd></div><div><dt>Details</dt><dd>{selected.details || "Not recorded"}</dd></div></dl>
    </section>}
  </div>;
}
