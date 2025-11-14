# Vercel Environment Variables Setup

This guide will help you set up all required environment variables in your Vercel project.

## Quick Setup via Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **cro-analyst-v2-new**
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable below for **Production**, **Preview**, and **Development** environments

## Required Environment Variables

### Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```
- **Description**: PostgreSQL connection string with pgvector extension
- **Where to get**: Supabase, Railway, Neon, or your PostgreSQL provider
- **Example**: `postgresql://user:pass@db.example.com:5432/cro_analyst`

### Redis (Optional but Recommended)
```bash
REDIS_URL=redis://host:6379
```
- **Description**: Redis connection string for caching
- **Where to get**: Upstash, Railway, or your Redis provider
- **Example**: `redis://default:password@redis.example.com:6379`

### Next.js App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-here
```
- **Description**: 
  - `NEXT_PUBLIC_APP_URL`: Your deployed Vercel URL
  - `NEXTAUTH_URL`: Same as above (for NextAuth.js)
  - `NEXTAUTH_SECRET`: Random secret for JWT encryption
- **Generate NEXTAUTH_SECRET**: 
  ```bash
  openssl rand -base64 32
  ```

### Google OAuth (For Authentication)
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
- **Description**: Google OAuth credentials for authentication
- **Where to get**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing
  3. Enable Google+ API
  4. Go to Credentials → Create OAuth 2.0 Client ID
  5. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

### AI/LLM Services

#### Anthropic (Claude)
```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-haiku-4-5
```
- **Description**: Anthropic API key for Claude LLM
- **Where to get**: [Anthropic Console](https://console.anthropic.com/)
- **Model**: Default is `claude-haiku-4-5` (cheapest option)

#### OpenAI (Embeddings)
```bash
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```
- **Description**: OpenAI API key for generating embeddings
- **Where to get**: [OpenAI Platform](https://platform.openai.com/)
- **Model**: Default is `text-embedding-3-small` (cheapest option)

## Optional Environment Variables

### Google Sheets Integration
```bash
GOOGLE_SHEETS_ID=your-sheets-id
GOOGLE_SHEETS_RANGE=Sheet1!A:ZZ
GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID=your-folder-id
GOOGLE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}
```
- **Description**: For importing data from Google Sheets
- **Where to get**: Google Sheets/Drive API credentials

## Setting Variables via Vercel CLI

If you prefer using the CLI:

```bash
cd frontend

# Link project (if not already linked)
vercel link

# Add each variable (will prompt for value)
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add ANTHROPIC_API_KEY production
vercel env add OPENAI_API_KEY production
```

## Verify Environment Variables

After setting variables, verify they're set:

```bash
cd frontend
vercel env ls
```

## Important Notes

1. **Set for all environments**: Make sure to add variables for Production, Preview, and Development
2. **Redeploy after changes**: After adding new environment variables, trigger a new deployment
3. **Keep secrets secure**: Never commit `.env` files to git
4. **Database URL**: Must include pgvector extension support
5. **NEXTAUTH_SECRET**: Must be a strong random string (use `openssl rand -base64 32`)

## Testing Locally

Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## Troubleshooting

### Variables not working?
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Database connection errors?
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure pgvector extension is installed

### Authentication not working?
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check redirect URI matches in Google Cloud Console
- Ensure `NEXTAUTH_URL` matches your deployment URL
- Verify `NEXTAUTH_SECRET` is set

## Next Steps

After setting environment variables:
1. Trigger a new deployment in Vercel
2. Check deployment logs for any errors
3. Test authentication flow
4. Verify database connections
5. Test search functionality

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs/concepts/projects/environment-variables) or create an issue.

