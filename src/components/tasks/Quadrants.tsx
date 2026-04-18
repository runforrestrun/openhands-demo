'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Task, Quadrant } from '@/types';
import { getQuadrantColor, getQuadrantLabel, cn } from '@/lib/utils';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';

interface QuadrantsProps {
  tasks: Task[];
  onAddTask: (quadrant?: Quadrant) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  highlightedTaskId: string | null;
}

export function Quadrants({ 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onCompleteTask,
  highlightedTaskId 
}: QuadrantsProps) {
  const [filterTag, setFilterTag] = React.useState<string>('all');
  const [filterState, setFilterState] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('dueDate');

  const getTasksForQuadrant = (quadrant: Quadrant) => {
    return tasks.filter(task => {
      const { importance, urgency } = task;
      let inQuadrant: boolean;
      
      switch (quadrant) {
        case 'do-first':
          inQuadrant = importance >= 3 && urgency >= 3;
          break;
        case 'schedule':
          inQuadrant = importance >= 3 && urgency < 3;
          break;
        case 'delegate':
          inQuadrant = importance < 3 && urgency >= 3;
          break;
        case 'eliminate':
          inQuadrant = importance < 3 && urgency < 3;
          break;
      }
      
      if (!inQuadrant) return false;
      
      // Filter by tag
      if (filterTag !== 'all' && !task.tags.includes(filterTag)) return false;
      
      // Filter by state
      if (filterState !== 'all' && task.state !== filterState) return false;
      
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const quadrantList: Quadrant[] = ['do-first', 'schedule', 'delegate', 'eliminate'];

  // Get all unique tags for filter
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach(task => task.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [tasks]);

  return (
    <div className="h-full">
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onAddTask()}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-foreground-secondary" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="rounded border border-border bg-surface px-2 py-1 text-sm"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="rounded border border-border bg-surface px-2 py-1 text-sm"
          >
            <option value="all">All States</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-foreground-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-border bg-surface px-2 py-1 text-sm"
            >
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quadrants Grid */}
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {quadrantList.map((quadrant, index) => {
          const color = getQuadrantColor(quadrant);
          const label = getQuadrantLabel(quadrant);
          const quadrantTasks = getTasksForQuadrant(quadrant);
          const newCount = quadrantTasks.filter(t => t.state === 'new').length;
          const inProgressCount = quadrantTasks.filter(t => t.state === 'in-progress').length;

          return (
            <motion.div
              key={quadrant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex min-h-[250px] flex-col rounded-xl border border-border bg-background-secondary p-4"
            >
              {/* Quadrant Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <h3 className="font-heading text-sm font-semibold">{label}</h3>
                  <span 
                    className="rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {quadrantTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddTask(quadrant)}
                  className="h-7 w-7 rounded-full p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Task counts */}
              <div className="mb-3 flex gap-3 text-xs text-foreground-secondary">
                <span>{newCount} new</span>
                <span>{inProgressCount} in progress</span>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 space-y-2 overflow-y-auto pb-2">
                <AnimatePresence>
                  {quadrantTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onComplete={onCompleteTask}
                      isHighlighted={highlightedTaskId === task.id}
                    />
                  ))}
                </AnimatePresence>
                
                {quadrantTasks.length === 0 && (
                  <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-foreground-secondary">
                      No tasks in this quadrant
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}