'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getQuadrantColor, getQuadrantLabel, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const playbackSpeeds = [0.5, 1, 2, 4];

export function HistoryPage() {
  const { 
    tasks, 
    historyEvents, 
    historyStats, 
    selectedDateRange, 
    setSelectedDateRange,
    playbackSpeed,
    setPlaybackSpeed,
    isPlaying,
    setIsPlaying
  } = useAppStore();
  
  const [currentTimeIndex, setCurrentTimeIndex] = React.useState(0);
  const [visibleTasks, setVisibleTasks] = React.useState<string[]>([]);
  
  // Get events sorted by date
  const sortedEvents = React.useMemo(() => {
    return [...historyEvents].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [historyEvents]);

  const completedTasks = React.useMemo(() => {
    return tasks.filter(t => t.state === 'completed');
  }, [tasks]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && sortedEvents.length > 0) {
      interval = setInterval(() => {
        setCurrentTimeIndex((prev) => {
          const next = prev + 1;
          if (next >= sortedEvents.length) {
            setIsPlaying(false);
            return prev;
          }
          
          const event = sortedEvents[next];
          
          // Add task to visible if it's a created event
          if (event.type === 'created') {
            if (!visibleTasks.includes(event.taskId)) {
              setVisibleTasks([...visibleTasks, event.taskId]);
            }
          }
          
          // Remove task from visible if it's a completed event
          if (event.type === 'completed') {
            setVisibleTasks(visibleTasks.filter(id => id !== event.taskId));
          }
          
          return next;
        });
      }, 2000 / playbackSpeed);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, sortedEvents.length]);

  const handlePlay = () => {
    if (currentTimeIndex >= sortedEvents.length - 1) {
      setCurrentTimeIndex(0);
      setVisibleTasks([]);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRewind = () => {
    setCurrentTimeIndex(0);
    setVisibleTasks([]);
    setIsPlaying(false);
  };

  const handleSkipForward = () => {
    setCurrentTimeIndex(Math.min(currentTimeIndex + 1, sortedEvents.length - 1));
  };

  const handleSkipBack = () => {
    setCurrentTimeIndex(Math.max(currentTimeIndex - 1, 0));
  };

  const getSpeedLabel = (speed: number) => {
    return speed === 0.5 ? '0.5x' : speed === 1 ? '1x' : speed === 2 ? '2x' : '4x';
  };

  return (
    <div className="flex h-full flex-col">
      {/* Date Range Picker */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-secondary">From:</span>
          <input
            type="date"
            value={selectedDateRange.start}
            onChange={(e) => setSelectedDateRange({ ...selectedDateRange, start: e.target.value })}
            className="rounded border border-border bg-surface px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-secondary">To:</span>
          <input
            type="date"
            value={selectedDateRange.end}
            onChange={(e) => setSelectedDateRange({ ...selectedDateRange, end: e.target.value })}
            className="rounded border border-border bg-surface px-2 py-1"
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="mb-6 flex items-center justify-center gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleRewind}>
            <Rewind className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSkipBack}>
            <SkipBack className="h-5 w-5" />
          </Button>
          
          {isPlaying ? (
            <Button variant="default" onClick={handlePause}>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          ) : (
            <Button variant="default" onClick={handlePlay}>
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
          )}
          
          <Button variant="ghost" size="icon" onClick={handleSkipForward}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <FastForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          {playbackSpeeds.map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                'rounded px-3 py-1 text-sm font-medium transition-colors',
                playbackSpeed === speed
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground-secondary hover:text-foreground'
              )}
            >
              {getSpeedLabel(speed)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-foreground-secondary">
            {sortedEvents[currentTimeIndex]?.date 
              ? new Date(sortedEvents[currentTimeIndex].date).toLocaleDateString() 
              : 'Start'}
          </span>
          <span className="text-foreground-secondary">
            Event {currentTimeIndex + 1} of {sortedEvents.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentTimeIndex + 1) / sortedEvents.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Event */}
      <AnimatePresence mode="wait">
        {sortedEvents[currentTimeIndex] && (
          <motion.div
            key={currentTimeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              {sortedEvents[currentTimeIndex].toQuadrant && (
                <div 
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: getQuadrantColor(sortedEvents[currentTimeIndex].toQuadrant!) }}
                />
              )}
              <div>
                <p className="font-medium">
                  {sortedEvents[currentTimeIndex].type === 'created' && 'Task Created'}
                  {sortedEvents[currentTimeIndex].type === 'completed' && 'Task Completed'}
                  {sortedEvents[currentTimeIndex].type === 'moved' && 'Task Moved'}
                  {sortedEvents[currentTimeIndex].type === 'edited' && 'Task Edited'}
                </p>
                <p className="text-sm text-foreground-secondary">
                  {new Date(sortedEvents[currentTimeIndex].date).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats by Quadrant */}
      <div className="mt-auto">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
          <BarChart3 className="h-5 w-5" />
          Completion Statistics
        </h3>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {historyStats.map((stat) => (
            <motion.div
              key={stat.quadrant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: getQuadrantColor(stat.quadrant) }}
                />
                <span className="font-medium">
                  {getQuadrantLabel(stat.quadrant)}
                </span>
              </div>
              <div className="text-3xl font-bold">{stat.count}</div>
              <div className="text-sm text-foreground-secondary">
                {stat.percentage}% of total
              </div>
              <div className="mt-2 h-2 rounded-full bg-background-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getQuadrantColor(stat.quadrant) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <div className="text-center">
            <span className="text-2xl font-bold text-green-500">
              {completedTasks.length}
            </span>
            <span className="text-foreground-secondary"> / {tasks.length}</span>
            <p className="text-sm text-foreground-secondary">
              Tasks completed in selected period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}