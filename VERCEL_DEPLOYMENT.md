# Vercel Deployment Guide

This guide will help you deploy CRO Analyst v2.0 to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare all required environment variables

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: CRO Analyst v2.0"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/cro-analyst-v2.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? cro-analyst-v2
# - Directory? ./
# - Override settings? No
```

## Step 3: Configure Environment Variables

In the Vercel dashboard, go to your project → Settings → Environment Variables and add:

### Required Variables

```bash
# Database (use your production database URL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis (use your production Redis URL)
REDIS_URL=redis://host:6379

# Next.js
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Sheets
GOOGLE_SHEETS_ID=your-sheets-id
GOOGLE_SHEETS_RANGE=Sheet1!A:ZZ

# Google Drive
GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID=your-folder-id

# Anthropic (LLM)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (Embeddings)
OPENAI_API_KEY=sk-...

# Optional: Model selection
ANTHROPIC_MODEL=claude-haiku-4-5
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Generating NEXTAUTH_SECRET

```bash
# Generate a random secret
openssl rand -base64 32
```

## Step 4: Database Setup

### Option A: Supabase (Recommended for PostgreSQL + pgvector)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Enable pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. Get your connection string from Project Settings → Database
5. Add to Vercel environment variables as `DATABASE_URL`

### Option B: Railway

1. Create account at [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Add pgvector extension
4. Get connection string and add to Vercel

### Option C: Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Enable pgvector extension
4. Get connection string and add to Vercel

## Step 5: Redis Setup

### Option A: Upstash (Recommended)

1. Create account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Get connection string (Redis URL)
4. Add to Vercel environment variables as `REDIS_URL`

### Option B: Railway

1. Create Redis database on Railway
2. Get connection string
3. Add to Vercel

## Step 6: Run Database Migrations

After deployment, you need to run Prisma migrations:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.local
cd frontend
npx prisma generate
npx prisma db push

# Option 2: Via Vercel Build Command
# Add to package.json scripts:
# "postinstall": "prisma generate"
# "vercel-build": "prisma generate && prisma db push && next build"
```

Or add to `package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

## Step 7: Configure Build Settings

In Vercel dashboard → Settings → General:

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (or `npm run vercel-build` if using migrations)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Step 8: Deploy

1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Step 9: Verify Deployment

1. Visit your deployed URL: `https://your-app.vercel.app`
2. Check `/experiments` page
3. Verify API routes are working
4. Check Vercel logs for any errors

## Troubleshooting

### Build Errors

- **Prisma Client not found**: Add `prisma generate` to build command
- **Environment variables missing**: Check all variables are set in Vercel
- **Database connection failed**: Verify `DATABASE_URL` is correct

### Runtime Errors

- **API routes not working**: Check serverless function logs in Vercel
- **Database queries failing**: Verify database is accessible and migrations ran
- **Redis connection failed**: Check `REDIS_URL` is correct

### Common Issues

1. **Module not found**: Ensure all dependencies are in `package.json`
2. **Type errors**: Run `npm run build` locally first to catch errors
3. **Environment variables**: Make sure they're set for Production, Preview, and Development

## Continuous Deployment

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview
- Pull requests → Preview

## Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Monitoring

- **Analytics**: Enable in Vercel dashboard
- **Logs**: View in Deployments → Function Logs
- **Errors**: Check Vercel dashboard for error tracking

## Next Steps

1. Set up monitoring and error tracking (Sentry)
2. Configure custom domain
3. Set up staging environment
4. Configure CI/CD workflows
5. Set up database backups

---

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs) or create an issue.

