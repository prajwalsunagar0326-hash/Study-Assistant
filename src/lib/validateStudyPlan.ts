import { StudyPlan, ApiError } from '../types/study';
import { StudyPlanSchema } from './schemas';
import { ZodError } from 'zod';

/**
 * Strips markdown code fences (```json ... ```) or surrounding conversational text
 * that LLMs may wrap around structured JSON responses.
 */
export function cleanRawJson(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let cleaned = raw.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }

  // Find first opening token ({ or [) and last matching closing token
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  // If array bracket appears first or only bracket exists
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket !== -1 && lastBracket > firstBracket) {
      cleaned = cleaned.slice(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }

  return cleaned.trim();
}

export type ValidationResult =
  | { success: true; data: StudyPlan }
  | { success: false; error: ApiError };

/**
 * Defensive runtime parser and validator.
 * Accepts raw string from LLM or pre-parsed object, cleans it, parses JSON safely,
 * and validates against StudyPlanSchema with comprehensive failure categorization.
 */
export function validateStudyPlan(raw: string | unknown): ValidationResult {
  // 1. Guard against empty / null responses
  if (!raw) {
    return {
      success: false,
      error: {
        type: 'EMPTY_RESPONSE',
        message: 'The model returned an empty response. Please provide more notes or a different topic.',
      },
    };
  }

  let parsed: unknown;

  // 2. String input: clean fences and parse JSON defensively
  if (typeof raw === 'string') {
    const cleaned = cleanRawJson(raw);
    if (!cleaned) {
      return {
        success: false,
        error: {
          type: 'EMPTY_RESPONSE',
          message: 'Received an empty response after stripping markdown fences.',
        },
      };
    }

    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return {
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          message: 'The AI returned invalid JSON that could not be parsed.',
          rawDetails: raw.length > 300 ? raw.slice(0, 300) + '...' : raw,
        },
      };
    }
  } else {
    parsed = raw;
  }

  // 3. Ensure root is a non-null object (not array or primitive)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Study plan root data must be an object matching the StudyPlan schema.',
      },
    };
  }

  // 4. Validate through Zod Schema
  const parseResult = StudyPlanSchema.safeParse(parsed);

  if (!parseResult.success) {
    const zodError = parseResult.error as ZodError;
    const firstIssue = zodError.issues[0];
    const path = firstIssue.path.length > 0 ? ` at "${firstIssue.path.join('.')}"` : '';
    const formattedMessage = `Schema error${path}: ${firstIssue.message}`;

    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: formattedMessage,
        rawDetails: JSON.stringify(zodError.format(), null, 2),
      },
    };
  }

  const validData = parseResult.data;

  // Return strongly-typed StudyPlan
  const studyPlan: StudyPlan = {
    title: validData.title.trim(),
    summary: validData.summary.trim(),
    flashcards: validData.flashcards.map((f, i) => ({
      id: f.id || `card-${i + 1}`,
      question: f.question.trim(),
      answer: f.answer.trim(),
      difficulty: f.difficulty,
    })),
    quiz: {
      questions: validData.quiz.questions.map((q, i) => ({
        id: q.id || `q-${i + 1}`,
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctAnswer: q.correctAnswer.trim(),
        explanation: q.explanation.trim(),
        difficulty: q.difficulty,
      })),
    },
  };

  return {
    success: true,
    data: studyPlan,
  };
}
