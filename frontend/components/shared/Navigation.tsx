'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@/components/auth/SignInButton'

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              CRO Analyst
            </Link>
            <div className="flex gap-4">
              <Link href="/experiments">
                <Button variant="ghost">Experiments</Button>
              </Link>
              <Link href="/search">
                <Button variant="ghost">Search</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

