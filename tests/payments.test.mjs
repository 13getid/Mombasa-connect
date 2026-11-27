import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/admin/payments.ts", import.meta.url), "utf8");
const csvSource = await readFile(new URL("../src/admin/csv.ts", import.meta.url), "utf8");
const csvJavascript = ts.transpileModule(csvSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const csvUrl = `data:text/javascript;base64,${Buffer.from(csvJavascript).toString("base64")}`;
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText.replace('"./csv"', JSON.stringify(csvUrl));
const { paymentCsv, paymentSummary } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const booking = {
  ref: "MTD-1",
  customer: "Demo",
  experience: "Tour",
  source: "Website",
  amount: 100,
  payment: "Paid",
  status: "Pending",
};

test("summary groups full booking values by payment status, independent of booking status", () => {
  const records = [
    booking,
    { ...booking, ref: "MTD-2", amount: 50, payment: "Pending", status: "Confirmed" },
    { ...booking, ref: "MTD-3", amount: 30, payment: "Refunded" },
    { ...booking, ref: "MTD-4", amount: 20, payment: "Failed" },
    { ...booking, ref: "MTD-5", amount: 10, payment: "Unpaid" },
  ];
  assert.deepEqual(paymentSummary(records), {
    total: 210,
    amounts: { Paid: 100, Pending: 50, Unpaid: 10, Failed: 20, Refunded: 30 },
    failed: 1,
    count: 5,
  });
  assert.equal(paymentSummary([]).total, 0);
});

test("CSV escapes quotes and formula-like text while preserving booking and payment values", () => {
  const csv = paymentCsv([{
    ...booking,
    ref: " =SUM(1,2)",
    customer: 'Demo, "Customer"',
    experience: "\t@command",
  }]);
  assert.match(csv, /"' =SUM\(1,2\)","Demo, ""Customer""","'\t@command","Website","100","Paid","Pending"/);
  assert.equal(paymentCsv([]).split("\r\n").length, 1);
});
