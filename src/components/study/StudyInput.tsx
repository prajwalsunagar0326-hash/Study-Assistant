import React, { useState, useRef } from 'react';
import { Sparkles, Wand2, X, AlertCircle } from 'lucide-react';
import { StudyMode } from '../../types/study';
import { ModeSelector } from './ModeSelector';
import { ExamplePrompts } from './ExamplePrompts';

interface StudyInputProps {
  onGenerate: (prompt: string, mode: StudyMode) => void;
  isLoading: boolean;
  defaultMode?: StudyMode;
}

export const StudyInput: React.FC<StudyInputProps> = ({
  onGenerate,
  isLoading,
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
    if (trimmed.length === 0) {
      setValidationError('Add a topic or some notes to get started.');
      textareaRef.current?.focus();
      return;
    }

    setValidationError(null);
    onGenerate(trimmed, mode);
  };

  return (
    <div className="w-full space-y-4">
      {/* Mode Selector */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
          Select Study Mode
        </label>
        <ModeSelector mode={mode} onChange={setMode} disabled={isLoading} />
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="study-prompt-input"
                className="text-xs font-semibold text-[var(--foreground)]"
              >
                Topic or Notes
              </label>
              {prompt.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-xl focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <textarea
                id="study-prompt-input"
                ref={textareaRef}
                value={prompt}
                onChange={handleTextChange}
                disabled={isLoading}
                placeholder="Paste lecture notes, study guides, textbook paragraphs, or simply type a topic (e.g. 'Operating Systems Deadlock Prevention')..."
                rows={5}
                className="w-full bg-transparent p-4 text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted-dark)] focus:outline-none resize-none leading-relaxed"
                aria-invalid={validationError ? 'true' : 'false'}
                aria-describedby={validationError ? 'input-error' : undefined}
              />

              {/* Bottom bar inside textarea box */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--muted)]">
                <span className={charsRemaining < 100 ? 'text-amber-500 font-medium' : ''}>
                  {charsRemaining.toLocaleString()} characters left
                </span>
                <span>Structured AI Study Generator</span>
              </div>
            </div>
          </div>

          {/* Validation error message */}
          {validationError && (
            <div
              id="input-error"
              role="alert"
              className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Example prompts */}
        <ExamplePrompts onSelectPrompt={handleSelectExample} disabled={isLoading} />

        {/* Submit button */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="submit"
            disabled={isLoading || prompt.trim().length === 0}
            className="btn-primary w-full sm:w-auto text-xs sm:text-sm px-6 py-2.5 shadow-md shadow-indigo-500/20"
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
    </div>
  );
};
