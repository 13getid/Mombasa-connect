import type { BookingRecord } from "./BookingsManagement";

export function isActiveSchedule(record: BookingRecord): boolean {
  return record.status === "Pending" || record.status === "Confirmed";
}

export function sameDayGuideBookings(record: BookingRecord, records: BookingRecord[]): BookingRecord[] {
  if (!record.assignedGuideId || !isActiveSchedule(record)) return [];
  return records.filter((other) => other.ref !== record.ref && isActiveSchedule(other)
    && other.assignedGuideId === record.assignedGuideId && other.date === record.date);
}

export function localDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
