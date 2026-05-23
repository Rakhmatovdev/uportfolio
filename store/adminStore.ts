import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  ip: string;
  time: string;
}

interface AdminState {
  sidebarOpen: boolean;
  themeAccent: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'blue';
  notifications: AdminNotification[];
  activityLogs: ActivityLog[];
  pusherConnected: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setThemeAccent: (accent: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'blue') => void;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'read' | 'time'>) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'time'>) => void;
  setPusherConnected: (connected: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      themeAccent: 'indigo',
      pusherConnected: true,
      notifications: [
        {
          id: 'n1',
          title: 'System Seed Complete',
          message: 'Database seeded with default super_admin and core assets.',
          time: 'Just now',
          read: false,
          type: 'success',
        },
        {
          id: 'n2',
          title: 'Real-time Connected',
          message: 'Secure WebSocket channel established with Pusher cluster AP2.',
          time: '3 mins ago',
          read: true,
          type: 'info',
        },
      ],
      activityLogs: [
        {
          id: 'l1',
          user: 'balu',
          action: 'SYSTEM_SEED',
          details: 'Initialized database and generated core assets',
          ip: '127.0.0.1',
          time: '2026-05-23 12:00:00',
        }
      ],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setThemeAccent: (themeAccent) => set({ themeAccent }),
      
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            id: Math.random().toString(36).substring(7),
            read: false,
            time: 'Just now',
            ...notif
          },
          ...state.notifications
        ]
      })),

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      clearNotifications: () => set({ notifications: [] }),

      addActivityLog: (log) => set((state) => ({
        activityLogs: [
          {
            id: Math.random().toString(36).substring(7),
            time: new Date().toLocaleString(),
            ...log
          },
          ...state.activityLogs
        ]
      })),

      setPusherConnected: (pusherConnected) => set({ pusherConnected }),
    }),
    {
      name: 'bexa-admin-storage',
      partialize: (state) => ({
        themeAccent: state.themeAccent,
        notifications: state.notifications,
        activityLogs: state.activityLogs,
      }),
    }
  )
);
