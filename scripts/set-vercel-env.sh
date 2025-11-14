#!/bin/bash

# Script to set environment variables in Vercel
# Usage: ./scripts/set-vercel-env.sh

set -e

echo "🔧 Setting up Vercel environment variables..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Install it with: npm i -g vercel"
    exit 1
fi

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

# Link project if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "📦 Linking project to Vercel..."
    vercel link
fi

echo ""
echo "📝 Setting environment variables..."
echo ""

# Required environment variables
declare -a env_vars=(
    "DATABASE_URL"
    "REDIS_URL"
    "NEXT_PUBLIC_APP_URL"
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "ANTHROPIC_API_KEY"
    "OPENAI_API_KEY"
    "ANTHROPIC_MODEL"
    "OPENAI_EMBEDDING_MODEL"
)

# Optional environment variables
declare -a optional_vars=(
    "GOOGLE_SHEETS_ID"
    "GOOGLE_SHEETS_RANGE"
    "GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID"
    "GOOGLE_SERVICE_ACCOUNT_JSON"
)

echo "Required variables:"
for var in "${env_vars[@]}"; do
    echo "  - $var"
done

echo ""
echo "Optional variables:"
for var in "${optional_vars[@]}"; do
    echo "  - $var"
done

echo ""
echo "⚠️  To set these variables, you can either:"
echo ""
echo "Option 1: Use Vercel Dashboard"
echo "  1. Go to https://vercel.com/dashboard"
echo "  2. Select your project: cro-analyst-v2-new"
echo "  3. Go to Settings → Environment Variables"
echo "  4. Add each variable for Production, Preview, and Development"
echo ""
echo "Option 2: Use Vercel CLI (interactive)"
echo "  Run: vercel env add <VARIABLE_NAME>"
echo ""
echo "Option 3: Use this script with values"
echo "  Edit this script and uncomment the vercel env add commands below"
echo ""

# Uncomment and fill in values to use CLI method:
# vercel env add DATABASE_URL production
# vercel env add REDIS_URL production
# vercel env add NEXT_PUBLIC_APP_URL production
# vercel env add NEXTAUTH_URL production
# vercel env add NEXTAUTH_SECRET production
# vercel env add GOOGLE_CLIENT_ID production
# vercel env add GOOGLE_CLIENT_SECRET production
# vercel env add ANTHROPIC_API_KEY production
# vercel env add OPENAI_API_KEY production

echo "✅ Environment variable setup guide complete!"
echo ""
echo "📚 See VERCEL_DEPLOYMENT.md for detailed instructions"

