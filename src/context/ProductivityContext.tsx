import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  NavigationTab,
  Task,
  StudyEvent,
  Bookmark,
  StudentProfile,
  StudyStatistics,
  PomodoroSettings,
  StudySetSummary,
  ToastNotification,
  ActivityItem,
} from '../types/productivity';
import { StudyPlan } from '../types/study';
import {
  loadStorage,
  saveStorage,
  calculateStudyStreak,
  getTodayDateString,
  StudyAIStorageState,
} from '../lib/storage';

interface ProductivityContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Profile
  profile: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Calendar Events
  events: StudyEvent[];
  addEvent: (event: Omit<StudyEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<StudyEvent>) => void;
  deleteEvent: (id: string) => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (sourceId: string) => boolean;

  // Pomodoro Settings
  pomodoroSettings: PomodoroSettings;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;

  // Study Statistics & Streak
  statistics: StudyStatistics;
  studyStreak: number;
  recordStudyDate: () => void;
  recordFlashcardReview: (count: number) => void;
  recordQuizCompletion: (score: number, total: number) => void;
  recordPomodoroSession: (minutes: number) => void;
  recordActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;

  // Saved Study Sets
  savedStudySets: StudySetSummary[];
  saveStudySet: (plan: StudyPlan) => void;
  removeStudySet: (id: string) => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const ProductivityContext = createContext<ProductivityContextType | null>(null);

