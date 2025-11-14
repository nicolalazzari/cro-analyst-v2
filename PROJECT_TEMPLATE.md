# CRO Analyst v2.0 - Project Template

Use this as a reference when creating your new project structure.

## Complete File Structure

```
cro-analyst-v2/
│
├── frontend/                          # Next.js application
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Auth group route
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/             # Dashboard group route
│   │   │   ├── experiments/
│   │   │   │   ├── page.tsx         # Experiments list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Experiment detail
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── page.tsx         # Search results
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                     # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── experiments/
│   │   │   │   ├── route.ts         # GET /api/experiments
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts     # GET /api/experiments/[id]
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── route.ts         # POST /api/search
│   │   │   │
│   │   │   ├── embeddings/
│   │   │   │   └── route.ts         # POST /api/embeddings
│   │   │   │
│   │   │   └── analysis/
│   │   │       └── route.ts         # POST /api/analysis
│   │   │
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── error.tsx                # Error boundary
│   │   └── not-found.tsx            # 404 page
│   │
│   ├── components/                  # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── experiments/            # Experiment components
│   │   │   ├── ExperimentCard.tsx
│   │   │   ├── ExperimentList.tsx
│   │   │   ├── ExperimentDetail.tsx
│   │   │   ├── ExperimentModal.tsx
│   │   │   └── ExperimentFilters.tsx
│   │   │
│   │   ├── search/                 # Search components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── SearchFilters.tsx
│   │   │
│   │   ├── analysis/               # Analysis components
│   │   │   ├── AnalysisDisplay.tsx
│   │   │   ├── CostDisplay.tsx
│   │   │   └── SummaryCard.tsx
│   │   │
│   │   └── shared/                 # Shared components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Navigation.tsx
│   │       ├── Loading.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/                        # Utilities
│   │   ├── db/
│   │   │   ├── client.ts           # Prisma client
│   │   │   └── queries.ts          # Database queries
│   │   │
│   │   ├── redis/
│   │   │   └── client.ts           # Redis client
│   │   │
│   │   ├── ai/
│   │   │   ├── embeddings.ts       # Embedding generation
│   │   │   ├── llm.ts              # LLM integration
│   │   │   ├── rag.ts              # RAG pipeline
│   │   │   └── prompts.ts          # Prompt templates
│   │   │
│   │   ├── google/
│   │   │   ├── sheets.ts           # Google Sheets API
│   │   │   └── drive.ts            # Google Drive API
│   │   │
│   │   ├── cache/
│   │   │   └── cache.ts            # Caching utilities
│   │   │
│   │   └── utils.ts                # General utilities
│   │
│   ├── types/                      # TypeScript types
│   │   ├── experiment.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useExperiments.ts
│   │   ├── useSearch.ts
│   │   └── useAnalysis.ts
│   │
│   ├── styles/                     # Global styles
│   │   └── globals.css
│   │
│   ├── public/                     # Static assets
│   │   ├── images/
│   │   └── favicon.ico
│   │
│   ├── prisma/                     # Prisma files
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── .env.local                  # Environment variables (gitignored)
│   ├── .env.example                # Environment template
│   ├── .gitignore
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── package.json
│   └── README.md
│
├── backend/                        # FastAPI backend (optional)
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── experiments.py
│   │   │   │   ├── search.py
│   │   │   │   └── analysis.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   └── experiment.py
│   │   │
│   │   ├── services/
│   │   │   ├── llm_service.py
│   │   │   ├── embedding_service.py
│   │   │   └── search_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/                       # Database files
│   ├── migrations/                 # SQL migrations
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_embeddings.sql
│   │
│   ├── seeds/                      # Seed data
│   │   └── seed.sql
│   │
│   └── schema.sql                  # Full schema
│
├── scripts/                        # Utility scripts
│   ├── migrate-data.py             # Migrate from v1
│   ├── generate-embeddings.py      # Generate embeddings
│   ├── setup-db.sh                 # Database setup
│   └── seed-db.sh                  # Seed database
│
├── docs/                           # Documentation
│   ├── API.md                      # API documentation
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── ARCHITECTURE.md             # Architecture docs
│   └── CONTRIBUTING.md             # Contributing guide
│
├── tests/                          # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                        # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml              # Local development
├── .env.example                    # Environment template
├── .gitignore
├── README.md
└── package.json                    # Root package.json (workspace)
```

## Key Files to Create

### 1. Root Files

**package.json** (workspace):
```json
{
  "name": "cro-analyst-v2",
  "version": "2.0.0",
  "private": true,
  "workspaces": ["frontend"],
  "scripts": {
    "dev": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "start": "cd frontend && npm start"
  }
}
```

**docker-compose.yml**:
```yaml
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

**.gitignore**:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment
.env
.env*.local

# Database
*.db
*.db-journal

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Python
__pycache__/
*.py[cod]
venv/
.venv/
```

### 2. Frontend Core Files

**frontend/next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['drive.google.com'],
  },
}

module.exports = nextConfig
```

**frontend/tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**frontend/tailwind.config.ts**:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mvf-navy': '#0F0F4B',
        'mvf-blue': '#1e40af',
      },
    },
  },
  plugins: [],
}
export default config
```

### 3. Database Schema

See `REBUILD_SETUP_GUIDE.md` for complete Prisma schema.

### 4. Environment Variables

See `REBUILD_SETUP_GUIDE.md` for complete `.env.example`.

---

## Component Examples

### Experiment Card Component

**frontend/components/experiments/ExperimentCard.tsx**:
```typescript
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ExperimentCardProps {
  experiment: {
    id: string
    testName: string
    experimentId: string
    vertical?: string
    geo?: string
  }
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{experiment.testName}</CardTitle>
        <CardDescription>
          {experiment.experimentId} • {experiment.vertical} • {experiment.geo}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
```

### Search Bar Component

**frontend/components/search/SearchBar.tsx**:
```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    // Implement search logic
  }

  return (
    <div className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search experiments..."
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  )
}
```

---

## API Route Examples

### Experiments List

**frontend/app/api/experiments/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const experiments = await prisma.experiment.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ experiments })
}
```

### Vector Search

**frontend/app/api/search/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/ai/embeddings'
import { prisma } from '@/lib/db/client'

export async function POST(request: Request) {
  const { query } = await request.json()
  
  // Generate embedding
  const embedding = await generateEmbedding(query)
  
  // Vector search
  const results = await prisma.$queryRaw`
    SELECT * FROM match_experiments(${embedding}::vector, 0.7, 10)
  `
  
  return NextResponse.json({ results })
}
```

---

## Next Steps

1. Use this template to create your project structure
2. Follow `QUICK_START.md` for initial setup
3. Use `REBUILD_CHECKLIST.md` to track progress
4. Refer to `REBUILD_SETUP_GUIDE.md` for detailed instructions

---

**Note**: This is a template. Adjust based on your specific needs and preferences.

