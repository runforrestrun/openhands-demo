export type TaskState = 'new' | 'in-progress' | 'completed';

export type RepeatOption = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type ReminderOption = 
  | 'none' 
  | 'at_due' 
  | '5min' 
  | '10min' 
  | '15min' 
  | '30min' 
  | '1hour' 
  | '2hours' 
  | '1day' 
  | '2days' 
  | 'custom';

export type MoveToUrgentOption = 
  | 'none' 
  | 'task_completion' 
  | 'time';

export type Quadrant = 'do-first' | 'schedule' | 'delegate' | 'eliminate';

export type Theme = 'dark' | 'light' | 'forrest' | 'sea' | 'sunset';

export type NotificationType = 'push' | 'email' | 'both';

export interface Task {
  id: string;
  title: string;
  description?: string;
  importance: number;
  urgency: number;
  dueDate?: string;
  repeat?: RepeatOption;
  repeatEndDate?: string;
  repeatDays?: number[];
  tags: string[];
  state: TaskState;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reminder?: ReminderOption;
  reminderCustomMinutes?: number;
  moveToUrgentBy?: MoveToUrgentOption;
  moveToUrgentByTaskIds?: string[];
  moveToUrgentByTime?: number;
  isAllDay: boolean;
}

export interface Notification {
  id: string;
  taskId: string;
  type: NotificationType;
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
  taskTitle?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface ThemeConfig {
  name: Theme;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
}

export interface CalendarEvent {
  id: string;
  taskId: string;
  date: string;
  type: 'created' | 'completed' | 'moved' | 'edited';
  fromQuadrant?: Quadrant;
  toQuadrant?: Quadrant;
}

export interface HistoryStats {
  quadrant: Quadrant;
  count: number;
  percentage: number;
}

export interface QuadrantReminderConfig {
  quadrant: Quadrant;
  intervalMinutes: number;
  enabled: boolean;
}