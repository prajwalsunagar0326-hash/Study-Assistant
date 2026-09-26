import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  CalendarDays,
  Bookmark,
  Timer,
  GraduationCap,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { NavigationTab } from '../../types/productivity';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
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
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'study',
      label: 'Study Workspace',
      icon: <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />,
    },
    {
      tab: 'tasks',
      label: 'Tasks & To-Dos',
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
      badge: activeTaskCount > 0 ? activeTaskCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      tab: 'calendar',
      label: 'Study Calendar',
      icon: <CalendarDays className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'bookmarks',
      label: 'Saved Bookmarks',
      icon: <Bookmark className="w-4 h-4 shrink-0" />,
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
    {
      tab: 'pomodoro',
      label: 'Pomodoro Timer',
      icon: <Timer className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (onNavigate) onNavigate();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`h-screen bg-[var(--surface)] border-r border-[var(--border-subtle)] backdrop-blur-xl flex flex-col justify-between p-3 select-none ${className}`}
    >
      {/* Top Section */}
      <div className="space-y-4">
        {/* Branding & Collapse Toggle */}
        <div
          className={`flex items-center ${
            isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between px-1'
          } pt-1 pb-1`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              onClick={() => handleSelectTab('dashboard')}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] via-[var(--secondary)] to-[var(--accent-cyan)] flex items-center justify-center shadow-md shadow-[var(--primary-glow)] shrink-0 cursor-pointer"
              title="StudyAI - Home"
              role="button"
              tabIndex={0}
              aria-label="Go to Dashboard"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelectTab('dashboard');
              }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-[var(--foreground)]">
                      Study<span className="gradient-text">AI</span>
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)]">Student Workspace</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCollapsed ? '' : 'rotate-180'
                }`}
              />
            </button>
          )}
        </div>

        {/* Streak Indicator Banner */}
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 truncate">
                  {studyStreak} Day{studyStreak === 1 ? '' : 's'} Streak
                </div>
                <div className="text-[9px] text-slate-500 dark:text-[var(--muted)] truncate">
                  {studyStreak > 0 ? 'Consistency active' : 'Study today to start'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 cursor-pointer"
            title={`${studyStreak} Day Streak`}
            onClick={() => handleSelectTab('profile')}
            role="button"
            tabIndex={0}
            aria-label={`${studyStreak} day streak. Open profile`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSelectTab('profile');
            }}
          >
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {studyStreak}d
            </span>
          </div>
        )}

        {/* Primary Navigation Menu */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Main Menu
            </div>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleSelectTab(item.tab)}
                title={isCollapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                } py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`${
                      isActive
                        ? 'text-white'
                        : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : item.badgeColor ||
                          'bg-[var(--surface-muted)] text-[var(--muted)] border-[var(--border)]'
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

      {/* Bottom Profile Section (Theme toggle consolidated in top-right header) */}
      <div className="pt-3 border-t border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={() => handleSelectTab('profile')}
          title={isCollapsed ? profile.name : undefined}
          aria-label={`Student Profile: ${profile.name}`}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-2'
          } rounded-xl border text-left transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500/50 text-indigo-950 dark:text-white ring-1 ring-indigo-500/20'
              : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-300 dark:hover:border-slate-600 text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm">
              {profile.avatarInitials || 'ST'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold truncate text-[var(--foreground)]">
                  {profile.name}
                </div>
                <div className="text-[10px] text-[var(--muted)] truncate">
                  {profile.studyGoal || 'Student'}
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />}
        </button>
      </div>
    </motion.aside>
  );
};
