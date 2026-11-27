import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatBookingDate, type BookingRecord } from "./BookingsManagement";
import { isActiveSchedule, localDateString } from "./scheduling";

export default function ScheduleCalendar({ month, records, selectedDate, onMonthChange, onSelectDate }: {
  month: string;
  records: BookingRecord[];
  selectedDate: string;
  onMonthChange: (month: string) => void;
  onSelectDate: (date: string) => void;
}) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(year, monthNumber - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, monthNumber, 0).getDate();
  const cells = Math.ceil((offset + days) / 7) * 7;
  const counts = new Map<string, number>();
  records.filter(isActiveSchedule).forEach((record) => counts.set(record.date, (counts.get(record.date) ?? 0) + 1));
  const shift = (delta: number) => onMonthChange(localDateString(new Date(year, monthNumber - 1 + delta, 1)).slice(0, 7));
  const title = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return <section className="schedule-calendar" aria-label="Experience calendar">
    <div className="schedule-calendar-heading"><div><h2 aria-live="polite">{title}</h2><p>Pending and confirmed bookings are marked.</p></div><div><button type="button" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next month" onClick={() => shift(1)}><ChevronRight size={17} /></button></div></div>
    <div className="schedule-calendar-grid">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span className="schedule-weekday" key={day}>{day}</span>)}
      {Array.from({ length: cells }, (_, index) => {
        const day = index - offset + 1;
        if (day < 1 || day > days) return <span key={index} aria-hidden="true" />;
        const date = `${month}-${String(day).padStart(2, "0")}`;
        const count = counts.get(date) ?? 0;
        return <button type="button" key={date} className={`${count ? "has-bookings" : ""} ${selectedDate === date ? "selected" : ""}`} aria-pressed={selectedDate === date} aria-label={`${formatBookingDate(date)}, ${count} active ${count === 1 ? "booking" : "bookings"}`} onClick={() => onSelectDate(date)}><b>{day}</b>{count > 0 && <small>{count} {count === 1 ? "booking" : "bookings"}</small>}</button>;
      })}
    </div>
  </section>;
}
