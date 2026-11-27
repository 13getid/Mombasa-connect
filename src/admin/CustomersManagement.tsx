import { useState } from "react";
import { Globe, Search, Smartphone, TicketCheck, Users } from "lucide-react";
import { formatBookingDate } from "./BookingsManagement";
import type { CustomerRecord } from "./customers";
import "./bookings.css";
import "./customers-management.css";

const filters = ["All customers", "Website customers", "USSD-only customers", "Customers with bookings"] as const;

export default function CustomersManagement({ customers, onViewCustomer }: {
  customers: CustomerRecord[];
  onViewCustomer: (key: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All customers");
  const counts = [
    customers.length,
    customers.filter((customer) => customer.hasWebsiteBooking).length,
    customers.filter((customer) => !customer.hasWebsiteBooking).length,
    customers.filter((customer) => customer.bookings.length > 0).length,
  ];
  const filtered = customers.filter((customer) => {
    const matchesSearch = [customer.name, customer.phone].some((value) => value.toLowerCase().includes(query.trim().toLowerCase()));
    return matchesSearch && (filter === "All customers"
      || (filter === "Website customers" && customer.hasWebsiteBooking)
      || (filter === "USSD-only customers" && !customer.hasWebsiteBooking)
      || (filter === "Customers with bookings" && customer.bookings.length > 0));
  });
  const clear = () => { setQuery(""); setFilter("All customers"); };

  return (
    <div className="bookings-page customers-page">
      <section className="bookings-page-header">
        <div>
          <p className="admin-eyebrow">Customer operations</p>
          <h1>Customers Management</h1>
          <p>Explore customer activity across the demo booking channels.</p>
          <p className="bookings-demo-note">Derived from admin demo bookings. Account details are not connected; changes reset on reload.</p>
        </div>
      </section>
      <section className="booking-stats-grid" aria-label="Demo customer summary">
        {([
          ["Identifiable customers", counts[0], Users],
          ["Website customers", counts[1], Globe],
          ["USSD-only customers", counts[2], Smartphone],
          ["Customers with bookings", counts[3], TicketCheck],
        ] as const).map(([label, total, Icon]) => (
          <article key={label}><span><Icon size={18} /></span><div><p>{label}</p><strong>{total}</strong><small>Demo records</small></div></article>
        ))}
      </section>
      <nav className="booking-status-tabs" aria-label="Customer filters">
        {filters.map((label, index) => <button type="button" key={label} className={filter === label ? "active" : ""} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}<span>{counts[index]}</span></button>)}
      </nav>
      <section className="booking-filter-panel customers-filter-panel" aria-label="Search customers">
        <label className="booking-search"><span>Search customers</span><div><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or phone" /></div></label>
        <button type="button" className="clear-filters" onClick={clear}>Clear filters</button>
      </section>
      <section className="reservations-panel">
        <div className="panel-heading"><div><h2>Customer Directory</h2><p>Website and USSD labels describe booking channels, not account status.</p></div><p>Showing {filtered.length} of {customers.length} demo customers</p></div>
        <div className="admin-table-wrap customers-table">
          <table>
            <thead><tr><th>Customer</th><th>Contact</th><th>Booking channel</th><th>Bookings</th><th>Latest experience date</th><th>Action</th></tr></thead>
            <tbody>{filtered.map((customer) => {
              const latest = customer.bookings.reduce<string | null>((date, booking) => !date || booking.date > date ? booking.date : date, null);
              return <tr key={customer.key}>
                <td><button className="customers-link" type="button" onClick={() => onViewCustomer(customer.key)}>{customer.name || "Name not provided"}</button></td>
                <td>{customer.phone || "Phone not provided"}<small className="customers-secondary">Email not provided</small></td>
                <td><span className={`source ${customer.hasWebsiteBooking ? "website" : "ussd"}`}>{customer.hasWebsiteBooking ? "Website" : "USSD only"}</span>{customer.hasWebsiteBooking && customer.bookings.some((booking) => booking.source === "USSD") && <small className="customers-secondary">Also booked via USSD</small>}</td>
                <td>{customer.bookings.length}</td>
                <td>{latest ? formatBookingDate(latest) : "Not provided"}</td>
                <td><button className="customers-link customers-view" type="button" onClick={() => onViewCustomer(customer.key)} aria-label={`View ${customer.name || "customer"} details`}>View details</button></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        {!filtered.length && <div className="table-empty"><Search size={20} /><b>No customers match these filters</b><span>Adjust or clear the filters to see available records.</span><button type="button" className="clear-filters" onClick={clear}>Clear filters</button></div>}
      </section>
    </div>
  );
}
