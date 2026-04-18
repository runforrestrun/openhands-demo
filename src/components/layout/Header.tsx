'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut, Sun, Moon, Trash2, Mail, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export function Header() {
  const { theme, setTheme, notifications, markNotificationRead, setHighlightedTaskId, highlightedTaskId, setSelectedQuadrant } = useAppStore();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notificationId: string, taskId: string) => {
    markNotificationRead(notificationId);
    setHighlightedTaskId(taskId);
    setSelectedQuadrant(null);
    setShowNotifications(false);
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedTaskId(null);
    }, 3000);
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('forrest');
    else if (theme === 'forrest') setTheme('sea');
    else if (theme === 'sea') setTheme('sunset');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'forrest': return <span className="text-xl">🌲</span>;
      case 'sea': return <span className="text-xl">🌊</span>;
      case 'sunset': return <span className="text-xl">🌅</span>;
      default: return <Moon className="h-5 w-5" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'push': return <span className="text-xs">🔔</span>;
      case 'email': return <Mail className="h-3 w-3" />;
      case 'both': return <Check className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <span className="font-heading text-xl font-bold text-foreground">Compass</span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10 rounded-full">
            {getThemeIcon()}
          </Button>

          {/* Notifications Bell */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                'h-10 w-10 rounded-full relative',
                showNotifications && 'bg-surface'
              )}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-auto rounded-lg border border-border bg-surface p-2 shadow-lg"
                >
                  <div className="mb-2 px-2 py-1">
                    <h3 className="font-heading text-sm font-semibold">Notifications</h3>
                  </div>
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.taskId)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-background',
                        !notification.read && 'bg-background/50'
                      )}
                    >
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        notification.type === 'push' && 'bg-primary/20',
                        notification.type === 'email' && 'bg-secondary/20',
                        notification.type === 'both' && 'bg-green-500/20'
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'truncate text-sm font-medium',
                          !notification.read && 'text-foreground'
                        )}>
                          {notification.title}
                        </p>
                        <p className="truncate text-xs text-foreground-secondary">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-foreground-secondary">
                          {formatDate(notification.sentAt, 'time')}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(!showProfile)}
              className={cn(
                'h-10 w-10 rounded-full',
                showProfile && 'bg-surface'
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-surface p-1 shadow-lg"
                >
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-background">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-background">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}