# Mombasa Connect

A tourism discovery and booking frontend connecting visitors with locally guided experiences in Mombasa, Kenya. The application brings together a public travel website, customer and guide portals, and an admin dashboard prototype.

**Current stage:** interactive frontend prototype deployed on Render. The public website and customer and guide demonstrations have responsive layouts and shared light/dark mode. Authentication, reservations, payments, and account updates are not connected to a backend.

## Progress Overview

| Area | Current status |
| --- | --- |
| Public website | Implemented with experience previews, account forms, and a USSD walkthrough. |
| Customer portal | Demonstration dashboard, bookings, discovery, notifications, profile, and support screens. |
| Guide portal | Demonstration assignments, schedule, availability, notifications, profile, and support screens. |
| Admin portal | Connected Overview, Bookings, Guide Assignment, and Tours & Experiences screens with shared light/dark theme and temporary demonstration data. |
| Backend and integrations | Not yet connected; data and operational actions are demonstrations. |
| Deployment | Live frontend hosted on Render; the application remains a demonstration prototype. |
| Project setup | React and Vite frontend with an npm lockfile for reproducible installs. |

The portals use sample data defined in their React components. Interactive changes are demonstration state, not saved bookings or account updates; the shared theme preference is stored in the browser.

## Experiences

| Experience | Duration | Sample Price per Visitor |
| --- | --- | --- |
| Old Town Heritage Tour | 2-3 hours | KES 1,500 |
| Tudor Creek Dhow Ride | 1-2 hours | KES 2,500 |
| Fort Jesus Experience | 1-2 hours | KES 1,200 |

Prices, reservations, customer details, guide assignments, and notifications are demonstration data, not live availability or confirmed commercial terms.

## Current Features

### Public Website

- Branded landing page with local experience photography, tour descriptions, and pricing.
- Sections covering the platform's story, local tourism, offline access, and inquiries.
- Public experience previews with account creation or login required before booking continuation.
- **Book now** navigation action opens customer registration before booking.
- Interactive USSD walkthrough demonstrating an offline booking concept.
- Customer login, registration, and password recovery forms with frontend validation and explicit backend-unavailable feedback.
- Separate approved-guide login entry, proposed qualifications, and an email enquiry link.
- No public Admin login or role-selection dropdown.
- Responsive navigation and light/dark theme switching.

### Customer Portal

- Personalized demonstration dashboard for **Amara Kamau**.
- Featured upcoming experience with date, time, visitor count, price, and booking reference.
- Booking overview and recent booking history.
- Booking filters for confirmed, pending, completed, and cancelled reservations.
- Booking details with payment status displayed separately from booking status, guide information, booking channel, and cancellation guidance.
- Experience discovery and a booking-start placeholder for future reservation integration.
- Notifications with read-state controls and an empty-list state.
- Profile and password forms with demonstration feedback and basic contact-field validation.
- Help & Support page with contact actions and frequently asked questions.
- Loading states and a mobile navigation drawer.
- Logout navigation back to the public website.

### Guide Portal

- Separate `/guide` dashboard using the current guide component and its own stylesheet.
- Assignment lists and details, daily schedule, availability, notifications, profile, and support screens.
- Local demonstration status updates and forms; no live operations or backend persistence.
- Responsive layout and shared light/dark mode.

### Admin Portal

- Shared `/admin` shell with Overview, Bookings Management, Booking Details, Guide Assignment, and Tours & Experiences screens, active navigation, breadcrumbs, search, notifications, the shared light/dark theme toggle, and responsive navigation.
- Refreshed Overview with performance cards, booking activity and channel charts, an operations summary, recent bookings, popular experiences, and an upcoming-tours panel.
- Interactive calendar with previous/next month controls and highlighted dates containing pending or confirmed sample bookings.
- Selecting a calendar date opens Bookings Management filtered by experience date, including an empty state for dates without bookings.
- Reservation filtering by status, search, tour, source, payment status, and experience date; clear filters to restore all sample reservations.
- CSV export of the currently filtered reservations, including each reservation's assigned guide.
- Temporary confirmation and cancellation actions, with shared booking statuses reflected in Overview records, scheduled calendar dates, and pending-booking counts.
- Booking Details screen opened from any reservation, showing customer, experience, payment, booking source, guide assignment, and a demonstration timeline; fields missing from the demo data are clearly labelled, and payment status stays separate from booking status.
- Guide Assignment for pending and confirmed bookings: one primary guide per booking, selected from demonstration guide records with explicit confirmation for assignment, replacement, and removal. Only approved demo guides are assignable; completed, cancelled, and rejected bookings are locked.
- Tours & Experiences supports searching, filtering, creating, editing, and publishing demo tours. Draft, Published, and Unpublished are distinct admin states; tour names must be unique, ignoring case and surrounding whitespace.
- Guide management and other unfinished modules remain explicitly marked future-feature placeholders.
- Booking, guide-assignment, and tour changes survive navigation between admin screens but reset on reload. The admin tour catalogue does not update the separate public or customer catalogues. Platform-wide totals and other operational figures are illustrative, not calculated from the sample reservations.
- No backend integration, authentication, or access control.

