# CRO Analyst v2.0 - Rebuild Setup Guide

## Quick Start Checklist

- [ ] Create new project directory
- [ ] Initialize Next.js project
- [ ] Set up backend (FastAPI or Next.js API)
- [ ] Configure database (PostgreSQL + pgvector)
- [ ] Set up Redis
- [ ] Configure environment variables
- [ ] Set up authentication
- [ ] Create database schema
- [ ] Set up data migration
- [ ] Configure deployment

---

## Step 1: Project Structure

### Create New Project

```bash
# Create project directory
mkdir cro-analyst-v2
cd cro-analyst-v2

# Initialize git
git init
git branch -M main
```

### Recommended Project Structure

```
cro-analyst-v2/
├── frontend/                 # Next.js application
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth routes
│   │   ├── (dashboard)/     # Dashboard routes
│   │   ├── api/             # API routes (if using Next.js API)
│   │   └── layout.tsx
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── experiments/     # Experiment-related components
│   │   └── shared/          # Shared components
│   ├── lib/                 # Utilities
│   │   ├── db/              # Database client
│   │   ├── ai/              # AI/LLM utilities
│   │   └── utils.ts
│   ├── types/               # TypeScript types
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                 # FastAPI backend (optional)
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Core functionality
│   │   ├── models/          # Database models
│   │   └── services/        # Business logic
│   ├── requirements.txt
│   └── main.py
│
├── database/                # Database migrations & scripts
│   ├── migrations/          # Alembic migrations
│   ├── seeds/               # Seed data
│   └── schema.sql           # Initial schema
│
├── scripts/                 # Utility scripts
│   ├── migrate-data.py      # Data migration from v1
│   ├── generate-embeddings.py
│   └── setup-db.sh
│
├── docs/                    # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── .env.example             # Environment variables template
├── .gitignore
├── docker-compose.yml       # Local development
├── README.md
└── package.json             # Root package.json (workspace)
```

---

## Step 2: Initialize Next.js Frontend

### Create Next.js Project

```bash
# Using create-next-app with TypeScript
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd frontend
```

### Install Dependencies

```bash
# Core dependencies
npm install @tanstack/react-query @tanstack/react-table
npm install zod react-hook-form @hookform/resolvers
npm install date-fns

# UI components (shadcn/ui)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input table dialog

# Authentication
npm install next-auth@beta
npm install @auth/prisma-adapter  # If using Prisma

# Database client
npm install @prisma/client
npm install prisma --save-dev

# AI/LLM
npm install @anthropic-ai/sdk openai

# Utilities
npm install redis ioredis
npm install axios
npm install marked  # Markdown rendering
```

### Configure Next.js

**next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}

module.exports = nextConfig
```

---

## Step 3: Set Up Database

### Install PostgreSQL + pgvector

**Local Development (Docker)**:
```bash
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: ankane/pgvector:latest
    environment:
      POSTGRES_USER: cro_analyst
      POSTGRES_PASSWORD: password
      POSTGRES_DB: cro_analyst
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Initialize Prisma

```bash
cd frontend
npx prisma init
```

**prisma/schema.prisma**:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Experiment {
  id                String   @id @default(uuid())
  experimentId      String   @unique @map("experiment_id")
  testName          String?  @map("test_name")
  hypothesis        String?
  lessonsLearned    String?  @map("lessons_learned")
  embedding         Unsupported("vector(1536)")?
  
  // Relationships
  launchedById      String?  @map("launched_by_id")
  launchedBy        Person?  @relation("LaunchedExperiments", fields: [launchedById], references: [id])
  
  vertical          String?
  geo               String?
  brand             String?
  
  dateLaunched      String?  @map("date_launched")
  dateConcluded     String?  @map("date_concluded")
  winningVar        String?  @map("winning_var")
  
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  @@index([experimentId])
  @@index([vertical])
  @@index([geo])
  @@map("experiments")
}

model Person {
  id          String       @id @default(uuid())
  name        String
  email       String?      @unique
  teamId      String?      @map("team_id")
  team        Team?        @relation(fields: [teamId], references: [id])
  
  experiments Experiment[] @relation("LaunchedExperiments")
  
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")
  
  @@map("people")
}

