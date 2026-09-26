import React, { useState, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType } from '../../types/study';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';

interface QuizViewProps {
  questions: QuizQuestionType[];
  onReviewFlashcards: () => void;
  onNewTopic: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions: initialQuestions,
  onReviewFlashcards,
  onNewTopic,
}) => {
  const { recordQuizCompletion, recordActivity } = useProductivity();
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestionType[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isRetryingWrong, setIsRetryingWrong] = useState<boolean>(false);

  const totalQuestions = activeQuestions.length;
  const currentQuestion = activeQuestions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (!isSubmitted) {
      setSelectedOption(opt);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption.trim() === currentQuestion.correctAnswer.trim();

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestionIds((prev) =>
        prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]
      );
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      recordQuizCompletion(score, totalQuestions);
      recordActivity({
        type: 'quiz',
        title: `Finished quiz with score ${score}/${totalQuestions}`,
      });
    }
  };

  // Section 29: In-Memory Retry Wrong Answers
  const handleRetryWrong = useCallback(() => {
    const wrongQuestions = initialQuestions.filter((q) => wrongQuestionIds.includes(q.id));
    if (wrongQuestions.length === 0) return;

    setActiveQuestions(wrongQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongQuestionIds([]);
    setIsCompleted(false);
    setIsRetryingWrong(true);
  }, [initialQuestions, wrongQuestionIds]);

  const handleRestartFullQuiz = useCallback(() => {
    setActiveQuestions(initialQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongQuestionIds([]);
    setIsCompleted(false);
    setIsRetryingWrong(false);
  }, [initialQuestions]);

  if (isCompleted) {
    return (
      <QuizResults
        score={score}
        totalQuestions={totalQuestions}
        wrongCount={totalQuestions - score}
        onRetryWrong={handleRetryWrong}
        onRestartFullQuiz={handleRestartFullQuiz}
        onReviewFlashcards={onReviewFlashcards}
        onNewTopic={onNewTopic}
        isRetriedSession={isRetryingWrong}
      />
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress & Session Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            {isRetryingWrong ? (
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY SESSION (MISSED QUESTIONS)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>QUIZ PROGRESS</span>
              </span>
            )}
          </span>
          <span className="text-[var(--foreground)]">
            Question {currentIndex + 1} of {totalQuestions} • Current Score: {score}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isRetryingWrong
                ? 'bg-gradient-to-r from-amber-500 to-indigo-500'
                : 'bg-gradient-to-r from-violet-500 to-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        isSubmitted={isSubmitted}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentIndex === totalQuestions - 1}
      />
    </div>
  );
};
