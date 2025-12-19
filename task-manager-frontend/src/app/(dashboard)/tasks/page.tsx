'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useSocket } from '@/context/SocketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Task, TaskFilters as TFilters } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState<TFilters>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { tasks, isLoading, mutate } = useTasks(filters);
  const { socket } = useSocket();

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = () => {
      mutate();
    };

    const handleTaskUpdated = () => {
      mutate();
    };

    const handleTaskDeleted = () => {
      mutate();
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);

    return () => {
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);
    };
  }, [socket, mutate]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSaved = () => {
    mutate();
    handleCloseDialog();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <Button onClick={handleCreateTask} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <TaskList
        tasks={tasks || []}
        onEditTask={handleEditTask}
        onTaskDeleted={mutate}
      />

      <TaskDialog
        open={isDialogOpen}
        task={selectedTask}
        onClose={handleCloseDialog}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
}