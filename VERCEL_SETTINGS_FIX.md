# Vercel Settings Fix

## Issue
There's a mismatch between Production Overrides and Project Settings.

## Current State

**Production Overrides (CORRECT):**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`
- Dev Command: `npm run dev`

**Project Settings (WRONG):**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/.next`
- Install Command: `cd frontend && npm install`
- Dev Command: `next`

## Fix

Since **Root Directory** is set to `frontend`, Vercel automatically runs all commands from that directory. Therefore, the Project Settings should match the Production Overrides.

### Update Project Settings in Vercel Dashboard:

1. Go to your project: **cro-analyst-v2-new**
2. Go to **Settings** → **General**
3. Update the following:

**Build & Development Settings:**
- **Build Command**: `prisma generate && npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Development Command**: `npm run dev`

**Root Directory:**
- Keep as: `frontend`

### Why This Matters

- Root Directory = `frontend` means Vercel runs commands from `/frontend/`
- So `npm run build` runs from `/frontend/` (correct)
- `cd frontend && npm run build` would try to go to `/frontend/frontend/` (wrong)

## After Fixing

The Production Overrides will disappear once Project Settings match, and all deployments will use the correct settings.

