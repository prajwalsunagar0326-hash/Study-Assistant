import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Sparkles, Bookmark as BookmarkIcon } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../../types/study';
import { useProductivity } from '../../context/ProductivityContext';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isSubmitted: boolean;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isSubmitted,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion,
}) => {
  const { isBookmarked, addBookmark, removeBookmark } = useProductivity();
  const bookmarked = isBookmarked(question.id);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(question.id);
    } else {
      addBookmark({
        type: 'quiz',
        title: question.question,
        content: `Correct Answer: ${question.correctAnswer}. ${question.explanation}`,
        sourceId: question.id,
        metadata: {
          difficulty: question.difficulty,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        },
      });
    }
  };

  const isSelected = (opt: string) => selectedOption === opt;
  const isCorrect = (opt: string) => opt.trim() === question.correctAnswer.trim();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {/* Question Card */}
      <div className="glass-panel p-4 sm:p-6 space-y-3.5">
        {/* Meta / Difficulty Header */}
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1.5 font-semibold text-violet-600 dark:text-violet-400">
            <HelpCircle className="w-4 h-4" />
            <span>QUESTION {questionNumber} OF {totalQuestions}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleBookmark}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                bookmarked
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
            >
              <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-amber-500' : ''}`} />
              <span>{bookmarked ? '★ Saved' : '☆ Save'}</span>
            </button>
            <span className="badge badge-medium capitalize">{question.difficulty}</span>
          </div>
        </div>

        {/* Question Prompt */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {question.question}
          </h3>
        </div>

        {/* 4 Options Grid (2x2 on desktop, 1-col on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5" role="radiogroup" aria-label={`Options for question ${questionNumber}`}>
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const selected = isSelected(option);
            const correct = isCorrect(option);

            let optionClasses = 'border-[var(--border)] bg-[var(--surface-muted)] hover:border-slate-400 dark:hover:border-slate-500/60 text-slate-900 dark:text-slate-100';
            let indicatorClasses = 'border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (isSubmitted) {
              if (correct) {
                optionClasses = 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 shadow-sm shadow-emerald-500/10 font-medium';
                indicatorClasses = 'border-emerald-500 bg-emerald-500 text-white dark:text-slate-950';
              } else if (selected && !correct) {
                optionClasses = 'border-rose-500/60 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100 shadow-sm shadow-rose-500/10 font-medium';
                indicatorClasses = 'border-rose-500 bg-rose-500 text-white';
              } else {
                optionClasses = 'opacity-50 border-[var(--border-subtle)] bg-[var(--surface-muted)] text-slate-500 dark:text-slate-400';
              }
            } else if (selected) {
              optionClasses = 'border-violet-500/80 bg-violet-50 dark:bg-violet-950/40 text-violet-950 dark:text-white shadow-md shadow-violet-500/15 font-semibold';
              indicatorClasses = 'border-violet-500 bg-violet-600 text-white';
            }

            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={isSubmitted}
                onClick={() => onSelectOption(option)}
                className={`w-full text-left p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all text-xs sm:text-sm ${optionClasses} ${
                  isSubmitted ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${indicatorClasses}`}
                  >
                    {letter}
                  </div>
                  <span className="font-medium truncate sm:whitespace-normal">{option}</span>
                </div>

                {isSubmitted && correct && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isSubmitted && selected && !correct && (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Revealed after submission) */}
        {isSubmitted && (
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-indigo-500/30 space-y-1.5 text-xs animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explanation:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {!isSubmitted ? (
            <button
              type="button"
              disabled={!selectedOption}
              onClick={onSubmitAnswer}
              className="btn-primary w-full sm:w-auto px-5 py-2 text-xs sm:text-sm"
            >
              <span>Check Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="btn-primary w-full sm:w-auto px-5 py-2 text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-indigo-600"
            >
              <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
