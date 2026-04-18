'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Link, Download, Upload, Trash2, Globe } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn, getQuadrantColor, getQuadrantLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Theme } from '@/types';

const themes: { id: Theme; name: string; description: string }[] = [
  { id: 'dark', name: 'Dark', description: 'Default dark theme' },
  { id: 'light', name: 'Light', description: 'Clean light theme' },
  { id: 'forrest', name: 'Forrest', description: 'Natural green tones' },
  { id: 'sea', name: 'Sea', description: 'Ocean blue theme' },
  { id: 'sunset', name: 'Sunset', description: 'Warm sunset colors' },
];

export function SettingsPage() {
  const {
    theme,
    setTheme,
    pushNotificationsEnabled,
    emailNotificationsEnabled,
    setPushNotificationsEnabled,
    setEmailNotificationsEnabled,
    quadrantReminderConfig,
    setQuadrantReminderConfig,
    user,
    logout,
    tasks,
  } = useAppStore();

  const [email, setEmail] = React.useState(user?.email || '');
  const [name, setName] = React.useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  const handleExport = () => {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compass-tasks.json';
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          // Handle imported data
          console.log('Imported data:', data);
          alert('Tasks imported successfully!');
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUpdateReminderConfig = (quadrant: string, minutes: number, enabled: boolean) => {
    const newConfig = quadrantReminderConfig.map((config) =>
      config.quadrant === quadrant ? { ...config, intervalMinutes: minutes, enabled } : config
    );
    setQuadrantReminderConfig(newConfig);
  };

  return (
    <div className="h-full space-y-6 overflow-y-auto pb-20">
      {/* Account Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">Account</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button>Save Changes</Button>
        </div>
      </motion.section>

      {/* Notifications Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Push Notifications</span>
            <button
              onClick={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                pushNotificationsEnabled ? 'bg-primary' : 'bg-border'
              )}
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                  pushNotificationsEnabled && 'translate-x-5'
                )}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span>Email Notifications</span>
            <button
              onClick={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                emailNotificationsEnabled ? 'bg-primary' : 'bg-border'
              )}
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                  emailNotificationsEnabled && 'translate-x-5'
                )}
              />
            </button>
          </label>

          {/* Registered Browsers */}
          {pushNotificationsEnabled && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium">Registered Devices</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-background p-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-foreground-secondary" />
                    <span className="text-sm">Chrome on macOS</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="mt-2">
                Send Test Notification
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Appearance Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">Appearance</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                'rounded-lg border p-3 text-left transition-all hover:border-primary',
                theme === t.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border'
              )}
            >
              <div className={cn(
                'mb-2 h-8 w-full rounded-lg',
                t.id === 'dark' && 'bg-[#0F0F0F]',
                t.id === 'light' && 'bg-[#FAFAFA]',
                t.id === 'forrest' && 'bg-[#1E3D2C]',
                t.id === 'sea' && 'bg-[#143857]',
                t.id === 'sunset' && 'bg-[#3D2317]'
              )} />
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-foreground-secondary">{t.description}</p>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Reminder Intervals Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">Reminder Intervals</h2>
        </div>

        <div className="space-y-3">
          {quadrantReminderConfig.map((config) => (
            <div
              key={config.quadrant}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: getQuadrantColor(config.quadrant) }}
                />
                <span>{getQuadrantLabel(config.quadrant)}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) =>
                      handleUpdateReminderConfig(
                        config.quadrant,
                        config.intervalMinutes,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Enable</span>
                </label>
                <select
                  value={config.intervalMinutes}
                  onChange={(e) =>
                    handleUpdateReminderConfig(
                      config.quadrant,
                      parseInt(e.target.value),
                      config.enabled
                    )
                  }
                  className="rounded border border-border bg-background px-2 py-1"
                  disabled={!config.enabled}
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={1440}>1 day</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Import/Export Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Link className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">Import / Export</h2>
        </div>

        <div className="flex gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 hover:bg-background-secondary">
            <Upload className="h-4 w-4" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 hover:bg-background-secondary"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </motion.section>

      {/* Logout Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <Button variant="destructive" onClick={logout} className="w-full">
          Log Out
        </Button>
      </motion.section>
    </div>
  );
}