// src/modules/task/task.repository.ts
import { prisma } from '../../config/prisma';

interface TaskFilters {
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class TaskRepository {
  create(data: any) {
    return prisma.task.create({ data });
  }

  update(id: string, data: any) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }

  findAllByUser(userId: string, filters: TaskFilters = {}) {
    const { status, priority, sortBy, sortOrder } = filters;

    return prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: userId },
          { creatorId: userId },
        ],
        ...(status && { status }),
        ...(priority && { priority }),
      },
      orderBy: sortBy
        ? { [sortBy]: sortOrder || 'asc' }
        : { dueDate: 'asc' },
    });
  }

  findDashboardTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: userId },
          { creatorId: userId },
        ],
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }
}
