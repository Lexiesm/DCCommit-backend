import express from 'express';
import {
  createVerification,
  getAllVerifications,
  getVerificationById,
  updateVerification,
  deleteVerification
} from '../controllers/verification.controller';

const router = express.Router();

router.post('/', createVerification);
router.get('/', getAllVerifications);
router.get('/:id', getVerificationById);
router.patch('/:id', updateVerification);
router.delete('/:id', deleteVerification);

export default router;
