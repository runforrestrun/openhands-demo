'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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

    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid credentials. Please try again.');
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
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-heading text-3xl font-bold">Compass</span>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  Sign in with Google
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Sign in with Apple
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a href="#" className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Demo button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Button variant="ghost" onClick={handleDemoLogin} className="w-full text-muted-foreground">
              Use demo credentials (a@x.nl / secret123)
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden md:flex md:w-1/2 bg-muted/30 flex-col justify-center px-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg"
        >
          <h2 className="mb-4 font-heading text-4xl font-bold">
            Navigate Your Priorities
          </h2>
          
          <p className="mb-12 text-lg text-muted-foreground">
            Compass helps you understand the difference between what's important 
            and what's urgent using the Eisenhower Matrix.
          </p>

          <div className="space-y-6">
            {[
              { num: '1', title: 'Do First', desc: 'Important & Urgent - Do these now', color: 'bg-red-500' },
              { num: '2', title: 'Schedule', desc: 'Important, Not Urgent - Plan for later', color: 'bg-yellow-400' },
              { num: '3', title: 'Delegate', desc: 'Not Important, Urgent - Assign to others', color: 'bg-teal-500' },
              { num: '4', title: 'Eliminate', desc: 'Not Important, Not Urgent - Remove these', color: 'bg-green-400' },
            ].map((item, index) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                  <span className={item.num === '2' || item.num === '4' ? 'text-black' : 'text-white'}>{item.num}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}