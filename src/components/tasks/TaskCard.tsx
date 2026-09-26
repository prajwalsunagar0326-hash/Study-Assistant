import React from 'react';
import { CheckCircle2, Calendar, Tag, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { Task } from '../../types/productivity';
import { getTodayDateString, getTomorrowDateString } from '../../lib/storage';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  const isDueToday = task.dueDate === todayStr;
  const isOverdue = Boolean(task.dueDate && task.dueDate < todayStr && !task.completed);
  const isDueTomorrow = task.dueDate === tomorrowStr;

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return (
          <span className="badge badge-hard text-[10px]">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="badge badge-medium text-[10px]">
            Medium
          </span>
        );
      default:
        return (
          <span className="badge badge-easy text-[10px]">
            Low
          </span>
        );
    }
  };

  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    if (isOverdue) return <span className="text-rose-400 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overdue ({task.dueDate})</span>;
    if (isDueToday) return <span className="text-amber-300 font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> Due Today</span>;
    if (isDueTomorrow) return <span className="text-slate-300 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Due Tomorrow</span>;
    return <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.dueDate}</span>;
  };

  return (
    <div
      className={`glass-panel hover-lift glass-stroke-border p-4 flex items-start justify-between gap-3 transition-all ${
        task.completed
          ? 'opacity-60 bg-slate-950/40 border-slate-850'
          : 'hover:border-indigo-500/50 bg-[var(--surface-muted)] hover:shadow-lg hover:shadow-indigo-500/10'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Accessible Checkbox Button */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'completed'}`}
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-slate-950'
              : 'border-slate-400 dark:border-slate-500 hover:border-indigo-500 bg-white dark:bg-slate-900/50'
          }`}
        >
          {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm sm:text-base font-semibold leading-snug break-words ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>
            {getPriorityBadge(task.priority)}
          </div>

          {task.description && (
            <p className="text-xs text-slate-600 dark:text-[var(--muted)] leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Badges / Metadata row */}
          <div className="flex items-center gap-3 text-xs text-[var(--muted)] pt-1 flex-wrap">
            {getDueDateLabel()}

            {task.category && (
              <span className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                <Tag className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                <span>{task.category}</span>
              </span>
            )}

            {task.completedAt && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0 ml-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Edit Task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
