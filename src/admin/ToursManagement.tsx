import { useState } from "react";
import { CircleCheck, CircleSlash, Compass, Pencil, Plus, Search } from "lucide-react";
import type { BookingRecord } from "./BookingsManagement";
import { tourCategories, type TourRecord } from "./tours";
import "./tours.css";

const statusFilters = ["All Tours", "Published", "Draft"] as const;

export default function ToursManagement({
  tours,
  onToursChange,
  bookings,
  onEditTour,
  onCreateTour,
}: {
  tours: TourRecord[];
  onToursChange: (tours: TourRecord[]) => void;
  bookings: BookingRecord[];
  onEditTour: (id: string) => void;
  onCreateTour: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All Tours");

  const filtered = tours.filter((tour) => {
    const text = `${tour.id} ${tour.name} ${tour.category} ${tour.location}`.toLowerCase();
    return text.includes(query.trim().toLowerCase())
      && (category === "All Categories" || tour.category === category)
      && (status === "All Tours" || tour.status === status);
  });
  const published = tours.filter((tour) => tour.status === "Published").length;
  const bookingCount = (name: string) => bookings.filter((booking) => booking.experience === name).length;
  const setStatusFor = (id: string, nextStatus: TourRecord["status"]) => {
    onToursChange(tours.map((tour) => tour.id === id ? { ...tour, status: nextStatus } : tour));
  };
  const clearFilters = () => {
    setQuery("");
    setCategory("All Categories");
    setStatus("All Tours");
  };

  return (
    <div className="bookings-page tours-page">
      <section className="bookings-page-header">
        <div>
          <p className="admin-eyebrow">Tour catalogue</p>
          <h1>Tours &amp; Experiences</h1>
          <p>Create, edit and publish the experiences offered on Mombasa Connect.</p>
          <p className="bookings-demo-note">Demo catalogue only. Changes are temporary and do not update the public website.</p>
        </div>
        <button className="admin-primary-button" type="button" onClick={onCreateTour}><Plus size={16} /> New Tour</button>
      </section>

      <section className="booking-stats-grid tours-stats-grid" aria-label="Demo catalogue summary">
        {([
          ["Total tours", tours.length, Compass],
          ["Published", published, CircleCheck],
          ["Drafts", tours.length - published, CircleSlash],
        ] as const).map(([label, value, Icon]) => (
          <article key={label}>
            <span><Icon size={18} /></span>
            <div><p>{label}</p><strong>{value}</strong><small>Demo catalogue</small></div>
          </article>
        ))}
      </section>

      <section className="booking-filter-panel tours-filter-panel" aria-label="Filter tours">
        <label className="booking-search">
          <span>Search tours</span>
          <div><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, location or tour ID" /></div>
        </label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>All Categories</option>{tourCategories.map((name) => <option key={name}>{name}</option>)}
        </select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          {statusFilters.map((name) => <option key={name}>{name}</option>)}
        </select></label>
        <button type="button" className="clear-filters" onClick={clearFilters}>Clear filters</button>
      </section>

      <section className="reservations-panel">
        <div className="panel-heading">
          <div><h2>Tour Catalogue</h2><p>Experiences available for publication and booking.</p></div>
          <p>Showing {filtered.length} of {tours.length} demo tours</p>
        </div>
        <div className="admin-table-wrap tours-table-wrap">
          <table>
            <thead><tr><th>Tour</th><th>Category</th><th>Location</th><th>Duration</th><th>Price</th><th>Bookings</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map((tour) => (
              <tr key={tour.id}>
                <td>
                  <div className="tour-cell">
                    <img src={tour.image} alt="" />
                    <div><b>{tour.name}</b><small>{tour.id}</small></div>
                  </div>
                </td>
                <td>{tour.category}</td>
                <td>{tour.location}</td>
                <td>{tour.duration}</td>
                <td><b>KES {tour.price.toLocaleString("en-KE")}</b></td>
                <td>{bookingCount(tour.name)}</td>
                <td><span className={`admin-status ${tour.status.toLowerCase()}`}>{tour.status}</span></td>
                <td>
                  <div className="tour-row-actions">
                    <button type="button" onClick={() => onEditTour(tour.id)}><Pencil size={13} /> Edit</button>
                    {tour.status === "Draft"
                      ? <button type="button" onClick={() => setStatusFor(tour.id, "Published")}>Publish</button>
                      : <button type="button" onClick={() => setStatusFor(tour.id, "Draft")}>Unpublish</button>}
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="table-empty"><Search size={20} /><b>No tours match these filters</b><span>Adjust or clear the filters to see the catalogue.</span><button type="button" className="clear-filters" onClick={clearFilters}>Clear filters</button></div>}
      </section>
    </div>
  );
}
