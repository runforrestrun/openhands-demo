'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, History, Settings, Command } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onCreateTask: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export function CommandPalette({ isOpen, onClose, onNavigate, onCreateTask }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { tasks } = useAppStore();

  const commands: CommandItem[] = React.useMemo(() => {
    const items: CommandItem[] = [
      {
        id: 'create-task',
        label: 'Create New Task',
        icon: <Plus className="h-4 w-4" />,
        action: () => { onCreateTask(); onClose(); },
        keywords: ['new', 'add', 'task', 'create'],
      },
      {
        id: 'go-tasks',
        label: 'Go to Tasks',
        icon: <Search className="h-4 w-4" />,
        action: () => { onNavigate('tasks'); onClose(); },
        keywords: ['tasks', 'home', 'dashboard'],
      },
      {
        id: 'go-calendar',
        label: 'Go to Calendar',
        icon: <Calendar className="h-4 w-4" />,
        action: () => { onNavigate('schedule'); onClose(); },
        keywords: ['calendar', 'schedule', 'events'],
      },
      {
        id: 'go-history',
        label: 'Go to History',
        icon: <History className="h-4 w-4" />,
        action: () => { onNavigate('history'); onClose(); },
        keywords: ['history', 'timeline', 'stats'],
      },
      {
        id: 'go-settings',
        label: 'Go to Settings',
        icon: <Settings className="h-4 w-4" />,
        action: () => { onNavigate('settings'); onClose(); },
        keywords: ['settings', 'preferences', 'config'],
      },
    ];

    // Add recent tasks that can be searched
    tasks.slice(0, 5).forEach((task) => {
      items.push({
        id: `task-${task.id}`,
        label: `Search: ${task.title}`,
        icon: <Search className="h-4 w-4" />,
        action: () => { onClose(); },
        keywords: [task.title, ...task.tags],
      });
    });

    return items;
  }, [tasks, onNavigate, onCreateTask, onClose]);

  const filteredCommands = React.useMemo(() => {
    if (!query) return commands.slice(0, 8);
    
    const lowerQuery = query.toLowerCase();
    return commands.filter((cmd) => 
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    ).slice(0, 8);
  }, [commands, query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="command-palette-backdrop fixed inset-0 z-50 flex items-start justify-center px-4 pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Search className="h-5 w-5 text-foreground-secondary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, tasks..."
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-secondary"
                autoFocus
              />
              <kbd className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground-secondary">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-foreground-secondary">
                  No results found
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => command.action()}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                      selectedIndex === index
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-background'
                    )}
                  >
                    {command.icon}
                    <span className="flex-1">{command.label}</span>
                    {selectedIndex === index && (
                      <kbd className="text-xs opacity-70">
                        <Command className="mr-1 inline h-3 w-3" /> Enter
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-foreground-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-background px-1">↑</kbd>
                  <kbd className="rounded border border-border bg-background px-1">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-background px-1">↵</kbd>
                  <span>Select</span>
                </span>
              </div>
              <span>Compass</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manage command palette
export function useCommandPalette(onNavigate: (page: string) => void, onCreateTask: () => void) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    setIsOpen,
    CommandPalette: (
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={onNavigate}
        onCreateTask={onCreateTask}
      />
    ),
  };
}