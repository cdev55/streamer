# Database foundation (auth-service)

## Schema

- **User** – id (UUID), username, email, passwordHash, streamKey, createdAt, updatedAt
- **Stream** – id (UUID), userId, title, description?, isLive, createdAt, updatedAt
- **StreamSession** – id (UUID), streamId, startedAt, endedAt?, peakViewers
- **Subscription** – id (UUID), subscriberId, streamerId, createdAt

Relations and indexes are defined in `prisma/schema.prisma`.

## Setup

1. **PostgreSQL**  
   Ensure PostgreSQL is running and create the database and user:

   ```bash
   createdb live_db
   psql -c "CREATE USER live_user WITH PASSWORD 'live_password';"
   psql -c "GRANT ALL PRIVILEGES ON DATABASE live_db TO live_user;"
   # If using PostgreSQL 15+: GRANT on schema and tables
   psql -d live_db -c "GRANT ALL ON SCHEMA public TO live_user; GRANT ALL ON ALL TABLES IN SCHEMA public TO live_user;"
   ```

2. **Env**  
   `.env` is set to:

   ```
   DATABASE_URL="postgresql://live_user:live_password@localhost:5432/live_db"
   ```

3. **Install and generate**

   ```bash
   npm install
   npm run prisma:generate
   ```

4. **Run migrations**

   ```bash
   npm run prisma:migrate
   ```

   When prompted for the migration name, use `init` (or it will use the default).

5. **Test the DB**

   ```bash
   npm run test:db
   ```

## Scripts

| Script            | Command                      | Description                |
|-------------------|------------------------------|----------------------------|
| `dev`             | `ts-node-dev --respawn ...`  | Run app in development     |
| `build`           | `tsc`                        | Compile TypeScript         |
| `prisma:generate` | `prisma generate`           | Generate Prisma client     |
| `prisma:migrate`  | `prisma migrate dev`         | Create/apply migrations    |
| `test:db`         | `ts-node src/scripts/test-db.ts` | Create sample data and query |

## Files

- `prisma/schema.prisma` – schema, relations, indexes
- `prisma/migrations/` – migration SQL
- `src/config/db.ts` – singleton Prisma client
- `src/scripts/test-db.ts` – create user, stream, session; fetch and print; cleanup
