'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket, disconnectSocket } from '@/lib/socket';
import { Task, Notification } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { notificationAPI } from '@/lib/api';

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load persistent notifications on mount
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.map((n: any) => ({
        ...n,
        timestamp: new Date(n.createdAt),
      })));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const socketInstance = initSocket();
      setSocket(socketInstance);

      // Listen for task assigned events
      socketInstance.on('taskAssigned', (data: { task: Task; updatedBy?: string }) => {
        const { task, updatedBy } = data;
        if (task.assignedToId === user.id && updatedBy !== user.id) {
          const notification: Notification = {
            id: `${Date.now()}-${task.id}`,
            type: 'taskAssigned',
            message: `You have been assigned to: ${task.title}`,
            task,
            timestamp: new Date(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev]);
          
          toast.success('New Task Assigned', {
            description: task.title,
          });
        }
      });

      // Listen for task updated events
      socketInstance.on('taskUpdated', (data: { task: Task; updatedBy?: string }) => {
        const { task, updatedBy } = data;
        if (updatedBy !== user.id && (task.assignedToId === user.id || task.creatorId === user.id)) {
          const notification: Notification = {
            id: `${Date.now()}-${task.id}`,
            type: 'taskUpdated',
            message: `Task updated: ${task.title}`,
            task,
            timestamp: new Date(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev]);
          
          toast.info('Task Updated', {
            description: task.title,
          });
        }
      });

      // Listen for task created events
      socketInstance.on('taskCreated', (data: { task: Task; createdBy?: string }) => {
        const { task, createdBy } = data;
        if (createdBy !== user.id && task.assignedToId === user.id) {
          const notification: Notification = {
            id: `${Date.now()}-${task.id}`,
            type: 'taskCreated',
            message: `New task created: ${task.title}`,
            task,
            timestamp: new Date(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev]);
          
          toast.info('New Task Created', {
            description: task.title,
          });
        }
      });

      // Listen for task deleted events
      socketInstance.on('taskDeleted', (data: { task: Task; deletedBy?: string }) => {
        const { task, deletedBy } = data;
        if (deletedBy !== user.id && task.assignedToId === user.id) {
          const notification: Notification = {
            id: `${Date.now()}-${task.id}`,
            type: 'taskUpdated',
            message: `Task deleted: ${task.title}`,
            task,
            timestamp: new Date(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev]);
          
          toast.warning('Task Deleted', {
            description: task.title,
          });
        }
      });

      return () => {
        disconnectSocket();
        setSocket(null);
      };
    }
  }, [user]);

  const markNotificationRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      await notificationAPI.clearAll();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, markNotificationRead, clearNotifications }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};