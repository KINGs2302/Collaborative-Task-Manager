'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/types';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';


export default function DashboardPage() {
  const { tasks, isLoading, mutate } = useDashboard();
  const { user } = useAuth();
  const { socket } = useSocket();

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => mutate();

    socket.on('taskCreated', handleUpdate);
    socket.on('taskUpdated', handleUpdate);
    socket.on('taskDeleted', handleUpdate);

    return () => {
      socket.off('taskCreated', handleUpdate);
      socket.off('taskUpdated', handleUpdate);
      socket.off('taskDeleted', handleUpdate);
    };
  }, [socket, mutate]);

  const stats = useMemo(() => {
    if (!tasks || !user) return null;

    const assignedToMe = tasks.filter((t) => t.assignedToId === user.id);
    const createdByMe = tasks.filter((t) => t.creatorId === user.id);
    const overdue = tasks.filter(
      (t) => isPast(new Date(t.dueDate)) && t.status !== 'Completed'
    );
    const dueToday = tasks.filter(
      (t) => isToday(new Date(t.dueDate)) && t.status !== 'Completed'
    );
    const completed = tasks.filter((t) => t.status === 'Completed');

    return {
      assignedToMe: assignedToMe.length,
      createdByMe: createdByMe.length,
      overdue: overdue.length,
      dueToday: dueToday.length,
      completed: completed.length,
      total: tasks.length,
    };
  }, [tasks, user]);

  const upcomingTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter((t) => t.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

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

  const getDueDateLabel = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date)) return 'Overdue';
    if (isToday(date)) return 'Due Today';
    if (isTomorrow(date)) return 'Due Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tasks and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 z-50 bg-slate-950/5 p-4 rounded-lg">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assigned to Me</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.assignedToMe}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Created by Me</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.createdByMe}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row items-start justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors gap-2 sm:gap-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                      <h4 className="font-medium truncate">{task.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {getDueDateLabel(task.dueDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}