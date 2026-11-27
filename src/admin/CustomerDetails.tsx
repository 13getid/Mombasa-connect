import { ArrowLeft, ClipboardList, Search, UserRound } from "lucide-react";
import { formatBookingDate } from "./BookingsManagement";
import type { CustomerRecord } from "./customers";
import "./bookings.css";
import "./booking-details.css";
import "./customers-management.css";

export default function CustomerDetails({ customer, onBack, onViewBooking }: {
  customer: CustomerRecord | undefined;
  onBack: () => void;
  onViewBooking: (ref: string) => void;
}) {
  if (!customer) {
    return <div className="booking-details-page"><button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Customers</button><section className="booking-panel booking-not-found"><Search size={22} /><h1>Customer not found</h1><p>This customer is not available in the current demo bookings.</p><button className="admin-primary-button" type="button" onClick={onBack}>Return to Customers</button></section></div>;
  }
  const bookings = [...customer.bookings].sort((a, b) => b.date.localeCompare(a.date));
  const statuses = ["Confirmed", "Completed", "Cancelled", "Pending", "Rejected"] as const;
  return (
    <div className="booking-details-page customer-details-page">
      <section className="booking-details-header">
        <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Customers</button>
        <p className="admin-eyebrow">Customer activity</p>
        <div className="booking-ref-row"><h1>{customer.name || "Name not provided"}</h1><span className={`source ${customer.hasWebsiteBooking ? "website" : "ussd"}`}>{customer.hasWebsiteBooking ? "Website booking customer" : "USSD-only customer"}</span></div>
        <p className="booking-details-meta">Demo booking data · account information is not connected</p>
      </section>
      <section className="booking-panel">
        <div className="panel-heading"><div><h2>Customer Information</h2><p>Contact details supplied with the demo bookings.</p></div><UserRound size={17} /></div>
        <div className="booking-field-grid">
          <div className="booking-field"><span>Name</span><b>{customer.name || "Not provided"}</b></div>
          <div className="booking-field"><span>Phone number</span><b>{customer.phone || "Not provided"}</b></div>
          <div className="booking-field"><span>Email address</span><b>Not provided</b></div>
          <div className="booking-field"><span>Website account</span><b>Not recorded</b></div>
          <div className="booking-field"><span>Booking channels</span><b>{[...new Set(bookings.map((booking) => booking.source))].join(", ") || "Not provided"}</b></div>
        </div>
      </section>
      <section className="booking-panel">
        <div className="panel-heading"><div><h2>Booking Overview</h2><p>Current booking statuses, independent of payment.</p></div><ClipboardList size={17} /></div>
        <div className="customer-status-summary"><div><strong>{bookings.length}</strong><span>Total bookings</span></div>{statuses.map((status) => <div key={status}><strong>{bookings.filter((booking) => booking.status === status).length}</strong><span>{status}</span></div>)}</div>
      </section>
      <section className="booking-panel">
        <div className="panel-heading"><div><h2>Booking History</h2><p>Booking creation dates are not recorded in the demo data.</p></div></div>
        {bookings.length ? <div className="admin-table-wrap customer-history-table"><table>
          <thead><tr><th>Reference</th><th>Experience</th><th>Booking date</th><th>Experience date</th><th>Booking status</th><th>Payment status</th><th>Source</th><th>Action</th></tr></thead>
          <tbody>{bookings.map((booking) => <tr key={booking.ref}><td><b>{booking.ref}</b></td><td>{booking.experience}</td><td>Not recorded</td><td>{formatBookingDate(booking.date)}</td><td><span className={`admin-status ${booking.status.toLowerCase()}`}>{booking.status}</span></td><td><span className={`booking-payment payment-${booking.payment.toLowerCase()}`}>{booking.payment}</span></td><td><span className={`source ${booking.source.toLowerCase()}`}>{booking.source}</span></td><td><button type="button" className="customers-link customers-view" onClick={() => onViewBooking(booking.ref)} aria-label={`View booking ${booking.ref}`}>View booking</button></td></tr>)}</tbody>
        </table></div> : <p className="customers-empty">No bookings are available for this customer.</p>}
      </section>
    </div>
  );
}
