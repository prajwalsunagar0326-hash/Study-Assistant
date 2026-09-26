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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        {/* Meta / Difficulty Header */}
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1.5 font-semibold text-violet-400">
            <HelpCircle className="w-4 h-4" />
            <span>QUESTION {questionNumber} OF {totalQuestions}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleBookmark}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                bookmarked
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
            >
              <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-amber-400' : ''}`} />
              <span>{bookmarked ? '★ Saved' : '☆ Save'}</span>
            </button>
            <span className="badge badge-medium capitalize">{question.difficulty}</span>
          </div>
        </div>

        {/* Question Prompt */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-3" role="radiogroup" aria-label={`Options for question ${questionNumber}`}>
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const selected = isSelected(option);
            const correct = isCorrect(option);

            let optionClasses = 'border-[var(--border)] bg-[var(--surface-muted)] hover:border-slate-500/60';
            let indicatorClasses = 'border-slate-600 bg-slate-800 text-slate-300';

            if (isSubmitted) {
              if (correct) {
                optionClasses = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-100 shadow-sm shadow-emerald-500/10';
                indicatorClasses = 'border-emerald-500 bg-emerald-500 text-slate-950';
              } else if (selected && !correct) {
                optionClasses = 'border-rose-500/60 bg-rose-950/30 text-rose-100 shadow-sm shadow-rose-500/10';
                indicatorClasses = 'border-rose-500 bg-rose-500 text-white';
              } else {
                optionClasses = 'opacity-50 border-[var(--border-subtle)] bg-[var(--surface-muted)]';
              }
            } else if (selected) {
              optionClasses = 'border-violet-500/80 bg-violet-950/40 text-white shadow-md shadow-violet-500/15';
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
                className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-3.5 transition-all text-sm sm:text-base ${optionClasses} ${
                  isSubmitted ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${indicatorClasses}`}
                  >
                    {letter}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>

                {isSubmitted && correct && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && selected && !correct && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Revealed after submission) */}
        {isSubmitted && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-2 text-xs sm:text-sm animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Explanation:</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!isSubmitted ? (
            <button
              type="button"
              disabled={!selectedOption}
              onClick={onSubmitAnswer}
              className="btn-primary w-full sm:w-auto px-6 py-2.5"
            >
              <span>Check Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="btn-primary w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600"
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
