import { ClassValue, clsx } from 'clsx';
import { Quadrant } from '@/types';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, format: 'short' | 'long' | 'time' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getQuadrantColor(quadrant: string): string {
  const colors: Record<string, string> = {
    'do-first': '#FF6B6B',
    'schedule': '#FFE66D',
    'delegate': '#4ECDC4',
    'eliminate': '#95E1D3',
  };
  return colors[quadrant] || '#A0A0A0';
}

export function getQuadrantLabel(quadrant: string): string {
  const labels: Record<string, string> = {
    'do-first': 'Do First',
    'schedule': 'Schedule',
    'delegate': 'Delegate',
    'eliminate': 'Eliminate',
  };
  return labels[quadrant] || quadrant;
}

export function getQuadrantFromImportanceUrgency(importance: number, urgency: number): Quadrant {
  if (importance >= 3 && urgency >= 3) return 'do-first';
  if (importance >= 3 && urgency < 3) return 'schedule';
  if (importance < 3 && urgency >= 3) return 'delegate';
  return 'eliminate';
}

export function getTaskStateColor(state: string): string {
  const colors: Record<string, string> = {
    'new': '#A0A0A0',
    'in-progress': '#3B82F6',
    'completed': '#22C55E',
  };
  return colors[state] || '#A0A0A0';
}

export function isSameDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1).toDateString();
  const d2 = new Date(date2).toDateString();
  return d1 === d2;
}

export function isToday(dateString: string): boolean {
  const today = new Date().toDateString();
  return new Date(dateString).toDateString() === today;
}

export function isPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}