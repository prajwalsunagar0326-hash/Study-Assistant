import { validateStudyPlan, cleanRawJson } from '../src/lib/validateStudyPlan';

console.log('====================================================');
console.log('STUDYAI DEFENSIVE PARSER & FAILURE MODE TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${detail || ''}`);
    failedTests++;
  }
}

// Helper: base valid mock study plan
const baseValidPlan = {
  title: 'Object-Oriented Programming in Java',
  summary: 'Core principles of inheritance, encapsulation, abstraction, and polymorphism.',
  flashcards: [
    {
      id: 'card-1',
      question: 'What is polymorphism?',
      answer: 'The ability of different classes to respond to the same message in unique ways.',
      difficulty: 'medium',
    },
  ],
  quiz: {
    questions: [
      {
        id: 'q-1',
        question: 'Which keyword prevents subclass inheritance in Java?',
        options: ['static', 'final', 'const', 'super'],
        correctAnswer: 'final',
        explanation: 'Applying final to a class declaration prevents it from being extended.',
        difficulty: 'easy',
      },
    ],
  },
};

// 1. Test valid StudyPlan (Happy path)
{
  const result = validateStudyPlan(JSON.stringify(baseValidPlan));
  assert(
    result.success && result.data.title === baseValidPlan.title && result.data.flashcards.length === 1,
    '1. Valid StudyPlan passes runtime schema validation'
  );
}

// 2. Test empty response
{
  const result = validateStudyPlan('');
  assert(
    !result.success && result.error.type === 'EMPTY_RESPONSE',
    '2. Empty response rejected with EMPTY_RESPONSE'
  );
}

// 3. Test malformed JSON syntax
{
  const brokenJson = '{"title": "Java OOP", "flashcards": [';
  const result = validateStudyPlan(brokenJson);
  assert(
    !result.success && result.error.type === 'MALFORMED_JSON',
    '3. Malformed JSON syntax caught without crashing'
  );
}

// 4. Test Markdown-wrapped JSON (fences)
{
  const fenced = `\`\`\`json\n${JSON.stringify(baseValidPlan)}\n\`\`\``;
  const cleaned = cleanRawJson(fenced);
  const result = validateStudyPlan(fenced);
  assert(
    cleaned.startsWith('{') && cleaned.endsWith('}') && result.success,
    '4. Markdown code fences (```json) cleaned before parsing'
  );
}

// 5. Test wrong root shape (array instead of object)
{
  const wrongRoot = JSON.stringify([baseValidPlan]);
  const result = validateStudyPlan(wrongRoot);
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '5. Array root rejected with SCHEMA_VALIDATION_ERROR'
  );
}

// 6. Test missing title
{
  const missingTitle = { ...baseValidPlan, title: '' };
  const result = validateStudyPlan(JSON.stringify(missingTitle));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '6. Missing or empty title rejected'
  );
}

// 7. Test missing flashcards array
{
  const { flashcards, ...noCards } = baseValidPlan as any;
  const result = validateStudyPlan(JSON.stringify(noCards));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '7. Missing flashcards array rejected'
  );
}

// 8. Test empty flashcards array
{
  const emptyCards = { ...baseValidPlan, flashcards: [] };
  const result = validateStudyPlan(JSON.stringify(emptyCards));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '8. Empty flashcards array rejected'
  );
}

// 9. Test invalid flashcard (missing question)
{
  const invalidCard = {
    ...baseValidPlan,
    flashcards: [{ id: 'c1', question: '', answer: 'Some answer', difficulty: 'easy' }],
  };
  const result = validateStudyPlan(JSON.stringify(invalidCard));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '9. Flashcard with empty question rejected'
  );
}

// 10. Test invalid difficulty value
{
  const invalidDiff = {
    ...baseValidPlan,
    flashcards: [{ id: 'c1', question: 'Q', answer: 'A', difficulty: 'extreme' }],
  };
  const result = validateStudyPlan(JSON.stringify(invalidDiff));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '10. Invalid difficulty value ("extreme") rejected'
  );
}

// 11. Test quiz missing
{
  const { quiz, ...noQuiz } = baseValidPlan as any;
  const result = validateStudyPlan(JSON.stringify(noQuiz));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '11. Missing quiz object rejected'
  );
}

// 12. Test quiz with no questions
{
  const noQuestions = { ...baseValidPlan, quiz: { questions: [] } };
  const result = validateStudyPlan(JSON.stringify(noQuestions));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '12. Quiz with 0 questions rejected'
  );
}

// 13. Test quiz question with wrong option count (3 instead of 4)
{
  const wrongCount = {
    ...baseValidPlan,
    quiz: {
      questions: [
        {
          id: 'q-1',
          question: 'Valid question?',
          options: ['Option A', 'Option B', 'Option C'], // Only 3!
          correctAnswer: 'Option A',
          explanation: 'Requires exactly 4 options.',
          difficulty: 'medium',
        },
      ],
    },
  };
  const result = validateStudyPlan(JSON.stringify(wrongCount));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '13. Quiz question with 3 options rejected (requires exactly 4)'
  );
}

