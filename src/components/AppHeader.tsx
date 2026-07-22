import { Icon } from "./Icon";

export type Screen = "home" | "category" | "quiz" | "result" | "wrong-note";

interface AppHeaderProps {
  screen: Screen;
  todayCount: number;
  navigate: (screen: Screen) => void;
  requestQuizExit?: (target: Screen) => void;
}

export function AppHeader({
  screen,
  todayCount,
  navigate,
  requestQuizExit,
}: AppHeaderProps) {
  const move = (target: Screen) => {
    if (screen === "quiz" && requestQuizExit) {
      requestQuizExit(target);
      return;
    }
    navigate(target);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => move("home")} aria-label="AICE CBT 홈">
          <span className="brand-mark"><Icon name="book" size={30} /></span>
          <span>AICE CBT</span>
        </button>

        <nav className="main-nav" aria-label="주요 메뉴">
          <button className={screen === "category" || screen === "quiz" ? "active" : ""} onClick={() => move("category")}>학습하기</button>
          <button className={screen === "wrong-note" ? "active" : ""} onClick={() => move("wrong-note")}>오답노트</button>
        </nav>

        <div className="today-pill" aria-label={`오늘 푼 문제 ${todayCount}개`}>
          <Icon name="calendar" size={20} />
          <span>오늘 <strong>{todayCount}</strong>문제</span>
        </div>
      </div>
    </header>
  );
}
