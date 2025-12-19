'use client';

import { TaskFilters as TFilters, Priority, Status } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TFilters;
  onFiltersChange: (filters: TFilters) => void;
}

const statuses: Status[] = ['To Do', 'In Progress', 'Review', 'Completed'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

export default function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const handleFilterChange = (key: keyof TFilters, value: string | undefined) => {
    onFiltersChange({
      ...(filters || {}),
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters && Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select
          value={filters?.status || 'all'}
          onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Priority</label>
        <Select
          value={filters?.priority || 'all'}
          onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Sort By</label>
        <Select
          value={filters?.sortBy || 'dueDate'}
          onValueChange={(value) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Order</label>
        <Select
          value={filters?.sortOrder || 'asc'}
          onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="sm:col-span-2 lg:col-span-4 xl:col-span-1">
          <Button variant="outline" onClick={clearFilters} size="icon" className="w-full sm:w-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}