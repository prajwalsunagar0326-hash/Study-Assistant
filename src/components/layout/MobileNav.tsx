import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  Timer,
  MoreHorizontal,
  CalendarDays,
  Bookmark,
  User,
  X,
  Flame,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { NavigationTab } from '../../types/productivity';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, tasks, bookmarks, studyStreak } = useProductivity();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const activeTaskCount = tasks.filter((t) => !t.completed).length;

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* More Sheet Modal for Mobile */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-fade-in">
          <div className="bg-[var(--surface)] border-t border-[var(--border)] rounded-t-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[var(--foreground)]">More Pages</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" />
                  {studyStreak}d Streak
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleTabClick('calendar')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border border-slate-700 dark:border-white/40 font-bold'
                    : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--foreground)]'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs font-semibold">Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('bookmarks')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  activeTab === 'bookmarks'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border border-slate-700 dark:border-white/40 font-bold'
                    : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--foreground)]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <div className="flex items-center justify-between flex-1">
                  <span className="text-xs font-semibold">Bookmarks</span>
                  {bookmarks.length > 0 && (
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full">
                      {bookmarks.length}
                    </span>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`col-span-2 p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border border-slate-700 dark:border-white/40 font-bold'
                    : 'bg-[var(--surface-muted)] border-[var(--border)] text-[var(--foreground)]'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-semibold">Student Profile & Analytics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border)] lg:hidden px-2 py-1.5 flex items-center justify-around"
      >
        <button
          type="button"
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'dashboard' ? 'text-[var(--foreground)] font-bold' : 'text-[var(--muted)]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('study')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'study' ? 'text-[var(--foreground)] font-bold' : 'text-[var(--muted)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Study</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('tasks')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'tasks' ? 'text-[var(--foreground)] font-bold' : 'text-[var(--muted)]'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tasks</span>
          {activeTaskCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('pomodoro')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'pomodoro' ? 'text-indigo-400' : 'text-[var(--muted)]'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Timer</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
            ['calendar', 'bookmarks', 'profile'].includes(activeTab) || isMoreOpen
              ? 'text-indigo-400'
              : 'text-[var(--muted)]'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
