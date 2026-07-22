export type CategoryId =
  | "ai-basics"
  | "data-preprocessing"
  | "model-evaluation"
  | "ai-ethics";

export type Difficulty = "쉬움" | "보통" | "어려움";

export interface Question {
  id: string;
  categoryId: CategoryId;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  shortDescription: string;
  icon: "brain" | "database" | "chart" | "scale";
}

export type AnswerMap = Record<string, number>;

export interface QuizAttempt {
  id: string;
  categoryId: CategoryId;
  questionIds: string[];
  answers: AnswerMap;
  currentIndex: number;
  startedAt: string;
  source: "category" | "wrong-note";
}

export interface QuestionResult {
  questionId: string;
  selectedIndex?: number;
  isCorrect: boolean;
  isUnanswered: boolean;
}

export interface QuizResult {
  attemptId: string;
  categoryId: CategoryId;
  source: QuizAttempt["source"];
  submittedAt: string;
  score: number;
  correctCount: number;
  totalCount: number;
  items: QuestionResult[];
}

export interface WrongNoteEntry {
  questionId: string;
  wrongCount: number;
  lastWrongAt: string;
  isMastered: boolean;
}
