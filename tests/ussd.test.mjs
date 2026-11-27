import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const csvSource = await readFile(new URL("../src/admin/csv.ts", import.meta.url), "utf8");
const csvUrl = `data:text/javascript;base64,${Buffer.from(compile(csvSource)).toString("base64")}`;
const source = await readFile(new URL("../src/admin/ussd.ts", import.meta.url), "utf8");
const javascript = compile(source).replace('"./csv"', JSON.stringify(csvUrl));
const { ussdBookings, ussdCsv } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const booking = {
  ref: "MTD-1",
  customer: 'Demo, "Customer"',
  phone: "+254 123",
  experience: " =SUM(1,2)",
  date: "2026-11-14",
  guests: 2,
  source: "USSD",
  amount: 1500,
  status: "Confirmed",
  payment: "Pending",
};

test("USSD records and export exclude website bookings", () => {
  const website = { ...booking, ref: "WEB-1", source: "Website" };
  assert.deepEqual(ussdBookings([booking, website]), [booking]);
  const csv = ussdCsv([booking, website]);
  assert.ok(!csv.includes("WEB-1"));
  assert.match(csv, /"MTD-1","Demo, ""Customer""","'\+254 123","' =SUM\(1,2\)","2026-11-14","2","USSD","1500","Confirmed","Pending"/);
  assert.equal(ussdCsv([]).split("\r\n").length, 1);
});
