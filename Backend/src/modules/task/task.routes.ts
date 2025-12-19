// src/modules/task/task.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from './task.controller';

const router = Router();

router.get('/', authMiddleware, ctrl.getAll);
router.get('/dashboard', authMiddleware, ctrl.dashboard);
router.post('/', authMiddleware, ctrl.create);
router.put('/:id', authMiddleware, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

export default router;
