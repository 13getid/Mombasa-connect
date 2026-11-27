import { useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Save } from "lucide-react";
import { tourImages, type TourRecord } from "./tours";
import { featuredTours, validateWebsiteContent, type WebsiteContent as Content, type WebsiteErrors } from "../shared/website/content";
import "./bookings.css";
import "./tours.css";
import "./website-content.css";

type Section = "Hero" | "About" | "Featured experiences";

export default function WebsiteContent({ content, tours, onSave, onDirtyChange, onPreview }: {
  content: Content;
  tours: TourRecord[];
  onSave: (content: Content) => void;
  onDirtyChange: (dirty: boolean) => void;
  onPreview: () => void;
}) {
  const [draft, setDraft] = useState<Content>(() => ({ ...content, featuredTourIds: [...content.featuredTourIds] }));
  const [section, setSection] = useState<Section>("Hero");
  const [errors, setErrors] = useState<WebsiteErrors>({});
  const [message, setMessage] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);
  const published = tours.filter((tour) => tour.status === "Published");
  const selected = featuredTours(draft, tours);
  const unavailable = draft.featuredTourIds.filter((id) => !published.some((tour) => tour.id === id));

  const update = (next: Content) => {
    setDraft(next);
    onDirtyChange(JSON.stringify(next) !== JSON.stringify(content));
    setMessage("");
  };
  const set = <K extends keyof Content>(key: K, value: Content[K]) => update({ ...draft, [key]: value });
  const cancel = () => {
    setDraft({ ...content, featuredTourIds: [...content.featuredTourIds] });
    onDirtyChange(false);
    setErrors({});
    setMessage("Unsaved changes discarded.");
  };
  const save = () => {
    const nextErrors = validateWebsiteContent(draft, tours);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setMessage("");
      return;
    }
    const next = { ...draft, featuredTourIds: [...draft.featuredTourIds] };
    onSave(next);
    onDirtyChange(false);
    setMessage("Saved for this demo session only. Reloading resets changes.");
  };
  const move = (id: string, direction: -1 | 1) => {
    const ids = [...draft.featuredTourIds];
    const index = ids.indexOf(id);
    const destination = index + direction;
    if (index < 0 || destination < 0 || destination >= ids.length) return;
    [ids[index], ids[destination]] = [ids[destination], ids[index]];
    set("featuredTourIds", ids);
  };
  const field = (key: "headline" | "headlineEmphasis" | "description" | "primaryAction" | "secondaryAction" | "aboutTitle" | "aboutDescription", label: string, multiline = false) => (
    <label className={errors[key] ? "invalid" : ""}>
      <span>{label}</span>
      {multiline
        ? <textarea rows={4} value={draft[key]} aria-invalid={Boolean(errors[key])} onChange={(event) => set(key, event.target.value)} />
        : <input value={draft[key]} aria-invalid={Boolean(errors[key])} onChange={(event) => set(key, event.target.value)} />}
      {errors[key] && <em>{errors[key]}</em>}
    </label>
  );

  return <div className="bookings-page website-content-page">
    <section className="bookings-page-header">
      <div><p className="admin-eyebrow">Public website</p><h1>Website Content</h1>
        <p>Manage the existing homepage hero, about section and featured experiences.</p>
        <p className="bookings-demo-note">Demo only. Changes apply in this session and reset on reload; nothing is published online.</p></div>
      <button type="button" className="booking-outline-button" onClick={onPreview} disabled={dirty}><ExternalLink size={15} /> Preview public website</button>
    </section>
    <div className="website-editor-status" role="status">{message || (dirty ? "Unsaved changes. Save or cancel before leaving or opening the public preview." : "No unsaved changes.")}</div>
    {Object.keys(errors).length > 0 && <div className="tour-publication-error" role="alert">Please correct the highlighted fields in the relevant sections before saving.</div>}
    <nav className="booking-status-tabs" aria-label="Website content sections">
      {(["Hero", "About", "Featured experiences"] as const).map((item) =>
        <button type="button" key={item} className={section === item ? "active" : ""} aria-pressed={section === item} onClick={() => setSection(item)}>{item}</button>)}
    </nav>
    <div className="website-editor-layout">
      <div className="website-editor-main">
        {section === "Hero" && <>
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Hero content</h2><p>Links remain connected to experiences and the offline booking section.</p></div></div>
            <div className="tour-form-grid">
              {field("headline", "Headline")}
              {field("headlineEmphasis", "Emphasized headline")}
              {field("description", "Supporting description", true)}
              {field("primaryAction", "Primary action text")}
              {field("secondaryAction", "Secondary action text")}
            </div>
          </section>
          <section className="booking-panel">
            <div className="panel-heading"><div><h2>Hero image</h2><p>Select an existing local photograph; uploading is not available.</p></div></div>
            <div className="tour-image-options" role="group" aria-label="Hero image">
              {tourImages.map((image) => <label key={image.value} className={`website-image-option ${draft.heroImage === image.value ? "selected" : ""}`}>
                <input type="radio" name="heroImage" value={image.value} checked={draft.heroImage === image.value} onChange={() => set("heroImage", image.value)} />
                <img src={image.value} alt="" /><span>{image.label}</span>
              </label>)}
            </div>
            {errors.heroImage && <p className="website-error">{errors.heroImage}</p>}
          </section>
        </>}
        {section === "About" && <section className="booking-panel">
          <div className="panel-heading"><div><h2>About the mission</h2><p>Content in the existing About section.</p></div></div>
          <div className="tour-form-grid">{field("aboutTitle", "About heading")}{field("aboutDescription", "About description", true)}</div>
        </section>}
        {section === "Featured experiences" && <section className="booking-panel">
          <div className="panel-heading"><div><h2>Featured experiences</h2><p>Choose and order up to three published tours. Edit tour details in Tours &amp; Experiences.</p></div></div>
          <div className="website-featured">
            {unavailable.length > 0 && <div className="tour-publication-error" role="alert">Some selections are no longer published and are hidden from the public page. Remove them before saving.
              <button type="button" onClick={() => set("featuredTourIds", draft.featuredTourIds.filter((id) => !unavailable.includes(id)))}>Remove unavailable selections</button></div>}
            <h3>Display order</h3>
            {selected.length ? <ol>{selected.map((tour, index) => <li key={tour.id}>
              <span>{tour.name}</span><div>
                <button type="button" aria-label={`Move ${tour.name} up`} disabled={index === 0 || unavailable.length > 0} onClick={() => move(tour.id, -1)}><ArrowUp size={16} /></button>
                <button type="button" aria-label={`Move ${tour.name} down`} disabled={index === selected.length - 1 || unavailable.length > 0} onClick={() => move(tour.id, 1)}><ArrowDown size={16} /></button>
              </div></li>)}</ol> : <p>No featured experiences selected.</p>}
            <h3>Published tours</h3>
            {published.length ? published.map((tour) => <label className="website-tour-choice" key={tour.id}>
              <input type="checkbox" checked={draft.featuredTourIds.includes(tour.id)} disabled={!draft.featuredTourIds.includes(tour.id) && draft.featuredTourIds.length >= 3}
                onChange={(event) => set("featuredTourIds", event.target.checked ? [...draft.featuredTourIds, tour.id] : draft.featuredTourIds.filter((id) => id !== tour.id))} />
              <img src={tour.image} alt="" /><span><b>{tour.name}</b><small>{tour.category} · Published</small></span>
            </label>) : <p>No published tours are available.</p>}
            {errors.featuredTourIds && <p className="website-error">{errors.featuredTourIds}</p>}
          </div>
        </section>}
      </div>
      <aside className="website-editor-preview booking-panel">
        <div className="panel-heading"><div><h2>Draft preview</h2><p>Save before opening the public website preview.</p></div></div>
        {section === "Hero" ? <div className="website-preview">
          <img src={draft.heroImage} alt={tourImages.find((image) => image.value === draft.heroImage)?.label ?? ""} />
          <h3>{draft.headline} <em>{draft.headlineEmphasis}</em></h3><p>{draft.description}</p>
          <small>{draft.primaryAction} · {draft.secondaryAction}</small>
        </div> : section === "About" ? <div className="website-preview"><h3>{draft.aboutTitle}</h3><p>{draft.aboutDescription}</p></div>
          : <div className="website-preview">{selected.length ? selected.map((tour) => <p key={tour.id}><b>{tour.name}</b><br />{tour.duration} · KES {tour.price.toLocaleString("en-KE")}</p>) : <p>No featured experiences selected.</p>}</div>}
      </aside>
    </div>
    <div className="website-editor-actions"><button type="button" className="admin-primary-button" onClick={save}><Save size={15} /> Save changes</button>
      <button type="button" className="booking-outline-button" onClick={cancel} disabled={!dirty}>Cancel changes</button></div>
  </div>;
}
