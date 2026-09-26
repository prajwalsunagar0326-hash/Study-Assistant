import React from 'react';
import { Search, Bug, Sun, Moon, Flame } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';

interface HeaderProps {
  isDiagnosticOpen: boolean;
  onToggleDiagnostic: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDiagnosticOpen,
  onToggleDiagnostic,
  theme,
  onToggleTheme,
}) => {
  const { activeTab, setIsSearchOpen, studyStreak } = useProductivity();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Study Dashboard';
      case 'study':
        return 'AI Study Workspace';
      case 'tasks':
        return 'Tasks & To-Dos';
      case 'calendar':
        return 'Study Calendar';
      case 'bookmarks':
        return 'Saved Bookmarks';
      case 'pomodoro':
        return 'Pomodoro Focus Timer';
      case 'profile':
        return 'Student Profile & Statistics';
      default:
        return 'StudyAI';
    }
  };

  return (
    <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Current View Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              {getTabTitle()}
            </h1>
            <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
              Active Learning & Student Productivity
            </span>
          </div>
        </div>

        {/* Global Search Bar (Ctrl+K) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] hover:border-indigo-500/50 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Search tasks, flashcards, events, notes...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Action Affordances */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:text-white hover:bg-[var(--surface-muted)]"
          >
            <Search className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Streak indicator on header */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{studyStreak}d Streak</span>
          </div>

          {/* Interviewer Mode Diagnostic Trigger */}
          <button
            type="button"
            onClick={onToggleDiagnostic}
            aria-label="Toggle Interviewer Diagnostic Mode"
            className={`btn-ghost text-xs px-2.5 py-1.5 rounded-lg border ${
              isDiagnosticOpen
                ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Diagnostic</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Color Theme"
            className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
