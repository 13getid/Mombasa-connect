import { useState } from "react";
import { CreditCard, Download, Search } from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { paymentCsv, paymentStatuses, paymentSummary } from "./payments";
import "./bookings.css";
import "./booking-details.css";
import "./payments-management.css";

type PaymentFilter = "All payments" | BookingRecord["payment"];

function amount(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export default function PaymentsManagement({ records, onViewBooking }: {
  records: BookingRecord[];
  onViewBooking: (ref: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PaymentFilter>("All payments");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const summary = paymentSummary(records);
  const filtered = records.filter((record) => (status === "All payments" || record.payment === status)
    && [record.ref, record.customer, record.phone, record.experience].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())));
  const selected = records.find((record) => record.ref === selectedRef);
  const clear = () => { setQuery(""); setStatus("All payments"); setSelectedRef(null); };
  const exportRows = () => {
    const url = URL.createObjectURL(new Blob([paymentCsv(filtered)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mombasa-connect-demo-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="bookings-page payments-page">
    <section className="bookings-page-header">
      <div><p className="admin-eyebrow">Payment oversight</p><h1>Payments Management</h1><p>Review recorded payment statuses alongside demo booking values.</p><p className="bookings-demo-note">Read-only demo data. No payments or refunds are processed; changes reset on reload.</p></div>
      <button type="button" className="admin-primary-button" onClick={exportRows}><Download size={16} /> Export CSV</button>
    </section>
    <section className="payments-summary" aria-label="Demo payment summary">
      {([
        ["Total booking value", amount(summary.total)],
        ["Paid booking value", amount(summary.amounts.Paid)],
        ["Pending booking value", amount(summary.amounts.Pending)],
        ["Unpaid booking value", amount(summary.amounts.Unpaid)],
        ["Failed payments", summary.failed],
        ["Refunded booking value", amount(summary.amounts.Refunded)],
        ["Bookings with payment status", summary.count],
      ] as const).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </section>
    <p className="payments-note">Amounts are full booking values grouped by the current demo payment status, not verified receipts or refund amounts. No actual or retained revenue can be calculated from these records.</p>
    <nav className="booking-status-tabs" aria-label="Payment status filter">
      {(["All payments", ...paymentStatuses] as const).map((filter) => <button key={filter} type="button" className={status === filter ? "active" : ""} aria-pressed={status === filter} onClick={() => { setStatus(filter); setSelectedRef(null); }}>{filter}<span>{filter === "All payments" ? records.length : records.filter((record) => record.payment === filter).length}</span></button>)}
    </nav>
    <section className="booking-filter-panel payments-filter" aria-label="Search payments">
      <label className="booking-search"><span>Search payments</span><div><Search size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedRef(null); }} placeholder="Reference, customer, phone or experience" /></div></label>
      <button type="button" className="clear-filters" onClick={clear}>Clear filters</button>
    </section>
    <section className="reservations-panel">
      <div className="panel-heading"><div><h2>Payment Records</h2><p>One status per demo booking; no transaction records are available.</p></div><p>Showing {filtered.length} of {records.length} bookings</p></div>
      <div className="admin-table-wrap payments-table"><table><thead><tr><th>Booking reference</th><th>Customer</th><th>Experience</th><th>Source</th><th>Booking amount</th><th>Payment status</th><th>Booking status</th><th>Action</th></tr></thead><tbody>
        {filtered.map((record) => <tr key={record.ref}><td><b>{record.ref}</b></td><td>{record.customer || "Not recorded"}<small>{record.phone || "Phone not recorded"}</small></td><td>{record.experience}</td><td>{record.source}</td><td><b>{amount(record.amount)}</b></td><td><span className={`booking-payment payment-${record.payment.toLowerCase()}`}>{record.payment}</span></td><td><span className={`admin-status ${record.status.toLowerCase()}`}>{record.status}</span></td><td><button className="payments-link" type="button" onClick={() => setSelectedRef(record.ref)} aria-label={`Payment details for ${record.ref}`}>Details</button></td></tr>)}
      </tbody></table></div>
      {!filtered.length && <div className="table-empty"><Search size={20} /><b>No payment records match these filters</b><span>Adjust or clear the filters to see bookings.</span><button type="button" className="clear-filters" onClick={clear}>Clear filters</button></div>}
    </section>
    {selected && <section className="booking-panel" aria-label="Payment details">
      <div className="panel-heading"><div><h2>Payment details · {selected.ref}</h2><p>Recorded booking information, not a payment transaction.</p></div><button className="clear-filters" type="button" onClick={() => setSelectedRef(null)}>Close details</button></div>
      <div className="booking-field-grid">
        <div className="booking-field"><span>Booking reference</span><b>{selected.ref}</b></div><div className="booking-field"><span>Customer</span><b>{selected.customer || "Not recorded"}</b></div>
        <div className="booking-field"><span>Experience</span><b>{selected.experience}</b></div><div className="booking-field"><span>Booking amount</span><b>{amount(selected.amount)}</b></div>
        <div className="booking-field"><span>Payment status</span><b><span className={`booking-payment payment-${selected.payment.toLowerCase()}`}>{selected.payment}</span></b></div><div className="booking-field"><span>Booking status</span><b><span className={`admin-status ${selected.status.toLowerCase()}`}>{selected.status}</span></b></div>
        <div className="booking-field"><span>Booking source</span><b>{selected.source}</b></div><div className="booking-field"><span>Experience date</span><b>{formatBookingDate(selected.date)}</b></div>
        <div className="booking-field"><span>Guests</span><b>{selected.guests}</b></div><div className="booking-field"><span>Payment method</span><b>Not recorded</b></div>
        <div className="booking-field"><span>Transaction reference</span><b>Not recorded</b></div><div className="booking-field"><span>Provider reference</span><b>Not recorded</b></div>
        <div className="booking-field"><span>Payment timestamp</span><b>Not recorded</b></div><div className="booking-field"><span>Amount received</span><b>Not recorded</b></div>
        <div className="booking-field"><span>Amount refunded</span><b>Not recorded</b></div>
      </div>
      <p className="payments-note payments-detail-note"><CreditCard size={15} /> Payment verification and refund processing require a future backend and payment provider.</p>
      <div className="payments-actions"><button type="button" className="admin-primary-button" onClick={() => onViewBooking(selected.ref)}>View booking</button></div>
    </section>}
  </div>;
}
