import { describe, it, expect } from 'vitest';
import { Task, StudyEvent, Bookmark, SearchResultItem } from '../src/types/productivity';

describe('Global Search System', () => {
  const tasks: Task[] = [
    {
      id: 't-1',
      title: 'Prepare Distributed Systems Slides',
      description: 'Cover Paxos and Raft consensus',
      completed: false,
      priority: 'high',
      createdAt: '',
    },
  ];

  const events: StudyEvent[] = [
    {
      id: 'e-1',
      title: 'Database Systems Midterm Exam',
      date: '2026-10-15',
      type: 'exam',
      description: 'SQL Joins, Relational Algebra, Normalization',
    },
  ];

  const bookmarks: Bookmark[] = [
    {
      id: 'b-1',
      type: 'flashcard',
      title: 'What is Byzantine Fault Tolerance?',
      content: 'Ability of a system to function even when components fail or act maliciously.',
      createdAt: '',
    },
  ];

  function performSearch(query: string): SearchResultItem[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Search tasks
    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) {
        results.push({
          id: t.id,
          type: 'task',
          title: t.title,
          subtitle: t.description,
          tabTarget: 'tasks',
        });
      }
    });

    // Search events
    events.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)) {
        results.push({
          id: e.id,
          type: 'event',
          title: e.title,
          subtitle: `${e.date} • ${e.type}`,
          tabTarget: 'calendar',
        });
      }
    });

    // Search bookmarks
    bookmarks.forEach((b) => {
      if (b.title.toLowerCase().includes(q) || b.content?.toLowerCase().includes(q)) {
        results.push({
          id: b.id,
          type: 'bookmark',
          title: b.title,
          subtitle: b.content,
          tabTarget: 'bookmarks',
        });
      }
    });

    return results;
  }

  it('matches specific task title', () => {
    const results = performSearch('Distributed Systems');
    expect(results.length).toBe(1);
    expect(results[0].type).toBe('task');
    expect(results[0].title).toContain('Distributed Systems');
  });

  it('returns empty array when no items match query', () => {
    const results = performSearch('NonExistentTermXYZ999');
    expect(results.length).toBe(0);
  });

  it('matches deep content across different entity types', () => {
    // Search for "Paxos" in task description
    const paxosResults = performSearch('paxos');
    expect(paxosResults.length).toBe(1);
    expect(paxosResults[0].type).toBe('task');

    // Search for "Byzantine" in bookmark
    const byzResults = performSearch('byzantine');
    expect(byzResults.length).toBe(1);
    expect(byzResults[0].type).toBe('bookmark');

    // Search for "Normalization" in event
    const examResults = performSearch('normalization');
    expect(examResults.length).toBe(1);
    expect(examResults[0].type).toBe('event');
  });
});
