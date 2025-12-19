import { TaskRepository } from './task.repository';
import { getIO } from '../../socket/socket';
import { CreateTaskDTO, UpdateTaskDTO } from './task.schema';

const repo = new TaskRepository();

const mapStatusToFrontend = (status: string) => {
  const map: Record<string, string> = {
    'ToDo': 'To Do',
    'InProgress': 'In Progress',
    'Review': 'Review',
    'Completed': 'Completed'
  };
  return map[status] || status;
};

export const getAllTasks = async (userId: string, filters = {}) => {
  const tasks = await repo.findAllByUser(userId, filters);
  return tasks.map(task => ({
    ...task,
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate.toISOString()
  }));
};

const mapStatus = (status: string) => {
  const map: Record<string, any> = {
    'To Do': 'ToDo',
    'In Progress': 'InProgress',
    'Review': 'Review',
    'Completed': 'Completed'
  };
  return map[status] || status;
};

export const createTask = async (userId: string, data: CreateTaskDTO) => {
  const task = await repo.create({
    ...data,
    status: mapStatus(data.status),
    creatorId: userId,
    dueDate: new Date(data.dueDate),
  });

  const taskWithMappedStatus = {
    ...task,
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate.toISOString()
  };

  if (data.assignedToId && data.assignedToId !== userId) {
    getIO().to(data.assignedToId).emit('taskAssigned', { task: taskWithMappedStatus, updatedBy: userId });
  }

  getIO().emit('taskCreated', { task: taskWithMappedStatus, createdBy: userId });

  return taskWithMappedStatus;
};

export const updateTask = async (id: string, data: UpdateTaskDTO, userId?: string) => {
  // Get existing task to check permissions
  const existingTask = await repo.findById(id);
  if (!existingTask) throw new Error('Task not found');
  
  // Check if user can edit task (creator or assigned user)
  const canEdit = existingTask.creatorId === userId || existingTask.assignedToId === userId;
  if (!canEdit) {
    throw new Error('You do not have permission to edit this task');
  }
  
  // Only creator can edit assignedToId field
  if (data.assignedToId !== undefined && existingTask.creatorId !== userId) {
    throw new Error('Only task creator can change task assignment');
  }

  const updateData: any = { ...data };
  if (data.status) {
    updateData.status = mapStatus(data.status);
  }
  if (data.dueDate) {
    updateData.dueDate = new Date(data.dueDate);
  }

  const task = await repo.update(id, updateData);
  const taskWithMappedStatus = {
    ...task,
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate.toISOString()
  };

  // Notify assigned user if different from updater
  if (task.assignedToId && task.assignedToId !== userId) {
    getIO().to(task.assignedToId).emit('taskUpdated', { task: taskWithMappedStatus, updatedBy: userId });
  }
  // Notify creator if different from updater and not the assigned user
  if (task.creatorId && task.creatorId !== userId && task.creatorId !== task.assignedToId) {
    getIO().to(task.creatorId).emit('taskUpdated', { task: taskWithMappedStatus, updatedBy: userId });
  }
  
  // If assignment changed, notify the newly assigned user
  if (data.assignedToId && data.assignedToId !== userId && data.assignedToId !== task.assignedToId) {
    getIO().to(data.assignedToId).emit('taskAssigned', { task: taskWithMappedStatus, updatedBy: userId });
  }
  
  getIO().emit('taskUpdated', { task: taskWithMappedStatus, updatedBy: userId });
  return taskWithMappedStatus;
};

export const deleteTask = async (id: string, userId: string) => {
  // Get task first to check ownership and notify users
  const task = await repo.findById(id);
  if (!task) throw new Error('Task not found');
  
  // Only creator can delete
  if (task.creatorId !== userId) {
    throw new Error('Only task creator can delete this task');
  }

  await repo.delete(id);
  
  // Notify users about deletion
  const taskWithMappedStatus = {
    ...task,
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate.toISOString()
  };
  
  getIO().emit('taskDeleted', { task: taskWithMappedStatus, deletedBy: userId });
};

export const dashboard = async (userId: string) => {
  const tasks = await repo.findDashboardTasks(userId);
  return tasks.map(task => ({
    ...task,
    status: mapStatusToFrontend(task.status),
    dueDate: task.dueDate.toISOString()
  }));
};
