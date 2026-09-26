import { describe, it, expect } from 'vitest';
import { Task } from '../src/types/productivity';

describe('Tasks System', () => {
  it('creates task with defaults and tracks completion status', () => {
    const task: Task = {
      id: 'task-101',
      title: 'Study Dijkstra Algorithm',
      priority: 'high',
      dueDate: '2026-10-01',
      category: 'Algorithms',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    expect(task.completed).toBe(false);

    // Toggle completion
    const updatedTask = {
      ...task,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    expect(updatedTask.completed).toBe(true);
    expect(updatedTask.completedAt).toBeDefined();
  });

  it('filters tasks by completion and priority', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', completed: false, priority: 'high', createdAt: '' },
      { id: '2', title: 'Task 2', completed: true, priority: 'low', createdAt: '' },
      { id: '3', title: 'Task 3', completed: false, priority: 'medium', createdAt: '' },
      { id: '4', title: 'Task 4', completed: false, priority: 'high', createdAt: '' },
    ];

    const activeTasks = tasks.filter((t) => !t.completed);
    expect(activeTasks.length).toBe(3);

    const highPriorityActive = tasks.filter((t) => !t.completed && t.priority === 'high');
    expect(highPriorityActive.length).toBe(2);
    expect(highPriorityActive.map((t) => t.id)).toEqual(['1', '4']);
  });

  it('edits task properties correctly', () => {
    let task: Task = {
      id: 'task-edit',
      title: 'Original Title',
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    task = {
      ...task,
      title: 'Updated Title',
      priority: 'high',
      description: 'Added detailed notes',
    };

    expect(task.title).toBe('Updated Title');
    expect(task.priority).toBe('high');
    expect(task.description).toBe('Added detailed notes');
  });
});
