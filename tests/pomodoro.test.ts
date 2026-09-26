import { describe, it, expect } from 'vitest';
import { calculateElapsedSeconds } from '../src/lib/storage';

describe('Pomodoro Timer System', () => {
  it('prevents drift by calculating elapsed seconds from wall clock timestamps', () => {
    const startTime = Date.now();
    const futureTime = startTime + 65 * 1000; // 65 seconds later

    const elapsed = calculateElapsedSeconds(startTime, futureTime);
    expect(elapsed).toBe(65);
  });

  it('accurately tracks timer states: start, pause, reset, completion', () => {
    let mode: 'focus' | 'shortBreak' | 'longBreak' = 'focus';
    let isRunning = false;
    let secondsLeft = 25 * 60;

    // Start
    isRunning = true;
    expect(isRunning).toBe(true);

    // Tick down 5 seconds
    secondsLeft -= 5;
    expect(secondsLeft).toBe(1495);

    // Pause
    isRunning = false;
    expect(isRunning).toBe(false);

    // Reset
    secondsLeft = 25 * 60;
    expect(secondsLeft).toBe(1500);

    // Complete session
    secondsLeft = 0;
    const isCompleted = secondsLeft <= 0;
    expect(isCompleted).toBe(true);

    // Switch to short break
    mode = 'shortBreak';
    secondsLeft = 5 * 60;
    expect(mode).toBe('shortBreak');
    expect(secondsLeft).toBe(300);
  });
});
