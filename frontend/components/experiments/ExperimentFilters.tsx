'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface ExperimentFiltersProps {
  verticals: string[]
  geos: string[]
}

export function ExperimentFilters({ verticals, geos }: ExperimentFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentVertical = searchParams.get('vertical')
  const currentGeo = searchParams.get('geo')

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/experiments?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/experiments')
  }

  const hasActiveFilters = currentVertical || currentGeo

  return (
    <div className="space-y-4 mb-6">
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentVertical && (
            <Badge variant="secondary" className="gap-1">
              Vertical: {currentVertical}
              <button
                onClick={() => updateFilter('vertical', null)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentGeo && (
            <Badge variant="secondary" className="gap-1">
              Geo: {currentGeo}
              <button
                onClick={() => updateFilter('geo', null)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        {verticals.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Vertical</label>
            <div className="flex gap-2 flex-wrap">
              {verticals.map((vertical) => (
                <Button
                  key={vertical}
                  variant={currentVertical === vertical ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    updateFilter('vertical', currentVertical === vertical ? null : vertical)
                  }
                >
                  {vertical}
                </Button>
              ))}
            </div>
          </div>
        )}

        {geos.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Geo</label>
            <div className="flex gap-2 flex-wrap">
              {geos.map((geo) => (
                <Button
                  key={geo}
                  variant={currentGeo === geo ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('geo', currentGeo === geo ? null : geo)}
                >
                  {geo}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

