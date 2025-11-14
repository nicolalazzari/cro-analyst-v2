'use client'

import { useEffect } from 'react'
import { ErrorDisplay } from '@/components/shared/ErrorDisplay'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <ErrorDisplay
          title="Something went wrong!"
          message={error.message || 'An unexpected error occurred'}
          onRetry={reset}
        />
      </div>
    </div>
  )
}

