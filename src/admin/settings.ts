import type { BookingRecord } from "./BookingsManagement";
import type { GuideRecord } from "./guides";

export type AdminSettings = {
  requireGuideBeforeConfirmation: boolean;
  showInAppNotifications: boolean;
  showBookingNotifications: boolean;
};

export const initialAdminSettings: AdminSettings = {
  requireGuideBeforeConfirmation: false,
  showInAppNotifications: true,
  showBookingNotifications: true,
};

export function validateSettings(settings: AdminSettings): string | null {
  return typeof settings.requireGuideBeforeConfirmation === "boolean"
    && typeof settings.showInAppNotifications === "boolean"
    && typeof settings.showBookingNotifications === "boolean"
    ? null : "Settings must have valid on or off values.";
}

export function bookingConfirmationError(
  booking: BookingRecord,
  guides: GuideRecord[],
  settings: AdminSettings,
): string | null {
  if (settings.requireGuideBeforeConfirmation && !guides.some((guide) => guide.id === booking.assignedGuideId)) {
    return `Assign a guide with an existing guide record to ${booking.ref} before confirming this demo booking.`;
  }
  return null;
}

export type DemoNotification = {
  title: string;
  detail: string;
  time: string;
  category: "booking" | "other";
};

export const demoNotifications: DemoNotification[] = [
  { title: "Booking requires review", detail: "MTD-1023 was submitted through USSD.", time: "8 minutes ago", category: "booking" },
  { title: "Guide verification submitted", detail: "Fatuma Noor uploaded new credentials.", time: "32 minutes ago", category: "other" },
  { title: "Tour capacity reached", detail: "Saturday’s Tudor Creek departure is full.", time: "1 hour ago", category: "other" },
];

export function visibleDemoNotifications(settings: AdminSettings): DemoNotification[] {
  if (!settings.showInAppNotifications) return [];
  return demoNotifications.filter((item) => item.category !== "booking" || settings.showBookingNotifications);
}
