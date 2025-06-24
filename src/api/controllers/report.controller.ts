import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export const createReport = async (req: Request, res: Response) => {
  const { userId, targetId, targetType, reason } = req.body

  if (!targetId || !targetType || !reason) {
    res.status(400).json({ error: 'Faltan campos obligatorios' })
    return 
  }

  try {
    const report = await prisma.report.create({
      data: {
        targetId,
        targetType,
        reason,
        date: new Date(),
        user: {
          connect: { id: userId },
      },
      },
    })
    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reporte' })
  }
}

export const getAllReports = async (_: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany()
    res.json(reports)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' })
  }
}

export const getReportById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const report = await prisma.report.findUnique({ where: { id: Number(id) } })
    if (!report){
      res.status(404).json({ error: 'Reporte no encontrado' })
      return 
    }
    res.json(report)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar reporte' })
  }
}

export const deleteReport = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.report.delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reporte' })
  }
}

export const respondToReport = async (req: Request, res: Response) => {
  const { id } = req.params
  const { modderResponse } = req.body

  if (!modderResponse){
    res.status(400).json({ error: 'Respuesta del moderador requerida' })
    return 
  }

  try {
    const updated = await prisma.report.update({
      where: { id: Number(id) },
      data: { modderResponse },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al responder reporte' })
  }
}