export const ProductivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StudyAIStorageState>(() => loadStorage());
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Synchronize state with localStorage whenever it changes
  useEffect(() => {
    saveStorage(state);
  }, [state]);

  // Toast Helpers
  const addToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastNotification = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Activity Logger Helper
  const recordActivity = useCallback((act: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: timeStr,
      ...act,
    };

    setState((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        recentActivities: [newActivity, ...prev.statistics.recentActivities.slice(0, 19)],
      },
    }));
  }, []);

  // Record Study Date for Streak Calculation
  const recordStudyDate = useCallback(() => {
    const today = getTodayDateString();
    setState((prev) => {
      if (prev.statistics.studyDates.includes(today)) return prev;
      return {
        ...prev,
        statistics: {
          ...prev.statistics,
          studyDates: [...prev.statistics.studyDates, today],
        },
      };
    });
  }, []);

  // Profile
  const updateProfile = useCallback((updates: Partial<StudentProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
    addToast('Profile updated', 'Your student preferences were saved locally.');
  }, [addToast]);

  // Task Operations
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false,
      ...taskData,
    };

    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));

    recordStudyDate();
    recordActivity({
      type: 'task',
      title: `Created task "${newTask.title}"`,
      badge: 'Task Added',
    });
    addToast('Task added', `"${newTask.title}" is ready.`);
  }, [addToast, recordActivity, recordStudyDate]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    addToast('Task updated', 'Changes saved successfully.');
  }, [addToast]);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
    addToast('Task deleted', undefined, 'info');
  }, [addToast]);

  const toggleTask = useCallback((id: string) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === id);
      if (!task) return prev;

      const nextCompleted = !task.completed;
      const completedAt = nextCompleted ? new Date().toISOString() : undefined;
      const completedTasksDiff = nextCompleted ? 1 : -1;

      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, completed: nextCompleted, completedAt } : t
        ),
        statistics: {
          ...prev.statistics,
          completedTasks: Math.max(0, prev.statistics.completedTasks + completedTasksDiff),
        },
      };
    });

    const target = state.tasks.find((t) => t.id === id);
    if (target) {
      if (!target.completed) {
        recordStudyDate();
        recordActivity({
          type: 'task',
          title: `Completed "${target.title}"`,
          badge: 'Task Done',
        });
        addToast('Task completed! 🎉', `Great job finishing "${target.title}".`);
      } else {
        addToast('Task reopened', `"${target.title}" is back on your list.`, 'info');
      }
    }
  }, [state.tasks, addToast, recordActivity, recordStudyDate]);

  // Calendar Event Operations
  const addEvent = useCallback((eventData: Omit<StudyEvent, 'id'>) => {
    const newEvent: StudyEvent = {
      id: `event-${Date.now()}`,
      ...eventData,
    };

    setState((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));

    recordStudyDate();
    recordActivity({
      type: 'study',
      title: `Scheduled "${newEvent.title}" on ${newEvent.date}`,
      badge: 'Event Added',
    });
    addToast('Event scheduled', `"${newEvent.title}" added to your calendar.`);
  }, [addToast, recordActivity, recordStudyDate]);

  const updateEvent = useCallback((id: string, updates: Partial<StudyEvent>) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    addToast('Event updated', 'Calendar updated successfully.');
  }, [addToast]);

  const deleteEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
    addToast('Event removed', undefined, 'info');
  }, [addToast]);

  // Bookmark Operations
  const addBookmark = useCallback((bmData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBm: Bookmark = {
      id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...bmData,
    };

    setState((prev) => ({
      ...prev,
      bookmarks: [newBm, ...prev.bookmarks],
    }));

    recordActivity({
      type: 'bookmark',
      title: `Saved bookmark "${newBm.title}"`,
      badge: 'Bookmark',
    });
    addToast('Saved to Bookmarks ⭐', `"${newBm.title}" is now available in your bookmarks.`);
  }, [addToast, recordActivity]);

  const removeBookmark = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== id && b.sourceId !== id),
    }));
    addToast('Bookmark removed', undefined, 'info');
  }, [addToast]);

  const isBookmarked = useCallback((sourceId: string): boolean => {
    return state.bookmarks.some((b) => b.sourceId === sourceId || b.id === sourceId);
  }, [state.bookmarks]);

  // Pomodoro Settings
  const updatePomodoroSettings = useCallback((settingsUpdates: Partial<PomodoroSettings>) => {
    setState((prev) => ({
      ...prev,
      pomodoroSettings: { ...prev.pomodoroSettings, ...settingsUpdates },
    }));
    addToast('Pomodoro settings saved', 'Timer parameters updated.');
  }, [addToast]);

  // Statistics Recording
  const recordFlashcardReview = useCallback((count: number) => {
    setState((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        flashcardsReviewed: prev.statistics.flashcardsReviewed + count,
      },
    }));
    recordStudyDate();
  }, [recordStudyDate]);

  const recordQuizCompletion = useCallback((score: number, total: number) => {
    setState((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        quizAttempts: prev.statistics.quizAttempts + 1,
        correctAnswers: prev.statistics.correctAnswers + score,
        totalAnswers: prev.statistics.totalAnswers + total,
      },
    }));
    recordStudyDate();
    recordActivity({
      type: 'quiz',
      title: `Completed quiz with score ${score}/${total} (${Math.round((score / total) * 100)}%)`,
      badge: 'Quiz Completed',
    });
  }, [recordActivity, recordStudyDate]);

  const recordPomodoroSession = useCallback((minutes: number) => {
    setState((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        pomodoroSessions: prev.statistics.pomodoroSessions + 1,
      },
    }));
    recordStudyDate();
    recordActivity({
      type: 'pomodoro',
      title: `Completed ${minutes}-min Focus Session`,
      badge: 'Focus Achieved',
    });
    addToast('Focus Session Complete! 🍅', 'Great discipline! Take a well-deserved break.');
  }, [addToast, recordActivity, recordStudyDate]);

  // Saved Study Sets
  const saveStudySet = useCallback((plan: StudyPlan) => {
    const summary: StudySetSummary = {
      id: `studyset-${Date.now()}`,
      title: plan.title,
      summary: plan.summary,
      createdAt: new Date().toISOString(),
      flashcardCount: plan.flashcards.length,
      quizCount: plan.quiz.questions.length,
      plan,
    };

    setState((prev) => {
      // Don't duplicate if already present with same title
      const existing = prev.savedStudySets.find((s) => s.title.toLowerCase() === plan.title.toLowerCase());
      if (existing) return prev;
      return {
        ...prev,
        savedStudySets: [summary, ...prev.savedStudySets.slice(0, 9)],
      };
    });

    addToast('Study Set Saved', `"${plan.title}" saved to your study library.`);
  }, [addToast]);

  const removeStudySet = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      savedStudySets: prev.savedStudySets.filter((s) => s.id !== id),
    }));
    addToast('Study Set removed from library', undefined, 'info');
  }, [addToast]);

  // Derived Consecutive Day Streak
  const studyStreak = useMemo(() => {
    return calculateStudyStreak(state.statistics.studyDates);
  }, [state.statistics.studyDates]);

  const contextValue = useMemo<ProductivityContextType>(() => ({
    activeTab,
    setActiveTab,
    isSearchOpen,
    setIsSearchOpen,
    profile: state.profile,
    updateProfile,
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    events: state.events,
    addEvent,
    updateEvent,
    deleteEvent,
    bookmarks: state.bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    pomodoroSettings: state.pomodoroSettings,
    updatePomodoroSettings,
    statistics: state.statistics,
    studyStreak,
    recordStudyDate,
    recordFlashcardReview,
    recordQuizCompletion,
    recordPomodoroSession,
    recordActivity,
    savedStudySets: state.savedStudySets,
    saveStudySet,
    removeStudySet,
    toasts,
    addToast,
    removeToast,
  }), [
    activeTab,
    isSearchOpen,
    state.profile,
    updateProfile,
    state.tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    state.events,
    addEvent,
    updateEvent,
    deleteEvent,
    state.bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    state.pomodoroSettings,
    updatePomodoroSettings,
    state.statistics,
    studyStreak,
    recordStudyDate,
    recordFlashcardReview,
    recordQuizCompletion,
    recordPomodoroSession,
    recordActivity,
    state.savedStudySets,
    saveStudySet,
    removeStudySet,
    toasts,
    addToast,
    removeToast,
  ]);

  return (
    <ProductivityContext.Provider value={contextValue}>
      {children}
    </ProductivityContext.Provider>
  );
};

export function useProductivity(): ProductivityContextType {
  const ctx = useContext(ProductivityContext);
  if (!ctx) {
    throw new Error('useProductivity must be used within a ProductivityProvider');
  }
  return ctx;
}
