# Quick Deployment to Vercel

## 🚀 Fast Track (5 minutes)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: CRO Analyst v2.0"
git remote add origin https://github.com/YOUR_USERNAME/cro-analyst-v2.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Via Web UI (Recommended)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
4. Add environment variables (see below)
5. Click "Deploy"

**Option B: Via CLI**
```bash
npm i -g vercel
cd frontend
vercel
```

### 3. Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

**Minimum Required:**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_SECRET=<generate-random-string>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
```

**Full List:** See `VERCEL_DEPLOYMENT.md`

### 4. Run Database Migrations

After first deployment, run:
```bash
vercel env pull .env.local
cd frontend
npx prisma generate
npx prisma db push
```

Or add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

### 5. Redeploy

Trigger a new deployment to apply migrations.

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Application deployed and accessible

## 🔗 Next Steps

1. Set up production database (Supabase/Railway/Neon)
2. Set up Redis (Upstash)
3. Configure Google OAuth
4. Add API keys (Anthropic, OpenAI)
5. Test deployment

## 📚 Full Guide

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

