import React from 'react';
import { Layers, CircleHelp } from 'lucide-react';
import { StudyMode } from '../../types/study';

interface ModeSelectorProps {
  mode: StudyMode;
  onChange: (mode: StudyMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange, disabled }) => {
  return (
    <div
      role="radiogroup"
      aria-label="Study Generation Mode"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
    >
      {/* Flashcards Option */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'flashcards'}
        disabled={disabled}
        onClick={() => onChange('flashcards')}
        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
          mode === 'flashcards'
            ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
            : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`p-2 rounded-lg transition-colors ${
            mode === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-xs sm:text-sm ${
                mode === 'flashcards'
                  ? 'text-indigo-950 dark:text-white'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              Interactive Flashcards
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[var(--muted)] truncate mt-0.5">
            Active recall with 3D flip cards & memory triggers
          </p>
        </div>
      </button>

      {/* Quiz Option */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'quiz'}
        disabled={disabled}
        onClick={() => onChange('quiz')}
        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
          mode === 'quiz'
            ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
            : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`p-2 rounded-lg transition-colors ${
            mode === 'quiz'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <CircleHelp className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-xs sm:text-sm ${
                mode === 'quiz'
                  ? 'text-indigo-950 dark:text-white'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              Interactive Quiz
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[var(--muted)] truncate mt-0.5">
            Timed knowledge assessment with instant feedback
          </p>
        </div>
      </button>
    </div>
  );
};
