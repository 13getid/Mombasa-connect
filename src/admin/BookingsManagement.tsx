import { useState } from "react";
import { Check, Clock3, Download, Search, TicketCheck, X } from "lucide-react";
import "./bookings.css";

export type BookingRecord = {
  ref: string;
  customer: string;
  phone: string;
  experience: string;
  date: string;
  guests: number;
  source: "Website" | "USSD";
  amount: number;
  payment: "Paid" | "Pending" | "Failed" | "Refunded";
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
};

const statuses = ["All Bookings", "Pending", "Confirmed", "Completed", "Cancelled", "Rejected"] as const;

export function formatBookingDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BookingsManagement({
  records,
  onRecordsChange,
  query,
  onQuery,
  initialDate,
  onPrototype,
  onViewBooking,
}: {
  records: BookingRecord[];
  onRecordsChange: (records: BookingRecord[]) => void;
  query: string;
  onQuery: (query: string) => void;
  initialDate: string;
  onPrototype: (label: string) => void;
  onViewBooking: (ref: string) => void;
}) {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All Bookings");
  const [tour, setTour] = useState("All Tours");
  const [source, setSource] = useState("All Sources");
  const [payment, setPayment] = useState("All Payments");
  const [date, setDate] = useState(initialDate);

  const filtered = records.filter((record) => {
    const searchText = Object.values(record).join(" ").toLowerCase();
    return searchText.includes(query.trim().toLowerCase())
      && (status === "All Bookings" || record.status === status)
      && (tour === "All Tours" || record.experience === tour)
      && (source === "All Sources" || record.source === source)
      && (payment === "All Payments" || record.payment === payment)
      && (!date || record.date === date);
  });
  const count = (value: string) => value === "All Bookings" ? records.length : records.filter((record) => record.status === value).length;
  const clearFilters = () => {
    setStatus("All Bookings");
    setTour("All Tours");
    setSource("All Sources");
    setPayment("All Payments");
    setDate("");
    onQuery("");
  };
  const updateStatus = (ref: string, nextStatus: BookingRecord["status"]) => {
    onRecordsChange(records.map((record) => record.ref === ref ? { ...record, status: nextStatus } : record));
  };
  const exportRows = () => {
    const rows = [
      ["Booking Reference", "Customer", "Phone", "Experience", "Experience Date", "Guests", "Source", "Amount (KES)", "Payment", "Status"],
      ...filtered.map((record) => [record.ref, record.customer, record.phone, record.experience, record.date, record.guests, record.source, record.amount, record.payment, record.status]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mombasa-connect-demo-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bookings-page">
      <section className="bookings-page-header">
        <div>
          <p className="admin-eyebrow">Reservations workspace</p>
          <h1>Bookings Management</h1>
          <p>View, track and manage customer reservations across Mombasa Connect.</p>
          <p className="bookings-demo-note">Demo data only. Changes are temporary and do not affect real bookings.</p>
        </div>
        <button className="admin-primary-button" type="button" onClick={exportRows}><Download size={16} /> Export</button>
      </section>

      <section className="booking-stats-grid" aria-label="Demo booking summary">
        {([
          ["Total bookings", "All Bookings", TicketCheck],
          ["Pending bookings", "Pending", Clock3],
          ["Confirmed bookings", "Confirmed", Check],
          ["Cancelled bookings", "Cancelled", X],
        ] as const).map(([label, value, Icon]) => (
          <article key={label}>
            <span><Icon size={18} /></span>
            <div><p>{label}</p><strong>{count(value)}</strong><small>Demo reservations</small></div>
          </article>
        ))}
      </section>

      <nav className="booking-status-tabs" aria-label="Booking status">
        {statuses.map((label) => (
          <button type="button" key={label} className={status === label ? "active" : ""} aria-pressed={status === label} onClick={() => setStatus(label)}>
            {label}<span>{count(label)}</span>
          </button>
        ))}
      </nav>

      <section className="booking-filter-panel" aria-label="Filter bookings">
        <label className="booking-search">
          <span>Search bookings</span>
          <div><Search size={16} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Reference, customer or phone" /></div>
        </label>
        <label><span>Tour</span><select value={tour} onChange={(event) => setTour(event.target.value)}>
          <option>All Tours</option>{[...new Set(records.map((record) => record.experience))].map((name) => <option key={name}>{name}</option>)}
        </select></label>
        <label><span>Source</span><select value={source} onChange={(event) => setSource(event.target.value)}><option>All Sources</option><option>Website</option><option>USSD</option></select></label>
        <label><span>Payment</span><select value={payment} onChange={(event) => setPayment(event.target.value)}><option>All Payments</option><option>Paid</option><option>Pending</option><option>Failed</option><option>Refunded</option></select></label>
        <label><span>Experience date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <button type="button" className="clear-filters" onClick={clearFilters}>Clear filters</button>
      </section>

      <section className="reservations-panel">
        <div className="panel-heading">
          <div><h2>All Reservations</h2><p>Manage and review demo customer bookings.</p></div>
          <p>Showing {filtered.length} of {records.length} demo reservations</p>
        </div>
        <div className="admin-table-wrap bookings-table-wrap">
          <table>
            <thead><tr><th>Booking reference</th><th>Customer</th><th>Tour / Experience</th><th>Experience date</th><th>Guests</th><th>Source</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map((record) => (
              <tr key={record.ref}>
                <td><b>{record.ref}</b></td>
                <td><b>{record.customer}</b><small className="booking-customer-phone">{record.phone}</small></td>
                <td>{record.experience}</td><td>{formatBookingDate(record.date)}</td><td>{record.guests}</td>
                <td><span className={`source ${record.source.toLowerCase()}`}>{record.source}</span></td>
                <td><b>KES {record.amount.toLocaleString("en-KE")}</b></td>
                <td><span className={`booking-payment payment-${record.payment.toLowerCase()}`}>{record.payment}</span></td>
                <td><span className={`admin-status ${record.status.toLowerCase()}`}>{record.status}</span></td>
                <td><details className="booking-actions"><summary aria-label={`Actions for ${record.ref}`}>Actions</summary>
                  <div>
                    <button type="button" onClick={() => onViewBooking(record.ref)}>View Booking</button>
                    {record.status === "Pending" && <button type="button" onClick={() => updateStatus(record.ref, "Confirmed")}>Confirm Booking</button>}
                    {(record.status === "Pending" || record.status === "Confirmed") && <>
                      <button type="button" onClick={() => onPrototype(`Assign Guide - ${record.ref}`)}>Assign Guide</button>
                      <button type="button" onClick={() => updateStatus(record.ref, "Cancelled")}>Cancel Booking</button>
                    </>}
                  </div>
                </details></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="table-empty"><Search size={20} /><b>No reservations match these filters</b><span>Adjust or clear the filters to see bookings.</span><button type="button" className="clear-filters" onClick={clearFilters}>Clear filters</button></div>}
      </section>
    </div>
  );
}
