import { csvRows } from "./csv";
import type { BookingRecord } from "./BookingsManagement";
import type { TourRecord } from "./tours";
import type { AdminSettings } from "./settings";
import type { WebsiteContent } from "../shared/website/content";

export const activityModules = ["Bookings", "Tours & Experiences", "Guides", "Website Content", "Settings"] as const;
export const activityTypes = ["Confirmed", "Cancelled", "Rejected", "Assigned", "Reassigned", "Removed", "Created", "Edited", "Published", "Unpublished", "Approved", "Suspended", "Reactivated", "Updated"] as const;
export type ActivityModule = typeof activityModules[number];
export type ActivityType = typeof activityTypes[number];
export type ActivityDraft = { action: string; module: ActivityModule; type: ActivityType; reference?: string; details?: string };
export type Activity = ActivityDraft & { id: number; actor: string; timestamp: string };
export type ActivityFilters = { search: string; module: string; type: string; order: "newest" | "oldest" };
export const initialActivityFilters: ActivityFilters = { search: "", module: "All", type: "All", order: "newest" };

export function createActivity(id: number, draft: ActivityDraft, now: Date = new Date()): Activity {
  return { ...draft, id, actor: "Admin (demo)", timestamp: now.toISOString() };
}

export function bookingActivities(before: BookingRecord[], after: BookingRecord[]): ActivityDraft[] {
  return after.flatMap((next) => {
    const previous = before.find((record) => record.ref === next.ref);
    if (!previous) return [];
    const events: ActivityDraft[] = [];
    if (previous.status !== next.status && (next.status === "Confirmed" || next.status === "Cancelled" || next.status === "Rejected")) {
      events.push({ action: `Booking ${next.status.toLowerCase()}`, module: "Bookings", type: next.status, reference: next.ref, details: `Booking status changed from ${previous.status} to ${next.status}.` });
    }
    if (previous.assignedGuideId !== next.assignedGuideId) {
      const type = !next.assignedGuideId ? "Removed" : previous.assignedGuideId ? "Reassigned" : "Assigned";
      events.push({ action: `Guide ${type.toLowerCase()} ${type === "Removed" ? "from" : "to"} booking`, module: "Bookings", type, reference: next.ref, details: `Guide reference: ${previous.assignedGuideId ?? "Unassigned"} → ${next.assignedGuideId ?? "Unassigned"}.` });
    }
    return events;
  });
}

export function tourActivity(previous: TourRecord | undefined, next: TourRecord): ActivityDraft | null {
  const fields: [keyof TourRecord, string][] = [["name", "name"], ["category", "category"], ["shortDescription", "short description"], ["fullDescription", "full description"], ["location", "location"], ["duration", "duration"], ["price", "price"], ["image", "image"], ["status", "status"]];
  const changed = previous ? fields.filter(([field]) => previous[field] !== next[field]).map(([, label]) => label) : [];
  if (previous && !changed.length) return null;
  const type: ActivityType = !previous ? "Created"
    : previous.status !== next.status && next.status === "Published" ? "Published"
    : previous.status !== next.status && next.status === "Unpublished" ? "Unpublished"
    : "Edited";
  const details = previous
    ? `Changed: ${changed.join(", ")}.${previous.status !== next.status ? ` Status: ${previous.status} → ${next.status}.` : ""}`
    : `Catalogue record created with status ${next.status}.`;
  return { action: `Tour ${type.toLowerCase()}`, module: "Tours & Experiences", type, reference: next.id, details };
}

export function websiteActivity(previous: WebsiteContent, next: WebsiteContent): ActivityDraft | null {
  const fields: [Exclude<keyof WebsiteContent, "featuredTourIds">, string][] = [
    ["headline", "headline"], ["headlineEmphasis", "headline emphasis"], ["description", "description"],
    ["primaryAction", "primary action text"], ["secondaryAction", "secondary action text"], ["heroImage", "hero image"],
    ["aboutTitle", "About heading"], ["aboutDescription", "About description"],
  ];
  const changed = fields.filter(([key]) => previous[key] !== next[key]).map(([, label]) => label);
  if (previous.featuredTourIds.length !== next.featuredTourIds.length || previous.featuredTourIds.some((id, index) => id !== next.featuredTourIds[index])) changed.push("featured experiences");
  return changed.length ? { action: "Website content updated", module: "Website Content", type: "Updated", details: `Changed: ${changed.join(", ")}.` } : null;
}

export function settingsActivity(previous: AdminSettings, next: AdminSettings): ActivityDraft | null {
  const fields: [keyof AdminSettings, string][] = [
    ["requireGuideBeforeConfirmation", "guide requirement"], ["showInAppNotifications", "in-app sample notifications"], ["showBookingNotifications", "booking sample notifications"],
  ];
  const changed = fields.filter(([key]) => previous[key] !== next[key]).map(([, label]) => label);
  return changed.length ? { action: "Demo settings updated", module: "Settings", type: "Updated", details: `Changed: ${changed.join(", ")}.` } : null;
}

export function filterActivities(activities: Activity[], filters: ActivityFilters): Activity[] {
  const search = filters.search.trim().toLowerCase();
  return activities.filter((item) =>
    (!search || [item.action, item.actor, item.module, item.reference ?? ""].some((value) => value.toLowerCase().includes(search)))
    && (filters.module === "All" || item.module === filters.module)
    && (filters.type === "All" || item.type === filters.type))
    .sort((a, b) => (filters.order === "newest" ? -1 : 1) * (a.timestamp.localeCompare(b.timestamp) || a.id - b.id));
}

export function activitySummary(activities: Activity[]) {
  return {
    total: activities.length,
    bookings: activities.filter((item) => item.module === "Bookings").length,
    content: activities.filter((item) => item.module === "Tours & Experiences" || item.module === "Website Content").length,
    administrative: activities.filter((item) => item.module === "Guides" || item.module === "Settings").length,
  };
}

export function activitiesCsv(activities: Activity[]): string {
  return csvRows([
    ["Action", "Module", "Activity type", "Actor", "Reference", "Recorded at (UTC)", "Details"],
    ...activities.map((item) => [item.action, item.module, item.type, item.actor, item.reference ?? "", item.timestamp, item.details ?? ""]),
  ]);
}
