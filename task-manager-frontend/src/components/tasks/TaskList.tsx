'use client';

import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, isPast, isToday } from 'date-fns';
import { Clock, MoreVertical, Pencil, Trash2, User } from 'lucide-react';
import { taskAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onTaskDeleted: () => void;
}

export default function TaskList({ tasks, onEditTask, onTaskDeleted }: TaskListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'To Do': 'bg-slate-500',
      'In Progress': 'bg-blue-500',
      'Review': 'bg-yellow-500',
      'Completed': 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getDueDateColor = (dueDate: string, status: string) => {
    if (status === 'Completed') return 'text-muted-foreground';
    const date = new Date(dueDate);
    if (isPast(date)) return 'text-red-600 font-semibold';
    if (isToday(date)) return 'text-orange-600 font-semibold';
    return 'text-muted-foreground';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setDeletingId(id);
    try {
      await taskAPI.deleteTask(id);
      toast.success('Task deleted successfully');
      onTaskDeleted();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No tasks found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                  <h3 className="font-semibold text-lg truncate">{task.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">{task.status}</Badge>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {task.assignedTo.name}
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-1 text-sm ${getDueDateColor(
                      task.dueDate,
                      task.status
                    )}`}
                  >
                    <Clock className="h-3 w-3" />
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === task.id}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditTask(task)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}