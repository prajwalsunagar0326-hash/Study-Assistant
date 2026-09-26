import React, { useState } from 'react';
import { X, Sliders, AlertCircle } from 'lucide-react';
import { PomodoroSettings } from '../../types/productivity';

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
  const [focus, setFocus] = useState(settings.focusDuration);
  const [shortBreak, setShortBreak] = useState(settings.shortBreakDuration);
  const [longBreak, setLongBreak] = useState(settings.longBreakDuration);
  const [interval, setInterval] = useState(settings.longBreakInterval);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (focus < 1 || shortBreak < 1 || longBreak < 1) {
      setError('Interval durations must be at least 1 minute.');
      return;
    }

    onSave({
      focusDuration: focus,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
      longBreakInterval: interval,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pomodoro Timer Settings"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Pomodoro Settings
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
            <label htmlFor="focus-dur" className="font-semibold text-slate-300 block">
              Focus Duration (Minutes)
            </label>
            <input
              id="focus-dur"
              type="number"
              min={1}
              max={90}
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="short-dur" className="font-semibold text-slate-300 block">
                Short Break (Mins)
              </label>
              <input
                id="short-dur"
                type="number"
                min={1}
                max={30}
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="long-dur" className="font-semibold text-slate-300 block">
                Long Break (Mins)
              </label>
              <input
                id="long-dur"
                type="number"
                min={1}
                max={60}
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="long-interval" className="font-semibold text-slate-300 block">
              Long Break Interval (Sessions)
            </label>
            <input
              id="long-interval"
              type="number"
              min={1}
              max={12}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
