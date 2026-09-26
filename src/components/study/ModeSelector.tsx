import React from 'react';
import { Layers, CircleHelp } from 'lucide-react';
import { StudyMode } from '../../types/study';

interface ModeSelectorProps {
  mode: StudyMode;
  onChange: (mode: StudyMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Study Mode Selection"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {/* Flashcards Option */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'flashcards'}
        disabled={disabled}
        onClick={() => onChange('flashcards')}
        className={`hover-lift glass-stroke-border flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all group ${
          mode === 'flashcards'
            ? 'bg-slate-100/80 dark:bg-white/10 border-slate-400 dark:border-white/40 shadow-md shadow-black/10 dark:shadow-white/5 ring-1 ring-white/20'
            : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-500 hover:bg-[var(--surface-hover)]'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-105 ${
            mode === 'flashcards'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-black/15 dark:shadow-white/10'
              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-[var(--foreground)]'
          }`}
        >
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs sm:text-sm ${
                mode === 'flashcards'
                  ? 'text-[var(--foreground)] font-bold'
                  : 'font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[var(--foreground)]'
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
        className={`hover-lift glass-stroke-border flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all group ${
          mode === 'quiz'
            ? 'bg-slate-100/80 dark:bg-white/10 border-slate-400 dark:border-white/40 shadow-md shadow-black/10 dark:shadow-white/5 ring-1 ring-white/20'
            : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-500 hover:bg-[var(--surface-hover)]'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-105 ${
            mode === 'quiz'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-black/15 dark:shadow-white/10'
              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-[var(--foreground)]'
          }`}
        >
          <CircleHelp className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs sm:text-sm ${
                mode === 'quiz'
                  ? 'text-[var(--foreground)] font-bold'
                  : 'font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[var(--foreground)]'
              }`}
            >
              Diagnostic Knowledge Quiz
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[var(--muted)] truncate mt-0.5">
            Multiple-choice test with immediate rationale feedback
          </p>
        </div>
      </button>
    </div>
  );
};
