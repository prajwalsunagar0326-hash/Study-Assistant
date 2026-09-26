import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconColor?: string;
  badge?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtext,
  icon,
  badge,
}) => {
  return (
    <div className="glass-panel hover-lift glass-stroke-border p-4 sm:p-5 space-y-2.5 relative overflow-hidden group cursor-default transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Subtle hover gradient reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="w-8 h-8 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] group-hover:border-indigo-500/40 group-hover:scale-105 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300 transition-all duration-300">
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
          {value}
        </div>
        <div className="text-xs font-medium text-[var(--foreground)] opacity-90">
          {label}
        </div>
        {subtext && (
          <p className="text-[11px] text-[var(--muted)] pt-0.5 line-clamp-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
