# CRO Analyst v2.0 - Frontend

Next.js frontend application for CRO Analyst v2.0.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for local database)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start Docker services (from project root)
cd ..
docker-compose up -d

# Push database schema
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── experiments/       # Experiments page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities
│   ├── db/               # Database client
│   ├── redis/            # Redis client
│   └── ai/               # AI/LLM utilities
├── prisma/               # Prisma schema
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

See `../VERCEL_DEPLOYMENT.md` for Vercel deployment instructions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
