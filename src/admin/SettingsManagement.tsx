import { useState } from "react";
import { Save } from "lucide-react";
import { version } from "../../package.json";
import { useTheme } from "../shared/theme/theme";
import { validateSettings, type AdminSettings } from "./settings";
import "./bookings.css";
import "./booking-details.css";
import "./settings-management.css";

type Section = "General" | "Booking" | "Display" | "Notifications" | "About";

export default function SettingsManagement({ settings, onSave, onDirtyChange, onWebsiteContent }: {
  settings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
  onDirtyChange: (dirty: boolean) => void;
  onWebsiteContent: () => void;
}) {
  const [section, setSection] = useState<Section>("General");
  const [draft, setDraft] = useState<AdminSettings>(() => ({ ...settings }));
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const update = (key: keyof AdminSettings, value: boolean) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    onDirtyChange(JSON.stringify(next) !== JSON.stringify(settings));
    setMessage("");
    setError(null);
  };
  const save = () => {
    const validationError = validateSettings(draft);
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }
    if (draft.requireGuideBeforeConfirmation !== settings.requireGuideBeforeConfirmation &&
      !window.confirm("Change the guide requirement for future demo booking confirmations? Existing bookings will not be changed.")) return;
    onSave({ ...draft });
    onDirtyChange(false);
    setError(null);
    setMessage("Demo settings saved for this session. They reset on reload.");
  };
  const cancel = () => {
    setDraft({ ...settings });
    onDirtyChange(false);
    setError(null);
    setMessage("Unsaved demo settings discarded. Theme changes apply immediately and are not reverted.");
  };
  const preference = (key: keyof AdminSettings, label: string, description: string) => (
    <label className="settings-preference">
      <span><b>{label}</b><small>{description}</small></span>
      <input type="checkbox" checked={draft[key]} onChange={(event) => update(key, event.target.checked)} />
    </label>
  );

  return <div className="bookings-page settings-page">
    <section className="bookings-page-header">
      <div><p className="admin-eyebrow">Platform preferences</p><h1>Settings</h1>
        <p>Manage supported preferences for this Admin demonstration.</p>
        <p className="bookings-demo-note">Demo settings reset on reload. Theme uses the existing shared browser preference.</p></div>
    </section>
    <p className="settings-status" role="status">{message || (dirty ? "Unsaved demo settings." : "No unsaved demo settings.")}</p>
    {error && <p className="booking-action-error" role="alert">{error}</p>}
    <nav className="booking-status-tabs" aria-label="Settings sections">
      {(["General", "Booking", "Display", "Notifications", "About"] as const).map((item) =>
        <button key={item} type="button" className={section === item ? "active" : ""} aria-pressed={section === item} onClick={() => setSection(item)}>{item}</button>)}
    </nav>
    <section className="booking-panel">
      {section === "General" && <>
        <div className="panel-heading"><div><h2>General Settings</h2><p>Current prototype information and public content.</p></div></div>
        <div className="settings-body">
          <dl className="settings-facts">
            <div><dt>Platform</dt><dd>Mombasa Connect</dd></div>
            <div><dt>Booking currency</dt><dd>KES (Kenyan shilling)</dd></div>
            <div><dt>Scheduling dates</dt><dd>Browser local date</dd></div>
          </dl>
          <p>Branding, contact information and currency are not configurable here. The existing public contact details remain on the website.</p>
          <p>Homepage hero and About text are managed in Website Content, not duplicated in Settings.</p>
          <button type="button" className="booking-outline-button" onClick={onWebsiteContent}>Open Website Content</button>
        </div>
      </>}
      {section === "Booking" && <>
        <div className="panel-heading"><div><h2>Booking Settings</h2><p>Applies only to Admin demo actions in this session.</p></div></div>
        <div className="settings-body">
          {preference("requireGuideBeforeConfirmation", "Require a guide before confirming", "Block confirmation of a pending demo booking until it has an assignment to an existing guide record. Existing assignments count even if the guide is no longer approved.")}
          <p>Changing this rule does not alter existing bookings. It is not backend enforcement. New web and USSD booking services are not connected, so channel and guest-limit controls are unavailable.</p>
        </div>
      </>}
      {section === "Display" && <>
        <div className="panel-heading"><div><h2>Display Preferences</h2><p>Uses the shared theme for all portals.</p></div></div>
        <div className="settings-body">
          <fieldset className="settings-theme"><legend>Theme</legend>
            {(["light", "dark"] as const).map((choice) => <label key={choice}>
              <input type="radio" name="settings-theme" checked={theme === choice} onChange={() => { if (theme !== choice) toggleTheme(); }} />
              <span>{choice === "light" ? "Light" : "Dark"}</span>
            </label>)}
          </fieldset>
          <p>Theme changes apply immediately and use the existing browser preference; Save and Cancel do not affect them.</p>
        </div>
      </>}
      {section === "Notifications" && <>
        <div className="panel-heading"><div><h2>Notification Preferences</h2><p>Controls visibility of the Admin sample notification panel only.</p></div></div>
        <div className="settings-body">
          {preference("showInAppNotifications", "Show in-app sample notifications", "Show the existing sample items and count in the Admin notification panel.")}
          {preference("showBookingNotifications", "Show booking sample notifications", "Include the existing booking-related sample item when in-app notifications are shown.")}
          <p>No notification delivery service is connected. These controls do not send or suppress emails, SMS, push messages or real booking events.</p>
        </div>
      </>}
      {section === "About" && <>
        <div className="panel-heading"><div><h2>About / System Information</h2><p>Current frontend prototype.</p></div></div>
        <div className="settings-body">
          <dl className="settings-facts">
            <div><dt>Application</dt><dd>Mombasa Connect</dd></div>
            <div><dt>Version</dt><dd>{version}</dd></div>
            <div><dt>Frontend</dt><dd>React · TypeScript · Vite · Tailwind CSS</dd></div>
            <div><dt>Mode</dt><dd>Frontend demonstration</dd></div>
            <div><dt>Backend and payment provider</dt><dd>Not connected</dd></div>
          </dl>
          <p>Demo data and settings reset on reload. Only the existing shared theme preference is stored in this browser when storage is available.</p>
        </div>
      </>}
    </section>
    <div className="settings-actions">
      <button type="button" className="admin-primary-button" disabled={!dirty} onClick={save}><Save size={15} /> Save demo settings</button>
      <button type="button" className="booking-outline-button" disabled={!dirty} onClick={cancel}>Cancel changes</button>
    </div>
  </div>;
}
