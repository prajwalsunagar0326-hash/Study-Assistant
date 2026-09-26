import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ProductivityProvider, useProductivity } from './context/ProductivityContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/ui/ToastContainer';
import { SearchCommandModal } from './components/search/SearchCommandModal';

import { Dashboard } from './components/dashboard/Dashboard';
import { TaskPage } from './components/tasks/TaskPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { BookmarkPage } from './components/bookmarks/BookmarkPage';
import { PomodoroPage } from './components/pomodoro/PomodoroPage';
import { ProfilePage } from './components/profile/ProfilePage';

import { StudyInput } from './components/study/StudyInput';
import { StudyHeader } from './components/study/StudyHeader';
import { FlashcardView } from './components/study/FlashcardView';
import { QuizView } from './components/study/QuizView';
import { LoadingState } from './components/states/LoadingState';
import { ErrorState } from './components/states/ErrorState';

import { useStudyGeneration } from './hooks/useStudyGeneration';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useLenis } from './hooks/useLenis';
import { StudyAIStorage } from './lib/storage';
import { StudyMode, StudyPlan } from './types/study';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  // Initialize Lenis smooth desktop scrolling (disabled on touch & reduced motion)
  useLenis();

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const prefs = StudyAIStorage.getPreferences();
      if (prefs.theme === 'dark' || prefs.theme === 'light') return prefs.theme;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return StudyAIStorage.getSidebarState();
    }
    return false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { activeTab, setActiveTab } = useProductivity();

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
    setStudyPlan,
  } = useStudyGeneration();

  // Synchronize theme with HTML document attribute, dark class, and storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    StudyAIStorage.setPreferences({ theme });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      StudyAIStorage.setSidebarState(next);
      return next;
    });
  };

  // GSAP Entrance animation on first load (400-800ms)
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (heroRef.current && activeTab === 'study') {
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
    { scope: containerRef, dependencies: [prefersReducedMotion, activeTab] }
  );

  // Scroll reveal observer for silky smooth entrance on view change & scroll
  useScrollReveal(activeTab);

  const handleGenerate = (promptText: string, selectedMode: StudyMode) => {
    generate(promptText, selectedMode);
  };

  const handleLoadStudyPlan = (plan: StudyPlan) => {
    setStudyPlan(plan);
    setActiveTab('study');
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 antialiased relative"
    >
      {/* Desktop Sidebar (Fixed left navigation per Section 21) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Slide-in Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-[var(--surface)] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isCollapsed={false}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area (Scrollable body with fixed sidebar offset) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin-left] duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-60'
        } pb-16 lg:pb-0 overflow-y-auto min-h-screen`}
      >
        {/* Top Header with unified single theme toggle */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Body based on activeTab */}
        <main
          className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 ${
            activeTab === 'study' ? 'py-2 sm:py-3 flex flex-col justify-center' : 'py-5 sm:py-6'
          }`}
        >
          {activeTab === 'dashboard' && (
            <Dashboard onLoadStudyPlan={handleLoadStudyPlan} />
          )}

          {activeTab === 'study' && (
            <div className="w-full max-w-5xl mx-auto space-y-4">
              {/* If no study plan has been generated yet, show the Hero and Input Area */}
              {!studyPlan && !isLoading && !error && (
                <div className="space-y-4">
                  {/* Hero Section */}
                  <div ref={heroRef} className="text-center space-y-1.5 pt-1">
                    <div className="hero-element inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Non-Chatbot Structured Learning Engine</span>
                    </div>
                    <h1 className="hero-element text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                      Study smarter. <span className="gradient-text">Learn faster.</span>
                    </h1>
                    <p className="hero-element text-xs sm:text-sm text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
                      Paste notes or enter a topic to generate interactive flashcards or a quiz in seconds.
                    </p>
                  </div>

                  {/* Input Panel */}
                  <div className="input-panel-anim">
                    <StudyInput
                      onGenerate={handleGenerate}
                      isLoading={isLoading}
                      defaultMode={mode}
                    />
                  </div>
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
                <div className="space-y-4 sm:space-y-5 animate-fade-in max-w-4xl mx-auto">
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
            </div>
          )}

          {activeTab === 'tasks' && <TaskPage />}

          {activeTab === 'calendar' && <CalendarPage />}

          {activeTab === 'bookmarks' && <BookmarkPage />}

          {activeTab === 'pomodoro' && <PomodoroPage />}

          {activeTab === 'profile' && <ProfilePage />}
        </main>

        {/* Global Footer (hidden on active study creator to fit screen without scrolling) */}
        {activeTab !== 'study' && (
          <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--surface-glass)] py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--foreground)]">Karen</span>
                <span>•</span>
                <span>Turn your notes into interactive learning</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-[var(--muted-dark)]">
                  Strict Structured JSON & Runtime Zod Schema • Client-Side Productivity
                </span>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Mobile Bottom Navigation (fixed on small viewports, lg:hidden) */}
      <MobileNav />

      {/* Global Command Palette / Search Modal (Ctrl+K) */}
      <SearchCommandModal />

      {/* Non-intrusive Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProductivityProvider>
      <AppContent />
    </ProductivityProvider>
  );
};

export default App;
