# Fuworx MVP grouped implementation plan

The project is intentionally delivered in grouped releases so the application progresses quickly while each release still goes through feature branch -> PR -> develop -> UAT -> main -> version tag -> production.

## Release 1.1.0 - Core sales workspace (this package)
- Professional responsive admin UI shell and dashboard
- Customer management + customer detail workspace
- Transactions management
- Invoice management with line items, GST rates and payment status

Suggested branch: `feature/core-sales-workspace`

## Release 1.2.0 - Compliance operations
- Expenses + expense categories
- Document upload/download/verification abstraction
- GST transactions, filing status and reconciliation workflow

Suggested branch: `feature/compliance-operations`

## Release 1.3.0 - Finance and returns
- Profit & Loss views
- Annual returns workflow
- Subscription plans, subscriptions and payments

Suggested branch: `feature/finance-returns-subscriptions`

## Release 1.4.0 - Administration and controls
- User management and RBAC
- Audit history and notifications
- Reports and operational hardening

Suggested branch: `feature/admin-controls-reports`

## Customer application phase
- React Native customer login, dashboard, invoice upload/create, GST, P&L, returns and profile
- Uses the same Spring Boot API and business isolation model
