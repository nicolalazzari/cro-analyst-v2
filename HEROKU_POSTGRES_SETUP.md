# Heroku PostgreSQL Setup for CRO Analyst v2

## Database Setup

✅ **DATABASE_URL has been added to Vercel environment variables**

Connection string: `postgres://udp7kmfuleh867:...@c2hbg00ac72j9d.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dciui719t768uf`

## Enable pgvector Extension

Heroku Postgres `essential-0` plan may not support pgvector by default. You have two options:

### Option 1: Enable via Heroku Postgres Console (Recommended)

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/apps/cro-analyst)
2. Click on **Resources** tab
3. Click on **heroku-postgresql** addon
4. Go to **Settings** → **Database Credentials**
5. Click **View Credentials** and copy the connection string
6. Use a PostgreSQL client (like pgAdmin, DBeaver, or psql) to connect
7. Run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Option 2: Enable via Prisma Migration

After running Prisma migrations, create a migration to enable the extension:

```bash
cd frontend
npx prisma migrate dev --name enable_pgvector
```

Then edit the migration file to add:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Option 3: Upgrade Heroku Postgres Plan

If pgvector is not available on `essential-0`, you may need to upgrade:

```bash
heroku addons:upgrade heroku-postgresql:standard-0 --app cro-analyst
```

Or use a different provider that supports pgvector:
- **Supabase** (free tier, pgvector included)
- **Neon** (free tier, pgvector included)
- **Railway** (pay-as-you-go, pgvector included)

## Verify pgvector is Enabled

After enabling, verify with:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

## Next Steps

1. ✅ DATABASE_URL added to Vercel
2. ⏳ Enable pgvector extension
3. ⏳ Run Prisma migrations
4. ⏳ Test database connection

## Running Migrations

After pgvector is enabled:

```bash
cd frontend
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

Or via Vercel build (already configured in vercel.json):
- The build command includes `prisma generate`
- You can add `prisma db push` to the build command if needed

