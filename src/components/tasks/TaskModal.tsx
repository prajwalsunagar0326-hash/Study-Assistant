import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, AlertCircle } from 'lucide-react';
import { Task } from '../../types/productivity';
import { getTodayDateString } from '../../lib/storage';
import { TaskFormSchema, TaskFormData } from '../../lib/schemas';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: getTodayDateString(),
      category: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        reset({
          title: initialTask.title,
          description: initialTask.description || '',
          priority: initialTask.priority,
          dueDate: initialTask.dueDate || getTodayDateString(),
          category: initialTask.category || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: getTodayDateString(),
          category: '',
        });
      }
    }
  }, [initialTask, isOpen, reset]);

  const onValidSubmit = (data: TaskFormData) => {
    onSubmit({
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      category: data.category?.trim() || 'General',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={initialTask ? 'Edit Task' : 'Create New Study Task'}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {initialTask ? 'Edit Task' : 'Create New Study Task'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4 text-xs sm:text-sm">
              {errors.title && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                  <span>{errors.title.message}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="task-title" className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Task Title <span className="text-rose-500 dark:text-rose-400">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Solve DBMS BCNF Practice Problems"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="task-desc" className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Description (Optional)
                </label>
                <textarea
                  id="task-desc"
                  rows={3}
                  {...register('description')}
                  placeholder="Add key notes, reference pages, or checklist items..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="task-priority" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    {...register('priority')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="task-due" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Due Date
                  </label>
                  <input
                    id="task-due"
                    type="date"
                    {...register('dueDate')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="task-cat" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Course / Subject
                  </label>
                  <input
                    id="task-cat"
                    type="text"
                    {...register('category')}
                    placeholder="e.g. Operating Systems"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary text-xs sm:text-sm px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs sm:text-sm px-5 py-2"
                >
                  {initialTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
