import { useState } from "react";
import { Download, Search } from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { findGuide, type GuideRecord } from "./guides";
import GuideStatusBadge from "./GuideStatusBadge";
import { paymentStatuses } from "./payments";
import { bookingStatuses, ussdBookings, ussdCsv } from "./ussd";
import "./bookings.css";
import "./booking-details.css";
import "./ussd-activity.css";

type BookingFilter = "All USSD bookings" | BookingRecord["status"];

function amount(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export default function USSDActivity({ records, guides, onViewBooking }: {
  records: BookingRecord[];
  guides: GuideRecord[];
  onViewBooking: (ref: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BookingFilter>("All USSD bookings");
  const [payment, setPayment] = useState("All payments");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const bookings = ussdBookings(records);
  const filtered = bookings.filter((record) => (status === "All USSD bookings" || record.status === status)
    && (payment === "All payments" || record.payment === payment)
    && [record.ref, record.customer, record.phone, record.experience].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())));
  const selected = bookings.find((record) => record.ref === selectedRef);
  const guide = selected && findGuide(guides, selected.assignedGuideId);
  const clear = () => { setQuery(""); setStatus("All USSD bookings"); setPayment("All payments"); setSelectedRef(null); };
  const exportRows = () => {
    const url = URL.createObjectURL(new Blob([ussdCsv(filtered)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mombasa-connect-demo-ussd-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="bookings-page ussd-page">
    <section className="bookings-page-header">
      <div><p className="admin-eyebrow">Channel oversight</p><h1>USSD Activity</h1><p>Review demo bookings recorded with the USSD source.</p><p className="bookings-demo-note">Booking records only, not live USSD traffic. Demo changes reset on reload.</p></div>
      <button type="button" className="admin-primary-button" onClick={exportRows}><Download size={16} /> Export CSV</button>
    </section>
    <section className="ussd-summary" aria-label="USSD booking summary">
      {([
        ["Total USSD bookings", bookings.length],
        ...bookingStatuses.map((value) => [`${value} bookings`, bookings.filter((record) => record.status === value).length] as const),
        ["USSD booking value", amount(bookings.reduce((total, record) => total + record.amount, 0))],
      ] as const).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </section>
    <section className="ussd-information" aria-label="USSD data limitations">
      <h2>Booking activity, not gateway sessions</h2>
      <p>These figures cover all USSD-sourced demo bookings, including cancelled and rejected bookings. Booking value is not verified revenue. Gateway sessions, menu interactions, timestamps and transaction references are not connected or recorded.</p>
    </section>
    <section className="ussd-payment-breakdown" aria-label="USSD booking payment status breakdown">
      <h2>Payment status <span>· USSD booking counts</span></h2>
      <div>{paymentStatuses.map((value) => <span key={value}><span className={`booking-payment payment-${value.toLowerCase()}`}>{value}</span> <b>{bookings.filter((record) => record.payment === value).length}</b></span>)}</div>
    </section>
    <nav className="booking-status-tabs" aria-label="USSD booking status filter">
      {(["All USSD bookings", ...bookingStatuses] as const).map((value) => <button key={value} type="button" className={status === value ? "active" : ""} aria-pressed={status === value} onClick={() => { setStatus(value); setSelectedRef(null); }}>{value}<span>{value === "All USSD bookings" ? bookings.length : bookings.filter((record) => record.status === value).length}</span></button>)}
    </nav>
    <section className="booking-filter-panel ussd-filter" aria-label="Filter USSD bookings">
      <label className="booking-search"><span>Search USSD bookings</span><div><Search size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedRef(null); }} placeholder="Reference, customer, phone or experience" /></div></label>
      <label><span>Payment status</span><select value={payment} onChange={(event) => { setPayment(event.target.value); setSelectedRef(null); }}><option>All payments</option>{paymentStatuses.map((value) => <option key={value}>{value}</option>)}</select></label>
      <button type="button" className="clear-filters" onClick={clear}>Clear filters</button>
    </section>
    <section className="reservations-panel">
      <div className="panel-heading"><div><h2>USSD booking records</h2><p>Experience dates are not booking or session dates.</p></div><p>Showing {filtered.length} of {bookings.length} demo bookings</p></div>
      <div className="admin-table-wrap ussd-table"><table><thead><tr><th>Booking reference</th><th>Customer</th><th>Phone</th><th>Experience</th><th>Experience date</th><th>Guests</th><th>Booking amount</th><th>Booking status</th><th>Payment status</th><th>Action</th></tr></thead><tbody>
        {filtered.map((record) => <tr key={record.ref}><td><b>{record.ref}</b></td><td>{record.customer || "Not recorded"}</td><td>{record.phone || "Not recorded"}</td><td>{record.experience || "Not recorded"}</td><td>{record.date ? formatBookingDate(record.date) : "Not recorded"}</td><td>{record.guests}</td><td><b>{amount(record.amount)}</b></td><td><span className={`admin-status ${record.status.toLowerCase()}`}>{record.status}</span></td><td><span className={`booking-payment payment-${record.payment.toLowerCase()}`}>{record.payment}</span></td><td><button className="ussd-link" type="button" onClick={() => setSelectedRef(record.ref)} aria-label={`USSD booking details for ${record.ref}`}>Details</button></td></tr>)}
      </tbody></table></div>
      {!filtered.length && <div className="table-empty"><Search size={20} /><b>{bookings.length ? "No USSD bookings match these filters" : "No USSD booking records"}</b><span>{bookings.length ? "Adjust or clear the filters to see available records." : "No bookings have been recorded with the USSD source."}</span>{bookings.length > 0 && <button type="button" className="clear-filters" onClick={clear}>Clear filters</button>}</div>}
    </section>
    {selected && <section className="booking-panel" aria-label="USSD booking details">
      <div className="panel-heading"><div><h2>USSD booking details · {selected.ref}</h2><p>Information from the shared demo booking record.</p></div><button className="clear-filters" type="button" onClick={() => setSelectedRef(null)}>Close details</button></div>
      <div className="booking-field-grid">
        <div className="booking-field"><span>Booking reference</span><b>{selected.ref}</b></div><div className="booking-field"><span>Customer name</span><b>{selected.customer || "Not recorded"}</b></div>
        <div className="booking-field"><span>Phone number</span><b>{selected.phone || "Not recorded"}</b></div><div className="booking-field"><span>Experience</span><b>{selected.experience || "Not recorded"}</b></div>
        <div className="booking-field"><span>Experience date</span><b>{selected.date ? formatBookingDate(selected.date) : "Not recorded"}</b></div><div className="booking-field"><span>Guests</span><b>{selected.guests}</b></div>
        <div className="booking-field"><span>Booking amount</span><b>{amount(selected.amount)}</b></div><div className="booking-field"><span>Booking source</span><b>{selected.source}</b></div>
        <div className="booking-field"><span>Booking status</span><b><span className={`admin-status ${selected.status.toLowerCase()}`}>{selected.status}</span></b></div><div className="booking-field"><span>Payment status</span><b><span className={`booking-payment payment-${selected.payment.toLowerCase()}`}>{selected.payment}</span></b></div>
        <div className="booking-field"><span>Assigned guide</span><b>{guide ? guide.name : selected.assignedGuideId ? `Unknown guide (${selected.assignedGuideId})` : "Unassigned"}</b>{guide && <GuideStatusBadge status={guide.status} />}</div>
      </div>
      <div className="ussd-actions"><button type="button" className="admin-primary-button" onClick={() => onViewBooking(selected.ref)}>View booking</button></div>
    </section>}
  </div>;
}
