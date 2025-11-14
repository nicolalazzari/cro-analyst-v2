import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/client"

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not set')
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET is not set')
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set')
}

// Initialize adapter - will be used for storing users in database
// Since we're using JWT sessions, the adapter is optional
// If database connection fails, NextAuth will still work with JWT sessions
let adapter: any = undefined
if (process.env.DATABASE_URL) {
  try {
    adapter = PrismaAdapter(prisma) as any
    console.log('PrismaAdapter initialized successfully')
  } catch (error) {
    console.error('Failed to initialize PrismaAdapter:', error)
    // Continue without adapter - will use JWT only (sessions won't be stored in DB)
  }
} else {
  console.log('DATABASE_URL not set, using JWT sessions only (no adapter)')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: adapter,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      try {
        if (account) {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
        }
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
          token.picture = user.image
        }
      } catch (error) {
        console.error('Error in jwt callback:', error)
      }
      return token
    },
    async session({ session, token }: any) {
      try {
        if (session.user) {
          session.user.id = token.id as string
          session.user.email = token.email as string
          session.user.name = token.name as string
          session.user.image = token.picture as string
          session.accessToken = token.accessToken as string
        }
      } catch (error) {
        console.error('Error in session callback:', error)
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as const,
  },
})

export const { GET, POST } = handlers

