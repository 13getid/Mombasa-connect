# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply. Tailwind's Preflight already applies `box-sizing: border-box`, removes default margins, and sets `font: inherit` on form controls, so do not repeat those rules.


---

# Mombasa Connect — Project-Specific Development Instructions

## 1. Project Identity

Mombasa Connect is a Mombasa tourism discovery and booking platform. It provides:

- A public tourism website.
- A customer portal.
- A tour guide portal.
- An administrator portal.
- A future USSD booking channel for users with limited internet access.

The application is currently a frontend prototype. Do not represent demonstration functionality as live backend functionality.

## 2. Technology Stack — Do Not Change

Use the existing project stack:

- React 19
- TypeScript 5.7
- Vite 8
- Tailwind CSS v4
- Custom CSS
- React Context for shared theme management
- CSS custom properties for theme tokens
- Local storage for the existing theme preference
- Lucide React for icons
- Existing local SVG assets
- oxfmt for formatting

Use npm and the existing package-lock.json.

Do not migrate to another framework, styling system, package manager, or build tool.

Do not install additional dependencies without explaining why they are needed and obtaining approval.

## 3. Mandatory Repository Inspection

Before modifying code:

1. Inspect the existing files relevant to the requested task.
2. Read the relevant component and stylesheet.
3. Understand existing state management and navigation.
4. Check how shared theme variables are used.
5. Reuse existing components and utilities wherever possible.

Treat the actual source code as authoritative when documentation and implementation differ.

Do not assume that a component, route, or utility exists without checking.

## 4. Project Preservation Rules

This is an existing application, not a new project.

NEVER:

- Replace the entire application with a new implementation.
- Delete or recreate existing customer-facing pages.
- Delete or recreate the Guide Portal.
- Redesign the completed Admin Overview without explicit approval.
- Remove or unnecessarily redesign Bookings Management.
- Create a second independent Admin Portal.
- Duplicate existing theme providers or navigation systems.
- Remove existing local SVG assets, photographs, or logos.
- Change the application's established branding without approval.
- Replace working functionality with static screenshots.
- overwrite existing files without inspecting their contents.

Make focused, incremental changes.

Preserve unrelated functionality when implementing a requested feature.

## 5. Existing Application Structure

The documented application structure includes:

src/
  main.tsx
  public/
    App.tsx
    index.css
  customer/
    CustomerPortal.tsx
    portal.css
  guide/
    GuidePortal.tsx
    guide.css
  admin/
    AdminPortal.tsx
    admin.css
    BookingsManagement.tsx
    bookings.css
    README.md
  shared/
    auth/
    theme/

public/
  assets/
  images/

The actual repository may evolve. Inspect the current files before relying on this structure.

Keep role-specific components and styles inside their respective folders.

Place components in shared/ only when they are genuinely reused by multiple application areas.

## 6. Admin Portal Continuity

The Admin Portal is one connected application.

Existing completed screens:

- Admin Dashboard Overview.
- Bookings Management.

Preserve both screens and their existing functionality.

New screens must extend the existing Admin Portal shell rather than create separate applications.

Maintain consistent:

- Sidebar navigation.
- Top navigation.
- Breadcrumbs.
- Typography.
- Colours and theme behaviour.
- Buttons and interaction patterns.
- Tables and filters.
- Status badges.
- Form elements.
- Spacing and responsive behaviour.

Only the active navigation item and page content should change when navigating between Admin modules.

Do not remove existing navigation items when adding new modules.

## 7. Admin Module Roadmap

Implement these modules incrementally:

1. Dashboard Overview — existing.
2. Bookings Management — existing.
3. Booking Details.
4. Guide Assignment.
5. Tours Management.
6. Create/Edit Tour.
7. Guide Management.
8. Customer Management.
9. Availability and Scheduling.
10. Payments Management.
11. USSD Activity Monitoring.
12. Reports and Analytics.
13. Website Content Management.
14. Settings.
15. Activity Logs.

Do not implement all modules in one operation.

Only implement the module explicitly requested in the current task.

## 8. Admin Permissions and Business Rules

The administrator manages the overall platform.

Administrators can:

- View platform-wide bookings.
- Confirm, reject, or cancel bookings.
- Manage tours and experiences.
- Create, edit, publish, and archive tours.
- Assign guides to bookings.
- Approve or suspend guides.
- Manage customer records.
- Manage schedules and availability.
- Review payment records.
- Monitor USSD activity.
- View reports and analytics.
- Manage public website content.
- Review activity logs.

Guides must not be given administrator privileges.

Guides cannot:

- Create or publish tours.
- Change tour prices.
- Manage customers.
- Assign other guides.
- Manage payments.
- View administrator analytics.
- Access other guides' private assignments.

