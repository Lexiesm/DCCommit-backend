import express from 'express'
import postRoutes from './api/routes/post.routes'
import verificationRoutes from './api/routes/verification.routes'
import commentRoutes from './api/routes/comment.routes'
import reportRoutes from './api/routes/report.routes'
import testRoutes from './api/routes/test.routes';
import userRoutes from './api/routes/user.routes'

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/verifications', verificationRoutes);
router.use('/comments', commentRoutes)
router.use('/reports', reportRoutes)
router.use('/test', testRoutes);


export default router;