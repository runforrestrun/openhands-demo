'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Apple } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const { login, isAuthenticated } = useAppStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid credentials');
      }
    }, 500);
  };

  const handleDemoLogin = () => {
    setEmail('a@x.nl');
    setPassword('secret123');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-heading text-2xl font-bold">Compass</span>
          </div>

          <h1 className="mb-2 font-heading text-3xl font-bold">Welcome back</h1>
          <p className="mb-8 text-foreground-secondary">
            Sign in to navigate your priorities
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-secondary" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-secondary" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-foreground-secondary">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social Login - placeholder for demo */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full gap-2" disabled>
              Sign in with Google (coming soon)
            </Button>
            <Button variant="outline" className="w-full gap-2" disabled>
              Sign in with Apple
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-foreground-secondary">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:underline">
              Sign up
            </a>
          </p>

          {/* Demo button */}
          <div className="mt-8 rounded-lg border border-border bg-surface p-4">
            <p className="mb-2 text-sm text-foreground-secondary">
              Demo credentials:
            </p>
            <Button variant="outline" onClick={handleDemoLogin} className="w-full gap-2">
              Use demo user (a@x.nl / secret123)
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Info (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden hidden flex-col justify-center bg-gradient-to-br from-primary/20 to-secondary/20 px-16 md:flex md:w-1/2"
      >
        <div className="max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 font-heading text-4xl font-bold"
          >
            Navigate Your Priorities
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-lg text-foreground-secondary"
          >
            Compass helps you understand the difference between what's important 
            and what's urgent using the Eisenhower Matrix.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-quadrant-do-first">
                <span className="text-white">1</span>
              </div>
              <div>
                <h3 className="font-heading font-semibold">Do First</h3>
                <p className="text-sm text-foreground-secondary">
                  Important & Urgent - Do these now
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-quadrant-schedule">
                <span className="text-black">2</span>
              </div>
              <div>
                <h3 className="font-heading font-semibold">Schedule</h3>
                <p className="text-sm text-foreground-secondary">
                  Important, Not Urgent - Plan for later
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-quadrant-delegate">
                <span className="text-white">3</span>
              </div>
              <div>
                <h3 className="font-heading font-semibold">Delegate</h3>
                <p className="text-sm text-foreground-secondary">
                  Not Important, Urgent - Assign to others
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-quadrant-eliminate">
                <span className="text-black">4</span>
              </div>
              <div>
                <h3 className="font-heading font-semibold">Eliminate</h3>
                <p className="text-sm text-foreground-secondary">
                  Not Important, Not Urgent - Remove these
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}