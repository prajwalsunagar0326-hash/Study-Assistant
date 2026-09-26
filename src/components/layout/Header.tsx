import React from 'react';
import { Sun, Moon, Flame, Menu } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenMobileMenu,
}) => {
  const { activeTab, studyStreak } = useProductivity();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Study Dashboard';
      case 'study':
        return 'Study Workspace';
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
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Current View Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-tight truncate">
              {getTabTitle()}
            </h1>
            <span className="text-[10px] text-[var(--muted)] hidden sm:inline truncate">
              Active Learning & Student Productivity
            </span>
          </div>
        </div>

        {/* Right: Streak & Unified Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator on header */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-700 dark:text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{studyStreak}d Streak</span>
          </div>

          {/* Single Unified Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Color Theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
