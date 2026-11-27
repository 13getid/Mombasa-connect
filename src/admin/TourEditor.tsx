import { useState } from "react";
import { ArrowLeft, Check, Save, Search } from "lucide-react";
import { nextTourId, tourCategories, tourImages, validateTour, type TourCategory, type TourErrors, type TourRecord } from "./tours";
import "./tours.css";

type TourDraft = {
  name: string;
  category: TourCategory;
  shortDescription: string;
  fullDescription: string;
  location: string;
  duration: string;
  price: string;
  image: string;
};

function toDraft(tour: TourRecord | undefined): TourDraft {
  return tour
    ? { name: tour.name, category: tour.category, shortDescription: tour.shortDescription, fullDescription: tour.fullDescription, location: tour.location, duration: tour.duration, price: String(tour.price), image: tour.image }
    : { name: "", category: tourCategories[0], shortDescription: "", fullDescription: "", location: "", duration: "", price: "", image: tourImages[0].value };
}

export default function TourEditor({
  tours,
  tourId,
  onSave,
  onBack,
}: {
  tours: TourRecord[];
  tourId: string | null;
  onSave: (tour: TourRecord, previousName: string | null) => void;
  onBack: () => void;
}) {
  const existing = tourId ? tours.find((tour) => tour.id === tourId) : undefined;
  const [draft, setDraft] = useState<TourDraft>(() => toDraft(existing));
  const [errors, setErrors] = useState<TourErrors>({});
  const [saved, setSaved] = useState<string | null>(null);

  if (tourId && !existing) {
    return (
      <div className="booking-details-page">
        <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Tours</button>
        <section className="booking-panel booking-not-found">
          <Search size={22} />
          <h1>Tour not found</h1>
          <p>No tour matches the reference {tourId} in the current demo catalogue.</p>
          <button className="admin-primary-button" type="button" onClick={onBack}>Return to Tours &amp; Experiences</button>
        </section>
      </div>
    );
  }

  const set = <Key extends keyof TourDraft>(key: Key, value: TourDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };
  const save = (status: TourRecord["status"]) => {
    const nextErrors = validateTour(draft, tours, existing?.id);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(null);
      return;
    }
    const record: TourRecord = {
      id: existing?.id ?? nextTourId(tours),
      name: draft.name.trim(),
      category: draft.category,
      shortDescription: draft.shortDescription.trim(),
      fullDescription: draft.fullDescription.trim(),
      location: draft.location.trim(),
      duration: draft.duration.trim(),
      price: Number(draft.price),
      image: draft.image,
      status,
    };
    onSave(record, existing ? existing.name : null);
    setSaved(`${record.name} saved as ${status.toLowerCase()} (demo change only; nothing is permanently stored).`);
  };

  return (
    <div className="booking-details-page tour-editor-page">
      <section className="booking-details-header">
        <div>
          <button className="booking-back" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to Tours</button>
          <p className="admin-eyebrow">{existing ? "Edit tour" : "Create tour"}</p>
          <div className="booking-ref-row">
            <h1>{existing ? existing.name : "New Tour"}</h1>
            {existing && <span className={`admin-status ${existing.status.toLowerCase()}`}>{existing.status}</span>}
          </div>
          <p className="booking-details-meta">
            <span>{existing ? `Tour ${existing.id}` : "A new tour ID will be generated on save"}</span>
            <span>Demonstration catalogue · changes reset on reload</span>
          </p>
        </div>
      </section>

      {saved && (
        <div className="guide-feedback" role="status">
          <Check size={16} />
          <p>{saved}</p>
          <button type="button" onClick={() => setSaved(null)} aria-label="Dismiss message">×</button>
        </div>
      )}

      <div className="booking-details-layout tour-editor-layout">
        <div className="booking-details-main">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Tour Information</h2><p>Details in the admin demo catalogue.</p></div></div>
            <div className="tour-form-grid">
              <label className={errors.name ? "invalid" : ""}>
                <span>Tour name</span>
                <input value={draft.name} onChange={(event) => set("name", event.target.value)} placeholder="Experience name" />
                {errors.name && <em>{errors.name}</em>}
              </label>
              <label>
                <span>Category</span>
                <select value={draft.category} onChange={(event) => set("category", event.target.value as TourCategory)}>
                  {tourCategories.map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>
              <label className={errors.location ? "invalid" : ""}>
                <span>Location</span>
                <input value={draft.location} onChange={(event) => set("location", event.target.value)} placeholder="Mombasa location" />
                {errors.location && <em>{errors.location}</em>}
              </label>
              <label className={errors.duration ? "invalid" : ""}>
                <span>Duration</span>
                <input value={draft.duration} onChange={(event) => set("duration", event.target.value)} placeholder="For example 1–2 hours" />
                {errors.duration && <em>{errors.duration}</em>}
              </label>
              <label className={errors.price ? "invalid" : ""}>
                <span>Price per guest (KES)</span>
                <input value={draft.price} onChange={(event) => set("price", event.target.value)} inputMode="numeric" placeholder="1500" />
                {errors.price && <em>{errors.price}</em>}
              </label>
              <label className={`tour-form-wide ${errors.shortDescription ? "invalid" : ""}`}>
                <span>Short description</span>
                <input value={draft.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} placeholder="One-line summary shown in listings" />
                {errors.shortDescription && <em>{errors.shortDescription}</em>}
              </label>
              <label className={`tour-form-wide ${errors.fullDescription ? "invalid" : ""}`}>
                <span>Full description</span>
                <textarea rows={4} value={draft.fullDescription} onChange={(event) => set("fullDescription", event.target.value)} placeholder="The complete description shown on the tour page" />
                {errors.fullDescription && <em>{errors.fullDescription}</em>}
              </label>
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Tour Image</h2><p>Choose from the existing local photographs.</p></div></div>
            <div className="tour-image-options" role="radiogroup" aria-label="Tour image">
              {tourImages.map((option) => (
                <button key={option.value} type="button" role="radio" aria-checked={draft.image === option.value} className={draft.image === option.value ? "selected" : ""} onClick={() => set("image", option.value)}>
                  <img src={option.value} alt={option.label} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="booking-details-rail">
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Save Tour</h2><p>Demo changes do not update the public or customer catalogues.</p></div></div>
            <div className="booking-actions-list">
              <button className="admin-primary-button" type="button" onClick={() => save("Published")}><Check size={16} /> Save &amp; Publish</button>
              <button className="booking-outline-button" type="button" onClick={() => save(existing && existing.status !== "Draft" ? "Unpublished" : "Draft")}><Save size={14} /> {existing && existing.status !== "Draft" ? "Save as Unpublished" : "Save as Draft"}</button>
            </div>
          </section>

          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Preview</h2><p>Preview of the demo tour details.</p></div></div>
            <div className="tour-preview">
              <img src={draft.image} alt="" />
              <div>
                <b>{draft.name.trim() || "Tour name"}</b>
                <small>{draft.category} · {draft.location.trim() || "Location"}</small>
                <p>{draft.shortDescription.trim() || "Short description appears here."}</p>
                <span>{draft.duration.trim() || "Duration"} · KES {Number(draft.price) > 0 ? Number(draft.price).toLocaleString("en-KE") : "—"} per guest</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
