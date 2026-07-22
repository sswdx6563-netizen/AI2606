import type { Category, Question } from "../types/quiz";

export const categories: Category[] = [
  {
    id: "ai-basics",
    name: "AI 기초",
    shortDescription: "학습 방식과 핵심 용어",
    icon: "brain",
  },
  {
    id: "data-preprocessing",
    name: "데이터 전처리",
    shortDescription: "결측치·인코딩·정규화",
    icon: "database",
  },
  {
    id: "model-evaluation",
    name: "모델 평가",
    shortDescription: "평가지표와 검증 방법",
    icon: "chart",
  },
  {
    id: "ai-ethics",
    name: "AI 윤리",
    shortDescription: "편향·개인정보·책임",
    icon: "scale",
  },
];

// 공식 기출문제가 아닌 학습 목적의 자체 제작 예시 문항입니다.
export const questions: Question[] = [
  {
    id: "ai-001",
    categoryId: "ai-basics",
    difficulty: "쉬움",
    prompt: "지도학습에 대한 설명으로 가장 알맞은 것은 무엇인가요?",
    choices: [
      "정답 없이 데이터의 패턴만 찾는다.",
      "입력 데이터와 정답을 함께 사용해 학습한다.",
      "보상 없이 무작위 행동만 반복한다.",
      "데이터 없이 규칙만으로 결과를 만든다.",
    ],
    answerIndex: 1,
    explanation:
      "지도학습은 입력값과 정답(label)이 함께 있는 데이터로 예측 규칙을 학습하는 방식입니다.",
  },
  {
    id: "ai-002",
    categoryId: "ai-basics",
    difficulty: "쉬움",
    prompt: "새로운 데이터를 기존 범주 중 하나로 나누는 문제는 무엇인가요?",
    choices: ["회귀", "분류", "군집화", "차원 축소"],
    answerIndex: 1,
    explanation:
      "분류는 이메일을 스팸/정상으로 나누는 것처럼 입력을 미리 정한 범주에 배정하는 문제입니다.",
  },
  {
    id: "ai-003",
    categoryId: "ai-basics",
    difficulty: "보통",
    prompt: "강화학습에서 에이전트가 더 나은 행동을 배우는 데 사용하는 신호는 무엇인가요?",
    choices: ["레이블", "보상", "결측치", "상관계수"],
    answerIndex: 1,
    explanation:
      "강화학습의 에이전트는 환경에서 받은 보상을 최대화하는 방향으로 행동 전략을 개선합니다.",
  },
  {
    id: "data-001",
    categoryId: "data-preprocessing",
    difficulty: "쉬움",
    prompt: "데이터에 결측치가 많을 때 가장 먼저 할 일로 적절한 것은 무엇인가요?",
    choices: [
      "모든 행을 바로 삭제한다.",
      "결측치의 위치·개수·발생 원인을 확인한다.",
      "정답 열을 삭제한다.",
      "그래프 색상만 바꾼다.",
    ],
    answerIndex: 1,
    explanation:
      "결측치는 분포와 원인을 먼저 확인한 뒤 삭제, 대체 등 적절한 처리 방법을 결정해야 합니다.",
  },
  {
    id: "data-002",
    categoryId: "data-preprocessing",
    difficulty: "보통",
    prompt: "범주형 값인 '서울·대전·부산'을 모델이 다룰 수 있게 바꾸는 과정은 무엇인가요?",
    choices: ["인코딩", "샘플링", "시각화", "크롤링"],
    answerIndex: 0,
    explanation:
      "인코딩은 문자 형태의 범주형 데이터를 모델이 처리할 수 있는 숫자 표현으로 변환합니다.",
  },
  {
    id: "data-003",
    categoryId: "data-preprocessing",
    difficulty: "보통",
    prompt: "서로 단위가 다른 특성들의 값 범위를 비슷하게 맞추는 주된 이유는 무엇인가요?",
    choices: [
      "파일 이름을 줄이기 위해",
      "특정 특성이 지나치게 큰 영향을 주는 것을 줄이기 위해",
      "결측치를 자동으로 만들기 위해",
      "정답 데이터를 숨기기 위해",
    ],
    answerIndex: 1,
    explanation:
      "스케일링은 값의 단위 차이 때문에 일부 특성이 학습에 과도한 영향을 주는 문제를 완화합니다.",
  },
  {
    id: "model-001",
    categoryId: "model-evaluation",
    difficulty: "쉬움",
    prompt: "실제값과 예측값의 관계를 TP·TN·FP·FN으로 정리한 표는 무엇인가요?",
    choices: ["혼동 행렬", "산점도", "파이 차트", "히스토그램"],
    answerIndex: 0,
    explanation:
      "혼동 행렬은 분류 모델의 실제값과 예측값을 조합해 정답과 오류 유형을 보여줍니다.",
  },
  {
    id: "model-002",
    categoryId: "model-evaluation",
    difficulty: "보통",
    prompt: "전체 예측 중 모델이 맞힌 비율을 뜻하는 평가지표는 무엇인가요?",
    choices: ["정확도", "재현율", "정밀도", "평균절대오차"],
    answerIndex: 0,
    explanation:
      "정확도는 전체 예측 건수에서 올바르게 예측한 건수가 차지하는 비율입니다.",
  },
  {
    id: "model-003",
    categoryId: "model-evaluation",
    difficulty: "어려움",
    prompt: "학습 데이터에서는 성능이 높지만 새로운 데이터에서 성능이 낮아지는 현상은 무엇인가요?",
    choices: ["과소적합", "과적합", "정규화", "군집화"],
    answerIndex: 1,
    explanation:
      "과적합은 모델이 학습 데이터의 세부 패턴과 잡음까지 외워 새로운 데이터에 일반화하지 못하는 현상입니다.",
  },
  {
    id: "ethics-001",
    categoryId: "ai-ethics",
    difficulty: "쉬움",
    prompt: "생성형 AI 결과물을 활용할 때 가장 바람직한 태도는 무엇인가요?",
    choices: [
      "사실 확인 없이 그대로 제출한다.",
      "결과를 검토하고 필요하면 출처와 사용 사실을 알린다.",
      "개인정보를 최대한 많이 입력한다.",
      "편향 가능성은 고려하지 않는다.",
    ],
    answerIndex: 1,
    explanation:
      "AI 결과에는 오류·편향·저작권 문제가 있을 수 있으므로 사람이 검토하고 책임 있게 사용해야 합니다.",
  },
  {
    id: "ethics-002",
    categoryId: "ai-ethics",
    difficulty: "보통",
    prompt: "채용 AI가 특정 집단에 계속 불리한 결과를 낸다면 가장 먼저 점검할 것은 무엇인가요?",
    choices: [
      "화면의 배경색",
      "학습 데이터와 평가 과정의 편향",
      "컴퓨터의 저장 용량",
      "사용자의 마우스 종류",
    ],
    answerIndex: 1,
    explanation:
      "데이터에 과거의 차별이나 불균형이 반영되면 모델 결과에도 편향이 생길 수 있어 데이터와 평가 과정을 점검해야 합니다.",
  },
  {
    id: "ethics-003",
    categoryId: "ai-ethics",
    difficulty: "보통",
    prompt: "AI 서비스에 개인정보를 입력하기 전에 확인할 사항으로 가장 적절한 것은 무엇인가요?",
    choices: [
      "입력창의 크기",
      "서비스의 수집 목적·보관 방식·제3자 제공 여부",
      "로고의 색상",
      "결과가 빨리 나오는지 여부만 확인",
    ],
    answerIndex: 1,
    explanation:
      "민감한 정보를 입력하기 전에는 어떤 정보를 왜 수집하며 얼마나 보관하고 누구와 공유하는지 확인해야 합니다.",
  },
];

export function getQuestionsByCategory(categoryId: Category["id"]) {
  return questions.filter((question) => question.categoryId === categoryId);
}

export function getQuestion(questionId: string) {
  return questions.find((question) => question.id === questionId);
}

export function getCategory(categoryId: Category["id"]) {
  return categories.find((category) => category.id === categoryId);
}
