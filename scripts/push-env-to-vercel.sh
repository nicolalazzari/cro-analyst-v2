#!/bin/bash

# Script to push environment variables from v1 to Vercel
# Reads from ../cro-analyst/.env and pushes to Vercel

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
V1_ENV_FILE="$PROJECT_ROOT/../cro-analyst/.env"

# Change to frontend directory for Vercel commands
cd "$PROJECT_ROOT/frontend"

if [ ! -f "$V1_ENV_FILE" ]; then
    echo "❌ Could not find $V1_ENV_FILE"
    exit 1
fi

echo "📖 Reading environment variables from v1 project..."
echo "   Source: $V1_ENV_FILE"
# Read and export variables from .env file
set -a
source "$V1_ENV_FILE"
set +a

# Vercel deployment URL
VERCEL_URL="https://cro-analyst-v2-new-nicolalazzarigmailcoms-projects.vercel.app"

# Generate NEXTAUTH_SECRET if not set
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "🔑 Generated NEXTAUTH_SECRET"
fi

echo ""
echo "🚀 Adding environment variables to Vercel..."
echo ""

# Function to add env var to all environments
add_env() {
    local var_name=$1
    local value=$2
    local description=$3
    
    if [ -z "$value" ]; then
        echo "⏭️  Skipping $var_name (no value)"
        return
    fi
    
    echo "➕ Adding $var_name..."
    echo "$value" | vercel env add "$var_name" production --yes 2>/dev/null || echo "$value" | vercel env add "$var_name" production
    echo "$value" | vercel env add "$var_name" preview --yes 2>/dev/null || echo "$value" | vercel env add "$var_name" preview
    echo "$value" | vercel env add "$var_name" development --yes 2>/dev/null || echo "$value" | vercel env add "$var_name" development
    echo "✅ Added $var_name"
}

# Required variables from v1
add_env "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" "Anthropic API key from v1"
add_env "ANTHROPIC_MODEL" "${ANTHROPIC_MODEL:-claude-haiku-4-5}" "Anthropic model"
add_env "GOOGLE_CLIENT_ID" "$GOOGLE_OAUTH2_CLIENT_ID" "Google OAuth Client ID from v1"
add_env "GOOGLE_CLIENT_SECRET" "$GOOGLE_OAUTH2_CLIENT_SECRET" "Google OAuth Client Secret from v1"
add_env "GOOGLE_SHEETS_ID" "$GOOGLE_SHEETS_ID" "Google Sheets ID from v1"
add_env "GOOGLE_SHEETS_RANGE" "${GOOGLE_SHEETS_RANGE:-A:ZZ}" "Google Sheets range"
add_env "GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID" "$GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID" "Google Drive folder ID from v1"

# New variables for v2
add_env "NEXT_PUBLIC_APP_URL" "$VERCEL_URL" "Vercel deployment URL"
add_env "NEXTAUTH_URL" "$VERCEL_URL" "NextAuth URL"
add_env "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "Generated NextAuth secret"

# Optional - these need to be set manually
echo ""
echo "⚠️  These variables need to be set manually:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - OPENAI_API_KEY (for embeddings)"
echo "   - REDIS_URL (optional, for caching)"
echo ""

echo "✅ Environment variables from v1 have been added!"
echo ""
echo "📋 To add remaining variables:"
echo "   vercel env add DATABASE_URL production"
echo "   vercel env add OPENAI_API_KEY production"
echo ""

