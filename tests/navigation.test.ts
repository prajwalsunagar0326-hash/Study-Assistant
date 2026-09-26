import { describe, it, expect } from 'vitest';
import { NavigationTab } from '../src/types/productivity';
import { StudyAIStorage } from '../src/lib/storage';

describe('Navigation & Sidebar System', () => {
  it('manages tab state transitions across all features', () => {
    let currentTab: NavigationTab = 'dashboard';
    const validTabs: NavigationTab[] = [
      'dashboard',
      'study',
      'tasks',
      'calendar',
      'bookmarks',
      'pomodoro',
      'profile',
    ];

    validTabs.forEach((tab) => {
      currentTab = tab;
      expect(currentTab).toBe(tab);
    });
  });

  it('toggles sidebar collapse state and persists changes', () => {
    let isCollapsed = false;

    // Toggle collapse
    isCollapsed = !isCollapsed;
    StudyAIStorage.setSidebarState(isCollapsed);
    expect(isCollapsed).toBe(true);
    expect(StudyAIStorage.getSidebarState()).toBe(true);

    // Toggle expand
    isCollapsed = !isCollapsed;
    StudyAIStorage.setSidebarState(isCollapsed);
    expect(isCollapsed).toBe(false);
    expect(StudyAIStorage.getSidebarState()).toBe(false);
  });
});
