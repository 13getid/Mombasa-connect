import type { BookingRecord } from "./BookingsManagement";
import type { TourRecord } from "./tours";
import { findGuide, type GuideRecord } from "./guides";
import { deriveCustomers } from "./customers";
import { csvRows } from "./csv";
import { bookingStatuses } from "./ussd";
import { paymentStatuses } from "./payments";

export type ReportFilters = {
  from: string;
  to: string;
  bookingStatus: string;
  paymentStatus: string;
  source: string;
};

export const initialReportFilters: ReportFilters = {
  from: "", to: "", bookingStatus: "All", paymentStatus: "All", source: "All",
};

export function sourceGroup(source: string | null | undefined): "Website" | "USSD" | "Unknown/Other" {
  return source === "Website" || source === "USSD" ? source : "Unknown/Other";
}

export function filterReportBookings(records: BookingRecord[], filters: ReportFilters): BookingRecord[] {
  if (filters.from && filters.to && filters.from > filters.to) return [];
  return records.filter((record) =>
    (!filters.from || (record.date && record.date >= filters.from))
    && (!filters.to || (record.date && record.date <= filters.to))
    && (filters.bookingStatus === "All" || record.status === filters.bookingStatus)
    && (filters.paymentStatus === "All" || record.payment === filters.paymentStatus)
    && (filters.source === "All" || sourceGroup(record.source) === filters.source));
}

export function reportSummary(records: BookingRecord[], guides: GuideRecord[]) {
  const bookingCounts = Object.fromEntries(bookingStatuses.map((status) => [status, records.filter((record) => record.status === status).length]));
  const paymentCounts = Object.fromEntries(paymentStatuses.map((status) => [status, records.filter((record) => record.payment === status).length]));
  const sources = {
    Website: records.filter((record) => sourceGroup(record.source) === "Website").length,
    USSD: records.filter((record) => sourceGroup(record.source) === "USSD").length,
    "Unknown/Other": records.filter((record) => sourceGroup(record.source) === "Unknown/Other").length,
  };
  const guideCounts = {
    Approved: guides.filter((guide) => guide.status === "Approved").length,
    "Pending Verification": guides.filter((guide) => guide.status === "Pending Verification").length,
    Rejected: guides.filter((guide) => guide.status === "Rejected").length,
    Suspended: guides.filter((guide) => guide.status === "Suspended").length,
  };
  const assigned = records.filter((record) => Boolean(record.assignedGuideId)).length;
  const unknownGuide = records.filter((record) => record.assignedGuideId && !findGuide(guides, record.assignedGuideId)).length;
  const customers = deriveCustomers(records);
  return {
    total: records.length,
    value: records.reduce((sum, record) => sum + record.amount, 0),
    bookingCounts, paymentCounts, sources, guideCounts, assigned,
    unassigned: records.length - assigned,
    unknownGuide,
    customerGroups: customers.length,
    multipleBookings: customers.filter((customer) => customer.bookings.length > 1).length,
    unidentifiedBookings: records.filter((record) => !record.customer.trim() && !record.phone.trim()).length,
  };
}

export function tourPerformance(records: BookingRecord[], tours: TourRecord[]) {
  const rows = tours.map((tour) => ({
    key: `tour:${tour.id}`, name: tour.name, category: tour.category, status: tour.status, count: 0, value: 0,
  }));
  const unmatched = new Map<string, { key: string; name: string; category: string; status: string; count: number; value: number }>();
  for (const record of records) {
    const matches = tours.flatMap((tour, index) => tour.name === record.experience ? [index] : []);
    if (matches.length === 1) {
      rows[matches[0]].count++;
      rows[matches[0]].value += record.amount;
    } else {
      const name = record.experience || "Not recorded";
      const row = unmatched.get(record.experience) ?? { key: `unmatched:${record.experience}`, name, category: "Not recorded", status: "Not matched", count: 0, value: 0 };
      row.count++;
      row.value += record.amount;
      unmatched.set(record.experience, row);
    }
  }
  return [...rows, ...unmatched.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function reportsCsv(records: BookingRecord[], guides: GuideRecord[]): string {
  return csvRows([
    ["Booking Reference", "Customer", "Phone", "Experience", "Experience Date", "Guests", "Booking Source", "Booking Amount (KES)", "Booking Status", "Payment Status", "Assigned Guide"],
    ...records.map((record) => [
      record.ref, record.customer, record.phone, record.experience, record.date, record.guests,
      record.source ?? "", record.amount, record.status, record.payment,
      record.assignedGuideId ? findGuide(guides, record.assignedGuideId)?.name ?? `Unknown guide (${record.assignedGuideId})` : "Unassigned",
    ]),
  ]);
}
