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

/* Form Validation Schemas for React Hook Form */
export const TaskFormSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(120, 'Title cannot exceed 120 characters'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  category: z.string().trim().max(50, 'Category cannot exceed 50 characters').optional(),
});
export type TaskFormData = z.infer<typeof TaskFormSchema>;

export const EventFormSchema = z.object({
  title: z.string().trim().min(1, 'Event title is required').max(120, 'Title cannot exceed 120 characters'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  type: z.enum(['study', 'assignment', 'exam', 'deadline', 'other']),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
});
export type EventFormData = z.infer<typeof EventFormSchema>;

export const ProfileFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Name cannot exceed 60 characters'),
  email: z.string().trim().email('Valid email is required'),
  bio: z.string().trim().max(300, 'Bio cannot exceed 300 characters').optional(),
  studyGoal: z.string().trim().max(200, 'Study goal cannot exceed 200 characters').optional(),
  avatarInitials: z.string().trim().max(3).optional(),
});
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;

export const PomodoroSettingsFormSchema = z.object({
  focusDuration: z.number().min(1, 'Focus duration must be at least 1 min').max(120, 'Maximum 120 mins'),
  shortBreakDuration: z.number().min(1, 'Short break must be at least 1 min').max(60, 'Maximum 60 mins'),
  longBreakDuration: z.number().min(1, 'Long break must be at least 1 min').max(90, 'Maximum 90 mins'),
  longBreakInterval: z.number().min(1, 'Interval must be at least 1').max(12, 'Maximum 12 sessions'),
});
export type PomodoroSettingsFormData = z.infer<typeof PomodoroSettingsFormSchema>;
