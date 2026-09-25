export type StudyMode = 'flashcards' | 'quiz';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface StudyPlan {
  title: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: {
    questions: QuizQuestion[];
  };
}

export type ErrorType =
  | 'EMPTY_RESPONSE'
  | 'MALFORMED_JSON'
  | 'SCHEMA_VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'ABORTED'
  | 'UNKNOWN';

export interface ApiError {
  type: ErrorType;
  message: string;
  rawDetails?: string;
  statusCode?: number;
}

export interface QuizSessionState {
  currentQuestionIndex: number;
  selectedOption: string | null;
  isSubmitted: boolean;
  score: number;
  wrongQuestionIds: string[];
  isCompleted: boolean;
  isRetryingWrong: boolean;
}
