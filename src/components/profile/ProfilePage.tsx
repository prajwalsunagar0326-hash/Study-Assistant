import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { useProductivity } from '../../context/ProductivityContext';
import { 
  Mail, 
  BookOpen, 
  Target, 
  Flame, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Bookmark as BookmarkIcon, 
  Edit3, 
  Save, 
  X, 
  Sparkles,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { ProfileFormSchema, ProfileFormData } from '../../lib/schemas';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, statistics, studyStreak, tasks, bookmarks, savedStudySets } = useProductivity();
  
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      bio: profile.bio || '',
      studyGoal: profile.studyGoal || '',
      avatarInitials: profile.avatarInitials || '',
    },
  });

  useEffect(() => {
    reset({
      name: profile.name,
      email: profile.email,
      bio: profile.bio || '',
      studyGoal: profile.studyGoal || '',
      avatarInitials: profile.avatarInitials || '',
    });
  }, [profile, reset]);

  const onValidSubmit = (data: ProfileFormData) => {
    updateProfile({
      name: data.name,
      email: data.email,
      bio: data.bio || undefined,
      studyGoal: data.studyGoal || undefined,
      avatarInitials: data.avatarInitials?.toUpperCase() || undefined,
    });
    setIsEditing(false);
  };

  // Derived metrics from actual data
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const quizAccuracy = statistics.totalAnswers > 0
    ? Math.round((statistics.correctAnswers / statistics.totalAnswers) * 100)
    : 0;
  const totalFocusHours = ((statistics.pomodoroSessions * 25) / 60).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Banner / Student Profile Card */}
      <div className="glass-panel p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar Initials */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-300 via-white to-slate-200 text-slate-950 flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-white/10 border border-white/40">
                {profile.avatarInitials || 'ST'}
              </div>
              <div
                className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-white p-1 rounded-lg shadow-sm border border-slate-900"
                title={`${studyStreak} Day Streak`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                  {profile.name}
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)]">
                  Student Learner
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100/10 dark:bg-white/10 text-[var(--foreground)] border border-slate-300/20 dark:border-white/15 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500 fill-current" />
                  {studyStreak} Day Streak
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[var(--muted)]">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.email}</span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--foreground)]/80 max-w-xl leading-relaxed">
                {profile.bio || 'Dedicated to active recall, spaced repetition, and deep learning.'}
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                reset();
              }
              setIsEditing(!isEditing);
            }}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" /> Cancel Edit
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Study Goal Bar */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="font-semibold text-[var(--foreground)]">Current Study Goal:</span>
            <span className="text-[var(--muted)] italic">"{profile.studyGoal}"</span>
          </div>
          <div className="text-[11px] text-[var(--muted)] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Active recall & structured practice
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Drawer when active */}
      <AnimatePresence>
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onValidSubmit)}
            className="glass-panel p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-500" /> Edit Student Details
              </h2>
              <span className="text-[11px] text-[var(--muted)]">Updates persist in local storage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500"
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500"
                />
                {errors.email && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Study Goal
                </label>
                <input
                  type="text"
                  {...register('studyGoal')}
                  placeholder="e.g. Master Operating Systems & Finish Semester Project"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--foreground)] mb-1">
                  Avatar Initials (max 2)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  {...register('avatarInitials')}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500 text-center font-bold"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-[var(--foreground)] mb-1">
                Short Bio
              </label>
              <textarea
                rows={2}
                {...register('bio')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary text-xs px-3.5 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Restrained Statistics Section (Uniform design system, no rainbow cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              Verified Learning Metrics
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Calculated dynamically from your actual tasks, quizzes, flashcards, and timer sessions.
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Real Data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Study Streak */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Current Streak</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] flex items-baseline gap-1">
                {studyStreak}
                <span className="text-xs font-normal text-[var(--muted)]">days</span>
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                {studyStreak > 0 ? 'Consistent daily study' : 'Study today to start'}
              </p>
            </div>
          </div>

          {/* Card 2: Quiz Accuracy */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Quiz Retention</span>
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                {statistics.totalAnswers > 0 ? `${quizAccuracy}%` : 'N/A'}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                {statistics.totalAnswers > 0 
                  ? `${statistics.correctAnswers} / ${statistics.totalAnswers} correct` 
                  : 'Complete a quiz'}
              </p>
            </div>
          </div>

          {/* Card 3: Flashcards Studied */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Cards Reviewed</span>
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                {statistics.flashcardsReviewed}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                Active recall iterations
              </p>
            </div>
          </div>

          {/* Card 4: Pomodoro Focus Hours */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Focus Hours</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] flex items-baseline gap-1">
                {totalFocusHours}
                <span className="text-xs font-normal text-[var(--muted)]">hrs</span>
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                {statistics.pomodoroSessions} sessions completed
              </p>
            </div>
          </div>

          {/* Card 5: Tasks Completed */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Tasks Done</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                {completedTasks}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                {pendingTasks} remaining in queue
              </p>
            </div>
          </div>

          {/* Card 6: Bookmarks Saved */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Bookmarks</span>
              <BookmarkIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                {bookmarks.length}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                Pinned cards & questions
              </p>
            </div>
          </div>

          {/* Card 7: Saved AI Sets */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Study Sets</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                {savedStudySets.length}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                Saved AI modules
              </p>
            </div>
          </div>

          {/* Card 8: Quiz Attempts */}
          <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col justify-between hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">Quiz Runs</span>
              <HelpCircle className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                {statistics.quizAttempts}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                Full quiz rounds taken
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Days Consistency Log */}
      <div className="glass-panel p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              Study Calendar Activity Dates
            </h3>
          </div>
          <span className="text-[11px] text-[var(--muted)]">
            {statistics.studyDates.length} recorded active {statistics.studyDates.length === 1 ? 'day' : 'days'}
          </span>
        </div>

        {statistics.studyDates.length === 0 ? (
          <div className="p-5 rounded-xl border border-dashed border-[var(--border)] text-center">
            <p className="text-xs text-[var(--muted)]">
              Start studying to build your statistics. Complete tasks, review flashcards, or finish a pomodoro to record your first study day.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {statistics.studyDates.map((dateStr) => (
              <span
                key={dateStr}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {dateStr}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
