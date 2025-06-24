import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import bcrypt from 'bcrypt'


export const syncUserFromClerk = async (req: Request, res: Response) => {
  const { name, nickname, email, profile_picture, rol } = req.body
  const clerkId = req.user?.sub
  if (!clerkId || !email) {
    res.status(400).json({ error: 'Faltan campos obligatorios: clerkId o email' })
    return
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    let user

    if (!existingUser) {
      user = await prisma.user.create({
        data: {
          clerkId,
          name,
          nickname,
          password: 'from-clerk',
          email,
          profile_picture,
          rol,
        }
      })
    } else {
      user = await prisma.user.update({
        where: { clerkId },
        data: {
          clerkId,
          name,
          email,
          profile_picture,
          rol
        }
      })
    }

    res.json({ success: true, user })
  } catch (err) {
    console.error('Error al sincronizar usuario:', err)

    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2002' &&
      Array.isArray(err.meta?.target) && err.meta.target.includes('nickname')

    ) {
      res.status(409).json({ error: 'Ese nickname ya está en uso' })
    }

    res.status(500).json({
      error: 'Error al sincronizar usuario',
      details: (err as Error).message
    })
  }
}

// Update usuario desde clerk
export const updateNickname = async (req: Request, res: Response) => {
  const { clerkId, nickname } = req.body

  if (!clerkId || !nickname) {
    res.status(400).json({ error: 'Faltan campos obligatorios' })
    return
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: { nickname }
    })

    res.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error('Error al actualizar nickname:', err)

    if (
    (err as any).code === 'P2002' &&
    Array.isArray((err as any).meta?.target) &&
    (err as any).meta.target.includes('nickname')
  ) {
    res.status(409).json({ error: 'Ese nickname ya está en uso' })
  }

  res.status(500).json({ error: 'Error al actualizar nickname' })
}
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()

    if (users.length === 0) {
      res.status(404).json({ error: 'No se encontraron usuarios' })
      return
    }

    res.status(200).json(users)
  } catch (err) {
    console.error('Error al obtener usuarios:', err) 
    res.status(500).json({ error: 'Error al obtener usuarios', details: (err as Error).message })
  }
}

export const getUserByClerkId = async (req: Request, res: Response) => {
  const { clerkId } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId }, // string
    })

    if (!user){
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, nickname, email, profile_picture, password } = req.body

  try {
    const data: any = {}

    if (name !== undefined) data.name = name
    if (nickname !== undefined) data.nickname = nickname
    if (email !== undefined) data.email = email
    if (profile_picture !== undefined) data.profile_picture = profile_picture
    
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10)
      data.password = hashedPassword
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    })

    if (!user){
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      profile_picture: user.profile_picture,
      rol: user.rol,
    })
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario', details: (err as Error).message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
    })

    if (!user){
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.status(204).json({ message: 'Usuario eliminado', user })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario', details: (err as Error).message })
  }
} 
