'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="h-5 w-5" /> },
  { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-5 w-5" /> },
  { id: 'history', label: 'History', icon: <History className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-16 bottom-0 z-30 hidden w-20 flex-col border-r border-border bg-background md:flex lg:w-56">
        <div className="flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:bg-surface',
                activeTab === item.id && 'bg-surface shadow-sm'
              )}
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground-secondary'
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'hidden text-sm font-medium lg:block',
                activeTab === item.id ? 'text-foreground' : 'text-foreground-secondary'
              )}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile/Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-border bg-background md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors',
              activeTab === item.id ? 'text-primary' : 'text-foreground-secondary'
            )}
          >
            <motion.div
              animate={{ scale: activeTab === item.id ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {item.icon}
            </motion.div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}