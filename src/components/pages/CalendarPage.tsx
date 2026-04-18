'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getQuadrantColor, getQuadrantLabel, cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';

type ViewMode = 'day' | 'week' | 'month' | 'year';

export function CalendarPage() {
  const { tasks, updateTask, deleteTask, addTask } = useAppStore();
  const [viewMode, setViewMode] = React.useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const getTasksForDate = (dateString: string) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = task.dueDate.split('T')[0];
      return taskDate === dateString;
    });
  };

  const getQuadrantForTask = (task: Task): string => {
    if (task.importance >= 3 && task.urgency >= 3) return 'do-first';
    if (task.importance >= 3 && task.urgency < 3) return 'schedule';
    if (task.importance < 3 && task.urgency >= 3) return 'delegate';
    return 'eliminate';
  };

  const handleDoubleClick = (dateString: string) => {
    setSelectedDate(dateString);
    // Could open create task modal here
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="grid flex-1 grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-foreground-secondary"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="min-h-[100px] bg-background-secondary/30" />;
          }

          const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = getTasksForDate(dateString);
          const isToday = dateString === new Date().toISOString().split('T')[0];

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={cn(
                'min-h-[100px] cursor-pointer rounded-lg border border-border bg-background-secondary/50 p-2 transition-colors hover:bg-background',
                isToday && 'ring-2 ring-primary'
              )}
              onDoubleClick={() => handleDoubleClick(dateString)}
            >
              <div className={cn(
                'mb-1 text-sm font-medium',
                isToday ? 'text-primary' : 'text-foreground-secondary'
              )}>
                {day}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'truncate rounded px-1 py-0.5 text-xs font-medium',
                      task.state === 'completed' && 'opacity-50 line-through'
                    )}
                    style={{ 
                      backgroundColor: `${getQuadrantColor(getQuadrantForTask(task))}30`,
                      color: getQuadrantColor(getQuadrantForTask(task))
                    }}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-foreground-secondary">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return (
      <div className="flex flex-1 gap-2">
        {days.map((day, index) => {
          const dateString = day.toISOString().split('T')[0];
          const dayTasks = getTasksForDate(dateString);
          const isToday = dateString === new Date().toISOString().split('T')[0];

          return (
            <div
              key={index}
              className={cn(
                'flex-1 rounded-lg border border-border bg-background-secondary/50 p-2',
                isToday && 'ring-2 ring-primary'
              )}
            >
              <div className={cn(
                'mb-2 text-center text-sm font-medium',
                isToday ? 'text-primary' : 'text-foreground-secondary'
              )}>
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                <br />
                <span className="text-lg">{day.getDate()}</span>
              </div>
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'truncate rounded px-2 py-1 text-xs font-medium',
                      task.state === 'completed' && 'opacity-50 line-through'
                    )}
                    style={{ 
                      backgroundColor: `${getQuadrantColor(getQuadrantForTask(task))}30`,
                      color: getQuadrantColor(getQuadrantForTask(task))
                    }}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateString = currentDate.toISOString().split('T')[0];
    const dayTasks = getTasksForDate(dateString);

    return (
      <div className="flex flex-1 flex-col">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-heading font-bold">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
        </div>
        <div className="space-y-2">
          {dayTasks.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-foreground-secondary">No tasks for this day</p>
            </div>
          ) : (
            dayTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
              >
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: getQuadrantColor(getQuadrantForTask(task)) }}
                />
                <div className="flex-1">
                  <p className={cn(
                    'font-medium',
                    task.state === 'completed' && 'line-through text-foreground-secondary'
                  )}>
                    {task.title}
                  </p>
                  {task.dueDate && task.dueDate.includes('T') && (
                    <p className="text-xs text-foreground-secondary">
                      {task.dueDate.split('T')[1]?.slice(0, 5)}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-heading font-bold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-1">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'rounded px-3 py-1 text-sm font-medium transition-colors',
                  viewMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                )}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Connect */}
      <div className="mb-4 flex gap-2">
        <Button variant="outline" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Connect Google Calendar
        </Button>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Connect Apple Calendar
        </Button>
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'month' && (
          <motion.div
            key="month"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col"
          >
            {renderCalendarGrid()}
          </motion.div>
        )}
        {viewMode === 'week' && (
          <motion.div
            key="week"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1"
          >
            {renderWeekView()}
          </motion.div>
        )}
        {viewMode === 'day' && (
          <motion.div
            key="day"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1"
          >
            {renderDayView()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}