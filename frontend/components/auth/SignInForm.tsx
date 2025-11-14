'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

export function SignInForm() {
  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}

