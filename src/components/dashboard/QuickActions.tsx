import React from 'react';
import { Sparkles, CheckSquare, Calendar, Timer, Bookmark } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';

export const QuickActions: React.FC = () => {
  const { setActiveTab } = useProductivity();

  const ACTIONS = [
    {
      label: 'AI Study Set',
      description: 'Generate 3D flashcards & quiz',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-500/15 border-indigo-500/30 hover:border-indigo-400',
      tab: 'study' as const,
    },
    {
      label: 'Add New Task',
      description: 'Organize study deliverables',
      icon: <CheckSquare className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-500/15 border-amber-500/30 hover:border-amber-400',
      tab: 'tasks' as const,
    },
    {
      label: 'Schedule Study',
      description: 'Plan exams & deadlines',
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/15 border-emerald-500/30 hover:border-emerald-400',
      tab: 'calendar' as const,
    },
    {
      label: 'Start Pomodoro',
      description: '25-minute deep focus block',
      icon: <Timer className="w-5 h-5 text-rose-400" />,
      color: 'bg-rose-500/15 border-rose-500/30 hover:border-rose-400',
      tab: 'pomodoro' as const,
    },
    {
      label: 'Saved Bookmarks',
      description: 'Review key insights',
      icon: <Bookmark className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/15 border-purple-500/30 hover:border-purple-400',
      tab: 'bookmarks' as const,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        Quick Learning Actions
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ACTIONS.map((act) => (
          <button
            key={act.label}
            type="button"
            onClick={() => setActiveTab(act.tab)}
            className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all hover:translate-y-[-2px] hover:shadow-lg ${act.color} bg-[var(--surface)] group`}
          >
            <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5 w-fit group-hover:scale-110 transition-transform">
              {act.icon}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                {act.label}
              </h4>
              <p className="text-[11px] text-[var(--muted)] line-clamp-1 mt-0.5">
                {act.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
