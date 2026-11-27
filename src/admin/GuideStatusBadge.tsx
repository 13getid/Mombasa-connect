import type { GuideRecord } from "./guides";

export default function GuideStatusBadge({ status }: { status: GuideRecord["status"] }) {
  const tone = status === "Approved" ? "confirmed" : status === "Pending Verification" ? "pending" : status === "Rejected" ? "rejected" : "cancelled";
  return <span className={`admin-status ${tone}`}>{status}</span>;
}
