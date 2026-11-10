# Admin Portal

Reserved for the future private admin portal. There is no admin route or public admin login yet.

Keep admin-specific components and CSS inside this folder, following the customer and guide folders. Add subfolders for admin features only as they are implemented.

Reuse the theme provider and controls from `../shared/theme/theme` and the shared `--mc-*` CSS tokens. Register an admin route and load its stylesheet separately in `../main.tsx` when the portal is ready.

Backend authentication and role-based authorization are required before exposing real administration features. A hidden navigation link is not an access-control mechanism.