import { Request, Response } from 'express';
import * as taskService from './task.service';
import { createTaskSchema, updateTaskSchema } from './task.schema';

export const getAll = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tasks = await taskService.getAllTasks(userId, req.query);
  res.json(tasks);
};

export const dashboard = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tasks = await taskService.dashboard(userId);
  res.json(tasks);
};

export const create = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = createTaskSchema.parse(req.body);
  const task = await taskService.createTask(userId, data);
  res.status(201).json(task);
};

export const update = async (req: Request, res: Response) => {
  const data = updateTaskSchema.parse(req.body);
  const task = await taskService.updateTask(req.params.id, data, req.user!.id);
  res.json(task);
};

export const remove = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id, req.user!.id);
  res.json({ message: 'Task deleted' });
};
