import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

async function loadUrl(name, dependencies = {}) {
  const source = await readFile(new URL(`../src/admin/${name}.ts`, import.meta.url), "utf8");
  let javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  for (const [path, url] of Object.entries(dependencies)) javascript = javascript.replace(`"${path}"`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
}
const csv = await loadUrl("csv");
const dependencies = {
  "./csv": csv,
  "./guides": await loadUrl("guides"),
  "./customers": await loadUrl("customers"),
  "./ussd": await loadUrl("ussd", { "./csv": csv }),
  "./payments": await loadUrl("payments", { "./csv": csv }),
};
const { reportSummary, filterReportBookings, initialReportFilters, tourPerformance, reportsCsv } = await import(await loadUrl("reports", dependencies));

const base = { ref: "A", customer: "Demo", phone: "+254 123456789", experience: "Tour A", date: "2026-01-01", guests: 2, source: "Website", amount: 100, status: "Pending", payment: "Unpaid", assignedGuideId: "g1" };
const records = [
  base,
  { ...base, ref: "B", date: "2026-01-02", source: "USSD", amount: 200, status: "Confirmed", payment: "Pending", assignedGuideId: "g2" },
  { ...base, ref: "C", experience: "Tour B", date: "2026-01-03", source: null, amount: 300, status: "Completed", payment: "Paid", assignedGuideId: "missing" },
  { ...base, ref: "D", experience: "Missing", source: "Other", amount: 400, status: "Cancelled", payment: "Failed", assignedGuideId: null },
  { ...base, ref: "E", experience: "Ambiguous", source: undefined, amount: 500, status: "Rejected", payment: "Refunded", assignedGuideId: null },
];
const guides = [
  { id: "g1", name: "Guide One", status: "Approved" },
  { id: "g2", name: "Guide Two", status: "Suspended" },
  { id: "g3", name: "Guide Three", status: "Rejected" },
  { id: "g4", name: "Guide Four", status: "Pending Verification" },
];
const tours = [
  { id: "t1", name: "Tour A", category: "Heritage", status: "Published" },
  { id: "t2", name: "Tour B", category: "Coastal", status: "Unpublished" },
  { id: "t3", name: "Ambiguous", category: "Other", status: "Draft" },
  { id: "t4", name: "Ambiguous", category: "Other", status: "Draft" },
  { id: "t5", name: "No bookings", category: "Other", status: "Draft" },
];

test("summary uses each booking once and separates booking, payment, source and guide status", () => {
  const summary = reportSummary(records, guides);
  assert.equal(summary.total, 5);
  assert.equal(summary.value, 1500);
  assert.deepEqual(summary.bookingCounts, { Pending: 1, Confirmed: 1, Completed: 1, Cancelled: 1, Rejected: 1 });
  assert.deepEqual(summary.paymentCounts, { Paid: 1, Pending: 1, Unpaid: 1, Failed: 1, Refunded: 1 });
  assert.deepEqual(summary.sources, { Website: 1, USSD: 1, "Unknown/Other": 3 });
  assert.deepEqual(summary.guideCounts, { Approved: 1, "Pending Verification": 1, Rejected: 1, Suspended: 1 });
  assert.deepEqual([summary.assigned, summary.unassigned, summary.unknownGuide], [3, 2, 1]);
  assert.equal(summary.customerGroups, 1);
  assert.equal(summary.multipleBookings, 1);
});

test("tour performance preserves stored values and separates unmatched or ambiguous names", () => {
  const rows = tourPerformance(records, tours);
  const row = (key) => rows.find((item) => item.key === key);
  assert.deepEqual([row("tour:t1").count, row("tour:t1").value, row("tour:t1").status], [2, 300, "Published"]);
  assert.deepEqual([row("tour:t2").count, row("tour:t2").value], [1, 300]);
  assert.deepEqual([row("unmatched:Missing").count, row("unmatched:Missing").value, row("unmatched:Missing").status], [1, 400, "Not matched"]);
  assert.deepEqual([row("unmatched:Ambiguous").count, row("tour:t3").count, row("tour:t4").count], [1, 0, 0]);
  assert.equal(row("tour:t5").count, 0);
});

test("inclusive experience dates, combined filters, unknown sources and invalid ranges", () => {
  const filter = (values) => filterReportBookings(records, { ...initialReportFilters, ...values });
  assert.deepEqual(filter({ from: "2026-01-02", to: "2026-01-03" }).map((r) => r.ref), ["B", "C"]);
  assert.deepEqual(filter({ from: "2026-01-02", to: "2026-01-02", bookingStatus: "Confirmed", paymentStatus: "Pending", source: "USSD" }).map((r) => r.ref), ["B"]);
  assert.deepEqual(filter({ source: "Unknown/Other" }).map((r) => r.ref), ["C", "D", "E"]);
  assert.deepEqual(filter({ from: "2026-01-03", to: "2026-01-01" }), []);
  assert.equal(filter({ paymentStatus: "Paid", source: "USSD" }).length, 0);
});

test("empty reports and filtered CSV preserve source records and escape spreadsheet inputs", () => {
  const original = JSON.stringify({ records, guides, tours });
  reportSummary(records, guides);
  tourPerformance(records, tours);
  reportsCsv(records, guides);
  const empty = reportSummary([], []);
  assert.equal(empty.total, 0);
  assert.equal(empty.value, 0);
  assert.equal(empty.unassigned, 0);
  assert.deepEqual(tourPerformance([], []), []);
  const selected = filterReportBookings(records, { ...initialReportFilters, source: "USSD" });
  const csv = reportsCsv([{ ...selected[0], customer: '=SUM(1,2)', experience: 'A "quoted", tour' }], guides);
  assert.ok(csv.startsWith('"Booking Reference","Customer","Phone","Experience","Experience Date","Guests","Booking Source","Booking Amount (KES)","Booking Status","Payment Status","Assigned Guide"\r\n'));
  assert.ok(csv.includes('"B","\'=SUM(1,2)","\'+254 123456789","A ""quoted"", tour","2026-01-02","2","USSD","200","Confirmed","Pending","Guide Two"'));
  assert.ok(!csv.includes('"A","'));
  assert.equal(reportsCsv([], guides).split("\r\n").length, 1);
  assert.equal(JSON.stringify({ records, guides, tours }), original);
});

test("customer patterns keep incomplete contacts separate and count unidentified records", () => {
  const summary = reportSummary([
    { ...base, ref: "F", customer: "", phone: "" },
    { ...base, ref: "G", customer: "Demo", phone: "123" },
    { ...base, ref: "H", customer: "Demo", phone: "123" },
  ], []);
  assert.equal(summary.customerGroups, 2);
  assert.equal(summary.multipleBookings, 0);
  assert.equal(summary.unidentifiedBookings, 1);
});
