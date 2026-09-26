import {
  StudentProfile,
  Task,
  StudyEvent,
  Bookmark,
  StudyStatistics,
  PomodoroSettings,
  StudySetSummary,
} from '../types/productivity';

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'studyai_storage_v1';

export interface StudyAIStorageState {
  version: number;
  profile: StudentProfile;
  tasks: Task[];
  events: StudyEvent[];
  bookmarks: Bookmark[];
  statistics: StudyStatistics;
  pomodoroSettings: PomodoroSettings;
  savedStudySets: StudySetSummary[];
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateElapsedSeconds(startTimeMs: number, currentTimeMs: number = Date.now()): number {
  return Math.max(0, Math.floor((currentTimeMs - startTimeMs) / 1000));
}

export const DEFAULT_STORAGE_STATE: StudyAIStorageState = {
  version: STORAGE_VERSION,
  profile: {
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    bio: 'Computer Science student passionate about distributed systems, algorithm design, and AI.',
    studyGoal: 'Deep-dive into Operating Systems, Database Normalization, and ML Architecture.',
    avatarInitials: 'AJ',
  },
  tasks: [
    {
      id: 'task-seed-1',
      title: 'Review DBMS Normalization & 3NF Rules',
      description: 'Go through Boyce-Codd Normal Form dependencies and functional closure decomposition.',
      completed: true,
      priority: 'high',
      dueDate: getTodayDateString(),
      category: 'Database Systems',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: 'task-seed-2',
      title: 'Revise Operating Systems Paging & Virtual Memory',
      description: 'Practice TLB hit ratio calculations and page replacement algorithms (LRU, FIFO).',
      completed: false,
      priority: 'high',
      dueDate: getTodayDateString(),
      category: 'Operating Systems',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-seed-3',
      title: 'Machine Learning Gradient Descent Assignment',
      description: 'Implement mini-batch stochastic gradient descent with momentum in Python.',
      completed: false,
      priority: 'medium',
      dueDate: getTomorrowDateString(),
      category: 'Machine Learning',
      createdAt: new Date().toISOString(),
    },
  ],
  events: [
    {
      id: 'event-seed-1',
      title: 'Operating Systems Revision',
      date: getTodayDateString(),
      startTime: '10:00',
      endTime: '11:30',
      type: 'study',
      description: 'Deep-dive session into process scheduling and race conditions.',
    },
    {
      id: 'event-seed-2',
      title: 'DBMS Project Submission Due',
      date: getTodayDateString(),
      startTime: '16:00',
      endTime: '17:00',
      type: 'deadline',
      description: 'Submit normalized schema diagrams and SQL DDL scripts.',
    },
    {
      id: 'event-seed-3',
      title: 'Machine Learning Midterm Prep',
      date: getTomorrowDateString(),
      startTime: '14:00',
      endTime: '16:00',
      type: 'exam',
      description: 'Mock exam covering bias-variance tradeoff and evaluation metrics.',
    },
  ],
  bookmarks: [
    {
      id: 'bm-seed-1',
      type: 'flashcard',
      title: 'Polymorphism in Object-Oriented Programming',
      content: 'Dynamic method dispatch resolves overridden methods at runtime based on actual object instance.',
      sourceId: 'card-1',
      createdAt: new Date().toISOString(),
      metadata: { difficulty: 'medium' },
    },
  ],
  statistics: {
    completedTasks: 1,
    pomodoroSessions: 2,
    flashcardsReviewed: 15,
    quizAttempts: 2,
    correctAnswers: 9,
    totalAnswers: 10,
    studyDates: [getYesterdayDateString(), getTodayDateString()],
    recentActivities: [
      {
        id: 'act-seed-1',
        type: 'task',
        title: 'Completed "Review DBMS Normalization & 3NF Rules"',
        timestamp: 'Today, 09:30 AM',
        badge: 'Task Completed',
      },
      {
        id: 'act-seed-2',
        type: 'pomodoro',
        title: 'Completed 25-min Focus Session on Operating Systems',
        timestamp: 'Today, 10:45 AM',
        badge: 'Pomodoro',
      },
      {
        id: 'act-seed-3',
        type: 'quiz',
        title: 'Scored 9/10 (90%) on Java OOP Practice Quiz',
        timestamp: 'Yesterday',
        badge: 'Quiz Passed',
      },
    ],
  },
  pomodoroSettings: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  },
  savedStudySets: [],
};

/**
 * Calculates current consecutive day study streak
 */
