import type { BookingRecord } from "./BookingsManagement";
import { csvRows } from "./csv";

export const bookingStatuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"] as const satisfies readonly BookingRecord["status"][];

export function ussdBookings(records: BookingRecord[]): BookingRecord[] {
  return records.filter((record) => record.source === "USSD");
}

export function ussdCsv(records: BookingRecord[]): string {
  return csvRows([
    ["Booking Reference", "Customer", "Phone", "Experience", "Experience Date", "Guests", "Source", "Booking Amount (KES)", "Booking Status", "Payment Status"],
    ...ussdBookings(records).map((record) => [record.ref, record.customer, record.phone, record.experience, record.date, record.guests, record.source, record.amount, record.status, record.payment]),
  ]);
}
