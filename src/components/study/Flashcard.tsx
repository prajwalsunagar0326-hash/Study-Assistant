import React from 'react';
import { RefreshCw, HelpCircle, CheckCircle2, Bookmark as BookmarkIcon } from 'lucide-react';
import { Flashcard as FlashcardType } from '../../types/study';
import { useProductivity } from '../../context/ProductivityContext';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  cardNumber: number;
  totalCards: number;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  cardNumber,
  totalCards,
}) => {
  const { isBookmarked, addBookmark, removeBookmark } = useProductivity();
  const bookmarked = isBookmarked(card.id);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(card.id);
    } else {
      addBookmark({
        type: 'flashcard',
        title: card.question,
        content: card.answer,
        sourceId: card.id,
        metadata: {
          difficulty: card.difficulty,
        },
      });
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="badge badge-easy">Easy</span>;
      case 'hard':
        return <span className="badge badge-hard">Hard</span>;
      default:
        return <span className="badge badge-medium">Medium</span>;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flashcard-perspective select-none">
      <div
        tabIndex={0}
        role="button"
        aria-label={`Flashcard ${cardNumber} of ${totalCards}. Question: ${card.question}. Press space to flip.`}
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        className={`flashcard-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-2xl ${
          isFlipped ? 'is-flipped' : ''
        }`}
      >
        {/* Front Face: Question */}
        <div className="flashcard-face flashcard-front">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>QUESTION</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleBookmark}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  bookmarked
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
                }`}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark flashcard'}
              >
                <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-amber-400' : ''}`} />
                <span>{bookmarked ? '★ Saved' : '☆ Save'}</span>
              </button>
              {getDifficultyBadge(card.difficulty)}
              <span className="font-semibold text-[var(--foreground)]">
                {cardNumber} / {totalCards}
              </span>
            </div>
          </div>

          <div className="my-auto py-6 px-2">
            <p className="text-lg sm:text-2xl font-bold text-white leading-snug">
              {card.question}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-300 font-medium">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Click or press Space to reveal answer</span>
          </div>
        </div>

        {/* Back Face: Answer */}
        <div className="flashcard-face flashcard-back">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1.5 font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>KEY INSIGHT & ANSWER</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleBookmark}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  bookmarked
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
                }`}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark flashcard'}
              >
                <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-amber-400' : ''}`} />
                <span>{bookmarked ? '★ Saved' : '☆ Save'}</span>
              </button>
              {getDifficultyBadge(card.difficulty)}
              <span className="font-semibold text-[var(--foreground)]">
                {cardNumber} / {totalCards}
              </span>
            </div>
          </div>

          <div className="my-auto py-6 px-2">
            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              {card.answer}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-purple-300 font-medium">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Click to flip back to question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
