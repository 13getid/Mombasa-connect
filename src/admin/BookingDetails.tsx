import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Clock3,
  Compass,
  CreditCard,
  Globe,
  Search,
  Smartphone,
  TicketCheck,
  UserRound,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { findGuide, guideInitials } from "./guides";
import "./booking-details.css";

const missingValue = <span className="booking-field-missing">Not recorded in demo data</span>;

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="booking-field">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

export default function BookingDetails({
  records,
  bookingRef,
  onRecordsChange,
  onBack,
  onAssignGuide,
}: {
  records: BookingRecord[];
  bookingRef: string;
  onRecordsChange: (records: BookingRecord[]) => void;
  onBack: () => void;
  onAssignGuide: () => void;
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const booking = records.find((record) => record.ref === bookingRef);

  if (!booking) {
    return (
      <div className="booking-details-page">
        <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Bookings</button>
        <section className="booking-panel booking-not-found">
          <Search size={22} />
          <h1>Booking not found</h1>
          <p>No reservation matches the reference {bookingRef || "provided"} in the current demo records.</p>
          <button className="admin-primary-button" type="button" onClick={onBack}>Return to Bookings Management</button>
        </section>
      </div>
    );
  }

  const updateStatus = (nextStatus: BookingRecord["status"]) => {
    onRecordsChange(records.map((record) => record.ref === booking.ref ? { ...record, status: nextStatus } : record));
  };
  const canConfirm = booking.status === "Pending";
  const canCancel = booking.status === "Pending" || booking.status === "Confirmed";
  const assignedGuide = findGuide(booking.assignedGuideId);
  const removeGuide = () => {
    onRecordsChange(records.map((record) => record.ref === booking.ref ? { ...record, assignedGuideId: null } : record));
    setConfirmingRemove(false);
  };
  const SourceIcon = booking.source === "USSD" ? Smartphone : Globe;
  const timeline = [
    { title: "Booking received", detail: `Submitted through the ${booking.source} channel with reference ${booking.ref}.`, icon: TicketCheck },
    ...(assignedGuide ? [{ title: "Guide assigned", detail: `${assignedGuide.name} is the primary guide for this experience.`, icon: UserRoundCheck }] : []),
    booking.status === "Pending"
      ? { title: "Awaiting review", detail: "This reservation is pending administrator action.", icon: Clock3 }
      : { title: `Booking ${booking.status.toLowerCase()}`, detail: "Current status of this reservation.", icon: booking.status === "Confirmed" || booking.status === "Completed" ? Check : X },
  ];

  return (
    <div className="booking-details-page">
      <section className="booking-details-header">
        <div>
          <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Bookings</button>
          <p className="admin-eyebrow">Reservation record</p>
          <div className="booking-ref-row">
            <h1>{booking.ref}</h1>
            <span className={`admin-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
          <p className="booking-details-meta">
            <span><SourceIcon size={13} /> {booking.source} booking</span>
            <span>Creation date not recorded in demo data</span>
          </p>
        </div>
      </section>

      <div className="booking-details-layout">
        <div className="booking-details-main">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Customer Information</h2><p>Contact details supplied with this reservation.</p></div><UserRound size={17} /></div>
            <div className="booking-field-grid">
              <Field label="Customer name" value={booking.customer} />
              <Field label="Phone number" value={booking.phone} />
              <Field label="Email address" value={missingValue} />
              <Field
                label="Website account"
                value={booking.source === "USSD"
                  ? <span className="booking-field-missing">Not required — USSD bookings can exist without a registered account</span>
                  : missingValue}
              />
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Experience Information</h2><p>Tour details for this reservation.</p></div><Compass size={17} /></div>
            <div className="booking-field-grid">
              <Field label="Tour / Experience" value={booking.experience} />
              <Field label="Experience date" value={formatBookingDate(booking.date)} />
              <Field label="Guests" value={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`} />
              <Field label="Booking price" value={`KES ${booking.amount.toLocaleString("en-KE")}`} />
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Payment Information</h2><p>Payment status is tracked separately from the booking status.</p></div><CreditCard size={17} /></div>
            <div className="booking-field-grid">
              <Field label="Booking amount" value={`KES ${booking.amount.toLocaleString("en-KE")}`} />
              <Field label="Payment status" value={<span className={`booking-payment payment-${booking.payment.toLowerCase()}`}>{booking.payment}</span>} />
              <Field label="Payment method" value={missingValue} />
              <Field label="Payment reference" value={missingValue} />
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Activity Timeline</h2><p>Demonstration timeline · event timestamps require backend integration.</p></div><Clock3 size={17} /></div>
            <div className="booking-timeline">
              {timeline.map(({ title, detail, icon: Icon }) => (
                <article key={title}>
                  <span><Icon size={14} /></span>
                  <div><b>{title}</b><p>{detail}</p></div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="booking-details-rail">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Booking Actions</h2><p>Demo status changes only; nothing is permanently saved.</p></div></div>
            <div className="booking-actions-list">
              {canConfirm && <button className="admin-primary-button" type="button" onClick={() => updateStatus("Confirmed")}><Check size={16} /> Confirm Booking</button>}
              {canCancel && <button className="booking-danger-button" type="button" onClick={() => updateStatus("Cancelled")}><X size={16} /> Cancel Booking</button>}
              {!canConfirm && !canCancel && <p className="booking-actions-empty">No status actions are available for a {booking.status.toLowerCase()} booking.</p>}
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Guide Assignment</h2><p>One primary guide per booking, assigned by administrators.</p></div><Users size={17} /></div>
            {assignedGuide ? (
              <div className="booking-guide-assigned">
                <div className="booking-guide-card">
                  <span className="admin-avatar">{guideInitials(assignedGuide.name)}</span>
                  <div>
                    <b>{assignedGuide.name}</b>
                    <small>{assignedGuide.title} · {assignedGuide.id}</small>
                    <small>{assignedGuide.phone}{assignedGuide.email ? ` · ${assignedGuide.email}` : ""}</small>
                    <small>Speaks {assignedGuide.languages.join(", ")}</small>
                  </div>
                </div>
                {canCancel ? (confirmingRemove ? (
                  <div className="booking-guide-remove-confirm">
                    <p>Remove {assignedGuide.name} as the primary guide for {booking.ref}?</p>
                    <div>
                      <button className="booking-danger-button" type="button" onClick={removeGuide}>Confirm Removal</button>
                      <button className="booking-outline-button" type="button" onClick={() => setConfirmingRemove(false)}>Keep Guide</button>
                    </div>
                  </div>
                ) : (
                  <div className="booking-guide-actions">
                    <button type="button" className="booking-outline-button" onClick={onAssignGuide}>Change Guide</button>
                    <button type="button" className="booking-outline-button" onClick={() => setConfirmingRemove(true)}>Remove Assignment</button>
                  </div>
                )) : (
                  <p className="booking-guide-locked">Guide assignment is locked for {booking.status.toLowerCase()} bookings.</p>
                )}
              </div>
            ) : booking.assignedGuideId ? (
              <div className="booking-guide-assigned">
                <p className="booking-guide-missing"><CircleAlert size={14} /> The assigned guide record ({booking.assignedGuideId}) cannot be found in the demo data. Clearing the assignment will remove this invalid guide reference.</p>
                {canCancel && (confirmingRemove ? (
                  <div className="booking-guide-remove-confirm">
                    <p>Clear the invalid guide reference ({booking.assignedGuideId}) from {booking.ref}? The booking will become unassigned.</p>
                    <div>
                      <button className="booking-danger-button" type="button" onClick={removeGuide}>Confirm Clear</button>
                      <button className="booking-outline-button" type="button" onClick={() => setConfirmingRemove(false)}>Keep Reference</button>
                    </div>
                  </div>
                ) : (
                  <div className="booking-guide-actions">
                    <button type="button" className="booking-outline-button" onClick={onAssignGuide}>Assign a New Guide</button>
                    <button type="button" className="booking-outline-button" onClick={() => setConfirmingRemove(true)}>Clear Assignment</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="booking-guide-empty">
                <span><Users size={17} /></span>
                <b>No guide assigned</b>
                <p>This reservation has not been matched with an approved guide.</p>
                {canCancel
                  ? <button type="button" className="booking-outline-button" onClick={onAssignGuide}>Assign Guide</button>
                  : <p className="booking-guide-locked">Guide assignment is locked for {booking.status.toLowerCase()} bookings.</p>}
              </div>
            )}
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Booking Source</h2><p>Channel used to place this reservation.</p></div></div>
            <div className="booking-source-body">
              <span><SourceIcon size={17} /></span>
              <div>
                <b>{booking.source}</b>
                <p>{booking.source === "USSD"
                  ? "Placed through the USSD channel for customers with limited internet access."
                  : "Placed through the public Mombasa Connect website."}</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
