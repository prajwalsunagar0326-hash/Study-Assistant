import { describe, it, expect } from 'vitest';
import { validateStudyPlan, cleanRawJson } from '../src/lib/validateStudyPlan';

describe('AI Generation & Defensive Validation', () => {
  const baseValidPlan = {
    title: 'Operating Systems & Concurrency',
    summary: 'Core principles of processes, threads, semaphores, and deadlocks.',
    flashcards: [
      {
        id: 'card-1',
        question: 'What is a race condition?',
        answer: 'A situation where multiple threads access shared resources concurrently and the final result depends on timing.',
        difficulty: 'medium',
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q-1',
          question: 'Which condition is NOT necessary for a deadlock?',
          options: ['Mutual exclusion', 'Hold and wait', 'Preemption allowed', 'Circular wait'],
          correctAnswer: 'Preemption allowed',
          explanation: 'No preemption is required for deadlock; if preemption is allowed, deadlocks can be broken.',
          difficulty: 'hard',
        },
      ],
    },
  };

  it('validates a correct StudyPlan response successfully', () => {
    const result = validateStudyPlan(JSON.stringify(baseValidPlan));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe(baseValidPlan.title);
      expect(result.data.flashcards.length).toBe(1);
      expect(result.data.quiz.questions.length).toBe(1);
    }
  });

  it('handles empty responses without crashing', () => {
    const result = validateStudyPlan('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe('EMPTY_RESPONSE');
    }
  });

  it('handles malformed JSON syntax gracefully', () => {
    const malformed = '{"title": "Operating Systems", "flashcards": [';
    const result = validateStudyPlan(malformed);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe('MALFORMED_JSON');
    }
  });

  it('strips Markdown code fences before parsing', () => {
    const fenced = `\`\`\`json\n${JSON.stringify(baseValidPlan)}\n\`\`\``;
    const cleaned = cleanRawJson(fenced);
    expect(cleaned.startsWith('{')).toBe(true);
    expect(cleaned.endsWith('}')).toBe(true);
    const result = validateStudyPlan(fenced);
    expect(result.success).toBe(true);
  });

  it('rejects invalid schema where root is an array instead of object', () => {
    const arrayRoot = JSON.stringify([baseValidPlan]);
    const result = validateStudyPlan(arrayRoot);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe('SCHEMA_VALIDATION_ERROR');
    }
  });

  it('rejects quiz question with less than 4 options', () => {
    const invalidQuiz = {
      ...baseValidPlan,
      quiz: {
        questions: [
          {
            id: 'q-bad',
            question: 'Incomplete options question?',
            options: ['Opt A', 'Opt B', 'Opt C'],
            correctAnswer: 'Opt A',
            explanation: 'Missing 4th option',
            difficulty: 'easy',
          },
        ],
      },
    };
    const result = validateStudyPlan(JSON.stringify(invalidQuiz));
    expect(result.success).toBe(false);
  });

  it('rejects quiz question where correctAnswer is not in options', () => {
    const invalidAnswer = {
      ...baseValidPlan,
      quiz: {
        questions: [
          {
            id: 'q-bad2',
            question: 'Mismatched correct answer?',
            options: ['One', 'Two', 'Three', 'Four'],
            correctAnswer: 'Five',
            explanation: 'Five is not among options',
            difficulty: 'medium',
          },
        ],
      },
    };
    const result = validateStudyPlan(JSON.stringify(invalidAnswer));
    expect(result.success).toBe(false);
  });
});
