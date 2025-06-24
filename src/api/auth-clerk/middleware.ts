import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@clerk/backend'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token proporcionado' })
    return
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const verifiedToken = await verifyToken(token, {
      issuer: 'https://concise-dinosaur-7.clerk.accounts.dev', 
    })
    req.user = {
      ...verifiedToken,
      role: typeof verifiedToken.role === 'string' ? verifiedToken.role : undefined,
      email: typeof verifiedToken.email === 'string' ? verifiedToken.email : undefined,
      clerkId: verifiedToken.sub,
    }
    next()
  } catch (err: any) {
    res.status(401).json({ error: 'Token inválido', message: err.message })
  }
}