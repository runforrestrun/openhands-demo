'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { TasksPage } from '@/components/pages/TasksPage';
import { CalendarPage } from '@/components/pages/CalendarPage';
import { HistoryPage } from '@/components/pages/HistoryPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { LoginPage } from '@/components/pages/LoginPage';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { useCommandPalette } from '@/components/ui/CommandPalette';

export default function AppLayout() {
  const { isAuthenticated, theme, installPromptDismissed, setInstallPromptDismissed } = useAppStore();
  const [activeTab, setActiveTab] = React.useState('tasks');
  const [showCreateTask, setShowCreateTask] = React.useState(false);

  const { isOpen: isPaletteOpen, setIsOpen: setPaletteOpen, CommandPalette } = useCommandPalette(
    (page) => setActiveTab(page),
    () => setShowCreateTask(true)
  );

  // Apply theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Theme attributes */}
      <div data-theme={theme} />
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 pb-16 md:pb-0 md:pl-20 lg:pl-56">
        <div className="h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <TasksPage />
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <CalendarPage />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <HistoryPage />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <SettingsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* PWA Install Prompt */}
      {!installPromptDismissed && (
        <PWAInstallPrompt onDismiss={() => setInstallPromptDismissed(true)} />
      )}

      {/* Command Palette */}
      {CommandPalette}

      {/* Toast Messages - would use a toast component here */}
    </div>
  );
}