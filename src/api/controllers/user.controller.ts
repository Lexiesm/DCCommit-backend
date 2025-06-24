import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PrismaClientInitializationError } from '@prisma/client/runtime/library'
import bcrypt from 'bcrypt'

export const syncUserFromClerk = async (req: Request, res: Response) => {
  const { name, nickname, email, profile_picture, rol } = req.body;
  const clerkId = req.user?.sub;

  // Validación más completa
  if (!clerkId || !email) {
    return res.status(400).json({ 
      error: 'Faltan campos obligatorios',
      required: ['clerkId', 'email'],
      received: { clerkId, email }
    });
  }

  try {
    // 1. Verificar usuario existente
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    // 2. Verificar nickname único (si se proporciona)
    if (nickname) {
      const nicknameUser = await prisma.user.findFirst({
        where: { 
          nickname,
          NOT: { clerkId } // Excluye al usuario actual si existe
        }
      });

      if (nicknameUser) {
        return res.status(409).json({ 
          error: 'Nickname no disponible',
          suggestion: `${nickname}-${Math.floor(Math.random() * 1000)}`
        });
      }
    }

    // 3. Operación de creación/actualización
    const user = existingUser
      ? await prisma.user.update({
          where: { clerkId },
          data: {
            name,
            email,
            ...(nickname && { nickname }), // Actualiza nickname solo si viene
            profile_picture,
            rol
          }
        })
      : await prisma.user.create({
          data: {
            clerkId,
            name,
            nickname,
            email,
            profile_picture,
            rol,
            password: 'from-clerk' // Password más seguro
          }
        });

    return res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        profile_picture: user.profile_picture,
        rol: user.rol
        // Excluye campos sensibles como password
      }
    });

  } catch (err) {
    console.error('Error al sincronizar usuario:', err);

    // Manejo específico de errores de Prisma
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        const target = err.meta?.target;
        return res.status(409).json({ 
          error: 'Conflicto de datos',
          field: Array.isArray(target) ? target[0] : target,
          message: 'El valor ya existe en otro usuario'
        });
      }

      if (err.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Usuario no encontrado para actualización'
        });
      }
    }

    // Manejo de errores de conexión/tiempo de espera
    if (err instanceof PrismaClientInitializationError) {
      return res.status(503).json({ 
        error: 'Servicio de base de datos no disponible',
        message: 'Intente nuevamente más tarde'
      });
    }

    // Error genérico
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' 
        ? (err as Error).message 
        : 'Por favor contacte al soporte técnico'
    });
  }
};
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
