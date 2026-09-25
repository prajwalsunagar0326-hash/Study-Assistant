import React from 'react';
import { Layers, Brain, CheckCircle, ArrowUp } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          Study smarter. <span className="gradient-text">Learn faster.</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          Paste your lecture notes or enter a topic above. StudyAI turns unstructured content into interactive 3D flashcards and timed practice quizzes.
        </p>
      </div>

      {/* Feature Value Props */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="glass-panel p-5 space-y-2 border-indigo-500/20">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            Interactive Flashcards
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            3D flip cards with question prompts, key memory triggers, and difficulty categorization.
          </p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-purple-500/20">
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            Instant Practice Quiz
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Multiple-choice challenges with instant rationale feedback and performance score breakdowns.
          </p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-emerald-500/20">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">
            Targeted Mistake Retry
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Isolate and retry questions you missed in-memory without wasting unnecessary AI roundtrips.
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 text-xs text-[var(--muted)] animate-bounce pt-2">
        <ArrowUp className="w-4 h-4 text-indigo-400" />
        <span>Type notes or select an example above to begin</span>
      </div>
    </div>
  );
};
