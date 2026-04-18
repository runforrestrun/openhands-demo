import { Task, Notification, CalendarEvent, HistoryStats } from '@/types';

const now = new Date();
const today = now.toISOString().split('T')[0];
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const mockTasks: Task[] = [
  // Q1 - Do First (Important & Urgent)
  {
    id: '1',
    title: 'Submit quarterly report',
    description: 'Complete and submit Q1 financial report to management',
    importance: 5,
    urgency: 5,
    dueDate: `${today}T17:00:00`,
    tags: ['work', 'urgent'],
    state: 'new',
    createdAt: `${lastWeek}T09:00:00`,
    updatedAt: `${lastWeek}T09:00:00`,
    isAllDay: false,
    reminder: '1hour',
  },
  {
    id: '2',
    title: 'Client presentation',
    description: 'Prepare slides for major client meeting tomorrow',
    importance: 5,
    urgency: 4,
    dueDate: `${tomorrow}T14:00:00`,
    tags: ['work', 'presentation'],
    state: 'in-progress',
    createdAt: `${lastWeek}T10:00:00`,
    updatedAt: `${today}T11:00:00`,
    isAllDay: false,
    reminder: '30min',
  },
  {
    id: '3',
    title: 'Fix critical bug in production',
    description: 'Users reporting login issues',
    importance: 5,
    urgency: 5,
    tags: ['bug', 'urgent'],
    state: 'new',
    createdAt: `${today}T08:00:00`,
    updatedAt: `${today}T08:00:00`,
    isAllDay: false,
  },
  
  // Q2 - Schedule (Important Not Urgent)
  {
    id: '4',
    title: 'Plan team strategy session',
    description: 'Schedule a quarterly planning meeting',
    importance: 4,
    urgency: 2,
    dueDate: `${twoDaysLater}T10:00:00`,
    tags: ['planning'],
    state: 'new',
    createdAt: `${lastWeek}T14:00:00`,
    updatedAt: `${lastWeek}T14:00:00`,
    isAllDay: false,
  },
  {
    id: '5',
    title: 'Learn new framework',
    description: 'Complete the React course module',
    importance: 3,
    urgency: 1,
    dueDate: `${lastMonth}T20:00:00`,
    tags: ['learning'],
    state: 'in-progress',
    createdAt: `${twoWeeksAgo()}`,
    updatedAt: `${today}T09:00:00`,
    isAllDay: false,
  },
  {
    id: '6',
    title: 'Update resume',
    description: 'Add recent projects to LinkedIn',
    importance: 3,
    urgency: 1,
    tags: ['career'],
    state: 'new',
    createdAt: `${lastWeek}T16:00:00`,
    updatedAt: `${lastWeek}T16:00:00`,
    isAllDay: false,
  },
  {
    id: '7',
    title: 'Schedule annual checkup',
    importance: 3,
    urgency: 2,
    dueDate: nextMonthFirst(),
    tags: ['health'],
    state: 'new',
    createdAt: `${lastWeek}T12:00:00`,
    updatedAt: `${lastWeek}T12:00:00`,
    isAllDay: false,
  },
  
  // Q3 - Delegate (Not Important Urgent)
  {
    id: '8',
    title: 'Email follow-ups',
    description: 'Reply to routine emails',
    importance: 1,
    urgency: 4,
    tags: ['admin'],
    state: 'new',
    createdAt: `${today}T07:00:00`,
    updatedAt: `${today}T07:00:00`,
    isAllDay: false,
  },
  {
    id: '9',
    title: 'Team meeting notes',
    description: 'Distribute meeting minutes',
    importance: 2,
    urgency: 3,
    dueDate: `${today}T18:00:00`,
    tags: ['admin'],
    state: 'completed',
    createdAt: `${lastWeek}T11:00:00`,
    updatedAt: `${today}T15:00:00`,
    completedAt: `${today}T15:00:00`,
    isAllDay: false,
    repeat: 'daily',
    repeatEndDate: nextWeekEnd(),
  },
  {
    id: '10',
    title: 'Update social media',
    importance: 1,
    urgency: 3,
    tags: ['marketing'],
    state: 'new',
    createdAt: `${today}T06:00:00`,
    updatedAt: `${today}T06:00:00`,
    isAllDay: false,
  },
  
  // Q4 - Eliminate (Not Important Not Urgent)
  {
    id: '11',
    title: 'Clear inbox',
    description: 'Archive old emails',
    importance: 1,
    urgency: 1,
    tags: ['admin'],
    state: 'new',
    createdAt: `${lastWeek}T17:00:00`,
    updatedAt: `${lastWeek}T17:00:00`,
    isAllDay: false,
  },
  {
    id: '12',
    title: 'Organize desktop files',
    importance: 0,
    urgency: 0,
    tags: ['admin'],
    state: 'new',
    createdAt: `${lastWeek}T18:00:00`,
    updatedAt: `${lastWeek}T18:00:00`,
    isAllDay: false,
  },
  {
    id: '13',
    title: 'Browse tech news',
    importance: 0,
    urgency: 1,
    tags: ['leisure'],
    state: 'new',
    createdAt: `${lastWeek}T13:00:00`,
    updatedAt: `${lastWeek}T13:00:00`,
    isAllDay: false,
  },
];

