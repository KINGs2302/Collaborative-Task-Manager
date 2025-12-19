import { z } from 'zod';

export const TaskPriorityEnum = z.enum([
  'Low',
  'Medium',
  'High',
  'Urgent',
]);

export const TaskStatusEnum = z.enum([
  'To Do',
  'In Progress',
  'Review',
  'Completed',
]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  
  dueDate: z.string().datetime(),

  priority: TaskPriorityEnum,
  status: TaskStatusEnum,

  assignedToId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;