export function calculateStudyStreak(studyDates: string[]): number {
  if (!studyDates || studyDates.length === 0) return 0;

  // Filter valid YYYY-MM-DD strings and sort descending
  const uniqueDates = Array.from(new Set(studyDates.filter(Boolean))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const mostRecent = uniqueDates[0];
  // If the student hasn't studied today or yesterday, streak is 0
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  // Parse YYYY-MM-DD to UTC day index: Math.floor(Date.UTC(y, m - 1, d) / 86400000)
  const toDayIndex = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / (1000 * 60 * 60 * 24));
  };

  let streak = 0;
  let expectedDay = toDayIndex(mostRecent);

  for (const dateStr of uniqueDates) {
    const currentDay = toDayIndex(dateStr);
    if (currentDay === expectedDay) {
      streak += 1;
      expectedDay -= 1;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Loads storage safely with fallback recovery for corrupt data or missing fields
 */
export function loadStorage(): StudyAIStorageState {
  if (typeof window === 'undefined') {
    return DEFAULT_STORAGE_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStorage(DEFAULT_STORAGE_STATE);
      return DEFAULT_STORAGE_STATE;
    }

    const parsed = JSON.parse(raw);

    // Schema version check and field normalization
    if (!parsed || typeof parsed !== 'object' || parsed.version !== STORAGE_VERSION) {
      console.warn('[Storage] Upgrading or resetting legacy storage format to v1.');
      saveStorage(DEFAULT_STORAGE_STATE);
      return DEFAULT_STORAGE_STATE;
    }

    return {
      version: STORAGE_VERSION,
      profile: {
        ...DEFAULT_STORAGE_STATE.profile,
        ...(parsed.profile || {}),
      },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : DEFAULT_STORAGE_STATE.tasks,
      events: Array.isArray(parsed.events) ? parsed.events : DEFAULT_STORAGE_STATE.events,
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : DEFAULT_STORAGE_STATE.bookmarks,
      statistics: {
        ...DEFAULT_STORAGE_STATE.statistics,
        ...(parsed.statistics || {}),
        studyDates: Array.isArray(parsed.statistics?.studyDates)
          ? parsed.statistics.studyDates
          : DEFAULT_STORAGE_STATE.statistics.studyDates,
        recentActivities: Array.isArray(parsed.statistics?.recentActivities)
          ? parsed.statistics.recentActivities
          : DEFAULT_STORAGE_STATE.statistics.recentActivities,
      },
      pomodoroSettings: {
        ...DEFAULT_STORAGE_STATE.pomodoroSettings,
        ...(parsed.pomodoroSettings || {}),
      },
      savedStudySets: Array.isArray(parsed.savedStudySets) ? parsed.savedStudySets : [],
    };
  } catch (err) {
    console.error('[Storage Error] Failed to read localStorage. Recovering with defaults.', err);
    return DEFAULT_STORAGE_STATE;
  }
}

/**
 * Persists storage safely
 */
export function saveStorage(state: StudyAIStorageState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[Storage Error] Failed to write to localStorage:', err);
  }
}

/**
 * Section 16: Centralized, typed StudyAIStorage persistence utility
 * Provides unified access to profile, tasks, events, bookmarks, statistics,
 * pomodoroSettings, sidebarState, and preferences with graceful fallbacks.
 */
export const StudyAIStorage = {
  load: loadStorage,
  save: saveStorage,

  getProfile: (): StudentProfile => loadStorage().profile,
  setProfile: (profile: StudentProfile): void => {
    const s = loadStorage();
    s.profile = profile;
    saveStorage(s);
  },

  getTasks: (): Task[] => loadStorage().tasks,
  setTasks: (tasks: Task[]): void => {
    const s = loadStorage();
    s.tasks = tasks;
    saveStorage(s);
  },

  getEvents: (): StudyEvent[] => loadStorage().events,
  setEvents: (events: StudyEvent[]): void => {
    const s = loadStorage();
    s.events = events;
    saveStorage(s);
  },

  getBookmarks: (): Bookmark[] => loadStorage().bookmarks,
  setBookmarks: (bookmarks: Bookmark[]): void => {
    const s = loadStorage();
    s.bookmarks = bookmarks;
    saveStorage(s);
  },

  getStatistics: (): StudyStatistics => loadStorage().statistics,
  setStatistics: (statistics: StudyStatistics): void => {
    const s = loadStorage();
    s.statistics = statistics;
    saveStorage(s);
  },

  getPomodoroSettings: (): PomodoroSettings => loadStorage().pomodoroSettings,
  setPomodoroSettings: (settings: PomodoroSettings): void => {
    const s = loadStorage();
    s.pomodoroSettings = settings;
    saveStorage(s);
  },

  getSidebarState: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('studyai-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  },
  setSidebarState: (collapsed: boolean): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('studyai-sidebar-collapsed', String(collapsed));
    } catch {}
  },

  getPreferences: (): { theme: 'dark' | 'light' } => {
    if (typeof window === 'undefined') return { theme: 'dark' };
    try {
      const saved = localStorage.getItem('studyai-theme');
      return { theme: saved === 'light' ? 'light' : 'dark' };
    } catch {
      return { theme: 'dark' };
    }
  },
  setPreferences: (prefs: { theme: 'dark' | 'light' }): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('studyai-theme', prefs.theme);
    } catch {}
  },
};
