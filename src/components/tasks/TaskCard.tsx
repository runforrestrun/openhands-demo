'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, GripVertical, Check, Circle, Clock } from 'lucide-react';
import { Task, Quadrant } from '@/types';
import { cn, getQuadrantColor, formatDate, isToday, isPast } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isHighlighted?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onComplete, isHighlighted }: TaskCardProps) {
  const [showActions, setShowActions] = React.useState(false);

  const getQuadrant = (): Quadrant => {
    if (task.importance >= 3 && task.urgency >= 3) return 'do-first';
    if (task.importance >= 3 && task.urgency < 3) return 'schedule';
    if (task.importance < 3 && task.urgency >= 3) return 'delegate';
    return 'eliminate';
  };

  const quadrant = getQuadrant();
  const color = getQuadrantColor(quadrant);
  const isOverdue = task.dueDate && isPast(task.dueDate) && task.state !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isHighlighted 
          ? `0 0 20px ${color}40, 0 4px 12px rgba(0,0,0,0.15)` 
          : '0 4px 12px rgba(0,0,0,0.15)'
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative cursor-grab rounded-lg border border-border bg-surface p-3 transition-all active:cursor-grabbing',
        task.state === 'completed' && 'opacity-70',
        isHighlighted && 'ring-2',
        'hover:shadow-md'
      )}
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* State indicator */}
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => task.state !== 'completed' && onComplete(task.id)}
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full transition-colors',
            task.state === 'completed' 
              ? 'bg-green-500 text-white' 
              : 'border-2 border-foreground-secondary hover:border-green-500'
          )}
        >
          {task.state === 'completed' && <Check className="h-3 w-3" />}
          {task.state === 'in-progress' && <Clock className="h-3 w-3 text-blue-500" />}
        </button>
        <span className={cn(
          'text-caption font-medium uppercase',
          task.state === 'completed' ? 'text-green-500' : 
          task.state === 'in-progress' ? 'text-blue-500' : 'text-foreground-secondary'
        )}>
          {task.state === 'new' ? 'New' : 
           task.state === 'in-progress' ? 'In Progress' : 'Done'}
        </span>
      </div>

      {/* Title */}
      <h4 className={cn(
        'mb-1 line-clamp-2 font-heading text-sm font-medium',
        task.state === 'completed' && 'line-through text-foreground-secondary'
      )}>
        {task.title}
      </h4>

      {/* Due date badge */}
      {task.dueDate && (
        <div className={cn(
          'flex items-center gap-1 text-xs',
          isOverdue ? 'text-red-500' : 'text-foreground-secondary'
        )}>
          <Clock className="h-3 w-3" />
          <span>{formatDate(task.dueDate, isToday(task.dueDate) ? 'time' : 'short')}</span>
          {isOverdue && task.state !== 'completed' && (
            <span className="ml-1 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
              LATE
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-background px-1.5 py-0.5 text-[10px] text-foreground-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions (visible on hover) */}
      {showActions && task.state !== 'completed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -right-2 -top-2 flex gap-1 rounded-lg bg-surface p-1 shadow-md"
        >
          <button
            onClick={() => onEdit(task)}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-background"
          >
            <Pencil className="h-3.5 w-3.5 text-foreground-secondary" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </button>
        </motion.div>
      )}

      {/* Grip handle */}
      {showActions && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-30">
          <GripVertical className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}