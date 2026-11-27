import { useState } from "react";
import { ArrowLeft, Check, CircleAlert, Search, ShieldX, UserRoundCheck, Users, X } from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { guideInitials, type GuideRecord } from "./guides";
import "./guide-assignment.css";

const lockedStatuses = ["Completed", "Cancelled", "Rejected"] as const;

function GuideStatusBadge({ status }: { status: GuideRecord["status"] }) {
  const tone = status === "Approved" ? "confirmed" : status === "Pending Verification" ? "pending" : "rejected";
  return <span className={`admin-status ${tone}`}>{status}</span>;
}

export default function GuideAssignment({
  records,
  guides,
  bookingRef,
  onRecordsChange,
  onBack,
}: {
  records: BookingRecord[];
  guides: GuideRecord[];
  bookingRef: string;
  onRecordsChange: (records: BookingRecord[]) => void;
  onBack: () => void;
}) {
  const booking = records.find((record) => record.ref === bookingRef);
  const [selectedId, setSelectedId] = useState<string | null>(booking?.assignedGuideId ?? null);
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!booking) {
    return (
      <div className="booking-details-page">
        <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Bookings</button>
        <section className="booking-panel booking-not-found">
          <Search size={22} />
          <h1>Booking not found</h1>
          <p>No reservation matches the reference {bookingRef || "provided"} in the current demo records.</p>
          <button className="admin-primary-button" type="button" onClick={onBack}>Return to Bookings</button>
        </section>
      </div>
    );
  }

  const currentGuide = guides.find((guide) => guide.id === booking.assignedGuideId);
  const selectedGuide = guides.find((guide) => guide.id === selectedId);
  const locked = (lockedStatuses as readonly string[]).includes(booking.status);
  const isReassignment = Boolean(booking.assignedGuideId) && selectedId !== booking.assignedGuideId;
  const canConfirm = !locked && Boolean(selectedGuide) && selectedId !== booking.assignedGuideId;

  const setAssignedGuide = (guideId: string | null) => {
    // Single primary guide: the one nullable field is replaced, never appended.
    onRecordsChange(records.map((record) => record.ref === booking.ref ? { ...record, assignedGuideId: guideId } : record));
  };
  const confirmAssignment = () => {
    if (!canConfirm || !selectedGuide) return;
    const replaced = currentGuide;
    setAssignedGuide(selectedGuide.id);
    setConfirmingRemoval(false);
    setFeedback(replaced
      ? `${selectedGuide.name} now replaces ${replaced.name} as the primary guide for ${booking.ref}.`
      : `${selectedGuide.name} is now the primary guide for ${booking.ref}.`);
  };
  const removeAssignment = () => {
    const removed = currentGuide;
    setAssignedGuide(null);
    setSelectedId(null);
    setConfirmingRemoval(false);
    setFeedback(removed ? `${removed.name} has been removed from ${booking.ref}. The booking is now unassigned.` : `The guide assignment was removed from ${booking.ref}.`);
  };

  return (
    <div className="booking-details-page guide-assignment-page">
      <section className="booking-details-header">
        <div>
          <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Booking Details</button>
          <p className="admin-eyebrow">Guide assignment</p>
          <div className="booking-ref-row">
            <h1>Assign Guide</h1>
            <span className={`admin-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
          <p className="booking-details-meta">
            <span>Booking {booking.ref}</span>
            <span>One primary guide per booking · demonstration records only</span>
          </p>
        </div>
      </section>

      {feedback && (
        <div className="guide-feedback" role="status">
          <Check size={16} />
          <p>{feedback} <small>Demo change only; nothing is permanently saved.</small></p>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss message"><X size={15} /></button>
        </div>
      )}

      {locked && (
        <div className="guide-locked-note" role="status">
          <ShieldX size={16} />
          <p>Guide assignment is locked for {booking.status.toLowerCase()} bookings. The assignment below is read-only.</p>
        </div>
      )}

      <div className="booking-details-layout guide-assignment-layout">
        <div className="booking-details-main">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Select a Guide</h2><p>Demonstration guide records · only approved guides can be assigned.</p></div><Users size={17} /></div>
            <div className="guide-select-list" role="radiogroup" aria-label="Available guides">
              {guides.map((guide) => {
                const selectable = guide.status === "Approved" && !locked;
                const selected = selectedId === guide.id;
                const isCurrent = booking.assignedGuideId === guide.id;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!selectable}
                    className={`guide-option${selected ? " selected" : ""}`}
                    onClick={() => { setSelectedId(guide.id); setConfirmingRemoval(false); }}
                  >
                    <span className="admin-avatar">{guideInitials(guide.name)}</span>
                    <span className="guide-option-body">
                      <b>{guide.name} {isCurrent && <i className="guide-current-tag">Currently assigned</i>}</b>
                      <small>{guide.title} · {guide.id}</small>
                      <small>{guide.phone} · Speaks {guide.languages.join(", ")}</small>
                      <small>Leads: {guide.tours.join(", ")}</small>
                    </span>
                    <span className="guide-option-side">
                      <GuideStatusBadge status={guide.status} />
                      {!selectable && !locked && <small>Not assignable</small>}
                      <span className="guide-radio" aria-hidden="true">{selected && <Check size={12} />}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="booking-details-rail">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Booking Summary</h2><p>Assignment does not change any booking details.</p></div></div>
            <div className="booking-field-grid guide-summary-grid">
              <div className="booking-field"><span>Booking reference</span><b>{booking.ref}</b></div>
              <div className="booking-field"><span>Customer</span><b>{booking.customer}</b></div>
              <div className="booking-field"><span>Tour / Experience</span><b>{booking.experience}</b></div>
              <div className="booking-field"><span>Experience date</span><b>{formatBookingDate(booking.date)}</b></div>
              <div className="booking-field"><span>Guests</span><b>{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</b></div>
              <div className="booking-field"><span>Booking status</span><b><span className={`admin-status ${booking.status.toLowerCase()}`}>{booking.status}</span></b></div>
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Current Assignment</h2><p>The booking's single primary guide.</p></div></div>
            <div className="guide-current-body">
              {currentGuide ? (
                <div className="guide-current-card">
                  <span className="admin-avatar">{guideInitials(currentGuide.name)}</span>
                  <div><b>{currentGuide.name}</b><small>{currentGuide.title}</small><small>{currentGuide.phone}</small></div>
                </div>
              ) : booking.assignedGuideId ? (
                <p className="guide-missing-note"><CircleAlert size={14} /> The assigned guide record ({booking.assignedGuideId}) no longer exists in the demo data. Assign a new guide or remove the assignment.</p>
              ) : (
                <p className="guide-unassigned-note">No guide assigned to this booking.</p>
              )}
              {!locked && booking.assignedGuideId && (confirmingRemoval ? (
                <div className="guide-remove-confirm">
                  <p>Remove {currentGuide?.name ?? "the assigned guide"} from {booking.ref}?</p>
                  <div>
                    <button className="booking-danger-button" type="button" onClick={removeAssignment}>Confirm Removal</button>
                    <button className="booking-outline-button" type="button" onClick={() => setConfirmingRemoval(false)}>Keep Guide</button>
                  </div>
                </div>
              ) : (
                <button className="booking-outline-button" type="button" onClick={() => setConfirmingRemoval(true)}>Remove Assignment</button>
              ))}
            </div>
          </section>

          {!locked && (
            <section className="booking-panel">
              <div className="panel-heading"><div><h2>Confirm Assignment</h2><p>{isReassignment && booking.assignedGuideId ? "The selected guide will replace the current guide." : "Review the selection before saving."}</p></div></div>
              <div className="guide-confirm-body">
                {selectedGuide ? (
                  <>
                    <p>
                      Assign <b>{selectedGuide.name}</b> as the primary guide for booking <b>{booking.ref}</b>
                      {isReassignment && currentGuide ? <>, replacing <b>{currentGuide.name}</b></> : null}.
                    </p>
                    {selectedId === booking.assignedGuideId
                      ? <p className="guide-unassigned-note">{selectedGuide.name} is already assigned to this booking.</p>
                      : <button className="admin-primary-button" type="button" onClick={confirmAssignment}><UserRoundCheck size={16} />{isReassignment ? "Replace Current Guide" : "Confirm Assignment"}</button>}
                  </>
                ) : (
                  <p className="guide-unassigned-note">Select an approved guide from the list to continue.</p>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
