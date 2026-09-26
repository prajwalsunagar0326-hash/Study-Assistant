import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Brain, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { Flashcard as FlashcardType } from '../../types/study';
import { Flashcard } from './Flashcard';
import { useProductivity } from '../../context/ProductivityContext';

interface FlashcardViewProps {
  cards: FlashcardType[];
  onTakeQuiz: () => void;
  onNewTopic: () => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  cards,
  onTakeQuiz,
  onNewTopic,
}) => {
  const { recordFlashcardReview, recordActivity } = useProductivity();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      recordFlashcardReview(totalCards);
      recordActivity({
        type: 'study',
        title: `Completed review of ${totalCards} flashcards`,
      });
    }
  }, [currentIndex, totalCards, recordFlashcardReview, recordActivity]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    if (isCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isCompleted]);

  // Completion Panel View
  if (isCompleted) {
    return (
      <div className="w-full max-w-xl mx-auto py-8">
        <div className="glass-panel p-6 sm:p-8 space-y-6 text-center border-indigo-500/40 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[var(--foreground)]">
              Nice work!
            </h3>
            <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
              You reviewed all {totalCards} flashcards in this study set. Testing yourself through active recall builds long-term memory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="btn-secondary w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Again</span>
            </button>
            <button
              type="button"
              onClick={onTakeQuiz}
              className="btn-primary w-full sm:w-auto"
            >
              <Brain className="w-4 h-4" />
              <span>Test Knowledge via Quiz</span>
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
      </div>
    );
  }

  // Progress Percentage
  const progressPercent = Math.round(((currentIndex + 1) / totalCards) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {/* Progress Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>PROGRESS</span>
          </span>
          <span className="text-[var(--foreground)]">
            Card {currentIndex + 1} of {totalCards} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main 3D Card */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        cardNumber={currentIndex + 1}
        totalCards={totalCards}
      />

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-secondary text-xs sm:text-sm px-4 py-2.5"
          aria-label="Previous Flashcard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="btn-secondary text-xs sm:text-sm px-5 py-2.5 border-indigo-500/40 text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Flip Card (Space)</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="btn-primary text-xs sm:text-sm px-5 py-2.5"
          aria-label={currentIndex === totalCards - 1 ? 'Finish Flashcards' : 'Next Flashcard'}
        >
          <span>{currentIndex === totalCards - 1 ? 'Finish' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-[11px] text-[var(--muted-dark)] hidden sm:block">
        Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Space</kbd> to flip • <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">→</kbd> to navigate
      </div>
    </div>
  );
};
