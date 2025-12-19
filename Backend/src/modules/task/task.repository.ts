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
    const whereClause: any = {
      OR: [
        { assignedToId: userId },
        { creatorId: userId },
      ],
    };

    if (filters.status) whereClause.status = filters.status;
    if (filters.priority) whereClause.priority = filters.priority;

    return prisma.task.findMany({
      where: whereClause,
      orderBy: filters.sortBy
        ? { [filters.sortBy]: filters.sortOrder || 'asc' }
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
