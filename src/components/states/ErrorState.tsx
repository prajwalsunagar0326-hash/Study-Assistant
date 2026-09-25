import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldAlert,
} from 'lucide-react';
import { ApiError } from '../../types/study';

interface ErrorStateProps {
  error: ApiError;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onBack }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCleanMessage = (rawMsg: string) => {
    if (!rawMsg) return '';
    try {
      if (rawMsg.includes('"message"')) {
        const parsed = JSON.parse(rawMsg);
        return parsed?.error?.message || parsed?.message || rawMsg;
      }
    } catch {}
    return rawMsg;
  };

  const cleanMessage = getCleanMessage(error.message);

  const getErrorPresentation = () => {
    switch (error.type) {
      case 'EMPTY_RESPONSE':
        return {
          title: 'Empty Response Received',
          description:
            cleanMessage ||
            'StudyAI received an empty completion from the model. Providing more lecture notes or a specific topic helps guide generation.',
          badge: 'Empty Output',
        };
      case 'MALFORMED_JSON':
        return {
          title: 'Defensive Parser Blocked Malformed JSON',
          description:
            'The AI generated invalid or truncated JSON syntax. StudyAI caught this before it could crash your learning workspace.',
          badge: 'Syntax Malformed',
        };
      case 'SCHEMA_VALIDATION_ERROR':
        return {
          title: 'Strict Schema Validation Rejected Data',
          description:
            cleanMessage ||
            'The AI response did not satisfy the strict runtime schema requirements (e.g. missing questions, empty options, or mismatched correct answer).',
          badge: 'Schema Violation',
        };
      case 'NETWORK_ERROR':
        return {
          title: 'Network Connection Interrupted',
          description:
            'Could not reach the StudyAI backend proxy. Please verify your internet connection or local server status.',
          badge: 'Network Error',
        };
      case 'SERVER_ERROR':
        return {
          title: 'Service Temporarily Unavailable',
          description:
            cleanMessage ||
            'The generation service encountered a temporary spike in traffic. You can retry immediately.',
          badge: 'High Demand',
        };
      default:
        return {
          title: 'Unable to Generate Study Set',
          description: error.message || 'An unexpected issue occurred while synthesizing your study materials.',
          badge: 'Error',
        };
    }
  };

  const presentation = getErrorPresentation();

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <div className="glass-panel p-6 sm:p-8 space-y-6 text-center border-rose-500/30 shadow-2xl shadow-rose-950/20">
        {/* Warning Icon Badge */}
        <div className="inline-flex p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-md shadow-rose-500/10">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="badge badge-hard">{presentation.badge}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            {presentation.title}
          </h3>
          <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
            {presentation.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Notes</span>
          </button>
        </div>

        {/* Expandable Diagnostic Inspector (Assignment Section 21) */}
        {error.rawDetails && (
          <div className="pt-4 border-t border-[var(--border-subtle)] text-left">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs text-[var(--muted)] hover:text-[var(--foreground)] py-1 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Inspect Diagnostic Parser Trace</span>
              </div>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                <div className="text-rose-400 font-semibold mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Validation Log:</span>
                </div>
                <pre className="whitespace-pre-wrap break-all leading-normal">
                  {error.rawDetails}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
