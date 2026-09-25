import { z } from 'zod';

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const FlashcardSchema = z.object({
  id: z.string().min(1, 'Flashcard ID is required'),
  question: z.string().min(1, 'Flashcard question cannot be empty'),
  answer: z.string().min(1, 'Flashcard answer cannot be empty'),
  difficulty: DifficultySchema.default('medium'),
});

export const QuizQuestionSchema = z
  .object({
    id: z.string().min(1, 'Question ID is required'),
    question: z.string().min(1, 'Question text cannot be empty'),
    options: z
      .array(z.string().min(1, 'Option text cannot be empty'))
      .length(4, 'Quiz question must have exactly 4 options')
      .refine(
        (opts) => new Set(opts.map((o) => o.trim().toLowerCase())).size === 4,
        { message: 'Quiz question options must be unique' }
      ),
    correctAnswer: z.string().min(1, 'Correct answer cannot be empty'),
    explanation: z.string().min(1, 'Explanation cannot be empty'),
    difficulty: DifficultySchema.default('medium'),
  })
  .refine(
    (q) => q.options.some((opt) => opt.trim() === q.correctAnswer.trim()),
    {
      message: 'correctAnswer must match one of the 4 options exactly',
      path: ['correctAnswer'],
    }
  );

export const QuizSchema = z.object({
  questions: z
    .array(QuizQuestionSchema)
    .min(1, 'Quiz must have at least 1 question'),
});

export const StudyPlanSchema = z.object({
  title: z.string().min(1, 'Study plan title is required'),
  summary: z.string().min(1, 'Study plan summary is required'),
  flashcards: z
    .array(FlashcardSchema)
    .min(1, 'Study plan must contain at least 1 flashcard'),
  quiz: QuizSchema,
});

export type StudyPlanZod = z.infer<typeof StudyPlanSchema>;
export type FlashcardZod = z.infer<typeof FlashcardSchema>;
export type QuizQuestionZod = z.infer<typeof QuizQuestionSchema>;
