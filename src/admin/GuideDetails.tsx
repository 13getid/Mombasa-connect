import { useState, type ReactNode } from "react";
import { ArrowLeft, Check, ClipboardList, Compass, Search, ShieldCheck, UserRound } from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { canChangeGuideStatus, guideInitials, type GuideRecord } from "./guides";
import GuideStatusBadge from "./GuideStatusBadge";
import type { TourRecord } from "./tours";
import "./guides-management.css";

type GuideStatus = GuideRecord["status"];

function Field({ label, value }: { label: string; value: ReactNode }) {
  return <div className="booking-field"><span>{label}</span><b>{value}</b></div>;
}

export default function GuideDetails({ guide, guideId, records, tours, onStatusChange, onBack, onViewBooking }: {
  guide: GuideRecord | undefined;
  guideId: string;
  records: BookingRecord[];
  tours: TourRecord[];
  onStatusChange: (id: string, from: GuideStatus, to: GuideStatus) => boolean;
  onBack: () => void;
  onViewBooking: (ref: string) => void;
}) {
  const [confirming, setConfirming] = useState<GuideStatus | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!guide) {
    return <div className="booking-details-page"><button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Guides</button><section className="booking-panel booking-not-found"><Search size={22} /><h1>Guide not found</h1><p>No guide matches {guideId || "the selected ID"} in the demo directory.</p><button className="admin-primary-button" type="button" onClick={onBack}>Return to Guides</button></section></div>;
  }

  const assignments = records.filter((record) => record.assignedGuideId === guide.id && (record.status === "Pending" || record.status === "Confirmed"));
  const actions: { target: GuideStatus; label: string }[] = guide.status === "Pending Verification"
    ? [{ target: "Approved", label: "Approve guide" }, { target: "Rejected", label: "Reject guide" }]
    : guide.status === "Approved" ? [{ target: "Suspended", label: "Suspend guide" }]
    : guide.status === "Suspended" ? [{ target: "Approved", label: "Reactivate guide" }] : [];
  const chosenAction = actions.find((action) => action.target === confirming);
  const confirm = () => {
    if (!confirming || !canChangeGuideStatus(guide.status, confirming) || !onStatusChange(guide.id, guide.status, confirming)) {
      setError("The guide status could not be changed. Return to the directory and try again.");
      setConfirming(null);
      return;
    }
    setFeedback(`${guide.name} is now ${confirming.toLowerCase()}. Demo change only; nothing is permanently saved.`);
    setError(null);
    setConfirming(null);
  };

  return (
    <div className="booking-details-page guide-details-page">
      <section className="booking-details-header">
        <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Guides</button>
        <p className="admin-eyebrow">Guide profile</p>
        <div className="booking-ref-row"><span className="admin-avatar">{guideInitials(guide.name)}</span><h1>{guide.name}</h1><GuideStatusBadge status={guide.status} /></div>
        <p className="booking-details-meta"><span>{guide.id}</span><span>Demo record · changes reset on reload</span></p>
      </section>
      {feedback && <div className="guide-feedback" role="status"><Check size={16} /><p>{feedback}</p><button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss message">×</button></div>}
      {error && <div className="guides-error" role="alert">{error}</div>}
      <div className="booking-details-layout">
        <div className="booking-details-main">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Profile &amp; Contact</h2><p>Information available in the demonstration record.</p></div><UserRound size={17} /></div>
            <div className="booking-field-grid">
              <Field label="Full name" value={guide.name} /><Field label="Guide ID" value={guide.id} />
              <Field label="Phone" value={guide.phone} /><Field label="Email" value={guide.email ?? "Not recorded"} />
              <Field label="Title" value={guide.title} /><Field label="Languages" value={guide.languages.length ? guide.languages.join(", ") : "Not recorded"} />
            </div>
          </section>
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Tour Specialities</h2><p>Associations in the shared demo guide record.</p></div><Compass size={17} /></div>
            {guide.tours.length ? <ul className="guides-speciality-list">{guide.tours.map((name) => <li key={name}>{name}{!tours.some((tour) => tour.name === name) && <small>Not found in demo catalogue</small>}</li>)}</ul> : <p className="guides-empty">No tour specialities recorded.</p>}
          </section>
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Current Booking Assignments</h2><p>Pending and confirmed demo bookings assigned to this guide.</p></div><ClipboardList size={17} /></div>
            {assignments.length ? <div className="admin-table-wrap guides-assignment-table"><table><thead><tr><th>Reference</th><th>Experience</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{assignments.map((booking) => <tr key={booking.ref}><td><b>{booking.ref}</b></td><td>{booking.experience}</td><td>{formatBookingDate(booking.date)}</td><td><span className={`admin-status ${booking.status.toLowerCase()}`}>{booking.status}</span></td><td><button className="guides-view-button" type="button" onClick={() => onViewBooking(booking.ref)}>View booking</button></td></tr>)}</tbody></table></div> : <p className="guides-empty">No pending or confirmed bookings assigned.</p>}
          </section>
        </div>
        <aside className="booking-details-rail">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Verification</h2><p>Demo status changes only.</p></div><ShieldCheck size={17} /></div>
            <div className="guides-verification">
              <GuideStatusBadge status={guide.status} />
              <p>Verification documents and activity history are not supported in the current demo.</p>
              {guide.status !== "Approved" && <p>Existing assignments are retained; only approved guides can receive new bookings.</p>}
              {chosenAction ? <div className="guides-confirm">
                <p>{chosenAction.label} {guide.name}? Existing booking assignments will not be changed.</p>
                <div><button className={confirming === "Rejected" || confirming === "Suspended" ? "booking-danger-button" : "admin-primary-button"} type="button" onClick={confirm}>Confirm {chosenAction.label}</button><button className="booking-outline-button" type="button" onClick={() => setConfirming(null)}>Keep current status</button></div>
              </div> : actions.length ? <div className="guides-status-actions">{actions.map((action) => <button key={action.target} className={action.target === "Rejected" || action.target === "Suspended" ? "booking-danger-button" : "admin-primary-button"} type="button" onClick={() => { setConfirming(action.target); setError(null); setFeedback(null); }}>{action.label}</button>)}</div> : <p>No verification actions are available for this status.</p>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
