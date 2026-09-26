import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  CalendarDays,
  Bookmark,
  Timer,
  GraduationCap,
  Flame,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { NavigationTab } from '../../types/productivity';

interface SidebarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme,
  onToggleTheme,
  className = '',
  onNavigate,
}) => {
  const { activeTab, setActiveTab, tasks, bookmarks, profile, studyStreak } = useProductivity();

  const activeTaskCount = tasks.filter((t) => !t.completed).length;

  const NAV_ITEMS: {
    tab: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      tab: 'study',
      label: 'AI Study Workspace',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      badge: 'AI',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      tab: 'tasks',
      label: 'Tasks & To-Dos',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: activeTaskCount > 0 ? activeTaskCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      tab: 'calendar',
      label: 'Study Calendar',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      tab: 'bookmarks',
      label: 'Saved Bookmarks',
      icon: <Bookmark className="w-4 h-4" />,
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
    {
      tab: 'pomodoro',
      label: 'Pomodoro Timer',
      icon: <Timer className="w-4 h-4" />,
    },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (onNavigate) onNavigate();
  };

  return (
    <aside
      className={`w-64 h-full bg-[var(--surface)] border-r border-[var(--border-subtle)] backdrop-blur-xl flex flex-col justify-between p-4 transition-colors select-none ${className}`}
    >
      {/* Top Branding */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] via-[var(--secondary)] to-[var(--accent-cyan)] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)] shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[var(--foreground)]">
                Study<span className="gradient-text">AI</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-[var(--muted)]">Student Workspace</span>
          </div>
        </div>

        {/* Streak Indicator Banner */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                {studyStreak} Day{studyStreak === 1 ? '' : 's'} Streak
              </div>
              <div className="text-[10px] text-[var(--muted)]">
                {studyStreak > 0 ? 'Consistency unlocked!' : 'Complete study to start'}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1" aria-label="Main Navigation">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Main Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleSelectTab(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : item.badgeColor || 'bg-[var(--surface-muted)] text-[var(--muted)] border-[var(--border)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Theme Section */}
      <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
        {/* Profile Card Button */}
        <button
          type="button"
          onClick={() => handleSelectTab('profile')}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-950/60 border-indigo-500/50 text-white'
              : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-600 text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm">
              {profile.avatarInitials || 'ST'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate text-[var(--foreground)]">
                {profile.name}
              </div>
              <div className="text-[10px] text-[var(--muted)] truncate">
                {profile.studyGoal || 'Student'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--muted)] shrink-0" />
        </button>

        {/* Theme and Mode Bar */}
        <div className="flex items-center justify-between px-2 pt-1 text-xs text-[var(--muted)]">
          <span>Theme Mode</span>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
