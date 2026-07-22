"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader, type Screen } from "./components/AppHeader";
import { ConfirmModal } from "./components/ConfirmModal";
import { Icon } from "./components/Icon";
import {
  categories,
  getCategory,
  getQuestion,
  getQuestionsByCategory,
  questions,
} from "./data/questions";
import {
  createAttempt,
  gradeAttempt,
  setMastered,
  updateAttemptAnswer,
} from "./features/quiz/quiz-service";
import { storageService } from "./services/storage-service";
import type {
  CategoryId,
  QuizAttempt,
  QuizResult,
  WrongNoteEntry,
} from "./types/quiz";

type ModalState =
  | { type: "exit"; target: Screen }
  | { type: "submit" }
  | null;

function sameLocalDay(isoDate: string) {
  const date = new Date(isoDate);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function AiceCbtApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [wrongNotes, setWrongNotes] = useState<WrongNoteEntry[]>([]);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [wrongFilter, setWrongFilter] = useState<"learning" | "mastered">("learning");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAttempt(storageService.getAttempt());
      setResult(storageService.getLatestResult());
      setWrongNotes(storageService.getWrongNotes());
      setHistory(storageService.getHistory());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const stats = useMemo(() => {
    const total = history.reduce((sum, item) => sum + item.totalCount, 0);
    const correct = history.reduce((sum, item) => sum + item.correctCount, 0);
    return {
      total,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      activeWrong: wrongNotes.filter((item) => !item.isMastered).length,
      todayCount: history
        .filter((item) => sameLocalDay(item.submittedAt))
        .reduce((sum, item) => sum + item.totalCount, 0),
    };
  }, [history, wrongNotes]);

  function navigate(target: Screen) {
    setModal(null);
    setScreen(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function beginCategory(categoryId: CategoryId) {
    const nextAttempt = createAttempt(
      categoryId,
      getQuestionsByCategory(categoryId).map((question) => question.id),
    );
    storageService.saveAttempt(nextAttempt);
    setAttempt(nextAttempt);
    setResult(null);
    navigate("quiz");
  }

  function beginWrongQuestion(questionId: string) {
    const question = getQuestion(questionId);
    if (!question) return;
    const nextAttempt = createAttempt(question.categoryId, [questionId], "wrong-note");
    storageService.saveAttempt(nextAttempt);
    setAttempt(nextAttempt);
    setResult(null);
    navigate("quiz");
  }

  function resumeAttempt() {
    if (attempt) navigate("quiz");
  }

  function selectAnswer(answerIndex: number) {
    if (!attempt) return;
    const questionId = attempt.questionIds[attempt.currentIndex];
    const updated = updateAttemptAnswer(attempt, questionId, answerIndex);
    storageService.saveAttempt(updated);
    setAttempt(updated);
  }

  function moveQuestion(nextIndex: number) {
    if (!attempt) return;
    const safeIndex = Math.min(Math.max(nextIndex, 0), attempt.questionIds.length - 1);
    const updated = { ...attempt, currentIndex: safeIndex };
    storageService.saveAttempt(updated);
    setAttempt(updated);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitAttempt() {
    if (!attempt) return;
    const nextResult = gradeAttempt(attempt);
    setResult(nextResult);
    setAttempt(null);
    setWrongNotes(storageService.getWrongNotes());
    setHistory(storageService.getHistory());
    setModal(null);
    navigate("result");
  }

  function confirmExit() {
    if (modal?.type !== "exit") return;
    const target = modal.target;
    storageService.clearAttempt();
    setAttempt(null);
    setModal(null);
    navigate(target);
  }

  function toggleMastered(questionId: string, isMastered: boolean) {
    setWrongNotes(setMastered(questionId, isMastered));
  }

  return (
    <div className="app-frame">
      <AppHeader
        screen={screen}
        todayCount={stats.todayCount}
        navigate={navigate}
        requestQuizExit={(target) => setModal({ type: "exit", target })}
      />

      <main>
        {screen === "home" && (
          <HomeScreen
            stats={stats}
            hasAttempt={Boolean(attempt)}
            onResume={resumeAttempt}
            onLearn={() => navigate("category")}
            onWrongNote={() => navigate("wrong-note")}
          />
        )}

        {screen === "category" && (
          <CategoryScreen onStart={beginCategory} onBack={() => navigate("home")} />
        )}

        {screen === "quiz" && attempt && (
          <QuizScreen
            attempt={attempt}
            onAnswer={selectAnswer}
            onMove={moveQuestion}
            onExit={() => setModal({ type: "exit", target: "home" })}
            onSubmit={() => setModal({ type: "submit" })}
          />
        )}

        {screen === "quiz" && !attempt && (
          <EmptyState
            title="진행 중인 문제가 없어요"
            description="분야를 선택하면 바로 문제를 시작할 수 있어요."
            action="분야 선택하기"
            onAction={() => navigate("category")}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result}
            onRetry={() => beginCategory(result.categoryId)}
            onWrongNote={() => navigate("wrong-note")}
            onHome={() => navigate("home")}
          />
        )}

        {screen === "result" && !result && (
          <EmptyState
            title="아직 확인할 결과가 없어요"
            description="문제를 풀고 제출하면 점수와 해설이 여기에 표시돼요."
            action="문제 풀기"
            onAction={() => navigate("category")}
          />
        )}

        {screen === "wrong-note" && (
          <WrongNoteScreen
            entries={wrongNotes}
            filter={wrongFilter}
            onFilter={setWrongFilter}
            onRetry={beginWrongQuestion}
            onToggleMastered={toggleMastered}
            onLearn={() => navigate("category")}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>AICE 학습을 위한 자체 제작 예시 문항입니다. 공식 기출문제가 아닙니다.</p>
      </footer>

      {modal?.type === "exit" && (
        <ConfirmModal
          title="풀이를 그만둘까요?"
          description="현재 선택한 답은 삭제되고 홈으로 이동해요."
          confirmLabel="나가기"
          tone="danger"
          onConfirm={confirmExit}
          onCancel={() => setModal(null)}
        />
      )}

      {modal?.type === "submit" && (
        <ConfirmModal
          title="답안을 제출할까요?"
          description={`${attempt ? attempt.questionIds.length - Object.keys(attempt.answers).length : 0}개의 미응답 문제도 함께 채점돼요.`}
          confirmLabel="제출하고 결과 보기"
          cancelLabel="다시 확인하기"
          onConfirm={submitAttempt}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

function HomeScreen({
  stats,
  hasAttempt,
  onResume,
  onLearn,
  onWrongNote,
}: {
  stats: { total: number; accuracy: number; activeWrong: number; todayCount: number };
  hasAttempt: boolean;
  onResume: () => void;
  onLearn: () => void;
  onWrongNote: () => void;
}) {
  const progress = Math.min(Math.round((stats.total / questions.length) * 100), 100);

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">AICE 자격증, 차분하게 준비해요</p>
          <h1>오늘의 한 문제부터<br />실력을 쌓아보세요</h1>
          <p className="hero-description">분야별 문제를 풀고, 틀린 문제는 자동으로 모아<br className="desktop-break" /> 다시 학습할 수 있어요.</p>
          <div className="hero-actions">
            <button className="button primary large" onClick={onLearn}>문제 풀기 <Icon name="arrow" /></button>
            <button className="button secondary large" onClick={onWrongNote}>오답노트</button>
          </div>
          {hasAttempt && (
            <button className="resume-link" onClick={onResume}><Icon name="pencil" size={18} /> 저장된 풀이 이어서 하기</button>
          )}
        </div>

        <article className="progress-card" aria-label="나의 학습 현황">
          <h2>나의 학습 현황</h2>
          <div className="progress-content">
            <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{progress}</strong><span>%</span><small>전체 학습률</small></div>
            </div>
            <dl className="stat-list">
              <div><dt><span className="stat-icon"><Icon name="pencil" /></span>풀이</dt><dd>{stats.total}<small>문제</small></dd></div>
              <div><dt><span className="stat-icon"><Icon name="target" /></span>정답률</dt><dd>{stats.accuracy}<small>%</small></dd></div>
              <div><dt><span className="stat-icon warm"><Icon name="close" /></span>복습 중</dt><dd>{stats.activeWrong}<small>문제</small></dd></div>
            </dl>
          </div>
        </article>
      </section>

      <section className="section-shell category-preview">
        <div className="section-heading"><div><p className="eyebrow">학습 분야</p><h2>분야별로 차근차근</h2></div><button className="text-button" onClick={onLearn}>전체 분야 보기 <Icon name="arrow" size={18} /></button></div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <button className={`category-card tone-${index + 1}`} key={category.id} onClick={onLearn}>
              <span className="category-icon"><Icon name={category.icon} size={38} /></span>
              <span><strong>{category.name}</strong><small>{category.shortDescription}</small></span>
              <span className="category-count">{getQuestionsByCategory(category.id).length}문제 <Icon name="chevron" size={18} /></span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryScreen({ onStart, onBack }: { onStart: (id: CategoryId) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<CategoryId>(categories[0].id);
  const selectedCategory = getCategory(selected)!;
  const count = getQuestionsByCategory(selected).length;

  return (
    <section className="page-shell">
      <button className="back-button" onClick={onBack}>← 홈으로</button>
      <div className="page-title"><p className="eyebrow">학습 시작</p><h1>어떤 분야를 공부할까요?</h1><p>부담 없이 한 분야를 골라 시작해 보세요.</p></div>
      <div className="select-grid" role="radiogroup" aria-label="문제 분야 선택">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`select-card tone-${index + 1} ${selected === category.id ? "selected" : ""}`}
            role="radio"
            aria-checked={selected === category.id}
            onClick={() => setSelected(category.id)}
          >
            <span className="category-icon"><Icon name={category.icon} size={40} /></span>
            <span className="select-check"><Icon name="check" size={16} /></span>
            <strong>{category.name}</strong>
            <small>{category.shortDescription}</small>
            <span>{getQuestionsByCategory(category.id).length}문제 · 약 5분</span>
          </button>
        ))}
      </div>
      <div className="start-panel"><div><span className="category-icon"><Icon name={selectedCategory.icon} /></span><p><strong>{selectedCategory.name}</strong><small>{count}문제를 풀게 돼요. 답은 이동해도 유지돼요.</small></p></div><button className="button primary large" onClick={() => onStart(selected)}>시작하기 <Icon name="arrow" /></button></div>
    </section>
  );
}

function QuizScreen({
  attempt,
  onAnswer,
  onMove,
  onExit,
  onSubmit,
}: {
  attempt: QuizAttempt;
  onAnswer: (index: number) => void;
  onMove: (index: number) => void;
  onExit: () => void;
  onSubmit: () => void;
}) {
  const question = getQuestion(attempt.questionIds[attempt.currentIndex]);
  if (!question) return null;
  const selected = attempt.answers[question.id];
  const isLast = attempt.currentIndex === attempt.questionIds.length - 1;
  const category = getCategory(question.categoryId);

  return (
    <section className="quiz-shell">
      <div className="quiz-topline"><button className="back-button" onClick={onExit}>← 나가기</button><span>{category?.name}</span></div>
      <div className="quiz-progress-header"><div><strong>{attempt.currentIndex + 1}</strong> / {attempt.questionIds.length}</div><span>{question.difficulty}</span></div>
      <div className="progress-bar"><span style={{ width: `${((attempt.currentIndex + 1) / attempt.questionIds.length) * 100}%` }} /></div>
      <article className="question-card">
        <p className="question-label">QUESTION {String(attempt.currentIndex + 1).padStart(2, "0")}</p>
        <h1>{question.prompt}</h1>
        <div className="choice-list" role="radiogroup" aria-label="답안 선택">
          {question.choices.map((choice, index) => (
            <button key={choice} className={`choice ${selected === index ? "selected" : ""}`} role="radio" aria-checked={selected === index} onClick={() => onAnswer(index)}>
              <span className="choice-number">{index + 1}</span><span>{choice}</span><span className="choice-check"><Icon name="check" size={18} /></span>
            </button>
          ))}
        </div>
      </article>
      <div className="question-map" aria-label="문제 바로가기">
        {attempt.questionIds.map((id, index) => <button key={id} className={`${index === attempt.currentIndex ? "current" : ""} ${attempt.answers[id] !== undefined ? "answered" : ""}`} onClick={() => onMove(index)} aria-label={`${index + 1}번 문제`}>{index + 1}</button>)}
      </div>
      <div className="quiz-actions">
        <button className="button secondary" disabled={attempt.currentIndex === 0} onClick={() => onMove(attempt.currentIndex - 1)}>이전 문제</button>
        {isLast ? <button className="button primary" onClick={onSubmit}>제출하기 <Icon name="check" /></button> : <button className="button primary" onClick={() => onMove(attempt.currentIndex + 1)}>다음 문제 <Icon name="arrow" /></button>}
      </div>
    </section>
  );
}

function ResultScreen({ result, onRetry, onWrongNote, onHome }: { result: QuizResult; onRetry: () => void; onWrongNote: () => void; onHome: () => void }) {
  const category = getCategory(result.categoryId);
  return (
    <section className="page-shell result-page">
      <div className="result-summary">
        <p className="eyebrow">학습 완료</p><h1>{category?.name} 문제를 풀었어요</h1>
        <div className="score"><strong>{result.score}</strong><span>점</span></div>
        <p>{result.correctCount}문제 정답 · {result.totalCount - result.correctCount}문제 복습 필요</p>
        <div className="result-actions"><button className="button primary" onClick={onRetry}>다시 풀기</button><button className="button secondary" onClick={onWrongNote}>오답노트 보기</button><button className="text-button" onClick={onHome}>홈으로</button></div>
      </div>
      <div className="review-list">
        <div className="section-heading"><div><p className="eyebrow">문제별 해설</p><h2>답을 하나씩 확인해요</h2></div></div>
        {result.items.map((item, index) => {
          const question = getQuestion(item.questionId);
          if (!question) return null;
          return <article className={`review-card ${item.isCorrect ? "correct" : "wrong"}`} key={item.questionId}>
            <div className="review-title"><span>{item.isCorrect ? <Icon name="check" /> : <Icon name="close" />}</span><div><small>{index + 1}번 · {item.isUnanswered ? "미응답" : item.isCorrect ? "정답" : "오답"}</small><h3>{question.prompt}</h3></div></div>
            <dl><div><dt>내 답</dt><dd>{item.selectedIndex === undefined ? "미응답" : `${item.selectedIndex + 1}. ${question.choices[item.selectedIndex]}`}</dd></div><div><dt>정답</dt><dd>{question.answerIndex + 1}. {question.choices[question.answerIndex]}</dd></div></dl>
            <div className="explanation"><strong>해설</strong><p>{question.explanation}</p></div>
          </article>;
        })}
      </div>
    </section>
  );
}

function WrongNoteScreen({ entries, filter, onFilter, onRetry, onToggleMastered, onLearn }: { entries: WrongNoteEntry[]; filter: "learning" | "mastered"; onFilter: (filter: "learning" | "mastered") => void; onRetry: (id: string) => void; onToggleMastered: (id: string, value: boolean) => void; onLearn: () => void }) {
  const visible = entries.filter((entry) => filter === "mastered" ? entry.isMastered : !entry.isMastered);
  return (
    <section className="page-shell wrong-page">
      <div className="page-title split"><div><p className="eyebrow">다시 보면 내 것이 돼요</p><h1>오답노트</h1><p>틀렸거나 답하지 않은 문제는 자동으로 모여요.</p></div><div className="note-count"><Icon name="note" /><strong>{entries.filter((item) => !item.isMastered).length}</strong><span>복습할 문제</span></div></div>
      <div className="tabs"><button className={filter === "learning" ? "active" : ""} onClick={() => onFilter("learning")}>복습 중</button><button className={filter === "mastered" ? "active" : ""} onClick={() => onFilter("mastered")}>학습 완료</button></div>
      {visible.length === 0 ? <EmptyState title={filter === "learning" ? "복습할 문제가 없어요" : "학습 완료한 문제가 없어요"} description={filter === "learning" ? "새 문제를 풀면 틀린 문제가 이곳에 자동 저장돼요." : "오답을 다시 맞히면 학습 완료로 이동해요."} action="문제 풀기" onAction={onLearn} compact /> : <div className="wrong-list">{visible.map((entry) => {
        const question = getQuestion(entry.questionId); if (!question) return null; const category = getCategory(question.categoryId);
        return <article className="wrong-card" key={entry.questionId}><div className="wrong-meta"><span>{category?.name}</span><span>틀린 횟수 {entry.wrongCount}회</span></div><h2>{question.prompt}</h2><p>{question.explanation}</p><div><button className="button primary" onClick={() => onRetry(entry.questionId)}>재풀이</button><button className="button secondary" onClick={() => onToggleMastered(entry.questionId, !entry.isMastered)}>{entry.isMastered ? "복습 중으로" : "학습 완료"}</button></div></article>;
      })}</div>}
    </section>
  );
}

function EmptyState({ title, description, action, onAction, compact = false }: { title: string; description: string; action: string; onAction: () => void; compact?: boolean }) {
  return <section className={`empty-state ${compact ? "compact" : "page-shell"}`}><span className="empty-icon"><Icon name="book" size={34} /></span><h1>{title}</h1><p>{description}</p><button className="button primary" onClick={onAction}>{action}</button></section>;
}
