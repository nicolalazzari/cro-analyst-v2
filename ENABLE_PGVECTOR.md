# Enable pgvector Extension on Heroku Postgres

## Current Status

✅ **DATABASE_URL** has been added to Vercel  
❌ **pgvector extension** needs to be enabled manually

## Why This is Needed

The `vector` type is required for storing embeddings. Heroku Postgres `essential-0` plan supports pgvector, but it needs to be enabled manually.

## How to Enable pgvector

### Option 1: Via Heroku Postgres Web Console (Easiest)

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/apps/cro-analyst)
2. Click on **Resources** tab
3. Click on **heroku-postgresql** addon (postgresql-transparent-69073)
4. Click on **Settings** tab
5. Click **View Credentials** to see connection details
6. Use a PostgreSQL client to connect:
   - **pgAdmin** (GUI)
   - **DBeaver** (GUI)
   - **psql** (CLI)
   - **TablePlus** (GUI)
   - **Postico** (Mac GUI)

7. Connect using the credentials and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Option 2: Via Heroku CLI (if psql is installed)

```bash
heroku pg:psql --app cro-analyst
```

Then run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Option 3: Via Online SQL Editor

1. Go to Heroku Postgres addon page
2. Look for "Data" or "SQL" tab
3. Run: `CREATE EXTENSION IF NOT EXISTS vector;`

## Verify Extension is Enabled

After enabling, verify with:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

You should see a row with `extname = 'vector'`.

## After Enabling pgvector

Once pgvector is enabled, you can:

1. **Push the schema:**
   ```bash
   cd frontend
   DATABASE_URL="your-database-url" npx prisma db push --accept-data-loss
   ```

2. **Or run migrations:**
   ```bash
   cd frontend
   DATABASE_URL="your-database-url" npx prisma migrate deploy
   ```

## Alternative: Use Supabase/Neon (pgvector included)

If enabling pgvector on Heroku is difficult, consider using:
- **Supabase** (free tier, pgvector pre-enabled)
- **Neon** (free tier, pgvector pre-enabled)

These providers have pgvector enabled by default and are easier to set up.

