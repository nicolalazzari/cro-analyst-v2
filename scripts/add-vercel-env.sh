#!/bin/bash

# Script to add environment variables to Vercel via CLI
# Usage: ./scripts/add-vercel-env.sh

set -e

cd "$(dirname "$0")/../frontend"

echo "🔧 Adding Environment Variables to Vercel"
echo "Project: cro-analyst-v2-new"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Install it with: npm i -g vercel"
    exit 1
fi

# Check if project is linked
if [ ! -f ".vercel/project.json" ]; then
    echo "📦 Linking project to Vercel..."
    vercel link --project cro-analyst-v2-new --yes
fi

echo "📝 You'll be prompted to enter values for each environment variable."
echo "   Press Enter to skip a variable (you can add it later)."
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local description=$2
    local default_env=${3:-production}
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Variable: $var_name"
    echo "Description: $description"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    read -p "Enter value (or press Enter to skip): " value
    
    if [ -n "$value" ]; then
        echo "Adding to: Production, Preview, Development..."
        echo "$value" | vercel env add "$var_name" production
        echo "$value" | vercel env add "$var_name" preview
        echo "$value" | vercel env add "$var_name" development
        echo "✅ Added $var_name"
    else
        echo "⏭️  Skipped $var_name"
    fi
}

# Required variables
add_env_var "DATABASE_URL" "PostgreSQL connection string (e.g., postgresql://user:pass@host:5432/db)"
add_env_var "NEXT_PUBLIC_APP_URL" "Your Vercel deployment URL (e.g., https://cro-analyst-v2-new.vercel.app)"
add_env_var "NEXTAUTH_URL" "Same as NEXT_PUBLIC_APP_URL"
add_env_var "NEXTAUTH_SECRET" "Random secret (generate with: openssl rand -base64 32)"
add_env_var "GOOGLE_CLIENT_ID" "Google OAuth Client ID"
add_env_var "GOOGLE_CLIENT_SECRET" "Google OAuth Client Secret"
add_env_var "ANTHROPIC_API_KEY" "Anthropic API key (starts with sk-ant-)"
add_env_var "OPENAI_API_KEY" "OpenAI API key (starts with sk-)"

# Optional variables
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Optional Variables (you can skip these)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

read -p "Add optional variables? (y/n): " add_optional
if [ "$add_optional" = "y" ] || [ "$add_optional" = "Y" ]; then
    add_env_var "REDIS_URL" "Redis connection string (optional)"
    add_env_var "ANTHROPIC_MODEL" "Anthropic model (default: claude-haiku-4-5)"
    add_env_var "OPENAI_EMBEDDING_MODEL" "OpenAI embedding model (default: text-embedding-3-small)"
    add_env_var "GOOGLE_SHEETS_ID" "Google Sheets ID (optional)"
    add_env_var "GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID" "Google Drive folder ID (optional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Environment variable setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To verify, run: vercel env ls"
echo "To pull to local .env.local: vercel env pull .env.local"
echo ""

