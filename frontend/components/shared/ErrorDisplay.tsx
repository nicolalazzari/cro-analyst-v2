import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorDisplay({ 
  title = 'Something went wrong', 
  message = 'An error occurred while loading this content.',
  onRetry 
}: ErrorDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button onClick={onRetry}>Try Again</Button>
        </CardContent>
      )}
    </Card>
  )
}