model Team {
  id        String   @id @default(uuid())
  name      String   @unique
  people    Person[]
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("teams")
}
```

### Create Database Schema

**database/schema.sql**:
```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create tables
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id TEXT UNIQUE NOT NULL,
    test_name TEXT,
    hypothesis TEXT,
    lessons_learned TEXT,
    embedding vector(1536),
    
    launched_by_id UUID REFERENCES people(id),
    vertical TEXT,
    geo TEXT,
    brand TEXT,
    
    date_launched TEXT,
    date_concluded TEXT,
    winning_var TEXT,
    
    -- All other columns from Google Sheets
    observed_revenue_impact TEXT,
    primary_metric_name TEXT,
    -- ... (add all columns)
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_experiments_experiment_id ON experiments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiments_vertical ON experiments(vertical);
CREATE INDEX IF NOT EXISTS idx_experiments_geo ON experiments(geo);
CREATE INDEX IF NOT EXISTS idx_experiments_embedding ON experiments 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Vector search function
CREATE OR REPLACE FUNCTION match_experiments(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    experiment_id text,
    test_name text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        experiments.id,
        experiments.experiment_id,
        experiments.test_name,
        1 - (experiments.embedding <=> query_embedding) as similarity
    FROM experiments
    WHERE experiments.embedding IS NOT NULL
        AND 1 - (experiments.embedding <=> query_embedding) > match_threshold
    ORDER BY experiments.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

---

## Step 4: Environment Variables

### Create .env.example

```bash
# Database
DATABASE_URL="postgresql://cro_analyst:password@localhost:5432/cro_analyst"

# Redis
REDIS_URL="redis://localhost:6379"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Sheets
GOOGLE_SHEETS_ID="your-sheets-id"
GOOGLE_SHEETS_RANGE="Sheet1!A:ZZ"

# Google Drive
GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID="your-folder-id"

# Google Service Account (for backend)
GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "service_account", ...}'

# Anthropic (LLM)
ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI (Embeddings)
OPENAI_API_KEY="sk-..."

# Optional: Model selection
ANTHROPIC_MODEL="claude-haiku-4-5"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
```

### Create .env.local

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

---

## Step 5: Set Up Authentication

### NextAuth.js Configuration

**frontend/app/api/auth/[...nextauth]/route.ts**:
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

## Step 6: Create Core Utilities

### Database Client

**frontend/lib/db/client.ts**:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Redis Client

**frontend/lib/redis/client.ts**:
```typescript
import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCached(key: string, value: any, ttl: number = 300) {
  await redis.setex(key, ttl, JSON.stringify(value))
}
```

### AI Utilities

**frontend/lib/ai/embeddings.ts**:
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    input: text,
  })
  
  return response.data[0].embedding
}
```

**frontend/lib/ai/llm.ts**:
```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateResponse(prompt: string, systemPrompt: string) {
  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })
  
  return message.content[0].text
}
```

---

## Step 7: Data Migration Script

### Migration Script

**scripts/migrate-data.py**:
```python
#!/usr/bin/env python3
"""
Migrate data from v1 (Parquet/Google Sheets) to v2 (PostgreSQL)
"""
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
import json

load_dotenv()

def migrate_experiments():
    # Load from v1 Parquet file
    df = pd.read_parquet('../cro-analyst/data/cro_experiments.parquet')
    
    # Connect to PostgreSQL
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    # Prepare data
    experiments = []
    for _, row in df.iterrows():
        experiments.append((
            str(row.get('experiment_id', '')),
            str(row.get('test_name', '')),
            str(row.get('hypothesis', '')),
            str(row.get('lessons_learned', '')),
            str(row.get('launched_by', '')),
            str(row.get('vertical', '')),
            str(row.get('geo', '')),
            str(row.get('brand', '')),
            str(row.get('date_launched', '')),
            str(row.get('date_concluded', '')),
            str(row.get('winning_var', '')),
            # Add all other columns
        ))
    
    # Insert into database
    insert_query = """
        INSERT INTO experiments (
            experiment_id, test_name, hypothesis, lessons_learned,
            launched_by, vertical, geo, brand,
            date_launched, date_concluded, winning_var
        ) VALUES %s
        ON CONFLICT (experiment_id) DO UPDATE SET
            test_name = EXCLUDED.test_name,
            updated_at = NOW()
    """
    
    execute_values(cur, insert_query, experiments)
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"✅ Migrated {len(experiments)} experiments")

