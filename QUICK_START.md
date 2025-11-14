# CRO Analyst v2.0 - Quick Start Guide

Get up and running in 30 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed
- Git installed
- Code editor (VS Code recommended)

## Step 1: Create Project (5 minutes)

```bash
# Create project directory
mkdir cro-analyst-v2
cd cro-analyst-v2

# Initialize Next.js
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd frontend
```

## Step 2: Install Dependencies (5 minutes)

```bash
# Core dependencies
npm install @tanstack/react-query @tanstack/react-table
npm install zod react-hook-form @hookform/resolvers
npm install date-fns

# Database
npm install @prisma/client
npm install prisma --save-dev

# Authentication
npm install next-auth@beta

# AI/LLM
npm install @anthropic-ai/sdk openai

# Redis
npm install ioredis

# UI (shadcn/ui)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input table dialog
```

## Step 3: Set Up Database (5 minutes)

```bash
# Create docker-compose.yml in project root
cat > ../docker-compose.yml << 'EOF'
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
EOF

# Start services
cd ..
docker-compose up -d
```

## Step 4: Configure Prisma (5 minutes)

```bash
cd frontend

# Initialize Prisma
npx prisma init

# Edit prisma/schema.prisma (see REBUILD_SETUP_GUIDE.md for full schema)
# Or use this minimal schema:

cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Experiment {
  id           String   @id @default(uuid())
  experimentId String   @unique @map("experiment_id")
  testName     String?  @map("test_name")
  hypothesis   String?
  embedding    Unsupported("vector(1536)")?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  
  @@map("experiments")
}
EOF

# Generate client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 5: Environment Variables (5 minutes)

```bash
# Create .env.local
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://cro_analyst:password@localhost:5432/cro_analyst"

# Redis
REDIS_URL="redis://localhost:6379"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Anthropic (get from https://console.anthropic.com/)
ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI (get from https://platform.openai.com/)
OPENAI_API_KEY="sk-..."

# Google Sheets
GOOGLE_SHEETS_ID="your-sheets-id"
GOOGLE_DRIVE_SCREENSHOT_FOLDER_ID="your-folder-id"
EOF

# Edit .env.local with your actual values
```

## Step 6: Create Basic API Route (5 minutes)

```bash
# Create API route
mkdir -p app/api/experiments
cat > app/api/experiments/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    const experiments = await prisma.experiment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ experiments })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    )
  }
}
EOF

# Create database client
mkdir -p lib/db
cat > lib/db/client.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
EOF
```

## Step 7: Create Basic Page (5 minutes)

```bash
# Create experiments page
mkdir -p app/experiments
cat > app/experiments/page.tsx << 'EOF'
export default async function ExperimentsPage() {
  const response = await fetch('http://localhost:3000/api/experiments', {
    cache: 'no-store'
  })
  const { experiments } = await response.json()
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Experiments</h1>
      <div className="space-y-4">
        {experiments?.map((exp: any) => (
          <div key={exp.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{exp.testName}</h2>
            <p className="text-gray-600">{exp.experimentId}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
EOF
```

## Step 8: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000/experiments

## Next Steps

1. **Add Authentication**: Follow NextAuth.js setup in `REBUILD_SETUP_GUIDE.md`
2. **Migrate Data**: Use migration script from v1
3. **Add Vector Search**: Generate embeddings and implement search
4. **Build UI**: Create components with shadcn/ui
5. **Add Features**: Implement search, filters, analytics

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check connection
psql postgresql://cro_analyst:password@localhost:5432/cro_analyst
```

### Prisma Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Port Already in Use
```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

## Resources

- Full setup guide: `REBUILD_SETUP_GUIDE.md`
- Architecture decisions: `REBUILD_EVALUATION.md`
- Skills required: `.skills`
- Progress tracking: `REBUILD_CHECKLIST.md`

---

**Need Help?** Check the full documentation or create an issue.

