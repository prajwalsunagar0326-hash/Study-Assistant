import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Sliders,
  Timer as TimerIcon,
  CheckCircle,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { PomodoroMode } from '../../types/productivity';
import { PomodoroSettingsModal } from './PomodoroSettingsModal';

export const PomodoroPage: React.FC = () => {
  const {
    pomodoroSettings,
    updatePomodoroSettings,
    recordPomodoroSession,
    statistics,
  } = useProductivity();

  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(statistics.pomodoroSessions);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Time remaining in seconds
  const [timeLeft, setTimeLeft] = useState<number>(() => pomodoroSettings.focusDuration * 60);

  // Drift-free calculation refs
  const endTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getModeDurationSeconds = useCallback(
    (m: PomodoroMode): number => {
      switch (m) {
        case 'focus':
          return pomodoroSettings.focusDuration * 60;
        case 'shortBreak':
          return pomodoroSettings.shortBreakDuration * 60;
        case 'longBreak':
          return pomodoroSettings.longBreakDuration * 60;
      }
    },
    [pomodoroSettings]
  );

  // Mode Switch
  const switchMode = useCallback(
    (newMode: PomodoroMode) => {
      setIsRunning(false);
      setShowCelebration(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setMode(newMode);
      setTimeLeft(getModeDurationSeconds(newMode));
      endTimeRef.current = null;
    },
    [getModeDurationSeconds]
  );

  // On session completion
  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (mode === 'focus') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      recordPomodoroSession(pomodoroSettings.focusDuration);
      setShowCelebration(true);

      // Auto suggest break
      const isLongBreakTime = nextCount % pomodoroSettings.longBreakInterval === 0;
      setTimeout(() => {
        switchMode(isLongBreakTime ? 'longBreak' : 'shortBreak');
      }, 2500);
    } else {
      setShowCelebration(true);
      setTimeout(() => {
        switchMode('focus');
      }, 2000);
    }
  }, [mode, completedSessions, pomodoroSettings, recordPomodoroSession, switchMode]);

  // Accurate drift-free countdown
  useEffect(() => {
    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      timerIntervalRef.current = setInterval(() => {
        if (!endTimeRef.current) return;
        const remainingMs = endTimeRef.current - Date.now();
        const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

        setTimeLeft(nextSeconds);

        if (nextSeconds <= 0) {
          handleSessionComplete();
        }
      }, 200);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      endTimeRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning, timeLeft, handleSessionComplete]);

  // Controls
  const togglePlay = () => {
    setShowCelebration(false);
    if (isRunning) {
      // Pause: calculate remaining seconds precisely
      if (endTimeRef.current) {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
      endTimeRef.current = null;
      setIsRunning(false);
    } else {
      // Resume / Start
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setShowCelebration(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    endTimeRef.current = null;
    setTimeLeft(getModeDurationSeconds(mode));
  };

  const handleSkip = () => {
    if (mode === 'focus') {
      switchMode('shortBreak');
    } else {
      switchMode('focus');
    }
  };

  // Keyboard shortcut listener (Space to play/pause, R to reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalModeSeconds = getModeDurationSeconds(mode);
  const progressPercent = Math.round(((totalModeSeconds - timeLeft) / totalModeSeconds) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Pomodoro Focus Timer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Build deep concentration with timestamp-synchronized interval training.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="btn-secondary self-start sm:self-center text-xs px-3 py-2"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Timer Settings</span>
        </button>
      </div>

      {/* Main Timer Display Glass Card */}
      <div className="glass-panel p-6 sm:p-10 space-y-8 text-center relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            mode === 'focus'
              ? 'bg-rose-500/15'
              : mode === 'shortBreak'
              ? 'bg-emerald-500/15'
              : 'bg-indigo-500/15'
          }`}
        />

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-[var(--border)] max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => switchMode('focus')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'focus'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-600 dark:text-[var(--muted)] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Focus ({pomodoroSettings.focusDuration}m)
          </button>
          <button
            type="button"
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-[var(--muted)] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Short Break ({pomodoroSettings.shortBreakDuration}m)
          </button>
          <button
            type="button"
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-[var(--muted)] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Long Break ({pomodoroSettings.longBreakDuration}m)
          </button>
        </div>

        {/* Celebration Banner */}
        {showCelebration && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>🎉 Session complete! Taking break...</span>
          </div>
        )}

        {/* Big Digital Timer Display */}
        <div className="space-y-4">
          <div className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter font-mono select-none drop-shadow-sm">
            {formattedTime}
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
              <span>{progressPercent}% elapsed</span>
              <span className="capitalize">{mode.replace(/([A-Z])/g, ' $1')} Interval</span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            title="Reset Timer (R)"
            className="p-3 rounded-xl border border-[var(--border)] bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-xl hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                : mode === 'focus'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timeLeft === totalModeSeconds ? 'Start Session' : 'Resume'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            title="Skip to next session"
            className="p-3 rounded-xl border border-[var(--border)] bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all hover:scale-105"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard shortcut notice */}
        <div className="text-[11px] text-[var(--muted-dark)]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">Space</kbd> to toggle • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">R</kbd> to reset
        </div>
      </div>

      {/* Focus Session Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30 shrink-0">
            <TimerIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {completedSessions}
            </div>
            <div className="text-xs text-[var(--muted)]">
              Completed Pomodoros
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {Math.round((completedSessions * pomodoroSettings.focusDuration) / 60 * 10) / 10} hrs
            </div>
            <div className="text-xs text-[var(--muted)]">
              Total Deep Focus Time
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {pomodoroSettings.longBreakInterval - (completedSessions % pomodoroSettings.longBreakInterval)} left
            </div>
            <div className="text-xs text-[var(--muted)]">
              Until Long Rest Break
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <PomodoroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={pomodoroSettings}
        onSave={updatePomodoroSettings}
      />
    </div>
  );
};
