'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function ImportPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import data')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Import Experiments from Google Sheets</CardTitle>
          <CardDescription>
            Import experiment data from your configured Google Sheet into the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleImport}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Import from Google Sheets'
            )}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-md">
              <p className="font-semibold text-green-900 dark:text-green-100">Import Complete!</p>
              <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-200">
                <li>✅ Imported: {result.imported} experiments</li>
                <li>⏭️ Skipped: {result.skipped} rows</li>
                <li>📊 Total: {result.total} rows processed</li>
              </ul>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">Warnings:</p>
                  <ul className="mt-1 space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                    {result.errors.slice(0, 5).map((err: string, i: number) => (
                      <li key={i}>• {err}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>... and {result.errors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You must be signed in with Google to import data</li>
              <li>The import uses your Google Sheets configured in environment variables</li>
              <li>Existing experiments with the same experiment_id will be updated</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

