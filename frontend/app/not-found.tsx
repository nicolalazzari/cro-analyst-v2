import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">404 - Page Not Found</CardTitle>
            <CardDescription>
              The page you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
            <Link href="/experiments">
              <Button variant="outline">View Experiments</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