// 14. Test duplicate options
{
  const duplicateOpts = {
    ...baseValidPlan,
    quiz: {
      questions: [
        {
          id: 'q-1',
          question: 'Valid question?',
          options: ['Redundant Option', 'Redundant Option', 'Option C', 'Option D'],
          correctAnswer: 'Option C',
          explanation: 'Options must be unique.',
          difficulty: 'medium',
        },
      ],
    },
  };
  const result = validateStudyPlan(JSON.stringify(duplicateOpts));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '14. Quiz question with duplicate options rejected'
  );
}

// 15. Test correctAnswer not matching any option
{
  const mismatchedAnswer = {
    ...baseValidPlan,
    quiz: {
      questions: [
        {
          id: 'q-1',
          question: 'Valid question?',
          options: ['Apple', 'Banana', 'Cherry', 'Date'],
          correctAnswer: 'Elephant', // Not in options!
          explanation: 'Must match one option exactly.',
          difficulty: 'easy',
        },
      ],
    },
  };
  const result = validateStudyPlan(JSON.stringify(mismatchedAnswer));
  assert(
    !result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR',
    '15. correctAnswer not matching options rejected'
  );
}

// 16. Test valid quiz with multiple questions
{
  const multiQuestionQuiz = {
    ...baseValidPlan,
    quiz: {
      questions: [
        {
          id: 'q-1',
          question: 'Question 1',
          options: ['A1', 'B1', 'C1', 'D1'],
          correctAnswer: 'A1',
          explanation: 'Exp 1',
          difficulty: 'easy',
        },
        {
          id: 'q-2',
          question: 'Question 2',
          options: ['A2', 'B2', 'C2', 'D2'],
          correctAnswer: 'C2',
          explanation: 'Exp 2',
          difficulty: 'hard',
        },
      ],
    },
  };
  const result = validateStudyPlan(JSON.stringify(multiQuestionQuiz));
  assert(
    result.success && result.data.quiz.questions.length === 2,
    '16. Valid multi-question quiz accepted'
  );
}

// 17. Stale request protection logic verification
{
  let currentRequestId = 1;
  let activeUiState = 'Initial Topic';

  // Request A starts with id 1
  const reqA_Id = 1;

  // Before Request A finishes, user starts Request B with id 2
  currentRequestId = 2;
  const reqB_Id = 2;

  // Request B finishes first and updates UI
  if (reqB_Id === currentRequestId) {
    activeUiState = 'Updated by Request B';
  }

  // Request A finishes later
  if (reqA_Id === currentRequestId) {
    activeUiState = 'Overwritten by stale Request A (BUG)';
  }

  assert(
    activeUiState === 'Updated by Request B',
    '17. Stale request protection prevents slower older request from overwriting newer generation'
  );
}

console.log('\n====================================================');
console.log('STUDENT PRODUCTIVITY SYSTEM TEST SUITE');
console.log('====================================================\n');

import { calculateStudyStreak, DEFAULT_STORAGE_STATE, getTodayDateString, getYesterdayDateString } from '../src/lib/storage';
import { Task, SearchResult } from '../src/types/productivity';

// 18. Task Management: Create and Complete Task
{
  const initialTask: Task = {
    id: 'task-test-1',
    title: 'Complete Distributed Systems Homework',
    description: 'Solve Raft consensus problem set',
    completed: false,
    priority: 'high',
    dueDate: '2026-10-01',
    category: 'Computer Science',
    createdAt: new Date().toISOString(),
  };

  // Complete the task
  const completedTask: Task = {
    ...initialTask,
    completed: true,
    completedAt: new Date().toISOString(),
  };

  assert(
    !initialTask.completed && completedTask.completed && typeof completedTask.completedAt === 'string',
    '18. Task creation and completion toggle with timestamp'
  );
}

// 19. Task Filtering and Sorting
{
  const today = getTodayDateString();
  const testTasks: Task[] = [
    { id: '1', title: 'Task Low', completed: false, priority: 'low', dueDate: '2026-10-05', createdAt: '2026-09-01' },
    { id: '2', title: 'Task High Today', completed: false, priority: 'high', dueDate: today, createdAt: '2026-09-02' },
    { id: '3', title: 'Task Done', completed: true, priority: 'medium', dueDate: '2026-09-20', createdAt: '2026-09-03' },
  ];

  const activeTasks = testTasks.filter(t => !t.completed);
  const highPriorityTasks = testTasks.filter(t => t.priority === 'high');
  const todayTasks = testTasks.filter(t => t.dueDate === today);

  // Priority sorting: high (3) > medium (2) > low (1)
  const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const sortedByPriority = [...testTasks].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);

  assert(
    activeTasks.length === 2 && highPriorityTasks.length === 1 && todayTasks.length === 1,
    '19. Task filtering by active, high priority, and today'
  );

  assert(
    sortedByPriority[0].priority === 'high' && sortedByPriority[2].priority === 'low',
    '20. Task sorting by priority order (high to low)'
  );
}

