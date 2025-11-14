import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ExperimentCardProps {
  experiment: {
    id: string
    experimentId: string
    testName?: string | null
    vertical?: string | null
    geo?: string | null
    brand?: string | null
    dateLaunched?: string | null
    winningVar?: string | null
  }
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  return (
    <Link href={`/experiments/${experiment.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">
                {experiment.testName || experiment.experimentId}
              </CardTitle>
              <CardDescription className="font-mono text-sm">
                {experiment.experimentId}
              </CardDescription>
            </div>
            {experiment.winningVar && (
              <Badge variant="default" className="ml-2">
                {experiment.winningVar}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {experiment.vertical && (
              <Badge variant="outline">Vertical: {experiment.vertical}</Badge>
            )}
            {experiment.geo && (
              <Badge variant="outline">Geo: {experiment.geo}</Badge>
            )}
            {experiment.brand && (
              <Badge variant="outline">Brand: {experiment.brand}</Badge>
            )}
            {experiment.dateLaunched && (
              <Badge variant="outline">Launched: {experiment.dateLaunched}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

