'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Quadrants } from '@/components/tasks/Quadrants';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { Task } from '@/types';

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, completeTask, highlightedTaskId } = useAppStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = React.useState<string | undefined>();

  const handleAddTask = (quadrant?: string) => {
    setSelectedQuadrant(quadrant);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    showConfetti();
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const showConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '50%';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      document.body.appendChild(confetti);

      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(-${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'ease-out'
      });

      animation.onfinish = () => confetti.remove();
    }
  };

  return (
    <div className="h-full">
      <AnimatePresence>
        <Quadrants
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          highlightedTaskId={highlightedTaskId}
        />
      </AnimatePresence>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        editTask={editingTask}
      />

      {/* Floating Add Button for mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:bottom-4 lg:bottom-4"
        onClick={() => handleAddTask()}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
}