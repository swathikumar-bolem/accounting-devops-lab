# Accounting Real-World Starter

Functional lab application for the full DevOps flow.

Includes:
- React frontend served by Nginx
- Spring Boot backend
- JWT login
- PostgreSQL
- Flyway migrations
- Customer create/list/delete flow
- Named Docker volume
- Local build Compose file
- Pull-only production Compose file
- Jenkinsfile starter

Default lab login: `admin@example.com` / `Admin@123`

Local build/run:
```bash
cp .env.example .env
docker compose -f docker-compose.local.yml build
docker compose -f docker-compose.local.yml up -d
```

Production-like host:
```bash
cp .env.example .env
docker compose --env-file .env -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.prod.yml up -d
```
