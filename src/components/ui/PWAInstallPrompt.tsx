'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PWAInstallPromptProps {
  onDismiss: () => void;
}

export function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleInstall = async () => {
    // Trigger PWA install
    if ('serviceWorker' in navigator) {
      // The actual install would be triggered by the service worker
      // but for demo purposes, we'll show browser-specific instructions
    }
    setIsVisible(false);
    onDismiss();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-surface p-4 shadow-lg md:bottom-4 md:left-auto md:right-4 md:w-80"
      >
        {/* Arrow pointing down (for iOS) */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform md:left-4 md:translate-x-0">
          <Download className="h-4 w-4 rotate-180 text-primary" />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="font-heading font-semibold">Install Compass</h3>
            <p className="mt-1 text-sm text-foreground-secondary">
              Add to home screen for the best experience
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-background"
          >
            <X className="h-4 w-4 text-foreground-secondary" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={handleInstall} className="flex-1">
            <Download className="mr-1 h-4 w-4" />
            Install
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Not now
          </Button>
        </div>

        <p className="mt-2 text-xs text-foreground-secondary">
          Tap <Command className="inline h-3 w-3" /> Share → Add to Home Screen (iOS)
        </p>
      </motion.div>
    </AnimatePresence>
  );
}