if __name__ == '__main__':
    migrate_experiments()
```

---

## Step 8: Setup Scripts

### Setup Script

**scripts/setup.sh**:
```bash
#!/bin/bash

echo "🚀 Setting up CRO Analyst v2.0..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }

# Start Docker services
echo "📦 Starting Docker services..."
docker-compose up -d

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
npm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma db push

# Generate embeddings (optional)
echo "🤖 Generating embeddings..."
cd ../scripts
python3 generate-embeddings.py

echo "✅ Setup complete!"
echo "📝 Don't forget to:"
echo "   1. Copy .env.example to .env.local"
echo "   2. Fill in your environment variables"
echo "   3. Run 'npm run dev' in the frontend directory"
```

### Generate Embeddings Script

**scripts/generate-embeddings.py**:
```python
#!/usr/bin/env python3
"""
Generate embeddings for all experiments
"""
import psycopg2
from openai import OpenAI
import os
from dotenv import load_dotenv
import time

load_dotenv()

openai = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_embeddings():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    # Get experiments without embeddings
    cur.execute("""
        SELECT id, test_name, hypothesis, lessons_learned
        FROM experiments
        WHERE embedding IS NULL
    """)
    
    experiments = cur.fetchall()
    print(f"📊 Found {len(experiments)} experiments to process")
    
    for exp_id, test_name, hypothesis, lessons_learned in experiments:
        # Combine text for embedding
        text = f"{test_name or ''} {hypothesis or ''} {lessons_learned or ''}".strip()
        
        if not text:
            continue
        
        try:
            # Generate embedding
            response = openai.embeddings.create(
                model='text-embedding-3-small',
                input=text
            )
            
            embedding = response.data[0].embedding
            
            # Store in database
            cur.execute("""
                UPDATE experiments
                SET embedding = %s::vector
                WHERE id = %s
            """, (str(embedding), exp_id))
            
            conn.commit()
            print(f"✅ Processed: {test_name}")
            
            # Rate limiting
            time.sleep(0.1)
            
        except Exception as e:
            print(f"❌ Error processing {exp_id}: {e}")
            continue
    
    cur.close()
    conn.close()
    print("✅ Embedding generation complete!")

if __name__ == '__main__':
    generate_embeddings()
```

---

## Step 9: Package.json Scripts

**frontend/package.json**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

---

## Step 10: Git Configuration

**.gitignore**:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env*.local
.env.production

# Database
*.db
*.db-journal

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Python
__pycache__/
*.py[cod]
venv/
.venv/

# Prisma
prisma/migrations/
```

---

## Step 11: Quick Start Commands

```bash
# 1. Clone/create project
mkdir cro-analyst-v2 && cd cro-analyst-v2

# 2. Initialize Next.js
npx create-next-app@latest frontend --typescript --tailwind --app

# 3. Start Docker services
docker-compose up -d

# 4. Install dependencies
cd frontend && npm install

# 5. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 6. Setup database
npx prisma generate
npx prisma db push

# 7. Run migrations (if using scripts)
cd ../scripts
python3 migrate-data.py

# 8. Generate embeddings
python3 generate-embeddings.py

# 9. Start development server
cd ../frontend
npm run dev
```

---

## Next Steps

1. **Create first API route** - `/api/experiments`
2. **Build first page** - Experiments list page
3. **Implement search** - Vector search functionality
4. **Add authentication** - NextAuth.js setup
5. **Create components** - Reusable UI components
6. **Set up testing** - Jest + React Testing Library
7. **Configure CI/CD** - GitHub Actions
8. **Deploy** - Vercel/Netlify

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Ready to start?** Follow the steps above in order, and you'll have a modern, scalable CRO Analyst v2.0!

