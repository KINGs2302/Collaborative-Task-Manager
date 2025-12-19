import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { profile, update, getAll } from './user.controller';

const router = Router();

router.get('/me', authMiddleware, profile);
router.put('/me', authMiddleware, update);
router.get('/', authMiddleware, getAll);

export default router;