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
        className={`relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all ${
          mode === 'flashcards'
            ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900/80 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
            : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-600/50'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`p-2.5 rounded-lg transition-colors ${
            mode === 'flashcards'
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/60 text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-sm ${
                mode === 'flashcards' ? 'text-white' : 'text-slate-200'
              }`}
            >
              Interactive Flashcards
            </span>
            {mode === 'flashcards' && (
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Review concepts with 3D flip cards & memory triggers.
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
        className={`relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all ${
          mode === 'quiz'
            ? 'bg-gradient-to-br from-violet-950/60 to-slate-900/80 border-violet-500/60 shadow-lg shadow-violet-500/10'
            : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-600/50'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`p-2.5 rounded-lg transition-colors ${
            mode === 'quiz'
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'bg-slate-800/60 text-slate-400'
          }`}
        >
          <CircleHelp className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-sm ${
                mode === 'quiz' ? 'text-white' : 'text-slate-200'
              }`}
            >
              Interactive Quiz
            </span>
            {mode === 'quiz' && (
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Test your understanding with instant feedback & scoring.
          </p>
        </div>
      </button>
    </div>
  );
};
