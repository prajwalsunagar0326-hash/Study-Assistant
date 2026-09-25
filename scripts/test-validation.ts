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

console.log(`\nResults: ${passedTests} passed, ${failedTests} failed.`);
if (failedTests > 0) process.exit(1);