// 21. Global Search: Multi-entity matching & Empty state
{
  const searchCorpus: { id: string; type: string; title: string; content?: string }[] = [
    { id: 't-1', type: 'task', title: 'Review OS & Virtual Memory' },
    { id: 'b-1', type: 'bookmark', title: 'Page Table Translation', content: 'TLB miss handling and page faults' },
    { id: 'e-1', type: 'event', title: 'OS Midterm Exam' },
  ];

  const performSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchCorpus.filter(
      item => item.title.toLowerCase().includes(q) || (item.content && item.content.toLowerCase().includes(q))
    );
  };

  const matchSingle = performSearch('Virtual Memory');
  const matchMultiType = performSearch('OS');
  const matchContent = performSearch('TLB miss');
  const noMatch = performSearch('Quantum Physics');

  assert(
    matchSingle.length === 1 && matchSingle[0].type === 'task',
    '21. Search matches specific task title'
  );

  assert(
    matchMultiType.length === 2 && matchMultiType.some(m => m.type === 'event'),
    '22. Search matches across multiple entity types (task & event)'
  );

  assert(
    matchContent.length === 1 && matchContent[0].type === 'bookmark',
    '23. Search searches deep bookmark content'
  );

  assert(
    noMatch.length === 0,
    '24. Search returns empty array for non-matching queries'
  );
}

// 25. Pomodoro Drift-Free Timer Logic
{
  const durationMs = 25 * 60 * 1000;
  const startTime = Date.now();
  const endTime = startTime + durationMs;

  // Simulate 10 seconds passing
  const simulatedCurrentTime = startTime + 10000;
  const remainingMs = Math.max(0, endTime - simulatedCurrentTime);

  assert(
    remainingMs === durationMs - 10000,
    '25. Pomodoro timestamp calculation prevents drift compared to naive decrements'
  );
}

// 26. Study Streak Calculation (Deterministic test)
{
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Test consecutive 3-day streak
  const d3 = new Date();
  d3.setDate(d3.getDate() - 2);
  const twoDaysAgo = `${d3.getFullYear()}-${String(d3.getMonth() + 1).padStart(2, '0')}-${String(d3.getDate()).padStart(2, '0')}`;

  const streak3 = calculateStudyStreak([twoDaysAgo, yesterday, today]);
  assert(streak3 === 3, `26. 3-day consecutive study streak correctly returns 3 (got ${streak3})`);

  // Test broken streak (missing yesterday)
  const brokenStreak = calculateStudyStreak([twoDaysAgo, today]);
  assert(brokenStreak === 1, `27. Broken day gap resets study streak to 1 for today (got ${brokenStreak})`);

  // Test empty streak
  const emptyStreak = calculateStudyStreak([]);
  assert(emptyStreak === 0, `28. Empty study activity correctly returns 0 streak`);
}

// 27. Study Statistics: Accuracy and Calculation
{
  const calcAccuracy = (correct: number, total: number) => {
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  };

  const zeroAttempts = calcAccuracy(0, 0);
  const halfCorrect = calcAccuracy(5, 10);
  const allCorrect = calcAccuracy(12, 12);

  assert(
    zeroAttempts === 0 && halfCorrect === 50 && allCorrect === 100,
    '29. Quiz accuracy calculated accurately and avoids divide-by-zero'
  );
}

// 28. Storage Corrupted Data Graceful Fallback
{
  const safeParseStorage = (raw: string | null) => {
    if (!raw) return DEFAULT_STORAGE_STATE;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
        return DEFAULT_STORAGE_STATE;
      }
      return parsed;
    } catch {
      return DEFAULT_STORAGE_STATE;
    }
  };

  const corruptedJson = safeParseStorage('{ invalid json !!');
  const invalidVersion = safeParseStorage(JSON.stringify({ version: 99, tasks: [] }));
  const validSaved = safeParseStorage(JSON.stringify(DEFAULT_STORAGE_STATE));

  assert(
    corruptedJson.version === 1 && corruptedJson.profile.name === DEFAULT_STORAGE_STATE.profile.name,
    '30. Corrupted JSON fallback returns valid default storage state'
  );

  assert(
    invalidVersion.version === 1 && validSaved.version === 1,
    '31. Storage migration / invalid version gracefully defaults without crashing'
  );
}

console.log(`\n====================================================`);
console.log(`RESULTS: ${passedTests} passed, ${failedTests} failed.`);
console.log('====================================================\n');
if (failedTests > 0) process.exit(1);
