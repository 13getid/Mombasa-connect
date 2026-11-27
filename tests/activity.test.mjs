import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

async function moduleUrl(path, dependencies = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  for (const [specifier, url] of Object.entries(dependencies)) code = code.replace(`"${specifier}"`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
}

const csv = await moduleUrl("../src/admin/csv.ts");
const { createActivity, bookingActivities, tourActivity, websiteActivity, settingsActivity, activitySummary, filterActivities, initialActivityFilters, activitiesCsv } =
  await import(await moduleUrl("../src/admin/activity.ts", { "./csv": csv }));
const date = new Date("2026-01-02T03:04:05.000Z");
const entry = (id, draft, timestamp = date) => createActivity(id, draft, timestamp);

test("records actual supplied time, actor and action metadata", () => {
  const activity = entry(1, { action: "Booking confirmed", module: "Bookings", type: "Confirmed", reference: "B-1" });
  assert.equal(activity.timestamp, "2026-01-02T03:04:05.000Z");
  assert.equal(activity.actor, "Admin (demo)");
  assert.equal(activity.reference, "B-1");
});

test("booking and assignment changes produce one event per change and preserve input records", () => {
  const before = [{ ref: "B-1", status: "Pending", assignedGuideId: null }];
  const snapshot = JSON.stringify(before);
  assert.deepEqual(bookingActivities(before, before), []);
  const confirmation = bookingActivities(before, [{ ...before[0], status: "Confirmed" }]);
  assert.equal(confirmation.length, 1);
  assert.deepEqual([confirmation[0].module, confirmation[0].type, confirmation[0].reference], ["Bookings", "Confirmed", "B-1"]);
  const assigned = [{ ...before[0], assignedGuideId: "G-1" }];
  assert.equal(bookingActivities(before, assigned)[0].type, "Assigned");
  assert.equal(bookingActivities(assigned, [{ ...assigned[0], assignedGuideId: "G-2" }])[0].type, "Reassigned");
  assert.equal(bookingActivities(assigned, before)[0].type, "Removed");
  assert.equal(JSON.stringify(before), snapshot);
});

test("tour creation, edits and publication are classified once and no-op saves are ignored", () => {
  const tour = { id: "T-1", name: "Tour", category: "Heritage Tours", shortDescription: "A", fullDescription: "B", location: "C", duration: "1 hour", price: 10, image: "/image", status: "Draft" };
  assert.equal(tourActivity(undefined, tour).type, "Created");
  assert.equal(tourActivity(tour, { ...tour }), null);
  assert.equal(tourActivity(tour, { ...tour, name: "Changed" }).type, "Edited");
  assert.equal(tourActivity(tour, { ...tour, name: "Changed" }).details, "Changed: name.");
  assert.equal(tourActivity(tour, { ...tour, name: "Changed", status: "Published" }).type, "Published");
  assert.equal(tourActivity({ ...tour, status: "Published" }, { ...tour, status: "Unpublished" }).type, "Unpublished");
});

test("content and settings changes describe fields, not private values, and ignore no-op saves", () => {
  const content = { headline: "One", headlineEmphasis: "Two", description: "Three", primaryAction: "A", secondaryAction: "B", heroImage: "/image", aboutTitle: "C", aboutDescription: "D", featuredTourIds: ["T-1"] };
  assert.equal(websiteActivity(content, { ...content, featuredTourIds: [...content.featuredTourIds] }), null);
  const event = websiteActivity(content, { ...content, headline: "Private text", featuredTourIds: [] });
  assert.equal(event.details, "Changed: headline, featured experiences.");
  assert.ok(!JSON.stringify(event).includes("Private text"));
  const settings = { requireGuideBeforeConfirmation: false, showInAppNotifications: true, showBookingNotifications: true };
  assert.equal(settingsActivity(settings, { ...settings }), null);
  assert.equal(settingsActivity(settings, { ...settings, requireGuideBeforeConfirmation: true }).details, "Changed: guide requirement.");
});

test("summaries, search, combined filters and stable timestamp sorting", () => {
  const entries = [
    entry(1, { action: "Booking confirmed", module: "Bookings", type: "Confirmed", reference: "B-1" }),
    entry(2, { action: "Tour edited", module: "Tours & Experiences", type: "Edited", reference: "T-2" }),
    entry(3, { action: "Guide approved", module: "Guides", type: "Approved", reference: "G-3" }, new Date("2026-01-03T03:04:05.000Z")),
    entry(4, { action: "Website content updated", module: "Website Content", type: "Updated" }),
    entry(5, { action: "Demo settings updated", module: "Settings", type: "Updated" }),
  ];
  assert.deepEqual(activitySummary(entries), { total: 5, bookings: 1, content: 2, administrative: 2 });
  assert.deepEqual(filterActivities(entries, initialActivityFilters).map((item) => item.id), [3, 5, 4, 2, 1]);
  assert.deepEqual(filterActivities(entries, { ...initialActivityFilters, order: "oldest" }).map((item) => item.id), [1, 2, 4, 5, 3]);
  for (const search of ["booking", "admin (demo)", "BOOKINGS", "b-1"]) assert.equal(filterActivities(entries, { ...initialActivityFilters, search, module: "Bookings", type: "Confirmed" }).length, 1);
  assert.equal(filterActivities(entries, { ...initialActivityFilters, module: "Bookings", type: "Approved" }).length, 0);
  assert.deepEqual(filterActivities([], initialActivityFilters), []);
  assert.deepEqual(activitySummary([]), { total: 0, bookings: 0, content: 0, administrative: 0 });
});

test("CSV has headers, escapes quotes and formula input, and leaves absent fields empty", () => {
  const csv = activitiesCsv([entry(1, { action: '=SUM("A1")', module: "Settings", type: "Updated" })]);
  assert.match(csv, /^"Action","Module","Activity type","Actor","Reference","Recorded at \(UTC\)","Details"\r\n/);
  assert.match(csv, /"'=SUM\(""A1""\)","Settings","Updated","Admin \(demo\)","","2026-01-02T03:04:05.000Z",""/);
  assert.equal(activitiesCsv([]).split("\r\n").length, 1);
});
