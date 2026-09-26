import React, { useState } from 'react';
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

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, statistics, studyStreak, tasks, bookmarks, savedStudySets } = useProductivity();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
    studyGoal: profile.studyGoal,
    avatarInitials: profile.avatarInitials,
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  // Derived metrics from actual data
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const quizAccuracy = statistics.totalAnswers > 0
    ? Math.round((statistics.correctAnswers / statistics.totalAnswers) * 100)
    : 0;
  const totalFocusHours = ((statistics.pomodoroSessions * 25) / 60).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Student Profile Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-600/10 via-indigo-600/10 to-violet-600/10 border border-brand-500/20 shadow-xl backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Initials with Glow */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-brand-500/25 border-2 border-white/20">
                {profile.avatarInitials || 'ST'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white dark:border-slate-900" title={`${studyStreak} Day Streak`}>
                <Flame className="w-4 h-4 fill-current animate-pulse text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  Student Learner
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {studyStreak} Day Streak
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{profile.email}</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                {profile.bio || 'Passionate student working on active recall, spaced repetition, and interactive mastery.'}
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              setFormData({
                name: profile.name,
                email: profile.email,
                bio: profile.bio,
                studyGoal: profile.studyGoal,
                avatarInitials: profile.avatarInitials,
              });
              setIsEditing(!isEditing);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" /> Cancel Edit
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-brand-500" /> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Study Goal Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm">
            <Target className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Current Study Goal:</span>
            <span className="text-slate-600 dark:text-slate-400 italic">"{profile.studyGoal}"</span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI-Enhanced Learning Active
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Drawer when active */}
      {isEditing && (
        <form
          onSubmit={handleEditSubmit}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800/50 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-brand-500" /> Edit Student Details
            </h2>
            <span className="text-xs text-slate-400">Updates are saved locally</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Study Goal
              </label>
              <input
                type="text"
                value={formData.studyGoal}
                onChange={(e) => setFormData({ ...formData, studyGoal: e.target.value })}
                placeholder="e.g. Master Operating Systems & Finish Semester Project"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Avatar Initials (max 2)
              </label>
              <input
                type="text"
                maxLength={2}
                value={formData.avatarInitials}
                onChange={(e) => setFormData({ ...formData, avatarInitials: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Short Bio
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Real Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-500" />
              Verified Learning Metrics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculated dynamically from your actual tasks, quizzes, flashcards, and timer sessions.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Real Data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1: Study Streak */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1">
                {studyStreak}
                <span className="text-xs font-medium text-slate-400">days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {studyStreak > 0 ? 'Consistent daily study active' : 'Study today to start your streak'}
              </p>
            </div>
          </div>

          {/* Card 2: Quiz Accuracy */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quiz Retention</span>
              <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {statistics.totalAnswers > 0 ? `${quizAccuracy}%` : 'N/A'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {statistics.totalAnswers > 0 
                  ? `${statistics.correctAnswers} / ${statistics.totalAnswers} correct answers` 
                  : 'Complete a quiz to benchmark'}
              </p>
            </div>
          </div>

          {/* Card 3: Flashcards Studied */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cards Reviewed</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {statistics.flashcardsReviewed}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Active recall iterations
              </p>
            </div>
          </div>

          {/* Card 4: Pomodoro Focus Hours */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Focus Hours</span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1">
                {totalFocusHours}
                <span className="text-xs font-medium text-slate-400">hrs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {statistics.pomodoroSessions} completed focus sessions
              </p>
            </div>
          </div>

          {/* Card 5: Tasks Completed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tasks Completed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {completedTasks}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {pendingTasks} tasks currently in queue
              </p>
            </div>
          </div>

          {/* Card 6: Bookmarks Saved */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saved Bookmarks</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center">
                <BookmarkIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {bookmarks.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Key cards & questions pinned
              </p>
            </div>
          </div>

          {/* Card 7: Saved AI Sets */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Study Sets</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-500 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {savedStudySets.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                AI topics saved in local storage
              </p>
            </div>
          </div>

          {/* Card 8: Quiz Attempts */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quiz Attempts</span>
              <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {statistics.quizAttempts}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Full quiz rounds evaluated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Days Consistency Log */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Study Calendar Activity Dates
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {statistics.studyDates.length} recorded active {statistics.studyDates.length === 1 ? 'day' : 'days'}
          </span>
        </div>

        {statistics.studyDates.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Start studying to build your statistics. Complete tasks, review flashcards, or finish a pomodoro to record your first study day.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {statistics.studyDates.map((dateStr) => (
              <span
                key={dateStr}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                {dateStr}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
