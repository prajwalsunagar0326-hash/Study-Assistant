import React, { useState, useMemo } from 'react';
import { Plus, ListFilter, ArrowUpDown, CheckCircle } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { Task } from '../../types/productivity';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { getTodayDateString } from '../../lib/storage';

type TaskFilter = 'all' | 'active' | 'completed' | 'today' | 'upcoming' | 'high';
type TaskSort = 'dueDate' | 'priority' | 'createdAt' | 'title';

export const TaskPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useProductivity();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('dueDate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todayStr = getTodayDateString();

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      if (filter === 'today') return t.dueDate === todayStr;
      if (filter === 'upcoming') return Boolean(t.dueDate && t.dueDate > todayStr && !t.completed);
      if (filter === 'high') return t.priority === 'high' && !t.completed;
      return true;
    });
  }, [tasks, filter, todayStr]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    list.sort((a, b) => {
      if (sort === 'priority') {
        const pOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      if (sort === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      // createdAt default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [filteredTasks, sort]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Study Tasks & To-Dos
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Organize assignments, syllabus readings, and revision milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary self-start sm:self-center text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl glass-panel text-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <ListFilter className="w-4 h-4 text-indigo-400 shrink-0 ml-1 mr-0.5" />
          {(
            [
              { key: 'all', label: `All (${tasks.length})` },
              { key: 'active', label: `Active (${activeCount})` },
              { key: 'today', label: 'Due Today' },
              { key: 'high', label: 'High Priority' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: `Completed (${completedCount})` },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                filter === item.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-[var(--muted)]" />
          <span className="text-[var(--muted)]">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TaskSort)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Recently Added</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="p-12 text-center space-y-3 border border-dashed border-slate-300 dark:border-slate-700/60 rounded-2xl glass-panel">
          <CheckCircle className="w-10 h-10 text-indigo-500 dark:text-indigo-400/60 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks! You are all caught up.'
              : 'No tasks found'}
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            {filter === 'all'
              ? 'Add your first task to start organizing your study day and tracking deliverables.'
              : 'Try changing your filter or add a new task.'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-primary text-xs px-4 py-2 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={handleOpenEdit}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialTask={editingTask}
      />
    </div>
  );
};
