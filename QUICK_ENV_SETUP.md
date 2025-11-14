# Quick Environment Variables Setup via CLI

Run these commands one by one. You'll be prompted to enter the value for each variable.

## Setup

```bash
cd frontend
```

## Required Variables

### 1. Database URL
```bash
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```
*Enter your PostgreSQL connection string when prompted*

### 2. App URL
```bash
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL preview
vercel env add NEXT_PUBLIC_APP_URL development
```
*Enter: `https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app`*

### 3. NextAuth URL
```bash
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_URL preview
vercel env add NEXTAUTH_URL development
```
*Same as NEXT_PUBLIC_APP_URL*

### 4. NextAuth Secret
```bash
# First generate a secret:
openssl rand -base64 32

# Then add it:
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_SECRET preview
vercel env add NEXTAUTH_SECRET development
```
*Paste the generated secret when prompted*

### 5. Google OAuth
```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_ID preview
vercel env add GOOGLE_CLIENT_ID development

vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_CLIENT_SECRET preview
vercel env add GOOGLE_CLIENT_SECRET development
```

### 6. AI API Keys
```bash
vercel env add ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY preview
vercel env add ANTHROPIC_API_KEY development

vercel env add OPENAI_API_KEY production
vercel env add OPENAI_API_KEY preview
vercel env add OPENAI_API_KEY development
```

## Optional Variables

```bash
vercel env add REDIS_URL production
vercel env add ANTHROPIC_MODEL production
vercel env add OPENAI_EMBEDDING_MODEL production
```

## Verify

After adding all variables, verify they're set:

```bash
vercel env ls
```

## Quick Script

Or use the interactive script:

```bash
./scripts/add-vercel-env.sh
```

