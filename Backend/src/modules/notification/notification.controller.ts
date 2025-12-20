import { Request, Response } from 'express';
import * as notificationService from './notification.service';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const notifications = await notificationService.getUserNotifications(userId);
  res.json(notifications);
};

export const markRead = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  await notificationService.markAsRead(id, userId);
  res.json({ message: 'Notification marked as read' });
};

export const clearAll = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await notificationService.clearAllNotifications(userId);
  res.json({ message: 'All notifications cleared' });
};