Design a comprehensive specification and development guideline for an application using the following tech stack:

- **Backend:** NestJS, PostgreSQL, TypeORM, Nodemailer, Google Calendar API, Zoom API
- **Frontend (App):** React Native with Expo and Expo Router, Zod, React-Hook-Form, Axios, Luxon (date handling), TanStack Query, RevenueCat, Zustand; NO external UI libraries.
- **Frontend (Admin Panel):** React (Vite, no Expo), pure React components
- **Other considerations:**
  - App must support Spanish and English (multilanguage), allow user authentication (including Google and Apple sign-in), enforce email verification, allow forgotten password flow, etc.
  - Support file upload (photo of receipts, with auto-fill via OCR), reusable & customizable React Native components inspired by chadcn/ui but built manually, NOT using any external UI kits
  - Distinct user types: Users/clients (individuals/companies), Staff, Admin
  - Bookings with staff (each with their own Google Calendar for real-time availability), ability to cancel appointments (advance notice required), email + in-app/push notifications (for confirmations/reminders/cancellations) to client and company
  - Services, with attributes: duration, representative photo, other data
  - Clients can view/read about services without authentication, but must sign up/log in to book, manage expenses/receipts, etc.
  - Subscription logic: free tier (e.g. 5 receipts per month), paywalls via RevenueCat, adjustable by company via Admin Panel
  - Admin Panel allows company control of business logic (services, categories, staff, free days/tiers, etc)
  - NOT a monorepo (projects are clearly separated)
  - Emphasize **scalability**, **design patterns**, and **clean code**
  - Use placeholders for detailed business logic/functions if needed

### Instructions

- **Carefully reason step-by-step** before summarizing: Cover all relevant entities, data relationships, system architecture, authentication/authorization, integration points, and any client-facing flows.
- **Explicitly call out reasoning portions** first, then only afterward present conclusions, lists, feature sets, or design recommendations. (Do NOT start solutions with a feature list—reason and walk through the workflow and rationale before recapping or listing features.)
- **If sub-flows or modules have their own complexity (e.g. receipt OCR workflow, multilanguage support), break out reasoning and summary for each.**
- **Be as exhaustive as possible** regarding architecture, necessary APIs, separation of concerns for scalability, and component reusability.
- **Include examples or JSON schemas** where relevant, using `[PLACEHOLDER]` for long/custom elements.
- **Output Format:**
  - The output should be a structured Markdown document, organized into appropriate, clearly-labeled sections and subsections (using headings, and bullet points or numbered lists as needed).
  - For data models or flows, use JSON **without wrapping in code blocks**.
  - For each major module or integration, consider including summary tables or bullet points.
  - DO NOT include sample code unless explicitly asked.
  - All sections should be self-explanatory and easy to reference for future use.
- **If the answer is lengthy, restate main objectives and "REASON BEFORE CONCLUDE" policy at the end as a reminder.**

---

### Example: [Shortened for illustration; real prompts should be much more detailed]

#### Input

[User provides high-level feature wishes and tech stack, as above.]

#### Output

**[Start of Example Output]**

#### Reasoning (Step-by-Step)

- Understand what services the business offers, and the relationships between users, staff, appointments, calendars, and receipts.
- Map how authentication must support multi-provider (email, Google, Apple), session flows, and verification, and how this affects database/user model structure.
- Plan for multilanguage—determine string management and locale negotiation, especially for React Native.
- Booking: Staff have individual calendars, booked via Google Calendar API with real-time availability; need to handle conflicts, user-defined time choice, event creation (and Zoom link if needed).
- Expense/receipt module: users upload receipt image, OCR is run, data auto-filled, limits are enforced, paywall (RevenueCat) ensures subscription before more uploads.
- Admin panel (React, Vite) manages services, staff, durations, categories, and free-tier logic.
- Avoid monorepo: define directory/project separation and shared interfaces (API contracts).
- All email comms (confirmation, reminders, cancel, etc) managed via Nodemailer.
- Custom, reusable UI components created to a defined design system, without third-party libraries but inspired by chadcn/ui (modular, overrideable).
- All business logic (like appointment cancellation window) to be overrideable by Admin, stored in DB.

#### Conclusions / Summarized Guidelines

- Entities: Users, Staff, Appointments, Services, Receipts, Expenses, Categories, AdminSettings, Subscriptions (see JSON schemas [here]).
- Backend: REST API (NestJS, PostgreSQL+TypeORM), modules for Auth, Booking, Notification, Receipt, Subscription, Admin, Multilanguage.
- Frontends:
  - App: React Native (Expo, custom components, see [UI design system guidelines]), state via Zustand/Tanstack, forms with Zod and React-Hook-Form, API via Axios, RevenueCat integration
  - Admin: React (Vite), pure functional components, settings CRUD, translation manager, staff/calendar CRUD
- Integrations: Google Calendar API (staff events), Nodemailer (emails), Zoom API (meetings), RevenueCat (subs), OCR API ([placeholder])
- JSON schema for Booking:
  {
  "id": "[UUID]",
  "userId": "[UserID]",
  "staffId": "[StaffID]",
  "serviceId": "[ServiceID]",
  "startTime": "[ISO8601]",
  "endTime": "[ISO8601]",
  "calendarEventId": "[GoogleCalendarEventID]",
  "zoomMeetingUrl": "[URL|null]",
  "status": "[confirmed|cancelled|pending]",
  "createdAt": "[ISO8601]"
  }

**[End of Example Output]**

---

**Important Reminder:**

- Main objective: _Reason in detail, step-by-step, before presenting conclusions or feature lists. Present output as a structured Markdown document with clear sections. All specs, models, and recommendations must follow this format; do not wrap JSON in code blocks._

---

If anything is unclear or missing, ask for clarification.
