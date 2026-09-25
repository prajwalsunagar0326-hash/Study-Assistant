import React from 'react';
import { Layers, Brain, Download, RotateCcw, Sparkles } from 'lucide-react';
import { StudyMode, StudyPlan } from '../../types/study';

interface StudyHeaderProps {
  studyPlan: StudyPlan;
  activeMode: StudyMode;
  onSwitchMode: (mode: StudyMode) => void;
  onNewTopic: () => void;
}

export const StudyHeader: React.FC<StudyHeaderProps> = ({
  studyPlan,
  activeMode,
  onSwitchMode,
  onNewTopic,
}) => {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(studyPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${studyPlan.title.toLowerCase().replace(/\s+/g, '-')}-studyset.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Title & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-mode">
              <Sparkles className="w-3 h-3" />
              <span>Study Module</span>
            </span>
            <span className="text-xs text-[var(--muted)]">
              {studyPlan.flashcards.length} cards • {studyPlan.quiz.questions.length} quiz questions
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            {studyPlan.title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            {studyPlan.summary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={handleExportJson}
            title="Download Study Plan JSON"
            className="btn-secondary text-xs px-3 py-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            onClick={onNewTopic}
            className="btn-secondary text-xs px-3 py-2 hover:border-rose-500/30 hover:text-rose-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Topic</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => onSwitchMode('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeMode === 'flashcards'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards ({studyPlan.flashcards.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeMode === 'quiz'
                ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md shadow-violet-600/30'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Practice Quiz ({studyPlan.quiz.questions.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
