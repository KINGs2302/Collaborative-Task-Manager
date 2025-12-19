// src/hooks/useTasks.ts
import useSWR from 'swr';
import { taskAPI } from '@/lib/api';
import { Task, TaskFilters } from '@/types';

const fetcher = (url: string, filters?: TaskFilters) => 
  taskAPI.getTasks(filters).then(res => res.data);

export const useTasks = (filters?: TaskFilters) => {
  const { data, error, mutate, isLoading } = useSWR<Task[]>(
    filters ? ['/tasks', filters] : '/tasks',
    () => fetcher('/tasks', filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useDashboard = () => {
  const { data, error, mutate, isLoading } = useSWR<Task[]>(
    '/tasks/dashboard',
    () => taskAPI.getDashboard().then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  };
};