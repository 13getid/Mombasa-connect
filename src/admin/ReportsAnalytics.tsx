import { useState } from "react";
import { Download } from "lucide-react";
import type { BookingRecord } from "./BookingsManagement";
import type { GuideRecord } from "./guides";
import type { TourRecord } from "./tours";
import { paymentStatuses } from "./payments";
import { bookingStatuses } from "./ussd";
import { filterReportBookings, initialReportFilters, reportSummary, reportsCsv, tourPerformance } from "./reports";
import GuideStatusBadge from "./GuideStatusBadge";
import "./bookings.css";
import "./reports-analytics.css";

function amount(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

function Breakdown({ title, note, values, total }: {
  title: string;
  note: string;
  values: { label: string; count: number }[];
  total: number;
}) {
  return <section className="reports-panel" aria-label={title}>
    <div className="panel-heading"><div><h2>{title}</h2><p>{note}</p></div></div>
    <ul className="reports-bars">
      {values.map(({ label, count }) => {
        const percentage = total ? count / total * 100 : 0;
        return <li key={label}>
          <div><span>{label}</span><b>{count} <small>· {Number(percentage.toFixed(1))}%</small></b></div>
          <div className="reports-bar-track" aria-hidden="true"><div style={{ width: `${percentage}%` }} /></div>
        </li>;
      })}
    </ul>
  </section>;
}

export default function ReportsAnalytics({ records, tours, guides }: {
  records: BookingRecord[];
  tours: TourRecord[];
  guides: GuideRecord[];
}) {
  const [filters, setFilters] = useState(initialReportFilters);
  const invalidRange = Boolean(filters.from && filters.to && filters.from > filters.to);
  const filtered = filterReportBookings(records, filters);
  const summary = reportSummary(filtered, guides);
  const performance = tourPerformance(filtered, tours);
  const exportRows = () => {
    const url = URL.createObjectURL(new Blob([reportsCsv(filtered, guides)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mombasa-connect-demo-report-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return <div className="bookings-page reports-page">
    <section className="bookings-page-header">
      <div><p className="admin-eyebrow">Platform insights</p><h1>Reports &amp; Analytics</h1><p>Explore the shared demo booking, tour and guide records.</p><p className="bookings-demo-note">Demo data only · changes reset on reload. Experience dates are not booking creation dates.</p></div>
      <button type="button" className="admin-primary-button" disabled={invalidRange} onClick={exportRows}><Download size={16} /> Export CSV</button>
    </section>
    <section className="booking-filter-panel reports-filter" aria-label="Report filters">
      <label><span>Experience Date from</span><input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
      <label><span>Experience Date to</span><input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
      <label><span>Booking status</span><select value={filters.bookingStatus} onChange={(event) => setFilters({ ...filters, bookingStatus: event.target.value })}><option value="All">All bookings</option>{bookingStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label><span>Payment status</span><select value={filters.paymentStatus} onChange={(event) => setFilters({ ...filters, paymentStatus: event.target.value })}><option value="All">All payments</option>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label><span>Booking source</span><select value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value })}><option value="All">All sources</option><option value="Website">WEB (Website)</option><option>USSD</option><option>Unknown/Other</option></select></label>
      <button type="button" className="clear-filters" onClick={() => setFilters(initialReportFilters)}>Reset filters</button>
    </section>
    {invalidRange && <p className="reports-error" role="alert">Experience Date from must be on or before Experience Date to. Correct the range before exporting.</p>}
    <p className="reports-context">Showing {filtered.length} of {records.length} demo booking records. Filters apply to booking-derived figures; guide-directory totals and catalogue details reflect current records.</p>
    <section className="reports-summary" aria-label="Filtered booking summary">
      {([
        ["Total bookings", summary.total],
        ["Confirmed bookings", summary.bookingCounts.Confirmed],
        ["Completed bookings", summary.bookingCounts.Completed],
        ["Pending bookings", summary.bookingCounts.Pending],
        ["Cancelled bookings", summary.bookingCounts.Cancelled],
        ["Recorded Booking Value", amount(summary.value)],
        ["WEB bookings", summary.sources.Website],
        ["USSD bookings", summary.sources.USSD],
      ] as const).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </section>
    <p className="reports-context">Counts are booking records in the selection. Recorded Booking Value sums their stored amounts across all statuses, including cancelled and rejected bookings; it is not revenue or money received.</p>
    {!filtered.length && !invalidRange && <div className="reports-empty" role="status">No booking records match the selected filters. Reset filters to broaden the report.</div>}
    <div className="reports-breakdowns">
      <Breakdown title="Booking status" note="Current booking status · share of filtered bookings" total={summary.total} values={bookingStatuses.map((status) => ({ label: status, count: summary.bookingCounts[status] }))} />
      <Breakdown title="Payment status" note="Recorded statuses, not payment-provider settlements" total={summary.total} values={paymentStatuses.map((status) => ({ label: status, count: summary.paymentCounts[status] }))} />
      <Breakdown title="Booking source" note="USSD bookings are not gateway sessions" total={summary.total} values={[
        { label: "WEB (Website)", count: summary.sources.Website },
        { label: "USSD", count: summary.sources.USSD },
        { label: "Unknown/Other", count: summary.sources["Unknown/Other"] },
      ]} />
    </div>
    <section className="reservations-panel">
      <div className="panel-heading"><div><h2>Tour performance</h2><p>Filtered bookings and stored booking values, including all statuses. Category and publication status are current catalogue details.</p></div></div>
      <p className="reports-panel-note">Bookings match catalogue names exactly. Unmatched or ambiguous names appear separately; zero-booking catalogue tours remain visible.</p>
      <div className="admin-table-wrap reports-tour-table"><table><thead><tr><th>Experience</th><th>Category</th><th>Bookings</th><th>Recorded booking value</th><th>Catalogue status</th></tr></thead><tbody>
        {performance.map((row) => <tr key={row.key}><td><b>{row.name}</b></td><td>{row.category}</td><td>{row.count}</td><td>{amount(row.value)}</td><td>{row.status}</td></tr>)}
      </tbody></table></div>
      {!performance.length && <div className="table-empty"><b>No tour or booking records</b><span>There are no catalogue tours or unmatched bookings to report.</span></div>}
    </section>
    <div className="reports-lower">
      <section className="reports-panel" aria-label="Guide activity">
        <div className="panel-heading"><div><h2>Guide activity</h2><p>Guide status totals use the full current directory, regardless of booking filters.</p></div></div>
        <div className="reports-guide-stats">
          <div><span>Total guides</span><b>{guides.length}</b></div>
          {Object.entries(summary.guideCounts).map(([status, count]) => <div key={status}><span>{status}</span><b>{count}</b></div>)}
        </div>
        <p className="reports-panel-note">Filtered bookings: {summary.assigned} assigned · {summary.unassigned} unassigned · {summary.unknownGuide} assigned to a missing guide record. An assignment does not establish a completed tour.</p>
        <div className="admin-table-wrap reports-guide-table"><table><thead><tr><th>Guide</th><th>Current status</th><th>Assigned bookings</th></tr></thead><tbody>
          {guides.map((guide) => <tr key={guide.id}><td><b>{guide.name}</b></td><td><GuideStatusBadge status={guide.status} /></td><td>{filtered.filter((record) => record.assignedGuideId === guide.id).length}</td></tr>)}
        </tbody></table></div>
        {!guides.length && <p className="reports-panel-note">No guide records are available.</p>}
      </section>
      <section className="reports-panel" aria-label="Customer booking patterns">
        <div className="panel-heading"><div><h2>Customer booking patterns</h2><p>Derived from the filtered booking records, not account data.</p></div></div>
        <div className="reports-guide-stats">
          <div><span>Contact groups</span><b>{summary.customerGroups}</b></div>
          <div><span>Groups with multiple bookings</span><b>{summary.multipleBookings}</b></div>
          <div><span>Bookings with no name or phone</span><b>{summary.unidentifiedBookings}</b></div>
        </div>
        <p className="reports-panel-note">Groups follow the existing name-and-phone matching heuristic. Incomplete details remain separate; shared phones or name variations can affect results. These are not verified people, accounts or retention.</p>
      </section>
    </div>
  </div>;
}
