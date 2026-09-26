import { describe, it, expect, beforeEach } from 'vitest';
import { StudyAIStorage, loadStorage, saveStorage, DEFAULT_STORAGE_STATE } from '../src/lib/storage';

describe('Storage & Corrupted Data Recovery', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and loads profile and tasks correctly', () => {
    StudyAIStorage.setProfile({
      name: 'Alex Johnson',
      email: 'alex@university.edu',
      studyGoal: 'Ace Compilers',
      avatarInitials: 'AJ',
    });

    const loadedProfile = StudyAIStorage.getProfile();
    expect(loadedProfile.name).toBe('Alex Johnson');
    expect(loadedProfile.studyGoal).toBe('Ace Compilers');
    expect(loadedProfile.avatarInitials).toBe('AJ');
  });

  it('recovers gracefully from corrupted JSON in localStorage', () => {
    // Inject corrupt JSON into storage key
    localStorage.setItem('studyai-student-workspace-v1', '{corrupt-json-structure-broken');

    const recovered = loadStorage();
    expect(recovered).toBeDefined();
    expect(recovered.profile.name).toBe(DEFAULT_STORAGE_STATE.profile.name);
    expect(Array.isArray(recovered.tasks)).toBe(true);
    expect(Array.isArray(recovered.events)).toBe(true);
    expect(Array.isArray(recovered.bookmarks)).toBe(true);
  });

  it('persists and retrieves sidebar state', () => {
    expect(StudyAIStorage.getSidebarState()).toBe(false);

    StudyAIStorage.setSidebarState(true);
    expect(StudyAIStorage.getSidebarState()).toBe(true);

    StudyAIStorage.setSidebarState(false);
    expect(StudyAIStorage.getSidebarState()).toBe(false);
  });
});
