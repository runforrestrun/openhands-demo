'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Calendar, Clock, Repeat, Bell, ArrowRight } from 'lucide-react';
import { Task, Quadrant, ReminderOption, RepeatOption, MoveToUrgentOption } from '@/types';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn, getQuadrantColor, getQuadrantLabel, getQuadrantFromImportanceUrgency } from '@/lib/utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editTask?: Task | null;
}

const steps = [
  { id: 1, label: 'Title & Description' },
  { id: 2, label: 'Importance' },
  { id: 3, label: 'Urgency' },
  { id: 4, label: 'Due Date & Repeat' },
  { id: 5, label: 'Auto-Move' },
];

export function CreateTaskModal({ isOpen, onClose, onSave, editTask }: CreateTaskModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [direction, setDirection] = React.useState(0);
  
  // Form state
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [importance, setImportance] = React.useState(2);
  const [urgency, setUrgency] = React.useState(2);
  const [dueDate, setDueDate] = React.useState('');
  const [dueTime, setDueTime] = React.useState('17:00');
  const [repeat, setRepeat] = React.useState<RepeatOption>('none');
  const [repeatEndDate, setRepeatEndDate] = React.useState('');
  const [repeatDays, setRepeatDays] = React.useState<number[]>([]);
  const [isAllDay, setIsAllDay] = React.useState(false);
  const [reminder, setReminder] = React.useState<ReminderOption>('none');
  const [reminderCustomMinutes, setReminderCustomMinutes] = React.useState(60);
  const [moveToUrgentBy, setMoveToUrgentBy] = React.useState<MoveToUrgentOption>('none');
  const [moveToUrgentByTaskIds, setMoveToUrgentByTaskIds] = React.useState<string[]>([]);
  const [moveToUrgentByTime, setMoveToUrgentByTime] = React.useState(60);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState('');

  // Reset form when opening
  React.useEffect(() => {
    if (isOpen && editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setImportance(editTask.importance);
      setUrgency(editTask.urgency);
      setDueDate(editTask.dueDate?.split('T')[0] || '');
      setDueTime(editTask.dueDate?.split('T')[1]?.slice(0, 5) || '17:00');
      setRepeat(editTask.repeat || 'none');
      setRepeatEndDate(editTask.repeatEndDate || '');
      setRepeatDays(editTask.repeatDays || []);
      setIsAllDay(editTask.isAllDay);
      setReminder(editTask.reminder || 'none');
      setReminderCustomMinutes(editTask.reminderCustomMinutes || 60);
      setMoveToUrgentBy(editTask.moveToUrgentBy || 'none');
      setMoveToUrgentByTaskIds(editTask.moveToUrgentByTaskIds || []);
      setMoveToUrgentByTime(editTask.moveToUrgentByTime || 60);
      setTags(editTask.tags);
    } else if (isOpen) {
      // Reset for new task
      setTitle('');
      setDescription('');
      setImportance(2);
      setUrgency(2);
      setDueDate('');
      setDueTime('17:00');
      setRepeat('none');
      setRepeatEndDate('');
      setRepeatDays([]);
      setIsAllDay(false);
      setReminder('none');
      setReminderCustomMinutes(60);
      setMoveToUrgentBy('none');
      setMoveToUrgentByTaskIds([]);
      setMoveToUrgentByTime(60);
      setTags([]);
    }
    setCurrentStep(1);
  }, [isOpen, editTask]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    }
  };

  const handleSave = () => {
    const dueDateString = dueDate ? (isAllDay ? dueDate : `${dueDate}T${dueTime}:00`) : undefined;
    
    onSave({
      title,
      description: description || undefined,
      importance,
      urgency,
      dueDate: dueDateString,
      repeat: repeat === 'none' ? undefined : repeat,
      repeatEndDate: repeatEndDate || undefined,
      repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
      isAllDay,
      reminder,
      reminderCustomMinutes: reminder === 'custom' ? reminderCustomMinutes : undefined,
      moveToUrgentBy,
      moveToUrgentByTaskIds: moveToUrgentBy === 'task_completion' ? moveToUrgentByTaskIds : undefined,
      moveToUrgentByTime: moveToUrgentBy === 'time' ? moveToUrgentByTime : undefined,
      tags,
      state: 'new',
      completedAt: undefined,
    });
    
    onClose();
  };

  const getQuadrant = (): Quadrant => {
    return getQuadrantFromImportanceUrgency(importance, urgency);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
      <ModalHeader>
        <ModalTitle>{editTask ? 'Edit Task' : 'Create New Task'}</ModalTitle>
        <ModalDescription>
          {currentStep === 1 && "Start with what's most important"}
          {currentStep === 2 && "How important is this task to your goals?"}
          {currentStep === 3 && "When does this need to be done?"}
          {currentStep === 4 && "Set a deadline and repetition"}
          {currentStep === 5 && "Automate task movement based on conditions"}
        </ModalDescription>
      </ModalHeader>

      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => goToStep(step.id)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : index + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-surface text-foreground-secondary'
              )}
            >
              {index + 1 < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                step.id
              )}
            </button>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  'h-0.5 w-8 transition-colors',
                  index + 1 < currentStep ? 'bg-green-500' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current quadrant preview */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div 
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: getQuadrantColor(getQuadrant()) }}
        />
        <span className="text-sm font-medium">
          {getQuadrantLabel(getQuadrant())}
        </span>
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <ModalContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Task Title *
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description (optional)
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add more details..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm"
                        >
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalContent>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <ModalContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-heading">
                      How important is this task?
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Does this align with your long-term goals and values?
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setImportance(value)}
                          className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold transition-all',
                            importance === value
                              ? 'bg-primary text-primary-foreground scale-110 shadow-glow'
                              : 'bg-surface text-foreground-secondary hover:bg-background'
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-foreground-secondary">
                    <span>Not Important</span>
                    <span>Very Important</span>
                  </div>

                  <div className="mt-4 rounded-lg bg-surface p-4">
                    <p className="text-sm">
                      {importance === 0 && "This has no connection to your goals."}
                      {importance === 1 && "This has minimal importance to your goals."}
                      {importance === 2 && "This somewhat relates to your goals."}
                      {importance === 3 && "This is moderately important to your goals."}
                      {importance === 4 && "This is quite important to your goals."}
                      {importance === 5 && "This is critical to your long-term success!"}
                    </p>
                  </div>
                </div>
              </ModalContent>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <ModalContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-heading">
                      How urgent is this task?
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Does this require immediate attention?
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setUrgency(value)}
                          className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold transition-all',
                            urgency === value
                              ? 'bg-secondary text-secondary-foreground scale-110 shadow-glow-secondary'
                              : 'bg-surface text-foreground-secondary hover:bg-background'
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-foreground-secondary">
                    <span>Not Urgent</span>
                    <span>Very Urgent</span>
                  </div>

                  <div className="mt-4 rounded-lg bg-surface p-4">
                    <p className="text-sm">
                      {urgency === 0 && "This can wait indefinitely."}
                      {urgency === 1 && "No time pressure on this."}
                      {urgency === 2 && "Somewhat time-sensitive."}
                      {urgency === 3 && "Needs attention soon."}
                      {urgency === 4 && "Should be done soon."}
                      {urgency === 5 && "Requires immediate action!"}
                    </p>
                  </div>
                </div>
              </ModalContent>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <ModalContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    {!isAllDay && (
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium">
                          Time
                        </label>
                        <Input
                          type="time"
                          value={dueTime}
                          onChange={(e) => setDueTime(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">All-day task</span>
                  </label>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Repeat</label>
                    <select
                      value={repeat}
                      onChange={(e) => setRepeat(e.target.value as RepeatOption)}
                      className="w-full rounded border border-border bg-surface px-3 py-2"
                    >
                      <option value="none">No repeat</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {repeat === 'weekly' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">Days</label>
                      <div className="flex gap-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <button
                            key={day}
                            onClick={() => {
                              if (repeatDays.includes(index)) {
                                setRepeatDays(repeatDays.filter(d => d !== index));
                              } else {
                                setRepeatDays([...repeatDays, index]);
                              }
                            }}
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded text-xs',
                              repeatDays.includes(index)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-surface text-foreground-secondary'
                            )}
                          >
                            {day[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {repeat !== 'none' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Repeat Until
                      </label>
                      <Input
                        type="date"
                        value={repeatEndDate}
                        onChange={(e) => setRepeatEndDate(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Remind Me
                    </label>
                    <select
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value as ReminderOption)}
                      className="w-full rounded border border-border bg-surface px-3 py-2"
                    >
                      <option value="none">No reminder</option>
                      <option value="at_due">At due date</option>
                      <option value="5min">5 minutes before</option>
                      <option value="15min">15 minutes before</option>
                      <option value="30min">30 minutes before</option>
                      <option value="1hour">1 hour before</option>
                      <option value="2hours">2 hours before</option>
                      <option value="1day">1 day before</option>
                      <option value="2days">2 days before</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {reminder === 'custom' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Custom reminder (minutes before)
                      </label>
                      <Input
                        type="number"
                        value={reminderCustomMinutes}
                        onChange={(e) => setReminderCustomMinutes(parseInt(e.target.value) || 60)}
                        min={1}
                      />
                    </div>
                  )}
                </div>
              </ModalContent>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <ModalContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-heading">
                      Move to Important & Urgent
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      When should this task become urgent?
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Trigger
                    </label>
                    <select
                      value={moveToUrgentBy}
                      onChange={(e) => setMoveToUrgentBy(e.target.value as MoveToUrgentOption)}
                      className="w-full rounded border border-border bg-surface px-3 py-2"
                    >
                      <option value="none">Manual</option>
                      <option value="task_completion">After task completion</option>
                      <option value="time">After time period</option>
                    </select>
                  </div>

                  {moveToUrgentBy === 'time' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Time period before moving
                      </label>
                      <select
                        value={moveToUrgentByTime}
                        onChange={(e) => setMoveToUrgentByTime(parseInt(e.target.value))}
                        className="w-full rounded border border-border bg-surface px-3 py-2"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={1440}>1 day</option>
                        <option value={2880}>2 days</option>
                      </select>
                    </div>
                  )}

                  <div className="mt-4 rounded-lg bg-surface p-4">
                    <p className="text-sm text-foreground-secondary">
                      <ArrowRight className="mr-2 inline h-4 w-4" />
                      This task will automatically move to the "Do First" quadrant when the condition is met.
                    </p>
                  </div>
                </div>
              </ModalContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        {currentStep < steps.length ? (
          <Button onClick={nextStep} disabled={currentStep === 1 && !title.trim()}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Check className="mr-1 h-4 w-4" />
            Create Task
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}