# Fuworx Accounting & Business Management MVP

Dockerized React + Nginx + Spring Boot + PostgreSQL modular-monolith application used for the Fuworx MVP and DevOps release practice.

## Current grouped release
Release candidate: **1.1.0 - Core sales workspace**

Implemented:
- JWT login and business isolation
- Professional admin application shell/dashboard
- Customer management and customer workspace
- Transactions: sale, purchase, expense, payment, receipt, journal
- Invoices with multiple line items, GST rates, paid/outstanding status
- Flyway schema migrations
- Local Docker Compose build deployment
- Pull-only production Docker Compose deployment

See `BATCHES.md` for the remaining grouped releases.

## Local/UAT startup
```bash
cp .env.example .env
# edit .env
docker compose -f docker-compose.local.yml build
docker compose -f docker-compose.local.yml up -d
docker compose -f docker-compose.local.yml ps
```

Open `http://<server-ip>`.

Lab bootstrap login defaults to `admin@example.com` / `Admin@123`; change these outside the lab.

## Production principle
Production uses `deploy/docker-compose.prod.yml`, which contains only `image:` references for application services. Images are built/tested in CI/UAT and pulled into production by version tag.
