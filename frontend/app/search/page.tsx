import { Suspense } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { ExperimentList } from '@/components/experiments/ExperimentList'
import { Loading } from '@/components/shared/Loading'
import { Card, CardContent } from '@/components/ui/card'

async function searchExperiments(query: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return { experiments: [] }
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching experiments:', error)
    return { experiments: [] }
  }
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Enter a search query to find experiments</p>
        </CardContent>
      </Card>
    )
  }

  const { experiments } = await searchExperiments(query)

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Found {experiments?.length || 0} result{experiments?.length !== 1 ? 's' : ''} for &quot;{query}&quot;
      </p>
      <ExperimentList experiments={experiments || []} />
    </div>
  )
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Experiments</h1>
        <SearchBar />
      </div>
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
}

