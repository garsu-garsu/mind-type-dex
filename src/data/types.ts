// 마음 유형 도감 — 코어 데이터.
// 4개 이분 축(각 1문항)에 답하면 4비트 → 2^4 = 16종 유형으로 "결정적" 매핑돼요.
// (랜덤/확률 뽑기가 아니라 답에 따라 정해지는 진단 결과 → 사행성 표면 0)

/** 축 순서: energy(bit0) · decision(bit1) · rhythm(bit2) · view(bit3) */
export interface Axis {
  key: "energy" | "decision" | "rhythm" | "view";
  /** 이 축에 대한 문항 변주들 (날짜에 따라 회전돼요) */
  questions: AxisQuestion[];
}

export interface AxisQuestion {
  q: string;
  /** 선택지 a 를 고르면 비트 0, b 를 고르면 비트 1 */
  a: string;
  b: string;
}

export const AXES: Axis[] = [
  {
    key: "energy",
    questions: [
      { q: "주말에 에너지가 차오르는 쪽은?", a: "사람들과 왁자지껄", b: "혼자 조용한 시간" },
      { q: "기분 좋은 약속이 잡혔다. 나는?", a: "한 명이라도 더 부른다", b: "딱 마음 맞는 한 명" },
      { q: "에너지를 채우는 방법은?", a: "밖으로 나가 활동", b: "집에서 충전" },
    ],
  },
  {
    key: "decision",
    questions: [
      { q: "중요한 선택 앞에서 나는?", a: "마음이 향하는 대로", b: "따져보고 논리대로" },
      { q: "친구의 고민을 들을 때 먼저?", a: "마음에 공감부터", b: "해결책을 같이 정리" },
      { q: "물건을 살 때 기준은?", a: "끌리는 느낌", b: "스펙과 가성비" },
    ],
  },
  {
    key: "rhythm",
    questions: [
      { q: "여행 스타일은?", a: "그날 기분 따라 즉흥", b: "동선까지 미리 계획" },
      { q: "오늘 할 일을 대하는 나는?", a: "일단 끌리는 것부터", b: "리스트 만들고 차근차근" },
      { q: "갑작스런 변수가 생기면?", a: "오히려 재밌다", b: "계획대로가 편하다" },
    ],
  },
  {
    key: "view",
    questions: [
      { q: "더 자주 생각하는 건?", a: "지금 이 순간", b: "먼 미래의 그림" },
      { q: "대화에서 더 끌리는 주제는?", a: "오늘 있었던 일", b: "앞으로의 꿈과 계획" },
      { q: "나를 움직이는 건?", a: "당장의 설렘", b: "장기적인 목표" },
    ],
  },
];

export interface MindType {
  id: number; // 0~15
  emoji: string;
  name: string;
  oneLiner: string; // 무료 공개
  detail: string; // 광고 보고 해금
}

