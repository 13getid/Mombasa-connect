# Admin Portal

The dashboard prototype is available at `/admin`. Its component and isolated styles live in `AdminPortal.tsx` and `admin.css`; the route is selected in `../main.tsx`.

Dashboard figures and notifications are demonstration data. Backend authentication and role-based authorization are required before connecting real administration features or exposing sensitive data. The current route is not an access-control mechanism.

The shared admin sidebar connects Overview and Bookings Management. Booking filters, exports, and status changes use sample records only; status changes are shared between the two screens for the current session and are lost on reload.

The Overview calendar and upcoming tours reflect the sample booking records. Platform-wide totals and other operational figures are illustrative and are not calculated from that sample.