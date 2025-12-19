'use client';

import { Notification } from '@/types';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <DropdownMenuItem
      className={`flex flex-col items-start p-3 cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between w-full">
        <p className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
          {notification.message}
        </p>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
      </p>
      {notification.task && (
        <p className="text-xs text-muted-foreground mt-1 truncate w-full">
          Task: {notification.task.title}
        </p>
      )}
    </DropdownMenuItem>
  );
}