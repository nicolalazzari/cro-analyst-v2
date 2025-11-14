'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export function SignInButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <Button variant="ghost" disabled>Loading...</Button>
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span className="text-sm">{session.user.name || session.user.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={() => signIn('google')}>
      Sign In with Google
    </Button>
  )
}

