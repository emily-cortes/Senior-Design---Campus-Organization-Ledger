# Senior-Design---Campus-Organization-Ledger
This repository contains a senior design project for a campus organization ledger. The app is aimed at helping student organizations track balances, record income and expenses, and review pending spending requests.

## Current Features

The project now includes:

- A public home page with senior design project messaging and prototype notice
- Dedicated sign-up and login flows with backend authentication
- TAMUK account creation with K-numbers in the range `K00000000` to `K00999999`
- Configurable admin recognition for specific K-numbers
- An Express backend with REST endpoints for organizations and transactions
- A protected browser-based dashboard served directly by the backend
- Firestore support for users, organizations, and transactions
- Seeded sample data for multiple student organizations
- A transaction entry form that updates the ledger data

## Run the project

From the `server` directory:

```bash
npm install
npm start
```

Then open [http://localhost:3001](http://localhost:3001).

## Firebase setup

The project can run in two modes:

- Without Firebase configured, it uses the local JSON seed files so the prototype works right away.
- With Firebase configured, it stores users, organizations, and transactions in Firestore.

To configure Firebase:

1. Copy `server/.env.example` to `server/.env`.
2. Set `JWT_SECRET`.
3. Add either `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON`.
4. Add any admin K-numbers to `ADMIN_ACCOUNT_IDS` as a comma-separated list.

Example admin list:

```env
ADMIN_ACCOUNT_IDS=K00123456,K00999999
```

## API endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/organizations`
- `GET /api/organizations/:organizationId`
- `GET /api/organizations/:organizationId/transactions`
- `POST /api/organizations/:organizationId/transactions`

## Good next steps

- Expand role permissions so advisors, treasurers, and admins see different actions
- Introduce approval workflows for pending expenses
- Add an admin interface to manage roles instead of relying only on environment configuration
- Add reports, export options, and audit logs
