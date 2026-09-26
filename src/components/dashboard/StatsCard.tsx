import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconColor: string;
  badge?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtext,
  icon,
  iconColor,
  badge,
}) => {
  return (
    <div className="glass-panel p-5 space-y-3 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:border-slate-600/60">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-xl ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          {value}
        </div>
        <div className="text-xs font-semibold text-[var(--muted)]">
          {label}
        </div>
        {subtext && (
          <p className="text-[11px] text-[var(--muted-dark)] pt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
