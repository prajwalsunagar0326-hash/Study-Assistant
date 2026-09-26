import { StudyPlan } from './study';

export type NavigationTab =
  | 'dashboard'
  | 'study'
  | 'tasks'
  | 'calendar'
  | 'bookmarks'
  | 'pomodoro'
  | 'profile';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string; // Format: YYYY-MM-DD
  category?: string;
  createdAt: string;
  completedAt?: string;
}

export type StudyEventType = 'study' | 'assignment' | 'exam' | 'deadline' | 'other';

export interface StudyEvent {
  id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  startTime?: string; // Format: HH:MM
  endTime?: string;
  type: StudyEventType;
  description?: string;
}

export type BookmarkType = 'flashcard' | 'quiz' | 'study-set';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  title: string;
  content: string;
  sourceId?: string;
  createdAt: string;
  metadata?: {
    difficulty?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
  };
}

export interface PomodoroSettings {
  focusDuration: number; // in minutes (default: 25)
  shortBreakDuration: number; // in minutes (default: 5)
  longBreakDuration: number; // in minutes (default: 15)
  longBreakInterval: number; // sessions before long break (default: 4)
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface StudentProfile {
  name: string;
  email: string;
  bio: string;
  studyGoal: string;
  avatarInitials: string;
}

export interface ActivityItem {
  id: string;
  type: 'task' | 'pomodoro' | 'study' | 'quiz' | 'bookmark';
  title: string;
  timestamp: string;
  badge?: string;
}

export interface StudyStatistics {
  completedTasks: number;
  pomodoroSessions: number;
  flashcardsReviewed: number;
  quizAttempts: number;
  correctAnswers: number;
  totalAnswers: number;
  studyDates: string[]; // List of YYYY-MM-DD dates where student had activity
  recentActivities: ActivityItem[];
}

export interface StudySetSummary {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  flashcardCount: number;
  quizCount: number;
  plan: StudyPlan;
}

export type SearchResultType =
  | 'task'
  | 'event'
  | 'bookmark'
  | 'flashcard'
  | 'quiz'
  | 'study-set';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  preview: string;
  tab: NavigationTab;
  actionData?: any;
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}
