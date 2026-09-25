import React from 'react';
import { Trophy, RotateCcw, Layers, Award, CheckCircle, XCircle } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  wrongCount: number;
  onRetryWrong: () => void;
  onRestartFullQuiz: () => void;
  onReviewFlashcards: () => void;
  onNewTopic: () => void;
  isRetriedSession?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  wrongCount,
  onRetryWrong,
  onRestartFullQuiz,
  onReviewFlashcards,
  onNewTopic,
  isRetriedSession = false,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getEvaluation = () => {
    if (percentage === 100) {
      return {
        headline: 'Flawless Mastery!',
        message: 'You answered every question correctly on this set. Your conceptual foundation is rock-solid.',
        badgeClass: 'badge-easy',
      };
    }
    if (percentage >= 80) {
      return {
        headline: 'Strong Performance!',
        message: 'Great retention of core principles. Reviewing the few missed questions will lock in total recall.',
        badgeClass: 'badge-easy',
      };
    }
    if (percentage >= 60) {
      return {
        headline: 'Good Progress!',
        message: 'Solid initial grasp. Retrying your incorrect answers will reinforce the nuanced distinction between concepts.',
        badgeClass: 'badge-medium',
      };
    }
    return {
      headline: 'Room for Growth',
      message: 'Active testing is how memory solidifies. Review the flashcards or retry the questions to strengthen recall.',
      badgeClass: 'badge-hard',
    };
  };

  const evalData = getEvaluation();

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <div className="glass-panel p-6 sm:p-8 space-y-6 text-center border-indigo-500/40 shadow-2xl">
        {/* Trophy / Award Icon */}
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-amber-500/20 border border-indigo-500/40 text-amber-400 shadow-lg shadow-indigo-500/10">
          {percentage >= 80 ? (
            <Trophy className="w-10 h-10 text-amber-400" />
          ) : (
            <Award className="w-10 h-10 text-indigo-400" />
          )}
        </div>

        {/* Score & Evaluation */}
        <div className="space-y-2">
          <span className={`badge ${evalData.badgeClass}`}>
            {percentage}% Mastery
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            {evalData.headline}
          </h3>
          <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
            {evalData.message}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-[var(--border-subtle)]">
          <div className="space-y-1">
            <span className="text-[11px] text-[var(--muted)] uppercase font-semibold">Score</span>
            <p className="text-lg sm:text-xl font-bold text-white">
              {score} / {totalQuestions}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-emerald-400 uppercase font-semibold flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Correct</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-emerald-400">
              {score}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-rose-400 uppercase font-semibold flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3" />
              <span>Missed</span>
            </span>
            <p className="text-lg sm:text-xl font-bold text-rose-400">
              {wrongCount}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Assignment Section 29: In-Memory Retry Wrong Answers */}
          {wrongCount > 0 && (
            <button
              type="button"
              onClick={onRetryWrong}
              className="btn-primary w-full py-3 bg-gradient-to-r from-amber-500 via-violet-600 to-indigo-600 shadow-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry {wrongCount} Missed Question{wrongCount > 1 ? 's' : ''} (In-Memory)</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRestartFullQuiz}
              className="btn-secondary w-full sm:w-auto text-xs sm:text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Full Quiz</span>
            </button>
            <button
              type="button"
              onClick={onReviewFlashcards}
              className="btn-secondary w-full sm:w-auto text-xs sm:text-sm text-indigo-300 border-indigo-500/30"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Review Flashcards</span>
            </button>
            <button
              type="button"
              onClick={onNewTopic}
              className="btn-ghost text-xs w-full sm:w-auto text-[var(--muted)]"
            >
              <span>New Topic</span>
            </button>
          </div>
        </div>

        {/* Footer note explaining in-memory zero-API penalty */}
        <div className="text-[11px] text-[var(--muted-dark)] border-t border-[var(--border-subtle)] pt-3">
          {isRetriedSession ? (
            <span>Targeted retry session completed without making external API requests.</span>
          ) : (
            <span>All quiz questions remain saved in local state for instant retries.</span>
          )}
        </div>
      </div>
    </div>
  );
};
