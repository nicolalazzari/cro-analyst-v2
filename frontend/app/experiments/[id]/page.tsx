import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

async function getExperiment(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/experiments/${id}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching experiment:', error)
    return null
  }
}

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experiment = await getExperiment(id)

  if (!experiment) {
    notFound()
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/experiments">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiments
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {experiment.testName || experiment.experimentId}
              </CardTitle>
              <CardDescription className="font-mono">
                {experiment.experimentId}
              </CardDescription>
            </div>
            {experiment.winningVar && (
              <Badge variant="default" className="ml-4">
                {experiment.winningVar}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {experiment.vertical && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vertical</p>
                <p className="text-lg">{experiment.vertical}</p>
              </div>
            )}
            {experiment.geo && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Geo</p>
                <p className="text-lg">{experiment.geo}</p>
              </div>
            )}
            {experiment.brand && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand</p>
                <p className="text-lg">{experiment.brand}</p>
              </div>
            )}
            {experiment.dateLaunched && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date Launched</p>
                <p className="text-lg">{experiment.dateLaunched}</p>
              </div>
            )}
            {experiment.dateConcluded && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date Concluded</p>
                <p className="text-lg">{experiment.dateConcluded}</p>
              </div>
            )}
          </div>

          {experiment.hypothesis && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Hypothesis</p>
              <p className="text-base whitespace-pre-wrap">{experiment.hypothesis}</p>
            </div>
          )}

          {experiment.lessonsLearned && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Lessons Learned</p>
              <p className="text-base whitespace-pre-wrap">{experiment.lessonsLearned}</p>
            </div>
          )}

          {experiment.observedRevenueImpact && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Observed Revenue Impact</p>
              <p className="text-base">{experiment.observedRevenueImpact}</p>
            </div>
          )}

          {experiment.primaryMetricName && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Primary Metric</p>
              <p className="text-base">{experiment.primaryMetricName}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

