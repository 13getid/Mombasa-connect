import { useState } from "react";
import { CalendarDays, List, Search, TriangleAlert } from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { findGuide, type GuideRecord } from "./guides";
import GuideStatusBadge from "./GuideStatusBadge";
import { isActiveSchedule, localDateString, sameDayGuideBookings } from "./scheduling";
import ScheduleCalendar from "./ScheduleCalendar";
import "./bookings.css";
import "./booking-details.css";
import "./availability-management.css";

type DateFilter = "All dates" | "Today" | "Upcoming" | "Past" | "Custom range";
const filters: DateFilter[] = ["All dates", "Today", "Upcoming", "Past", "Custom range"];

export default function AvailabilityManagement({ records, guides, onViewBooking, onViewGuide, onAssignGuide }: {
  records: BookingRecord[];
  guides: GuideRecord[];
  onViewBooking: (ref: string) => void;
  onViewGuide: (id: string) => void;
  onAssignGuide: (ref: string) => void;
}) {
  const today = localDateString(new Date());
  const [month, setMonth] = useState(today.slice(0, 7));
  const [view, setView] = useState<"Calendar" | "List">("Calendar");
  const [filter, setFilter] = useState<DateFilter>("All dates");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const invalidRange = filter === "Custom range" && Boolean(from && to && from > to);
  const active = records.filter(isActiveSchedule);
  const potential = active.filter((record) => findGuide(guides, record.assignedGuideId) && sameDayGuideBookings(record, records).length > 0);
  const filtered = records.filter((record) => {
    if (invalidRange) return false;
    if (filter === "Today") return record.date === today;
    if (filter === "Upcoming") return record.date > today;
    if (filter === "Past") return record.date < today;
    if (filter === "Custom range") return (!from || record.date >= from) && (!to || record.date <= to);
    return true;
  });
  const visible = filtered.filter((record) => !selectedDate || record.date === selectedDate).slice().sort((a, b) => a.date.localeCompare(b.date) || a.ref.localeCompare(b.ref));
  const selected = records.find((record) => record.ref === selectedRef);
  const selectedGuide = selected && findGuide(guides, selected.assignedGuideId);
  const selectedPotential = selected && selectedGuide ? sameDayGuideBookings(selected, records) : [];
  const setDateFilter = (value: DateFilter) => { setFilter(value); setSelectedDate(""); setSelectedRef(null); };
  const selectDate = (date: string) => { setSelectedDate(date); setSelectedRef(null); };

  return <div className="bookings-page schedule-page">
    <section className="bookings-page-header"><div><p className="admin-eyebrow">Operations planning</p><h1>Availability &amp; Scheduling</h1><p>Review demo bookings by experience date and assigned guide.</p><p className="bookings-demo-note">Demo data only · changes reset on reload. Guide working hours and availability are not recorded.</p></div></section>
    <section className="schedule-summary" aria-label="Schedule summary">
      {([
        ["Upcoming", active.filter((record) => record.date > today).length],
        ["Today", active.filter((record) => record.date === today).length],
        ["Past", records.filter((record) => record.date < today && record.status !== "Cancelled" && record.status !== "Rejected").length],
        ["Confirmed", active.filter((record) => record.status === "Confirmed").length],
        ["Pending", active.filter((record) => record.status === "Pending").length],
        ["No guide", active.filter((record) => !record.assignedGuideId).length],
        ["Potential issues", potential.length],
      ] as const).map(([label, count]) => <div key={label}><span>{label}</span><strong>{count}</strong></div>)}
    </section>
    <p className="schedule-explanation"><TriangleAlert size={16} /> Counts are booking records, not departures. Upcoming, today and no-guide counts use pending and confirmed bookings; past includes completed bookings. Potential issues count active bookings with the same guide on the same date. Times are not recorded, so no time conflict or guide availability can be confirmed.</p>
    <nav className="booking-status-tabs" aria-label="Schedule date filter">
      {filters.map((label) => <button key={label} type="button" className={filter === label ? "active" : ""} aria-pressed={filter === label} onClick={() => setDateFilter(label)}>{label}</button>)}
    </nav>
    {filter === "Custom range" && <section className="booking-filter-panel schedule-range" aria-label="Custom date range">
      <label><span>From</span><input type="date" value={from} onChange={(event) => { setFrom(event.target.value); setSelectedDate(""); setSelectedRef(null); }} /></label>
      <label><span>To</span><input type="date" value={to} onChange={(event) => { setTo(event.target.value); setSelectedDate(""); setSelectedRef(null); }} /></label>
      {invalidRange && <p role="alert">The start date must be on or before the end date.</p>}
    </section>}
    <div className="schedule-view-controls"><div role="group" aria-label="Schedule view"><button type="button" className={view === "Calendar" ? "active" : ""} aria-pressed={view === "Calendar"} onClick={() => setView("Calendar")}><CalendarDays size={15} /> Calendar</button><button type="button" className={view === "List" ? "active" : ""} aria-pressed={view === "List"} onClick={() => setView("List")}><List size={15} /> List</button></div>{selectedDate && <button className="clear-filters" type="button" onClick={() => selectDate("")}>Clear selected date</button>}</div>
    {view === "Calendar" && <ScheduleCalendar month={month} records={filtered} selectedDate={selectedDate} onMonthChange={(nextMonth) => { setMonth(nextMonth); selectDate(""); }} onSelectDate={selectDate} />}
    <section className="reservations-panel">
      <div className="panel-heading"><div><h2>{selectedDate ? `Bookings on ${formatBookingDate(selectedDate)}` : "Booking schedule"}</h2><p>All booking statuses shown; cancelled and rejected records are not active departures.</p></div><p>{visible.length} demo {visible.length === 1 ? "booking" : "bookings"}</p></div>
      <div className="admin-table-wrap schedule-table"><table><thead><tr><th>Experience / reference</th><th>Experience date</th><th>Guests</th><th>Guide / status</th><th>Booking status</th><th>Payment status</th><th>Review</th></tr></thead><tbody>
        {visible.map((record) => {
          const guide = findGuide(guides, record.assignedGuideId);
          const sameDay = guide ? sameDayGuideBookings(record, records) : [];
          return <tr key={record.ref}><td><b>{record.experience}</b><small>{record.ref}</small></td><td>{formatBookingDate(record.date)}</td><td>{record.guests}</td><td>{guide ? <><button className="schedule-link" type="button" onClick={() => onViewGuide(guide.id)}>{guide.name}</button><div><GuideStatusBadge status={guide.status} /></div></> : record.assignedGuideId ? "Unknown guide" : "Unassigned"}{sameDay.length > 0 && <small className="schedule-warning">Same guide, same date · review</small>}</td><td><span className={`admin-status ${record.status.toLowerCase()}`}>{record.status}</span></td><td><span className={`booking-payment payment-${record.payment.toLowerCase()}`}>{record.payment}</span></td><td><button className="schedule-link" type="button" onClick={() => setSelectedRef(record.ref)} aria-label={`Schedule details for ${record.ref}`}>Details</button></td></tr>;
        })}
      </tbody></table></div>
      {!visible.length && <div className="table-empty"><Search size={20} /><b>No booking records for this selection</b><span>Choose another date or adjust the date filter.</span></div>}
    </section>
    {selected && <section className="booking-panel schedule-details" aria-label="Schedule details">
      <div className="panel-heading"><div><h2>Schedule details · {selected.ref}</h2><p>Experience date only; departure time and guide availability are unknown.</p></div><button type="button" className="clear-filters" onClick={() => setSelectedRef(null)}>Close details</button></div>
      <div className="booking-field-grid">
        <div className="booking-field"><span>Experience</span><b>{selected.experience}</b></div><div className="booking-field"><span>Experience date</span><b>{formatBookingDate(selected.date)}</b></div>
        <div className="booking-field"><span>Customer</span><b>{selected.customer}</b></div><div className="booking-field"><span>Guests</span><b>{selected.guests}</b></div>
        <div className="booking-field"><span>Assigned guide</span><b>{selectedGuide ? <button type="button" className="schedule-link" onClick={() => onViewGuide(selectedGuide.id)}>{selectedGuide.name}</button> : selected.assignedGuideId ? `Unknown guide (${selected.assignedGuideId})` : "Unassigned"}</b>{selectedGuide && <GuideStatusBadge status={selectedGuide.status} />}</div>
        <div className="booking-field"><span>Guide availability</span><b>Unknown · working hours not recorded</b></div>
        <div className="booking-field"><span>Booking status</span><b><span className={`admin-status ${selected.status.toLowerCase()}`}>{selected.status}</span></b></div><div className="booking-field"><span>Payment status</span><b><span className={`booking-payment payment-${selected.payment.toLowerCase()}`}>{selected.payment}</span></b></div>
      </div>
      {selectedPotential.length > 0 && <p className="schedule-detail-warning"><TriangleAlert size={15} /> Potential issue: the same guide is assigned to {selectedPotential.map((record) => record.ref).join(", ")} on this date. Without times, an overlap cannot be determined.</p>}
      {isActiveSchedule(selected) && !selected.assignedGuideId && <p className="schedule-detail-warning"><TriangleAlert size={15} /> Missing information: no guide has been assigned to this booking.</p>}
      {selected.assignedGuideId && !selectedGuide && <p className="schedule-detail-warning"><TriangleAlert size={15} /> Missing information: the assigned guide record could not be found.</p>}
      <div className="schedule-detail-actions"><button type="button" className="admin-primary-button" onClick={() => onViewBooking(selected.ref)}>View booking</button>{isActiveSchedule(selected) && <button type="button" className="booking-outline-button" onClick={() => onAssignGuide(selected.ref)}>{selected.assignedGuideId ? "Manage guide assignment" : "Assign guide"}</button>}</div>
    </section>}
  </div>;
}
