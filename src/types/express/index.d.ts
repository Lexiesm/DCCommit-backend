import { JwtPayload } from '@clerk/clerk-sdk-node'

declare global {
  namespace Express {
    interface User extends JwtPayload {
      sub: string
      role?: string
      email?: string
      clerkId: string
    }

    interface Request {
      user?: User
    }
  }
}

export {}