function twoWeeksAgo(): string {
  return new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function nextMonthFirst(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];
}

function nextWeekEnd(): string {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    taskId: '1',
    type: 'push',
    title: 'Quarterly Report Due',
    message: 'Your quarterly report is due in 1 hour',
    sentAt: `${today}T16:00:00`,
    read: false,
    taskTitle: 'Submit quarterly report',
  },
  {
    id: 'n2',
    taskId: '2',
    type: 'both',
    title: 'Client Presentation Tomorrow',
    message: 'Reminder: Client presentation scheduled for tomorrow 2:00 PM',
    sentAt: `${today}T09:00:00`,
    read: false,
    taskTitle: 'Client presentation',
  },
  {
    id: 'n3',
    taskId: '9',
    type: 'email',
    title: 'Meeting Completed',
    message: 'Team meeting notes have been distributed',
    sentAt: `${today}T15:30:00`,
    read: true,
    taskTitle: 'Team meeting notes',
  },
  {
    id: 'n4',
    taskId: '3',
    type: 'push',
    title: 'Critical Bug Reported',
    message: 'New issue: Users cannot log in',
    sentAt: `${today}T08:15:00`,
    read: true,
    taskTitle: 'Fix critical bug in production',
  },
  {
    id: 'n5',
    taskId: '5',
    type: 'email',
    title: 'Learning Reminder',
    message: 'Time to continue your React course!',
    sentAt: `${yesterday}T20:00:00`,
    read: true,
    taskTitle: 'Learn new framework',
  },
  {
    id: 'n6',
    taskId: '4',
    type: 'both',
    title: 'Strategy Session',
    message: 'Planning session scheduled for 2 days',
    sentAt: `${yesterday}T10:00:00`,
    read: false,
    taskTitle: 'Plan team strategy session',
  },
  {
    id: 'n7',
    taskId: '8',
    type: 'push',
    title: 'Follow Up Reminder',
    message: 'You have pending follow-up emails',
    sentAt: `${today}T07:30:00`,
    read: true,
    taskTitle: 'Email follow-ups',
  },
  {
    id: 'n8',
    taskId: '11',
    type: 'email',
    title: 'Inbox Cleanup',
    message: 'Consider clearing your inbox today',
    sentAt: `${lastWeek}T18:00:00`,
    read: true,
    taskTitle: 'Clear inbox',
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  // History for timeline replay
  { id: 'e1', taskId: '9', date: `${today}T15:00:00`, type: 'completed', toQuadrant: 'delegate' },
  { id: 'e2', taskId: '5', date: `${today}T09:00:00`, type: 'edited', fromQuadrant: 'schedule', toQuadrant: 'schedule' },
  { id: 'e3', taskId: '2', date: `${today}T11:00:00`, type: 'moved', fromQuadrant: 'do-first', toQuadrant: 'do-first' },
  { id: 'e4', taskId: '9', date: `${yesterday}T10:00:00`, type: 'created', fromQuadrant: 'delegate' },
  { id: 'e5', taskId: '8', date: `${yesterday}T14:00:00`, type: 'moved', fromQuadrant: 'eliminate', toQuadrant: 'delegate' },
  { id: 'e6', taskId: '1', date: `${lastWeek}T09:00:00`, type: 'created', fromQuadrant: 'do-first' },
  { id: 'e7', taskId: '4', date: `${lastWeek}T14:00:00`, type: 'created', fromQuadrant: 'schedule' },
  { id: 'e8', taskId: '11', date: `${lastWeek}T17:00:00`, type: 'created', fromQuadrant: 'eliminate' },
  { id: 'e9', taskId: '12', date: `${lastWeek}T18:00:00`, type: 'created', fromQuadrant: 'eliminate' },
  { id: 'e10', taskId: '6', date: `${lastWeek}T16:00:00`, type: 'created', fromQuadrant: 'schedule' },
  { id: 'e11', taskId: '3', date: `${today}T08:00:00`, type: 'created', fromQuadrant: 'do-first' },
  { id: 'e12', taskId: '13', date: `${lastWeek}T13:00:00`, type: 'created', fromQuadrant: 'eliminate' },
];

export const mockHistoryStats: HistoryStats[] = [
  { quadrant: 'do-first', count: 45, percentage: 35 },
  { quadrant: 'schedule', count: 38, percentage: 29 },
  { quadrant: 'delegate', count: 28, percentage: 22 },
  { quadrant: 'eliminate', count: 18, percentage: 14 },
];

export function getTasksByQuadrant(tasks: Task[], quadrant: string): Task[] {
  return tasks.filter(task => {
    const { importance, urgency } = task;
    switch (quadrant) {
      case 'do-first':
        return importance >= 3 && urgency >= 3;
      case 'schedule':
        return importance >= 3 && urgency < 3;
      case 'delegate':
        return importance < 3 && urgency >= 3;
      case 'eliminate':
        return importance < 3 && urgency < 3;
      default:
        return true;
    }
  });
}