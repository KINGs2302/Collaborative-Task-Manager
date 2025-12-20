import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from './notification.controller';

const router = Router();

router.get('/', authMiddleware, ctrl.getNotifications);
router.put('/:id/read', authMiddleware, ctrl.markRead);
router.delete('/', authMiddleware, ctrl.clearAll);

export default router;