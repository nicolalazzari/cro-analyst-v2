import { ExperimentCard } from './ExperimentCard'

interface Experiment {
  id: string
  experimentId: string
  testName?: string | null
  vertical?: string | null
  geo?: string | null
  brand?: string | null
  dateLaunched?: string | null
  winningVar?: string | null
}

interface ExperimentListProps {
  experiments: Experiment[]
}

export function ExperimentList({ experiments }: ExperimentListProps) {
  if (experiments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No experiments found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add some data to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {experiments.map((experiment) => (
        <ExperimentCard key={experiment.id} experiment={experiment} />
      ))}
    </div>
  )
}

