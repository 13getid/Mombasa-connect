import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/admin/settings.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { initialAdminSettings, validateSettings, bookingConfirmationError, visibleDemoNotifications } =
  await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

test("defaults preserve confirmation behavior and show existing sample notifications", () => {
  const booking = { ref: "TEST-1", assignedGuideId: null };
  assert.equal(validateSettings(initialAdminSettings), null);
  assert.equal(bookingConfirmationError(booking, [], initialAdminSettings), null);
  assert.equal(visibleDemoNotifications(initialAdminSettings).length, 3);
});

test("guide requirement blocks missing or unknown assignments, but retains historical assignments", () => {
  const settings = { ...initialAdminSettings, requireGuideBeforeConfirmation: true };
  const guides = [{ id: "guide-1", status: "Suspended" }];
  const booking = { ref: "TEST-1", assignedGuideId: null, status: "Pending", payment: "Paid" };
  const original = JSON.stringify({ booking, guides, settings });
  assert.match(bookingConfirmationError(booking, guides, settings), /Assign a guide/);
  assert.match(bookingConfirmationError({ ...booking, assignedGuideId: "unknown" }, guides, settings), /Assign a guide/);
  assert.equal(bookingConfirmationError({ ...booking, assignedGuideId: "guide-1" }, guides, settings), null);
  assert.equal(JSON.stringify({ booking, guides, settings }), original);
});

test("notification preferences filter only the existing demo items", () => {
  const withoutBookings = { ...initialAdminSettings, showBookingNotifications: false };
  assert.deepEqual(visibleDemoNotifications(withoutBookings).map((item) => item.category), ["other", "other"]);
  assert.deepEqual(visibleDemoNotifications({ ...withoutBookings, showInAppNotifications: false }), []);
  assert.equal(visibleDemoNotifications(initialAdminSettings).length, 3);
});

test("validation rejects invalid preference values", () => {
  assert.match(validateSettings({ ...initialAdminSettings, showInAppNotifications: "yes" }), /valid on or off/);
  assert.match(validateSettings({ ...initialAdminSettings, requireGuideBeforeConfirmation: undefined }), /valid on or off/);
});
