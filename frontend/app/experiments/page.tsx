import { Suspense } from 'react'
import { ExperimentList } from '@/components/experiments/ExperimentList'
import { ExperimentFilters } from '@/components/experiments/ExperimentFilters'
import { Pagination } from '@/components/experiments/Pagination'
import { SearchBar } from '@/components/search/SearchBar'

export const dynamic = 'force-dynamic'

async function getExperiments(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const params = new URLSearchParams()
    
    if (searchParams.page) params.set('page', String(searchParams.page))
    if (searchParams.limit) params.set('limit', String(searchParams.limit))
    if (searchParams.vertical) params.set('vertical', String(searchParams.vertical))
    if (searchParams.geo) params.set('geo', String(searchParams.geo))
    if (searchParams.sortBy) params.set('sortBy', String(searchParams.sortBy))
    if (searchParams.sortOrder) params.set('sortOrder', String(searchParams.sortOrder))

    const response = await fetch(`${baseUrl}/api/experiments?${params.toString()}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return { experiments: [], pagination: {}, filters: { verticals: [], geos: [] } }
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching experiments:', error)
    return { experiments: [], pagination: {}, filters: { verticals: [], geos: [] } }
  }
}

export default async function ExperimentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { experiments, pagination, filters } = await getExperiments(searchParams)

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Experiments</h1>
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchBar />
        </Suspense>
      </div>
      
      <Suspense fallback={<div>Loading filters...</div>}>
        <ExperimentFilters 
          verticals={filters?.verticals || []} 
          geos={filters?.geos || []} 
        />
      </Suspense>
      
      <ExperimentList experiments={experiments || []} />
      
      {pagination && (
        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination
            currentPage={pagination.page || 1}
            totalPages={pagination.totalPages || 1}
          />
        </Suspense>
      )}
    </div>
  )
}

