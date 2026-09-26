import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  CheckSquare,
  CalendarDays,
  Bookmark,
  Sparkles,
  ArrowRight,
  Command,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { SearchResult, NavigationTab } from '../../types/productivity';

export const SearchCommandModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab, tasks, events, bookmarks, savedStudySets } =
    useProductivity();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global Ctrl+K / Cmd+K and Escape listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Client-side instant unified search
  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: SearchResult[] = [];

    // 1. Search Tasks
    tasks.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      ) {
        list.push({
          id: `task-${t.id}`,
          type: 'task',
          title: t.title,
          preview: t.description || `Category: ${t.category || 'General'} • Priority: ${t.priority}`,
          tab: 'tasks',
        });
      }
    });

    // 2. Search Events
    events.forEach((ev) => {
      if (
        ev.title.toLowerCase().includes(q) ||
        (ev.description && ev.description.toLowerCase().includes(q))
      ) {
        list.push({
          id: `event-${ev.id}`,
          type: 'event',
          title: ev.title,
          preview: `Date: ${ev.date} ${ev.startTime ? `(${ev.startTime})` : ''} • ${ev.type}`,
          tab: 'calendar',
        });
      }
    });

    // 3. Search Bookmarks
    bookmarks.forEach((bm) => {
      if (
        bm.title.toLowerCase().includes(q) ||
        bm.content.toLowerCase().includes(q)
      ) {
        list.push({
          id: `bm-${bm.id}`,
          type: 'bookmark',
          title: bm.title,
          preview: bm.content.slice(0, 100) + (bm.content.length > 100 ? '...' : ''),
          tab: 'bookmarks',
        });
      }
    });

    // 4. Search Saved Study Sets
    savedStudySets.forEach((set) => {
      if (
        set.title.toLowerCase().includes(q) ||
        set.summary.toLowerCase().includes(q)
      ) {
        list.push({
          id: `set-${set.id}`,
          type: 'study-set',
          title: set.title,
          preview: `${set.flashcardCount} cards • ${set.quizCount} questions: ${set.summary.slice(0, 90)}...`,
          tab: 'study',
        });
      }
    });

    return list;
  }, [query, tasks, events, bookmarks, savedStudySets]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-4 h-4 text-amber-400" />;
      case 'event':
        return <CalendarDays className="w-4 h-4 text-emerald-400" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-purple-400" />;
      case 'study-set':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search Command Palette"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fade-in"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, study sets, calendar events, bookmarks..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {query.trim().length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <Command className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs sm:text-sm">Type any keyword to search across your study workspace.</p>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <span>Try:</span>
                <button
                  type="button"
                  onClick={() => setQuery('dbms')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 hover:bg-slate-700"
                >
                  dbms
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('operating')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 hover:bg-slate-700"
                >
                  operating
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('assignment')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 hover:bg-slate-700"
                >
                  assignment
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <p className="text-sm font-semibold text-slate-300">No results found for "{query}"</p>
              <p className="text-xs text-slate-500">Check spelling or try a more general search term.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 pb-1">
                {results.length} result{results.length === 1 ? '' : 's'} found
              </div>
              {results.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => handleSelectResult(res.tab)}
                  className="w-full flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-indigo-950/30 hover:border-indigo-500/40 text-left transition-all group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 shrink-0 mt-0.5">
                      {getResultIcon(res.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-white truncate">
                          {res.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {res.preview}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search automatically groups tasks, notes, and study sets</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
