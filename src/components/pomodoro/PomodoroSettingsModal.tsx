import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sliders, AlertCircle } from 'lucide-react';
import { PomodoroSettings } from '../../types/productivity';
import { PomodoroSettingsFormSchema, PomodoroSettingsFormData } from '../../lib/schemas';

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
}

export const PomodoroSettingsModal: React.FC<PomodoroSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PomodoroSettingsFormData>({
    resolver: zodResolver(PomodoroSettingsFormSchema),
    defaultValues: {
      focusDuration: settings.focusDuration,
      shortBreakDuration: settings.shortBreakDuration,
      longBreakDuration: settings.longBreakDuration,
      longBreakInterval: settings.longBreakInterval,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        focusDuration: settings.focusDuration,
        shortBreakDuration: settings.shortBreakDuration,
        longBreakDuration: settings.longBreakDuration,
        longBreakInterval: settings.longBreakInterval,
      });
    }
  }, [isOpen, settings, reset]);

  const onValidSubmit = (data: PomodoroSettingsFormData) => {
    onSave({
      focusDuration: data.focusDuration,
      shortBreakDuration: data.shortBreakDuration,
      longBreakDuration: data.longBreakDuration,
      longBreakInterval: data.longBreakInterval,
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
            aria-label="Pomodoro Timer Settings"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Pomodoro Settings
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
              {(errors.focusDuration || errors.shortBreakDuration || errors.longBreakDuration || errors.longBreakInterval) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                  <span>
                    {errors.focusDuration?.message ||
                      errors.shortBreakDuration?.message ||
                      errors.longBreakDuration?.message ||
                      errors.longBreakInterval?.message}
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="focus-dur" className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Focus Duration (Minutes)
                </label>
                <input
                  id="focus-dur"
                  type="number"
                  min={1}
                  max={120}
                  {...register('focusDuration', { valueAsNumber: true })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="short-dur" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Short Break (Mins)
                  </label>
                  <input
                    id="short-dur"
                    type="number"
                    min={1}
                    max={60}
                    {...register('shortBreakDuration', { valueAsNumber: true })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="long-dur" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Long Break (Mins)
                  </label>
                  <input
                    id="long-dur"
                    type="number"
                    min={1}
                    max={90}
                    {...register('longBreakDuration', { valueAsNumber: true })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="long-interval" className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Long Break Interval (Sessions)
                </label>
                <input
                  id="long-interval"
                  type="number"
                  min={1}
                  max={12}
                  {...register('longBreakInterval', { valueAsNumber: true })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
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
                  Save Settings
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
