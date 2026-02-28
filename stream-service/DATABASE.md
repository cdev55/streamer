# Database foundation (stream-service)

Uses the **same schema and database** as auth-service (shared `live_db`).

- **User**, **Stream**, **StreamSession**, **Subscription** – see `prisma/schema.prisma`

## Setup

1. Use the same PostgreSQL database as auth-service (`live_db`, `live_user`, `live_password`).
2. Run migrations **once** from either auth-service or stream-service (same DB).
3. In this repo:

   ```bash
   npm install
   npm run prisma:generate
   # Migrate only if you didn’t already from auth-service:
   # npm run prisma:migrate
   npm run test:db
   ```

## Scripts

| Script            | Description                |
|-------------------|----------------------------|
| `dev`             | Run app in development     |
| `build`           | Compile TypeScript         |
| `prisma:generate` | Generate Prisma client     |
| `prisma:migrate`  | Create/apply migrations    |
| `test:db`         | Run DB test script         |

## Files

- `prisma/schema.prisma` – same as auth-service
- `src/config/db.ts` – singleton Prisma client
- `src/scripts/test-db.ts` – create user, stream, session; fetch and print; cleanup
