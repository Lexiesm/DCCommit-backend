import express from 'express'
import {
  createComment,
  getAllComments,
  getCommentById,
  deleteComment,
} from '../controllers/comment.controller'

const router = express.Router()

router.post('/', createComment)
router.get('/', getAllComments)
router.get('/:id', getCommentById)
router.delete('/:id', deleteComment)

export default router
