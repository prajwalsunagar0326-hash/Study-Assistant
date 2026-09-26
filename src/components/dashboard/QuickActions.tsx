import React from 'react';
import { Sparkles, CheckSquare, Calendar, Timer, Bookmark, ArrowRight } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';

export const QuickActions: React.FC = () => {
  const { setActiveTab } = useProductivity();

  const ACTIONS = [
    {
      label: 'AI Study Set',
      description: 'Generate 3D flashcards & quiz',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      tab: 'study' as const,
    },
    {
      label: 'Add New Task',
      description: 'Organize study deliverables',
      icon: <CheckSquare className="w-4 h-4 text-indigo-400" />,
      tab: 'tasks' as const,
    },
    {
      label: 'Schedule Study',
      description: 'Plan exams & deadlines',
      icon: <Calendar className="w-4 h-4 text-indigo-400" />,
      tab: 'calendar' as const,
    },
    {
      label: 'Start Pomodoro',
      description: '25-minute focus session',
      icon: <Timer className="w-4 h-4 text-indigo-400" />,
      tab: 'pomodoro' as const,
    },
    {
      label: 'Saved Bookmarks',
      description: 'Review saved insights',
      icon: <Bookmark className="w-4 h-4 text-indigo-400" />,
      tab: 'bookmarks' as const,
    },
  ];

  return (
    <div className="glass-panel p-4 sm:p-5 space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <h3 className="font-bold text-xs sm:text-sm text-[var(--foreground)]">
          Quick Actions
        </h3>
        <span className="text-[10px] text-[var(--muted)]">Productivity Tools</span>
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-between">
        {ACTIONS.map((act) => (
          <button
            key={act.label}
            type="button"
            onClick={() => setActiveTab(act.tab)}
            className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] hover:bg-[var(--surface-hover)] hover:border-indigo-500/40 text-left flex items-center justify-between gap-3 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-indigo-400">
                {act.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-[var(--foreground)] group-hover:text-indigo-400 transition-colors truncate">
                  {act.label}
                </h4>
                <p className="text-[10px] text-[var(--muted)] truncate">
                  {act.description}
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
