import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { StudyEvent } from '../../types/productivity';
import { getTodayDateString } from '../../lib/storage';
import { EventFormSchema, EventFormData } from '../../lib/schemas';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<StudyEvent, 'id'>) => void;
  initialEvent?: StudyEvent | null;
  selectedDate?: string;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEvent,
  selectedDate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: '',
      date: selectedDate || getTodayDateString(),
      startTime: '10:00',
      endTime: '11:30',
      type: 'study',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        reset({
          title: initialEvent.title,
          date: initialEvent.date,
          startTime: initialEvent.startTime || '10:00',
          endTime: initialEvent.endTime || '11:30',
          type: initialEvent.type,
          description: initialEvent.description || '',
        });
      } else {
        reset({
          title: '',
          date: selectedDate || getTodayDateString(),
          startTime: '10:00',
          endTime: '11:30',
          type: 'study',
          description: '',
        });
      }
    }
  }, [initialEvent, selectedDate, isOpen, reset]);

  const onValidSubmit = (data: EventFormData) => {
    onSubmit({
      title: data.title.trim(),
      date: data.date,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
      type: data.type,
      description: data.description?.trim() || undefined,
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
            aria-label={initialEvent ? 'Edit Study Event' : 'Schedule Study Event'}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {initialEvent ? 'Edit Study Event' : 'Schedule Study Event'}
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
                <label htmlFor="event-title" className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Event Title <span className="text-rose-500 dark:text-rose-400">*</span>
                </label>
                <input
                  id="event-title"
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Operating Systems Final Review"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="event-date" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Date <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    {...register('date')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  {errors.date && (
                    <p className="text-[11px] text-rose-500">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="event-type" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Event Type
                  </label>
                  <select
                    id="event-type"
                    {...register('type')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="study">Study Session</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam / Test</option>
                    <option value="deadline">Deadline</option>
                    <option value="other">Other Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="start-time" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Start Time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    {...register('startTime')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="end-time" className="font-semibold text-slate-700 dark:text-slate-300 block">
                    End Time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    {...register('endTime')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="event-desc" className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Description / Study Plan (Optional)
                </label>
                <textarea
                  id="event-desc"
                  rows={3}
                  {...register('description')}
                  placeholder="Outline topics, chapters, or practice problems to complete..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
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
                  {initialEvent ? 'Save Changes' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
