import React, { useMemo } from 'react';
import {
  CheckSquare,
  Timer,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Clock,
  History,
  Layers,
  Brain,
  Sparkles,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { StatsCard } from './StatsCard';
import { TodayPlan } from './TodayPlan';
import { QuickActions } from './QuickActions';

interface DashboardProps {
  onLoadStudyPlan?: (plan: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLoadStudyPlan }) => {
  const {
    profile,
    tasks,
    statistics,
    studyStreak,
    savedStudySets,
    setActiveTab,
  } = useProductivity();

  // Dynamic Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const quizAccuracy = useMemo(() => {
    if (statistics.totalAnswers === 0) return 0;
    return Math.round((statistics.correctAnswers / statistics.totalAnswers) * 100);
  }, [statistics.correctAnswers, statistics.totalAnswers]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Dashboard Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {formattedDate}
            </span>
            <span className="text-[var(--muted-dark)]">•</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{studyStreak} Day Streak</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            {greeting}, <span className="gradient-text">{profile.name}</span> 👋
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
            {profile.studyGoal ? `Focus Goal: ${profile.studyGoal}` : 'Ready to turn your study material into active knowledge?'}
          </p>
        </div>

        {/* Generate Study CTA */}
        <button
          type="button"
          onClick={() => setActiveTab('study')}
          className="btn-primary shrink-0 self-start md:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Study Workspace</span>
        </button>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 scroll-reveal-stagger">
        <StatsCard
          label="Tasks Completed"
          value={`${completedTasksCount} / ${tasks.length}`}
          subtext={`${tasks.length - completedTasksCount} pending deliverables`}
          icon={<CheckSquare className="w-4 h-4 text-indigo-400" />}
          badge={tasks.length > 0 ? `${Math.round((completedTasksCount / tasks.length) * 100)}%` : undefined}
        />
        <StatsCard
          label="Study Sessions"
          value={statistics.pomodoroSessions + statistics.quizAttempts}
          subtext={`${statistics.pomodoroSessions} pomodoros • ${statistics.quizAttempts} quizzes`}
          icon={<Timer className="w-4 h-4 text-indigo-400" />}
          badge="Total"
        />
        <StatsCard
          label="Study Streak"
          value={`${studyStreak} Days`}
          subtext="Daily active recall habit"
          icon={<Flame className="w-4 h-4 text-amber-400" />}
          badge={studyStreak > 0 ? 'Active' : 'Start Today'}
        />
        <StatsCard
          label="Quiz Accuracy"
          value={statistics.totalAnswers > 0 ? `${quizAccuracy}%` : 'N/A'}
          subtext={`${statistics.correctAnswers} of ${statistics.totalAnswers} correct`}
          icon={<Award className="w-4 h-4 text-emerald-400" />}
          badge="Retention"
        />
      </div>

      {/* Main Focus: 2/3 Today's Plan + 1/3 Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch scroll-reveal">
        <div className="lg:col-span-2">
          <TodayPlan />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Two Column Section: Saved Study Sets & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-reveal">
        {/* Saved Study Sets Library */}
        <div className="glass-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
                Saved Study Sets ({savedStudySets.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('study')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Create New</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {savedStudySets.length === 0 ? (
            <div className="p-8 text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto opacity-70" />
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">No saved study sets yet</h4>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Generate flashcards or quizzes on the Study page to build your personal active-recall library.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('study')}
                className="btn-secondary text-xs px-3 py-1.5 mt-2"
              >
                <span>Generate Study Set</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedStudySets.slice(0, 3).map((set) => (
                <div
                  key={set.id}
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] hover:border-indigo-500/40 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate">
                      {set.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {set.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{set.flashcardCount} cards</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        <span>{set.quizCount} questions</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onLoadStudyPlan) onLoadStudyPlan(set.plan);
                      setActiveTab('study');
                    }}
                    className="btn-secondary text-xs px-3 py-1.5 shrink-0 self-center"
                  >
                    <span>Resume</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real Activity Stream */}
        <div className="glass-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
                Recent Activity
              </h3>
            </div>
            <span className="text-xs text-[var(--muted)]">Live Learning Log</span>
          </div>

          {statistics.recentActivities.length === 0 ? (
            <div className="p-8 text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[var(--muted)]">
              No learning activities recorded yet. Complete a task or start a study set!
            </div>
          ) : (
            <div className="space-y-2.5">
              {statistics.recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-start gap-3 text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {act.timestamp}
                      </span>
                      {act.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {act.badge}
                        </span>
                      )}
                    </div>
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
