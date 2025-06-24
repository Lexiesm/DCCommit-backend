import express from 'express'
import {
  createReport,
  getAllReports,
  getReportById,
  deleteReport,
  respondToReport,
} from '../controllers/report.controller'
import { authMiddleware } from '../auth-clerk/middleware'

const router = express.Router()

router.post('/', createReport)
router.get('/', authMiddleware, getAllReports)
router.get('/:id', getReportById)
router.delete('/:id', deleteReport)
router.patch('/:id/respond', respondToReport)

export default router
