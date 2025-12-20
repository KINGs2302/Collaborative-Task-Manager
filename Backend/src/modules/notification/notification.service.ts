import { prisma } from '../../config/prisma';

export const createNotification = async (data: {
  userId: string;
  type: string;
  message: string;
  taskId?: string;
}) => {
  return prisma.notification.create({ data });
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
};

export const markAsRead = async (notificationId: string, userId: string) => {
  return prisma.notification.update({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

export const clearAllNotifications = async (userId: string) => {
  return prisma.notification.deleteMany({
    where: { userId },
  });
};