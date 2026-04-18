import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Notification, Theme, Quadrant, CalendarEvent, HistoryStats, QuadrantReminderConfig } from '@/types';
import { mockTasks, mockNotifications, mockCalendarEvents, mockHistoryStats } from '@/data/mockData';


interface AppState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, completedAt?: string) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // UI State
  selectedQuadrant: Quadrant | null;
  setSelectedQuadrant: (quadrant: Quadrant | null) => void;
  highlightedTaskId: string | null;
  setHighlightedTaskId: (id: string | null) => void;
  
  // History/Calendar
  historyEvents: CalendarEvent[];
  historyStats: HistoryStats[];
  selectedDateRange: { start: string; end: string };
  setSelectedDateRange: (range: { start: string; end: string }) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  
  // Auth
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  user: { email: string; name: string } | null;
  
  // Settings
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotificationsEnabled: (enabled: boolean) => void;
  quadrantReminderConfig: QuadrantReminderConfig[];
  setQuadrantReminderConfig: (config: QuadrantReminderConfig[]) => void;
  
  // PWA
  installPromptDismissed: boolean;
  setInstallPromptDismissed: (dismissed: boolean) => void;
  
  // Bulk create from multiline text
  bulkCreateTasks: (text: string) => void;
}

// Generate UUID simple function
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const defaultQuadrantReminderConfig: QuadrantReminderConfig[] = [
  { quadrant: 'do-first', intervalMinutes: 30, enabled: true },
  { quadrant: 'schedule', intervalMinutes: 120, enabled: true },
  { quadrant: 'delegate', intervalMinutes: 60, enabled: false },
  { quadrant: 'eliminate', intervalMinutes: 0, enabled: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial tasks from mock data
      tasks: mockTasks,
      
      addTask: (task) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...task,
          id: uuid(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      completeTask: (id, completedAt) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  state: 'completed',
                  completedAt: completedAt || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },
      
      // Notifications
      notifications: mockNotifications,
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      
      clearNotifications: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // UI State
      selectedQuadrant: null,
      setSelectedQuadrant: (quadrant) => set({ selectedQuadrant: quadrant }),
      highlightedTaskId: null,
      setHighlightedTaskId: (id) => set({ highlightedTaskId: id }),
      
      // History
      historyEvents: mockCalendarEvents,
      historyStats: mockHistoryStats,
      selectedDateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
      setSelectedDateRange: (range) => set({ selectedDateRange: range }),
      playbackSpeed: 1,
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      isPlaying: false,
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      // Auth
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        if (email === 'a@x.nl' && password === 'secret123') {
          set({ isAuthenticated: true, user: { email, name: 'Demo User' } });
          return true;
        }
        if (email && password) {
          set({ isAuthenticated: true, user: { email, name: email.split('@')[0] } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      
      // Settings
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: true,
      setPushNotificationsEnabled: (enabled) => set({ pushNotificationsEnabled: enabled }),
      setEmailNotificationsEnabled: (enabled) => set({ emailNotificationsEnabled: enabled }),
      quadrantReminderConfig: defaultQuadrantReminderConfig,
      setQuadrantReminderConfig: (config) => set({ quadrantReminderConfig: config }),
      
      // PWA
      installPromptDismissed: false,
      setInstallPromptDismissed: (dismissed) => set({ installPromptDismissed: dismissed }),
      
      // Bulk create
      bulkCreateTasks: (text) => {
        const lines = text.split('\n').filter((line) => line.trim());
        const newTasks: Task[] = lines.map((line) => {
          const now = new Date().toISOString();
          return {
            id: uuid(),
            title: line.trim(),
            importance: 2,
            urgency: 2,
            tags: [],
            state: 'new',
            createdAt: now,
            updatedAt: now,
            isAllDay: false,
          };
        });
        set((state) => ({ tasks: [...state.tasks, ...newTasks] }));
      },
    }),
    {
      name: 'compass-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        theme: state.theme,
        pushNotificationsEnabled: state.pushNotificationsEnabled,
        emailNotificationsEnabled: state.emailNotificationsEnabled,
        quadrantReminderConfig: state.quadrantReminderConfig,
        installPromptDismissed: state.installPromptDismissed,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);