### Shared Appearance

The interface uses a sunny Mombasa palette: sky blue (`#63C5F5`), cloud white (`#F8FCFF`), and scarlet red (`#C92A35`). Deeper blue (`#006B9E`) supports readable cloud-white labels; dark mode uses rich blue surfaces and cloud-white text. Editorial serif headings and functional sans-serif text remain consistent across pages. Some demonstration content retains the Mombasa Tour Direct name and `MTD` booking references.

Light/dark mode is shared between the public website, guide preview, admin dashboard, and all customer portal screens, including support. The preference is saved under `mombasa-connect-theme` in browser local storage and synchronized between tabs. If browser storage is unavailable, the toggle still works for the mounted application.

The browser page title is **Mombasa Connect**, configured in `.figma/make/site.json`. The public website, customer portal, guide portal, and admin dashboard use the shared `public/assets/logo.png` logo.

## Demo Access and Routes

**Live site URL:** https://mombasa-connect.onrender.com

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/home` | Public landing page; destination after logout |
| `/dashboard` | Customer portal |
| `/guide` | Guide portal demonstration |
| `/admin` | Admin dashboard demonstration |

To open the customer demonstration:

1. Open the public website.
2. Select **Log in** in the navigation.
3. Use **Create an account** for registration, or the login form for an existing account.
4. For this frontend-only demonstration, select **Preview customer dashboard**.

The customer demo displays Amara Kamau's sample profile. Account forms validate input but do not create accounts, verify credentials, or send password-reset emails. The separate demo link does not sign you in.

Guide access is separate: visit **For tour guides** in the footer or the guide section on the landing page, then choose **Tour guide log in**. **Preview guide assignments** opens the sample guide portal. Live guides will require operator-approved accounts. Proposed qualifications are subject to review and are not legal or licensing advice.

For the admin demonstration, open `/admin`. Use the sidebar or **View All Bookings** to switch to Bookings Management. Alternatively, select a calendar date to open date-filtered reservations. From a reservation's **Actions** menu, **View Booking** opens Booking Details and **Assign Guide** opens the Guide Assignment screen. All screens share the same sample booking records; reloading returns to Overview and restores the original sample data.

**The dashboard, guide, and admin routes are not protected.** They can be opened directly. Customer and guide logout controls are demonstration navigation, not authenticated-session invalidation; secure admin logout is a future-feature placeholder. Portal sections are managed with React state under `/dashboard`; they do not have individual URLs, and refreshing returns to the dashboard view.

## Technology

| Area | Implementation |
| --- | --- |
| UI | React 19 and TypeScript 5.7 |
| Development and build | Vite 8 |
| Styling | Tailwind CSS v4 and custom CSS |
| Shared theme | React context, CSS custom properties, and local storage |
| Icons | Lucide React and existing local SVG assets |
| Formatting | oxfmt |
| Project environment | Figma Make configuration and Vite plugins |

FastAPI is an intended backend integration, not an installed or running part of this repository.

## Local Development

### Requirements

- Git.
- Node.js 22.12 or newer within the Node.js 22 release line, compatible with Vite 8.
- npm, included with Node.js.

The optional [mise toolchain configuration](.mise.toml) specifies Node.js 22 and pnpm 10.34.3. This project uses npm and the included npm lockfile; avoid mixing package managers within the same dependency update.

### Clone, Install and Run

1. Clone the repository and enter its directory:

   ```bash
   git clone https://github.com/13getid/Mombasa-connect.git
   cd Mombasa-connect
   ```

2. Install the dependencies from the lockfile and start the development server:

   ```bash
   npm ci
   npm run dev
   ```

3. Open `http://localhost:8443` in your browser. The public page is available at `/`; the demo portals are available directly at `/dashboard`, `/guide`, and `/admin`.

Vite uses the `PORT` environment variable when provided and is configured to fail if the selected port is occupied. No backend, environment variables, or credentials are required for the frontend demo.

The logo and experience photos are stored directly in Git, so they are available after a normal clone without Git LFS. Other file types may still use the repository's Git LFS rules.

To run on the port used during recent local development:

```bash
npm run dev -- --port 5173
```

Then open `http://localhost:5173`. If a Figma Make preview server is already running, use that preview instead of starting another server on the same port.

### Build and Check

```bash
npx tsc --noEmit
npm run build
npm run preview
```

The build is written to `dist/`. The preview server defaults to port `8443` or the value of `PORT`; stop the development server first or choose another preview port:

```bash
npm run preview -- --port 4173
```

Vite's build does not replace the separate TypeScript check. There is currently no automated unit or end-to-end test suite configured in the project scripts.

To format the project:

```bash
npm run format
```

## Project Structure

