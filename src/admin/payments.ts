import type { BookingRecord } from "./BookingsManagement";

export const paymentStatuses = ["Paid", "Pending", "Unpaid", "Failed", "Refunded"] as const satisfies readonly BookingRecord["payment"][];

export function paymentSummary(records: BookingRecord[]) {
  const amounts: Record<BookingRecord["payment"], number> = { Paid: 0, Pending: 0, Unpaid: 0, Failed: 0, Refunded: 0 };
  let total = 0;
  for (const record of records) {
    total += record.amount;
    amounts[record.payment] += record.amount;
  }
  return { total, amounts, failed: records.filter((record) => record.payment === "Failed").length, count: records.length };
}

function csvCell(value: string | number): string {
  const text = String(value);
  const safe = typeof value === "string" && (/^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^ *[\t\r\n]/.test(text)) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function paymentCsv(records: BookingRecord[]): string {
  const rows: (string | number)[][] = [
    ["Booking Reference", "Customer", "Experience", "Booking Source", "Booking Amount (KES)", "Payment Status", "Booking Status"],
    ...records.map((record) => [record.ref, record.customer, record.experience, record.source, record.amount, record.payment, record.status]),
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
