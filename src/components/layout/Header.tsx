import React from 'react';
import { GraduationCap, Bug, Sun, Moon, Cpu } from 'lucide-react';

interface HeaderProps {
  isDiagnosticOpen: boolean;
  onToggleDiagnostic: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDiagnosticOpen,
  onToggleDiagnostic,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] via-[var(--secondary)] to-[var(--accent-cyan)] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[var(--foreground)]">
                Study<span className="gradient-text">AI</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] hidden md:block">
              Turn your notes into interactive learning
            </p>
          </div>
        </div>

        {/* Right Action Affordances */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Model indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--muted)]">
            <Cpu className="w-3.5 h-3.5 text-[var(--primary-light)]" />
            <span>Gemini 3.5 Flash-Lite</span>
          </div>

          {/* Interviewer Mode Diagnostic Trigger */}
          <button
            type="button"
            onClick={onToggleDiagnostic}
            aria-label="Toggle Interviewer Diagnostic Mode"
            className={`btn-ghost text-xs px-2.5 py-1.5 rounded-lg border ${
              isDiagnosticOpen
                ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Diagnostic Mode</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Color Theme"
            className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