These are application business rules. Actual authorization must eventually be enforced by the backend, not only by hiding frontend controls.

## 9. Booking and Payment Data Rules

Keep booking status separate from payment status.

Booking status examples:

- Pending
- Confirmed
- Completed
- Cancelled
- Rejected

Payment status examples:

- Unpaid
- Pending
- Paid
- Failed
- Refunded

Do not combine these into one status field or badge.

A booking should retain its booking reference, customer information, tour, experience date, guest count, booking source, and price information.

Booking sources:

- Website
- USSD

USSD bookings may eventually exist without a registered website customer account. Do not assume every booking must have a customer user ID.

Use the existing booking data model where possible. Propose changes before replacing it.

## 10. Frontend Design Standards

The interface should feel like a polished, professionally designed tourism platform.

Avoid:

- Generic AI-generated dashboard layouts.
- Excessive cards.
- Excessive gradients.
- Unnecessary rounded containers.
- Inconsistent typography.
- Decorative elements that reduce usability.
- Overcrowded tables.
- Fake functionality presented as operational functionality.

Prioritise:

- Clear information hierarchy.
- Readable data.
- Strong spacing and alignment.
- Consistent component behaviour.
- Accessible contrast.
- Responsive layouts.
- Meaningful empty, loading, and error states.

Use existing branding and theme variables. Do not introduce a new palette without approval.

## 11. Theme and Styling Rules

Use the existing ThemeProvider and useTheme() implementation.

Reuse the existing CSS custom properties, including:

- --mc-background
- --mc-surface
- --mc-surface-muted
- --mc-text
- --mc-text-muted
- --mc-border
- --mc-accent
- --mc-focus

Support both existing light and dark themes.

Do not create a separate theme system for the Admin Portal.

Use Tailwind CSS v4 utilities where appropriate and existing custom CSS conventions for more complex layouts.

Do not add an unnecessary Tailwind configuration or PostCSS configuration.

## 12. React and TypeScript Standards

- Use functional React components.
- Use TypeScript for all new application components.
- Define clear interfaces or types for component props and data.
- Avoid using `any` unless absolutely necessary and justified.
- Keep components focused and reusable.
- Extract repeated UI patterns when appropriate.
- Avoid unnecessarily large components.
- Keep state management consistent with the existing implementation.
- Clean up event listeners and effects appropriately.
- Avoid duplicating sample data across components.

Do not introduce a new state-management library without approval.

## 13. Demonstration Data and Backend Boundaries

Until the backend is implemented:

- Clearly treat sample data as demonstration data.
- Keep existing frontend interactions functional.
- Reuse shared state where multiple screens display the same records.
- Do not claim that changes are permanently saved.
- Do not invent successful payment, SMS, or USSD transactions.
- Do not place secrets or private credentials in frontend code.
- Do not introduce fake API endpoints and describe them as operational.

Future backend integration is planned with FastAPI and PostgreSQL.

Do not start backend implementation unless explicitly requested.

## 14. Responsive Design

Design and verify interfaces for:

- Desktop: approximately 1440px.
- Tablet: approximately 768px.
- Mobile: approximately 375px.

The Admin Portal should remain usable on smaller screens.

Tables should have deliberate responsive behaviour, such as horizontal scrolling or an appropriate mobile layout.

Avoid clipping important actions or navigation.

## 15. Icons and Assets

Prefer existing Lucide React icons and repository SVG assets.

Do not replace established brand assets with arbitrary icons or emoji.

Do not install another icon library.

Use descriptive accessible labels for icon-only controls.

## 16. Development Workflow

For every requested module:

1. Inspect the existing implementation.
2. Explain the files that need modification or creation.
3. Describe the implementation approach briefly.
4. Implement only the requested feature.
5. Preserve existing functionality.
6. Run the TypeScript check.
7. Run the production build.
8. Report the files changed and checks performed.

Use the existing project scripts.

Expected verification commands:

npx tsc --noEmit
npm run build

Use npm run format when formatting is needed.

Do not claim that checks passed unless they were actually executed.

## 17. Git Safety

- Do not run destructive Git commands.
- Do not reset or overwrite the user's existing work.
- Do not force-push.
- Do not commit or push without explicit permission.
- Inspect git status before significant changes.
- Preserve the user's uncommitted work.

## 18. Copilot Working Behaviour

Act as a careful senior React and TypeScript developer working on an existing application.

Before making substantial changes, explain the intended approach.

If an instruction conflicts with existing project architecture, inspect the code and explain the conflict before changing the architecture.

Ask for clarification when a requirement is ambiguous.

Prioritise correctness, maintainability, consistency, and preservation of existing work over generating large amounts of code quickly.
