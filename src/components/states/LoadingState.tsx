import React from 'react';
import { Wand2, XCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { LoadingStage } from '../../hooks/useStudyGeneration';

interface LoadingStateProps {
  stage: LoadingStage;
  onCancel: () => void;
}

const STAGES = [
  { key: 'reading', label: 'Reading and analyzing your material' },
  { key: 'identifying', label: 'Extracting high-yield concepts & terminology' },
  { key: 'building', label: 'Structuring interactive flashcards & quiz' },
  { key: 'validating', label: 'Defensively validating runtime schema' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ stage, onCancel }) => {
  const currentStageIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <div className="glass-panel p-6 sm:p-8 space-y-6 text-center relative overflow-hidden border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse-glow">
            <Wand2 className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            Synthesizing Your Study Set
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Transforming notes into reliable, validated active-recall tools.
          </p>
        </div>

        {/* Progressive UX Stage Indicators */}
        <div className="space-y-2.5 max-w-md mx-auto text-left pt-2">
          {STAGES.map((s, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={s.key}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs sm:text-sm transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-white font-medium shadow-sm'
                    : isCompleted
                    ? 'bg-[var(--surface-glass)] border-emerald-500/20 text-emerald-300/80'
                    : 'bg-transparent border-transparent text-[var(--muted-dark)]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Skeleton Card Preview */}
        <div className="pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-[var(--border-subtle)] space-y-3 opacity-60 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/3 mx-auto" />
            <div className="h-3 bg-slate-850 rounded w-4/5 mx-auto" />
            <div className="h-3 bg-slate-850 rounded w-3/5 mx-auto" />
          </div>
        </div>

        {/* Cancel Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost text-xs text-[var(--muted)] hover:text-rose-400 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};
