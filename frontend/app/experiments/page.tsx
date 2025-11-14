import { ExperimentList } from '@/components/experiments/ExperimentList'
import { SearchBar } from '@/components/search/SearchBar'

async function getExperiments() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/experiments`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return { experiments: [] }
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching experiments:', error)
    return { experiments: [] }
  }
}

export default async function ExperimentsPage() {
  const { experiments } = await getExperiments()

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Experiments</h1>
        <SearchBar />
      </div>
      <ExperimentList experiments={experiments || []} />
    </div>
  )
}

