#!/bin/bash

# Script to set up database on Heroku Postgres
# This will enable pgvector and create the schema

set -e

cd "$(dirname "$0")/../frontend"

# Get DATABASE_URL from Vercel or use local .env.local
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep DATABASE_URL | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found. Pull from Vercel: vercel env pull .env.local"
    exit 1
fi

echo "🔧 Setting up database..."
echo ""

# Enable pgvector extension
echo "📦 Enabling pgvector extension..."
DATABASE_URL="$DATABASE_URL" npx prisma db execute --stdin <<< "CREATE EXTENSION IF NOT EXISTS vector;" || {
    echo "⚠️  Could not enable pgvector via Prisma. You may need to enable it manually via Heroku Postgres console."
    echo "   See HEROKU_POSTGRES_SETUP.md for instructions"
}

# Push schema (this will create tables)
echo ""
echo "📊 Creating database schema..."
DATABASE_URL="$DATABASE_URL" npx prisma db push --accept-data-loss --skip-generate

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. If you have existing data in cro_experiments table, run migration script"
echo "   2. Generate embeddings for experiments"
echo "   3. Test the application"