```text
src/
  main.tsx             Route selection and shared theme provider
  vite-env.d.ts        Vite client types
  public/
    App.tsx            Public website, tour previews, and guide onboarding
    index.css          Public website and account form styles
  customer/
    CustomerPortal.tsx Customer dashboard and portal screens
    portal.css         Customer-only styles
  guide/
    GuidePortal.tsx    Guide dashboard and operational screens
    guide.css          Guide-only styles
  admin/
    AdminPortal.tsx    Admin shell, Overview, and shared sample bookings
    admin.css          Admin shell and Overview styles
    BookingsManagement.tsx Reservation filters, export, and demo status actions
    bookings.css       Bookings Management styles
    BookingDetails.tsx Single-reservation record with guide panel and demo timeline
    booking-details.css Booking Details styles
    GuideAssignment.tsx Primary-guide selection, replacement, and removal
    guide-assignment.css Guide Assignment styles
    guides.ts          Demonstration guide records and lookup helpers
    ToursManagement.tsx Demo tour catalogue, filters, and publication actions
    TourEditor.tsx     Demo tour creation and editing
    tours.ts           Tour data, categories, images, and validation
    tours.css          Tours & Experiences styles
    README.md          Admin portal and integration guidance
  shared/
    auth/
      AccountAccess.tsx Customer registration and login forms
    theme/
      theme.tsx        ThemeProvider, useTheme, and ThemeToggle
      theme.css        Shared palette and toggle styles
public/
  assets/              Logo and supporting assets
  images/              Experience photographs
.figma/                Figma Make configuration
```

The entrypoint loads the component for the current route; each component imports its own [customer](src/customer/portal.css), [guide](src/guide/guide.css), [admin](src/admin/admin.css), or [public](src/public/index.css) styles. [Shared theme styles](src/shared/theme/theme.css) are loaded for all pages. Customer and guide styles are never imported into each other's components.

To edit a role, start in its folder: [customer](src/customer/CustomerPortal.tsx), [guide](src/guide/GuidePortal.tsx), or [admin](src/admin/AdminPortal.tsx). Keep new role-specific components and feature subfolders inside the owning role folder. Put code in `shared/` only when multiple roles actually reuse it.

## Extending the System

New pages within the application root inherit `ThemeProvider`. Use `useTheme()` and `ThemeToggle` instead of maintaining a separate theme preference.

Use the shared `--mc-background`, `--mc-surface`, `--mc-surface-muted`, `--mc-text`, `--mc-text-muted`, `--mc-border`, `--mc-accent`, and `--mc-focus` CSS tokens for new screens. Existing portal styles also define their own themed tokens.

Register new top-level pages in [the application entrypoint](src/main.tsx). Admin access should remain outside the public navigation. Future guide APIs must scope assignments to the authenticated guide on the server, not just filter records in the browser.

## Integration and Launch Readiness

The following work remains before the application can serve real customers:

- Connect FastAPI endpoints and persistent storage for customers, experiences, reservations, and notifications.
- Implement real sign-in, authorization, protected routes, secure session handling, and logout for each role.
- Replace static booking data and simulated confirmations with validated availability and persisted reservations.
- Implement payment collection, payment verification, cancellation handling, and refunds.
- Connect profile, password, and photograph updates to secure account services.
- Integrate Africa's Talking USSD/SMS services; the current walkthrough does not send SMS or dial a live booking service.
- Add authentication and role-based access control for admin routes, then connect admin actions and guide assignments to authenticated, guide-scoped data.
- Confirm operating contact details, prices, cancellation policies, and support promises with the business.
- Add automated tests, API error handling, and production accessibility and security checks.

Some demonstration screens display success messages, booking confirmations, or support-response expectations. These are prototype interface states, not proof of a server action, delivered message, payment, or reservation. Do not enter real passwords or sensitive customer information into the demo forms.

## Render Deployment and Updates

The frontend is live on Render. For future updates:

1. Make and verify changes locally with `npx tsc --noEmit` and `npm run build`.
2. Commit and push the changes to the branch connected to the Render service.
3. If automatic deploys are enabled, wait for the deployment; otherwise, trigger a manual deploy in the Render dashboard.
4. Check the deployment logs and verify the updated site and relevant dashboard routes.

The build command is `npm run build` and the generated frontend is in `dist/`. For a Render static site, configure a rewrite from `/*` to `/index.html` so direct navigation and refresh work for `/dashboard`, `/guide`, `/admin`, and `/home`. Check the Render service settings for the actual build, publish, and rewrite configuration.

No backend URL, API key, or authentication secret is required for the current frontend demonstration. Do not place service secrets in browser code or `VITE_*` variables, which are exposed to the client.

The project retains Figma Make configuration. `PORT` and `FIGMA_DEV_SERVER_HOST` control server binding; `FIGMA_PUBLIC_URL` adjusts the Vite base path for Figma builds. Current navigation and asset references use root-relative paths, so deployment at the domain root is the supported assumption until subpath navigation is explicitly adapted.

Several font definitions load from `static.figma.com`. A production deployment should review font availability, licensing, and hosting requirements.