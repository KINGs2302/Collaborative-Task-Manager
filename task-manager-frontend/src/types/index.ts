export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  creator?: User;
  assignedToId?: string | null;
  assignedTo?: User | null;
  createdAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignedToId?: string | null;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
  assignedToId?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Notification {
  id: string;
  type: 'taskAssigned' | 'taskUpdated' | 'taskCreated';
  message: string;
  task?: Task;
  timestamp: Date;
  read: boolean;
}