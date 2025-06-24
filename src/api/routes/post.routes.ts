import express from 'express'
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  changePostStatus,
  getAllUserPosts
} from '../controllers/post.controller'
import { authMiddleware } from '../auth-clerk/middleware'

const router = express.Router()

router.post('/:clerkId', authMiddleware, createPost)
router.get('/user/:id', authMiddleware, getAllUserPosts)
router.get('/', getAllPosts)
router.get('/:id', authMiddleware, getPostById)
router.delete('/:id', authMiddleware, deletePost)
router.patch('/:id', updatePost)
router.patch('/:id/status', authMiddleware, changePostStatus)

export default router
