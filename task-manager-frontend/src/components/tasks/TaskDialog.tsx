'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useSWR from 'swr';
import { Task, Priority, Status, User } from '@/types';
import { taskAPI, userAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';


const taskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']),
  assignedToId: z.string().nullable().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onTaskSaved: () => void;
}

export default function TaskDialog({
  open,
  task,
  onClose,
  onTaskSaved,
}: TaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: currentUser } = useAuth();

  const { data: users } = useSWR<User[]>('/users', () =>
    userAPI.getAllUsers().then((res) => res.data)
  );


  const isCreator = task?.creatorId === currentUser?.id;
  const isAssignedUser = task?.assignedToId === currentUser?.id;

  const canEditFull = !task || isCreator;
  const canEditLimited = isAssignedUser;


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'Medium',
      status: 'To Do',
      assignedToId: null,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        dueDate: format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm"),
        priority: task.priority,
        status: task.status,
        assignedToId: task.assignedToId ?? null,
      });
    } else {
      reset({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'To Do',
        assignedToId: null,
      });
    }
  }, [task, reset]);



  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
     
      if (!task) {
        const payload = {
          title: data.title!,
          description: data.description!,
          dueDate: new Date(data.dueDate!).toISOString(),
          priority: data.priority,
          status: data.status,
          assignedToId: data.assignedToId ?? null,
        };

        await taskAPI.createTask(payload);
        toast.success('Task created successfully');
        onTaskSaved();
        return;
      }
      let payload: any = {};

      // Creator → full edit
      if (isCreator) {
        payload = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString()
            : undefined,
          priority: data.priority,
          status: data.status,
          assignedToId: data.assignedToId ?? null,
        };
      }

      // Assigned user → limited edit
      if (isAssignedUser && !isCreator) {
        payload = {
          priority: data.priority,
          status: data.status,
        };
      }

      await taskAPI.updateTask(task.id, payload);
      toast.success('Task updated successfully');
      onTaskSaved();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...register('title')} disabled={!canEditFull} />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} disabled={!canEditFull} />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(v) =>
                  setValue('priority', v as Priority)
                }
                disabled={!(canEditFull || canEditLimited)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) =>
                  setValue('status', v as Status)
                }
                disabled={!(canEditFull || canEditLimited)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <Label>Due Date</Label>
            <Input
              type="datetime-local"
              {...register('dueDate')}
              disabled={!canEditFull}
            />
          </div>

          {/* Assign To */}
          <div>
            <Label>Assign To</Label>
            <Select
              value={watch('assignedToId') ?? 'unassigned'}
              onValueChange={(v) =>
                setValue(
                  'assignedToId',
                  v === 'unassigned' ? null : v
                )
              }
              disabled={!canEditFull}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">
                  Unassigned
                </SelectItem>
                {users?.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            {(canEditFull || canEditLimited) && (
              <Button type="submit" disabled={isSubmitting}>
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
