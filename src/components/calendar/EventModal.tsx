import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { StudyEvent, StudyEventType } from '../../types/productivity';
import { getTodayDateString } from '../../lib/storage';

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
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate || getTodayDateString());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [type, setType] = useState<StudyEventType>('study');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDate(initialEvent.date);
      setStartTime(initialEvent.startTime || '10:00');
      setEndTime(initialEvent.endTime || '11:30');
      setType(initialEvent.type);
      setDescription(initialEvent.description || '');
    } else {
      setTitle('');
      setDate(selectedDate || getTodayDateString());
      setStartTime('10:00');
      setEndTime('11:30');
      setType('study');
      setDescription('');
    }
    setError(null);
  }, [initialEvent, selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (!date) {
      setError('Please specify a date.');
      return;
    }

    onSubmit({
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      type,
      description: description.trim() || undefined,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={initialEvent ? 'Edit Study Event' : 'Schedule Study Event'}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {initialEvent ? 'Edit Study Event' : 'Schedule Study Event'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="event-title" className="font-semibold text-slate-300 block">
              Event Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="event-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems Final Review"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="event-date" className="font-semibold text-slate-300 block">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                id="event-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="event-type" className="font-semibold text-slate-300 block">
                Event Type
              </label>
              <select
                id="event-type"
                value={type}
                onChange={(e) => setType(e.target.value as StudyEventType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="study">Study Session</option>
                <option value="assignment">Assignment</option>
                <option value="exam">Exam / Quiz</option>
                <option value="deadline">Project Deadline</option>
                <option value="other">Other Event</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="event-start" className="font-semibold text-slate-300 block">
                Start Time
              </label>
              <input
                id="event-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="event-end" className="font-semibold text-slate-300 block">
                End Time
              </label>
              <input
                id="event-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="event-desc" className="font-semibold text-slate-300 block">
              Description / Notes (Optional)
            </label>
            <textarea
              id="event-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What modules or chapters will you cover?"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
      </div>
    </div>
  );
};
