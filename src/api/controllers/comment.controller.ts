import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'


export const createComment = async (req: Request, res: Response) => {
  const { content, postId, userId } = req.body

  if (!content || !postId || !userId) {
    res.status(400).json({ error: 'Faltan campos obligatorios' })
    return 
  }

  try {
    const comment = await prisma.comment.create({
      data: { content, postId, userId },
    })
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear comentario', details: (error as Error).message })
  }
}

export const getAllComments = async (_: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany()
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}

export const getCommentById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const comment = await prisma.comment.findUnique({ where: { id: Number(id) } })
    if (!comment) {
      res.status(404).json({ error: 'Comentario no encontrado' })
      return 
    }
    res.json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar comentario' })
  }
}

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.comment.delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comentario' })
  }
}
