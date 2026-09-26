import React, { useState, useMemo } from 'react';
import { Bookmark as BookmarkIcon, Search, Trash2, Layers, Brain, BookOpen, ArrowRight } from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { BookmarkType } from '../../types/productivity';

export const BookmarkPage: React.FC = () => {
  const { bookmarks, removeBookmark, setActiveTab } = useProductivity();
  const [filter, setFilter] = useState<'all' | BookmarkType>('all');
  const [search, setSearch] = useState('');

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bm) => {
      const matchesType = filter === 'all' || bm.type === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        bm.title.toLowerCase().includes(q) ||
        bm.content.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [bookmarks, filter, search]);

  const getBookmarkBadge = (type: BookmarkType) => {
    switch (type) {
      case 'flashcard':
        return (
          <span className="badge badge-mode flex items-center gap-1 text-[10px]">
            <Layers className="w-3 h-3" />
            <span>Flashcard</span>
          </span>
        );
      case 'quiz':
        return (
          <span className="badge badge-medium flex items-center gap-1 text-[10px]">
            <Brain className="w-3 h-3" />
            <span>Quiz Question</span>
          </span>
        );
      case 'study-set':
        return (
          <span className="badge badge-easy flex items-center gap-1 text-[10px]">
            <BookOpen className="w-3 h-3" />
            <span>Study Set</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Saved Bookmarks
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Revisit key questions, complex definitions, and important study sets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('study')}
          className="btn-primary self-start sm:self-center text-xs sm:text-sm"
        >
          <span>Go to Study Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl glass-panel text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(
            [
              { key: 'all', label: `All (${bookmarks.length})` },
              { key: 'flashcard', label: 'Flashcards' },
              { key: 'quiz', label: 'Quiz Questions' },
              { key: 'study-set', label: 'Study Sets' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                filter === item.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="p-12 text-center space-y-3 border border-dashed border-slate-300 dark:border-slate-700/60 rounded-2xl glass-panel">
          <BookmarkIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400/60 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {search ? 'No bookmarks match your search' : 'No bookmarks saved yet'}
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            {search
              ? 'Try using a broader keyword or clear your search input.'
              : 'Click the star icon while reviewing flashcards or answering quiz questions to save them here for quick revision.'}
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('study')}
            className="btn-secondary text-xs px-4 py-2 mt-2"
          >
            <span>Open Study Workspace</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="glass-panel p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getBookmarkBadge(bm.type)}
                  <span className="text-[10px] text-[var(--muted)]">
                    {new Date(bm.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {bm.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {bm.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('study')}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold flex items-center gap-1"
                >
                  <span>Review in Study</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => removeBookmark(bm.id)}
                  title="Remove Bookmark"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
