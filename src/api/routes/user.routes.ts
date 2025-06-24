import { Router } from 'express'
import { 
    getAllUsers, 
    getUserByClerkId, 
    updateUser, 
    deleteUser,
    syncUserFromClerk,
    updateNickname
} from '../controllers/user.controller'
import { authMiddleware } from '../auth-clerk/middleware'

const router = Router()

router.post('/sync-user',authMiddleware , syncUserFromClerk) 
router.get('/',authMiddleware , getAllUsers)
router.get('/by-clerk/:clerkId', getUserByClerkId)
router.patch('/update-nickname', updateNickname)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)


export default router
