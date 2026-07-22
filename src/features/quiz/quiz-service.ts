import { getQuestion } from "../../data/questions";
import { storageService } from "../../services/storage-service";
import type {
  AnswerMap,
  CategoryId,
  QuizAttempt,
  QuizResult,
  WrongNoteEntry,
} from "../../types/quiz";

function attemptId() {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createAttempt(
  categoryId: CategoryId,
  questionIds: string[],
  source: QuizAttempt["source"] = "category",
): QuizAttempt {
  return {
    id: attemptId(),
    categoryId,
    questionIds,
    answers: {},
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    source,
  };
}

export function gradeAttempt(attempt: QuizAttempt): QuizResult {
  const items = attempt.questionIds.map((questionId) => {
    const question = getQuestion(questionId);
    const selectedIndex = attempt.answers[questionId];

    if (!question) {
      return { questionId, selectedIndex, isCorrect: false, isUnanswered: true };
    }

    return {
      questionId,
      selectedIndex,
      isCorrect: selectedIndex === question.answerIndex,
      isUnanswered: selectedIndex === undefined,
    };
  });

  const correctCount = items.filter((item) => item.isCorrect).length;
  const result: QuizResult = {
    attemptId: attempt.id,
    categoryId: attempt.categoryId,
    source: attempt.source,
    submittedAt: new Date().toISOString(),
    score: Math.round((correctCount / Math.max(items.length, 1)) * 100),
    correctCount,
    totalCount: items.length,
    items,
  };

  updateWrongNotes(result);
  storageService.saveResult(result);
  storageService.clearAttempt();
  return result;
}

function updateWrongNotes(result: QuizResult) {
  const notes = storageService.getWrongNotes();
  const byId = new Map(notes.map((entry) => [entry.questionId, entry]));

  result.items.forEach((item) => {
    const existing = byId.get(item.questionId);

    if (!item.isCorrect) {
      byId.set(item.questionId, {
        questionId: item.questionId,
        wrongCount: (existing?.wrongCount ?? 0) + 1,
        lastWrongAt: result.submittedAt,
        isMastered: false,
      });
      return;
    }

    if (result.source === "wrong-note" && existing) {
      byId.set(item.questionId, { ...existing, isMastered: true });
    }
  });

  storageService.saveWrongNotes([...byId.values()]);
}

export function updateAttemptAnswer(
  attempt: QuizAttempt,
  questionId: string,
  answerIndex: number,
) {
  return {
    ...attempt,
    answers: { ...attempt.answers, [questionId]: answerIndex } as AnswerMap,
  };
}

export function setMastered(questionId: string, isMastered: boolean) {
  const updated: WrongNoteEntry[] = storageService
    .getWrongNotes()
    .map((entry) =>
      entry.questionId === questionId ? { ...entry, isMastered } : entry,
    );
  storageService.saveWrongNotes(updated);
  return updated;
}
