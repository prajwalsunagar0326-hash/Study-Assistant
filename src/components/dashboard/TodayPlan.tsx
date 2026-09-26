import React from 'react';
import { CheckSquare, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { getTodayDateString } from '../../lib/storage';

export const TodayPlan: React.FC = () => {
  const { tasks, events, toggleTask, setActiveTab } = useProductivity();
  const todayStr = getTodayDateString();

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || !t.completed);
  const todayEvents = events.filter((e) => e.date === todayStr);

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
            Today's Schedule & Tasks
          </h3>
        </div>
        <span className="text-xs text-[var(--muted)]">
          {todayTasks.filter((t) => t.completed).length}/{todayTasks.length} Completed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Tasks Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Priority Tasks</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-700/60 text-center text-xs text-[var(--muted)]">
              No tasks due today. You're all caught up!
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                      : 'bg-[var(--surface-muted)] border-[var(--border)] hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-500 hover:border-indigo-400'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-medium leading-snug truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                          task.priority === 'high'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.category && (
                        <span className="text-[10px] text-[var(--muted-dark)] truncate">
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Events Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calendar Events Today</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
            >
              <span>Calendar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {todayEvents.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-700/60 text-center text-xs text-[var(--muted)]">
              No sessions scheduled today. Click Calendar to plan one.
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 text-center min-w-[50px]">
                    <span className="text-[11px] font-bold block">{ev.startTime || 'All Day'}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                      {ev.description || `${ev.type.toUpperCase()} session`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