// index = energy(1) + decision(2) + rhythm(4) + view(8)
export const TYPES: MindType[] = [
  { id: 0, emoji: "🐶", name: "햇살 리트리버", oneLiner: "곁에 있으면 기분 좋아지는 다정 에너자이저.", detail: "사람을 좋아하고 지금 이 순간의 즐거움에 충실해요. 마음 가는 대로 움직이는 게 잘 맞고, 주변을 환하게 만드는 분위기 메이커예요. 가끔은 혼자 충전하는 시간도 챙겨주면 더 단단해져요." },
  { id: 1, emoji: "🐱", name: "보들 고양이", oneLiner: "내 공간에서 마음을 채우는 포근한 사람.", detail: "조용한 곳에서 감정을 천천히 음미하는 타입이에요. 가까운 사람에게는 한없이 다정하고, 오늘의 작은 행복을 소중히 여겨요. 마음이 끌리면 망설임 없이 움직이는 따뜻한 즉흥파." },
  { id: 2, emoji: "🦊", name: "재치 여우", oneLiner: "순발력과 위트로 분위기를 사로잡는 사람.", detail: "사람들 속에서 빛나고, 머리 회전이 빨라 즉석에서 재치 있게 대처해요. 지금 벌어지는 상황을 즐기며 유연하게 풀어가는 현장형 똑똑이예요." },
  { id: 3, emoji: "🦉", name: "골똘 부엉이", oneLiner: "혼자 깊이 파고드는 조용한 분석가.", detail: "조용한 곳에서 생각을 정리할 때 가장 또렷해져요. 논리적으로 따져보되 즉흥적인 통찰도 번뜩이는 타입. 지금 눈앞의 문제를 차분히 꿰뚫는 관찰력이 강점이에요." },
  { id: 4, emoji: "🐰", name: "폴짝 토끼", oneLiner: "계획 위에서 신나게 뛰노는 다정한 활동가.", detail: "사람들과 어울리는 걸 좋아하면서도 나름의 루틴을 지켜요. 마음을 따라 움직이지만 오늘 할 일은 야무지게 챙기는, 따뜻하고 부지런한 사람이에요." },
  { id: 5, emoji: "🦦", name: "느긋 수달", oneLiner: "내 페이스로 차곡차곡, 마음이 넉넉한 사람.", detail: "조용한 공간에서 계획을 세워 하루를 꾸려가요. 감성이 풍부하고 지금의 편안함을 소중히 여기는 타입. 서두르지 않아도 결국 해내는 단단한 여유가 있어요." },
  { id: 6, emoji: "🐝", name: "야무진 꿀벌", oneLiner: "오늘 할 일은 오늘! 똑부러지는 실행가.", detail: "활발하게 움직이며 계획을 착착 해치우는 현실 감각의 소유자예요. 논리적으로 우선순위를 정하고 지금 처리할 일에 집중하는, 믿음직한 일잘러." },
  { id: 7, emoji: "🐢", name: "단단 거북", oneLiner: "조용하고 꾸준하게, 자기 길을 가는 사람.", detail: "혼자만의 속도로 계획을 지켜내는 신중한 타입이에요. 논리적이고 차분하며 지금 발밑을 단단히 다지는 사람. 한 번 정한 건 끝까지 가는 뚝심이 매력이에요." },
  { id: 8, emoji: "🦋", name: "자유 나비", oneLiner: "마음 따라 훨훨, 멀리 꿈꾸는 낭만가.", detail: "사람들과 어울리며 영감을 얻고, 마음이 이끄는 대로 자유롭게 움직여요. 먼 미래의 그림을 그리는 걸 좋아하는 즉흥적 몽상가. 틀에 갇히지 않는 상상력이 무기예요." },
  { id: 9, emoji: "🐨", name: "몽글 코알라", oneLiner: "느긋하게 꿈꾸는, 마음 따뜻한 이상가.", detail: "조용한 곳에서 미래를 상상하며 마음을 채우는 타입이에요. 감성이 깊고 즉흥적이지만 멀리 보는 시선을 가졌어요. 천천히, 그러나 멈추지 않고 꿈을 키워가요." },
  { id: 10, emoji: "🐦", name: "호기심 파랑새", oneLiner: "새로운 아이디어를 찾아 날아다니는 탐험가.", detail: "활발하고 논리적이며, 즉흥적으로 미래의 가능성을 탐색해요. 호기심이 끝이 없어 늘 새로운 걸 시도하는 타입. 멀리 보는 통찰과 빠른 실행력을 함께 가졌어요." },
  { id: 11, emoji: "🐺", name: "신비 늑대", oneLiner: "혼자 큰 그림을 그리는 독립적인 전략가.", detail: "조용히 미래를 설계하는 논리형 자유인이에요. 즉흥적인 통찰로 판을 읽고, 혼자만의 시간에 깊은 전략을 세워요. 신비롭고 독립적인 매력의 소유자." },
  { id: 12, emoji: "🐬", name: "활기 돌고래", oneLiner: "사람들과 미래를 향해 헤엄치는 리더형.", detail: "활발하고 다정하며, 계획적으로 먼 목표를 향해 나아가요. 주변을 이끌면서도 마음을 살피는 따뜻한 리더. 큰 그림과 사람 사이의 균형을 잘 잡아요." },
  { id: 13, emoji: "🦌", name: "차분 사슴", oneLiner: "고요히 멀리 보는, 우아한 계획가.", detail: "조용한 곳에서 미래를 그리며 마음을 다스리는 타입이에요. 감성이 깊고 계획적이며 장기적인 시선을 가졌어요. 서두르지 않는 우아함과 단단한 내면이 매력이에요." },
  { id: 14, emoji: "🦅", name: "큰그림 독수리", oneLiner: "높이 날아 멀리 보는, 추진력의 화신.", detail: "활발하고 논리적이며 큰 목표를 향해 계획대로 밀어붙여요. 멀리 내다보는 시야와 강한 추진력으로 일을 성사시키는 타입. 리더십과 결단력이 돋보여요." },
  { id: 15, emoji: "🐘", name: "든든 코끼리", oneLiner: "묵직하게 멀리 보는, 신뢰의 기둥.", detail: "조용하고 논리적이며 장기적인 계획을 끝까지 지켜내요. 듬직하고 변치 않는 신뢰를 주는 타입. 멀리 보는 안목과 흔들리지 않는 뚝심으로 주변의 기둥이 돼요." },
];

/** 4개 답(각 0=a, 1=b)을 받아 유형 index 계산 */
export function answersToTypeId(bits: [number, number, number, number]): number {
  return bits[0] * 1 + bits[1] * 2 + bits[2] * 4 + bits[3] * 8;
}

/** 날짜 키 → 정수 해시(문항 변주 회전용) */
export function dayNumber(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** 오늘의 문항 4개(축 순서대로, 날짜에 따라 변주 선택) */
export function todayQuestions(dateKey: string): AxisQuestion[] {
  const n = dayNumber(dateKey);
  return AXES.map((axis, i) => {
    const idx = (n + i) % axis.questions.length;
    return axis.questions[idx];
  });
}

export interface Rank {
  label: string;
  emoji: string;
  min: number; // 수집 개수 하한
}

export const RANKS: Rank[] = [
  { label: "새싹 분석가", emoji: "🌱", min: 0 },
  { label: "마음 관찰자", emoji: "👀", min: 2 },
  { label: "유형 수집가", emoji: "📒", min: 5 },
  { label: "마음 분석가", emoji: "🔍", min: 9 },
  { label: "마음 박사", emoji: "🎓", min: 14 },
];

export function rankOf(collectedCount: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (collectedCount >= rank.min) r = rank;
  return r;
}

export const TOTAL_TYPES = TYPES.length;
