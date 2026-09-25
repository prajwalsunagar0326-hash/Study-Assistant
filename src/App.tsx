import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Header } from './components/layout/Header';
import { StudyInput } from './components/study/StudyInput';
import { StudyHeader } from './components/study/StudyHeader';
import { FlashcardView } from './components/study/FlashcardView';
import { QuizView } from './components/study/QuizView';
import { LoadingState } from './components/states/LoadingState';
import { ErrorState } from './components/states/ErrorState';
import { EmptyState } from './components/states/EmptyState';
import { useStudyGeneration } from './hooks/useStudyGeneration';
import { useReducedMotion } from './hooks/useReducedMotion';
import { StudyMode } from './types/study';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studyai-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const {
    studyPlan,
    mode,
    setMode,
    isLoading,
    loadingStage,
    error,
    generate,
    cancelGeneration,
    retry,
    resetToNewTopic,
  } = useStudyGeneration();

  // Synchronize theme with HTML document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studyai-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // GSAP Entrance animation on first load (400-800ms)
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (heroRef.current) {
        tl.fromTo(
          '.hero-element',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.55 }
        ).fromTo(
          '.input-panel-anim',
          { opacity: 0, scale: 0.98, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45 },
          '-=0.25'
        );
      }
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  const handleGenerate = (promptText: string, selectedMode: StudyMode) => {
    generate(promptText, selectedMode);
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header */}
      <Header
        isDiagnosticOpen={isDiagnosticOpen}
        onToggleDiagnostic={() => setIsDiagnosticOpen((prev) => !prev)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* If no study plan has been generated yet, show the Hero and Input Area */}
        {!studyPlan && !isLoading && !error && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div ref={heroRef} className="text-center space-y-3 pt-2 sm:pt-4">
              <div className="hero-element inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Non-Chatbot Structured Learning Engine</span>
              </div>
              <h1 className="hero-element text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
                Study smarter. <span className="gradient-text">Learn faster.</span>
              </h1>
              <p className="hero-element text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
                Paste your notes or enter a topic. StudyAI turns them into interactive flashcards or a quiz in seconds.
              </p>
            </div>

            {/* Input Panel */}
            <div className="input-panel-anim">
              <StudyInput
                onGenerate={handleGenerate}
                isLoading={isLoading}
                isDiagnosticOpen={isDiagnosticOpen}
                defaultMode={mode}
              />
            </div>

            {/* Empty State Features */}
            <EmptyState />
          </div>
        )}

        {/* Loading State with progressive UX stages & cancellation */}
        {isLoading && (
          <LoadingState stage={loadingStage} onCancel={cancelGeneration} />
        )}

        {/* Error State with user-friendly remediation & retry */}
        {!isLoading && error && (
          <ErrorState error={error} onRetry={retry} onBack={resetToNewTopic} />
        )}

        {/* Active Study Plan Workspace */}
        {!isLoading && !error && studyPlan && (
          <div className="space-y-8 animate-fade-in">
            {/* Header: Title, Summary, Navigation Tabs, Export */}
            <StudyHeader
              studyPlan={studyPlan}
              activeMode={mode}
              onSwitchMode={(newMode) => setMode(newMode)}
              onNewTopic={resetToNewTopic}
            />

            {/* Mode Content: Flashcards vs Quiz */}
            {mode === 'flashcards' ? (
              <FlashcardView
                cards={studyPlan.flashcards}
                onTakeQuiz={() => setMode('quiz')}
                onNewTopic={resetToNewTopic}
              />
            ) : (
              <QuizView
                questions={studyPlan.quiz.questions}
                onReviewFlashcards={() => setMode('flashcards')}
                onNewTopic={resetToNewTopic}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--surface-glass)] py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--foreground)]">StudyAI</span>
            <span>•</span>
            <span>Turn your notes into interactive learning</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[var(--muted-dark)]">
              Strict Structured JSON & Runtime Zod Schema
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
