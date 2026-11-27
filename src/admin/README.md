# Admin Portal

The dashboard prototype is available at `/admin`. Its component and isolated styles live in `AdminPortal.tsx` and `admin.css`; the route is selected in `../main.tsx`.

Dashboard figures and notifications are demonstration data. Backend authentication and role-based authorization are required before connecting real administration features or exposing sensitive data. The current route is not an access-control mechanism.

The shared admin sidebar connects Overview, Bookings Management, Tours & Experiences, and Guides Management; Booking Details and Guide Assignment open from individual reservations. Booking, guide, and tour changes use sample records only; changes are shared between the admin screens for the current session and are lost on reload.

The Overview calendar and upcoming tours reflect the sample booking records. Platform-wide totals and other operational figures are illustrative and are not calculated from that sample.

Use the calendar month controls to browse dates. Selecting a date opens Bookings Management with the experience-date filter applied, including dates with no reservations. Clear filters to return to all sample bookings.

Bookings Management supports status, search, tour, source, payment, and experience-date filters; CSV export includes only the filtered reservations and each reservation's assigned guide. Pending bookings can be confirmed, and pending or confirmed bookings can be cancelled.

**View Booking** opens Booking Details with customer, experience, payment, source, and guide information plus a demonstration timeline; payment status is tracked separately from booking status. **Assign Guide** opens the Guide Assignment screen, where each booking has at most one primary guide selected from the demonstration guide records in `guides.ts`. Assignment, replacement, and removal require explicit confirmation, only approved guides are assignable, and completed, cancelled, or rejected bookings are locked.

Tours & Experiences supports searching, filtering, creating, editing, publishing, and unpublishing demo tours. A Draft has never been published; Published and Unpublished reflect the current demo catalogue state. Tour names must be unique ignoring case and surrounding whitespace. Renames update matching admin booking and guide tour names without changing historical booking amounts. The admin catalogue is temporary frontend state and does not update the separate public or customer catalogues; reload restores the initial data.

Guides Management offers a searchable directory and profile details, including tour specialities and pending or confirmed booking assignments. Pending guides can be approved or rejected, approved guides suspended, and suspended guides reactivated; each action requires confirmation. Only approved guides can receive new assignments, while existing assignments are retained and show their guide's current status. Verification documents and activity history are not supported. Guide changes are frontend demo state, reset on reload, and do not update the separate guide portal. Other unfinished modules remain future-feature placeholders.