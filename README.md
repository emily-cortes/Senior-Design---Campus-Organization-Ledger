# Senior-Design---Campus-Organization-Ledger
This repository contains a senior design project for a campus organization ledger. The app is aimed at helping student organizations track balances, record income and expenses, and review pending spending requests.

## Current Features

The project now includes:

- A public home page with senior design project messaging and prototype notice
- Dedicated sign-up and login flows with backend authentication
- An Express backend with REST endpoints for organizations and transactions
- A protected browser-based dashboard served directly by the backend
- Seeded sample data for multiple student organizations
- A transaction entry form that updates the ledger data

## Run the project

From the `server` directory:

```bash
npm start
```

Then open [http://localhost:3001](http://localhost:3001).

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

- Move seeded JSON data into MongoDB with Mongoose models
- Expand role permissions so advisors, treasurers, and admins see different actions
- Introduce approval workflows for pending expenses
- Add reports, export options, and audit logs
