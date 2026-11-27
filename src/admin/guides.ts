export type GuideRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  title: string;
  status: "Approved" | "Pending Verification" | "Rejected" | "Suspended";
  languages: string[];
  tours: string[];
};

export function canChangeGuideStatus(from: GuideRecord["status"], to: GuideRecord["status"]): boolean {
  return (from === "Pending Verification" && (to === "Approved" || to === "Rejected"))
    || (from === "Approved" && to === "Suspended")
    || (from === "Suspended" && to === "Approved");
}

/**
 * Demonstration guide records. Ali Bakari matches the existing guide portal
 * profile; Fatuma Noor matches the pending-verification admin notification.
 */
export const demoGuides: GuideRecord[] = [
  { id: "MTD-G-0117", name: "Ali Bakari", phone: "+254 722 471 125", email: "ali.bakari@mombasadirect.ke", title: "Heritage guide & dhow captain", status: "Approved", languages: ["Swahili", "English"], tours: ["Old Town Heritage Tour", "Tudor Creek Dhow Ride"] },
  { id: "MTD-G-0121", name: "Mwanaisha Juma", phone: "+254 710 554 280", title: "Old Town heritage specialist", status: "Approved", languages: ["Swahili", "English"], tours: ["Old Town Heritage Tour", "Fort Jesus Experience"] },
  { id: "MTD-G-0124", name: "Hassan Mwalimu", phone: "+254 733 908 417", title: "Fort Jesus historian", status: "Approved", languages: ["Swahili", "English", "French"], tours: ["Fort Jesus Experience"] },
  { id: "MTD-G-0129", name: "Neema Achieng", phone: "+254 701 226 395", title: "Creek & coastal excursions", status: "Approved", languages: ["Swahili", "English"], tours: ["Tudor Creek Dhow Ride"] },
  { id: "MTD-G-0133", name: "Fatuma Noor", phone: "+254 745 118 062", title: "Trainee heritage guide", status: "Pending Verification", languages: ["Swahili", "English"], tours: ["Old Town Heritage Tour"] },
  { id: "MTD-G-0108", name: "Omar Said", phone: "+254 728 330 571", title: "Dhow captain", status: "Suspended", languages: ["Swahili"], tours: ["Tudor Creek Dhow Ride"] },
];

export function findGuide(guides: GuideRecord[], id: string | null | undefined): GuideRecord | undefined {
  return id ? guides.find((guide) => guide.id === id) : undefined;
}

export function guideInitials(name: string): string {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}
