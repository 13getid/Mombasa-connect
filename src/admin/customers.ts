import type { BookingRecord } from "./BookingsManagement";

export type CustomerRecord = {
  key: string;
  name: string;
  phone: string;
  bookings: BookingRecord[];
  hasWebsiteBooking: boolean;
};

export function deriveCustomers(records: BookingRecord[]): CustomerRecord[] {
  const customers = new Map<string, CustomerRecord>();
  for (const booking of records) {
    const name = booking.customer.trim();
    const phone = booking.phone.trim();
    if (!name && !phone) continue;
    const digits = phone.replace(/\D/g, "");
    // A name alone or an incomplete phone number cannot establish identity.
    const key = name && digits.length >= 10
      ? JSON.stringify(["contact", name.toLowerCase(), digits])
      : JSON.stringify(["booking", booking.ref]);
    const customer = customers.get(key);
    if (customer) {
      customer.bookings.push(booking);
      customer.hasWebsiteBooking ||= booking.source === "Website";
    } else {
      customers.set(key, {
        key,
        name,
        phone,
        bookings: [booking],
        hasWebsiteBooking: booking.source === "Website",
      });
    }
  }
  return [...customers.values()];
}
