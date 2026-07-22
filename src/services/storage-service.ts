import type {
  QuizAttempt,
  QuizResult,
  WrongNoteEntry,
} from "../types/quiz";

const KEYS = {
  attempt: "aice-cbt:attempt",
  latestResult: "aice-cbt:latest-result",
  wrongNotes: "aice-cbt:wrong-notes",
  history: "aice-cbt:history",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storageService = {
  getAttempt: () => read<QuizAttempt | null>(KEYS.attempt, null),
  saveAttempt: (attempt: QuizAttempt) => write(KEYS.attempt, attempt),
  clearAttempt: () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(KEYS.attempt);
  },

  getLatestResult: () => read<QuizResult | null>(KEYS.latestResult, null),
  saveResult: (result: QuizResult) => {
    write(KEYS.latestResult, result);
    const history = read<QuizResult[]>(KEYS.history, []);
    write(KEYS.history, [result, ...history].slice(0, 30));
  },

  getHistory: () => read<QuizResult[]>(KEYS.history, []),
  getWrongNotes: () => read<WrongNoteEntry[]>(KEYS.wrongNotes, []),
  saveWrongNotes: (entries: WrongNoteEntry[]) => write(KEYS.wrongNotes, entries),
};
