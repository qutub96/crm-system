# CRM Console (Frontend)

A React dashboard for the CRM System API — login, a metrics dashboard with charts, and full CRUD for customers, interactions, and opportunities.

## Tech stack

- React 19 + Vite
- React Router
- Axios (with JWT interceptor)
- Recharts (dashboard charts)
- Tailwind CSS

## Design

An "operations ledger" look — an ink-navy sidebar, warm paper-white content area, and a single amber accent for actions and highlights. Built to feel like a tool for people who live in spreadsheets and CRMs all day, not a generic admin template.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment example and point it at your running API:
   ```bash
   cp .env.example .env
   ```
   By default it expects the backend at `https://localhost:7163/api` — update `VITE_API_BASE_URL` in `.env` if yours runs elsewhere.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Make sure the CRM System API backend is running at the same time — this frontend has no functionality without it.

5. Register a user from the app's Register page, then sign in.

## Pages

| Route | Description |
|---|---|
| `/login`, `/register` | Auth screens |
| `/` | Dashboard — customer/opportunity counts, pipeline value, charts |
| `/customers` | Customer list, create/edit modal, delete (Admin only) |
| `/customers/:id` | Customer detail with interaction and opportunity history |
| `/interactions` | Interaction list and logging form |
| `/opportunities` | Opportunity pipeline list and creation form |

## Notes

- JWT tokens are stored in `localStorage` and attached automatically to every API request.
- A 401 response from the API automatically logs the user out and redirects to `/login`.
- The "Delete customer" action is hidden for non-Admin accounts, matching the backend's role-based authorization.
