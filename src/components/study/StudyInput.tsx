import React, { useState, useRef } from 'react';
import { Sparkles, Wand2, X, AlertCircle, ShieldAlert, WifiOff } from 'lucide-react';
import { StudyMode } from '../../types/study';
import { ModeSelector } from './ModeSelector';
import { ExamplePrompts } from './ExamplePrompts';

interface StudyInputProps {
  onGenerate: (prompt: string, mode: StudyMode) => void;
  isLoading: boolean;
  isDiagnosticOpen: boolean;
  defaultMode?: StudyMode;
}

export const StudyInput: React.FC<StudyInputProps> = ({
  onGenerate,
  isLoading,
  isDiagnosticOpen,
  defaultMode = 'flashcards',
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<StudyMode>(defaultMode);
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 5000;
  const charsRemaining = MAX_CHARS - prompt.length;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setPrompt(val);
      if (validationError && val.trim().length > 0) {
        setValidationError(null);
      }
    }
  };

  const handleClear = () => {
    setPrompt('');
    setValidationError(null);
    textareaRef.current?.focus();
  };

  const handleSelectExample = (exampleText: string) => {
    setPrompt(exampleText);
    setValidationError(null);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = prompt.trim();
    if (!trimmed) {
      setValidationError('Add a topic or some notes to get started.');
      textareaRef.current?.focus();
      return;
    }

    setValidationError(null);
    onGenerate(trimmed, mode);
  };

  // Interviewer Diagnostic Quick Triggers
  const handleSimulate = (diagnosticFlag: string) => {
    setValidationError(null);
    onGenerate(`Topic for Testing ${diagnosticFlag}`, mode);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Mode Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Select Study Mode
        </label>
        <ModeSelector mode={mode} onChange={setMode} disabled={isLoading} />
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="study-material-input"
            className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Enter Notes or Topic</span>
          </label>
          {prompt.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-[var(--muted)] hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            id="study-material-input"
            ref={textareaRef}
            rows={5}
            value={prompt}
            onChange={handleTextChange}
            disabled={isLoading}
            placeholder="Paste your notes, lecture content, or enter a topic (e.g. Java OOP, Machine Learning, Normalization)..."
            className="w-full bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] focus:border-indigo-500 rounded-xl p-4 text-sm sm:text-base leading-relaxed placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y min-h-[140px] max-h-[360px]"
          />
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span
              className={`text-xs ${
                charsRemaining < 200 ? 'text-amber-400' : 'text-[var(--muted)]'
              }`}
            >
              {charsRemaining} characters left
            </span>
            <span className="text-[11px] text-[var(--muted-dark)] hidden sm:inline">
              Max {MAX_CHARS} chars • Markdown / plain text supported
            </span>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Example Topics */}
        <ExamplePrompts onSelectPrompt={handleSelectExample} disabled={isLoading} />

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-end">
          <button
            type="submit"
            disabled={isLoading || prompt.trim().length === 0}
            className="btn-primary w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>Creating your study set...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Study Set</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Interviewer Diagnostic Panel */}
      {isDiagnosticOpen && (
        <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Interviewer Diagnostic Mode (Failure Simulation)</span>
            </div>
            <span className="text-[11px] text-slate-400">Assignment Section 21 Verification</span>
          </div>
          <p className="text-xs text-slate-300">
            Click any button below to trigger and inspect StudyAI's defensive parsing, runtime validation, and error recovery states live:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSimulate('__test_malformed__')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-amber-500/40 text-amber-300 hover:bg-amber-950/30 text-xs font-medium transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Malformed JSON</span>
            </button>
            <button
              type="button"
              onClick={() => handleSimulate('__test_wrong_shape__')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-orange-500/40 text-orange-300 hover:bg-orange-950/30 text-xs font-medium transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
              <span>2. Wrong Schema Shape</span>
            </button>
            <button
              type="button"
              onClick={() => handleSimulate('__test_error_500__')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-rose-500/40 text-rose-300 hover:bg-rose-950/30 text-xs font-medium transition-colors"
            >
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span>3. Server 500 Error</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
