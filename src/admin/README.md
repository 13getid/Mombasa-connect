# Admin Portal

The dashboard prototype is available at `/admin`. Its component and isolated styles live in `AdminPortal.tsx` and `admin.css`; the route is selected in `../main.tsx`.

Dashboard figures and notifications are demonstration data. Backend authentication and role-based authorization are required before connecting real administration features or exposing sensitive data. The current route is not an access-control mechanism.

The shared admin sidebar connects Overview and Bookings Management. Booking filters, exports, and status changes use sample records only; status changes are shared between the two screens for the current session and are lost on reload.

The Overview calendar and upcoming tours reflect the sample booking records. Platform-wide totals and other operational figures are illustrative and are not calculated from that sample.

Use the calendar month controls to browse dates. Selecting a date opens Bookings Management with the experience-date filter applied, including dates with no reservations. Clear filters to return to all sample bookings.

Bookings Management supports status, search, tour, source, payment, and experience-date filters; CSV export includes only the filtered reservations. Pending bookings can be confirmed, and pending or confirmed bookings can be cancelled. Booking details, guide assignment, and other unfinished modules remain future-feature placeholders.