import { useCallback, useState } from "react";

import { isConsecutive, dayBefore } from "../lib/dateKey";

export interface HistoryEntry {
  dateKey: string;
  typeId: number;
}

export interface DexState {
  collected: number[]; // 수집한 typeId
  unlocked: number[]; // 상세 해석 해금한 typeId
  history: HistoryEntry[]; // 최근 결과 기록
  streak: { count: number; lastDateKey: string };
  daily: { dateKey: string; doneCount: number }; // 오늘 테스트 횟수
}

const KEY = "mtd:state";

const EMPTY: DexState = {
  collected: [],
  unlocked: [],
  history: [],
  streak: { count: 0, lastDateKey: "" },
  daily: { dateKey: "", doneCount: 0 },
};

function load(): DexState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DexState>;
    return {
      collected: parsed.collected ?? [],
      unlocked: parsed.unlocked ?? [],
      history: parsed.history ?? [],
      streak: parsed.streak ?? { count: 0, lastDateKey: "" },
      daily: parsed.daily ?? { dateKey: "", doneCount: 0 },
    };
  } catch {
    return EMPTY;
  }
}

function save(state: DexState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* 저장 실패 무시(시크릿 모드 등) */
  }
}

export interface CompleteResult {
  isNew: boolean; // 도감에 처음 추가된 유형인지
  collectedCount: number;
  streakCount: number;
}

export function useDexState() {
  const [state, setState] = useState<DexState>(() => load());

  const update = useCallback((next: DexState) => {
    save(next);
    setState(next);
  }, []);

  /** 오늘의 테스트를 완료하고 결과를 기록해요. 첫 테스트면 연속 기록을 갱신. */
  const completeTest = useCallback(
    (today: string, typeId: number): CompleteResult => {
      const firstToday = state.daily.dateKey !== today;
      const isNew = !state.collected.includes(typeId);

      let streak = state.streak;
      if (firstToday) {
        const count = isConsecutive(streak.lastDateKey, today)
          ? streak.count + 1
          : 1;
        streak = { count, lastDateKey: today };
      }

      const daily = firstToday
        ? { dateKey: today, doneCount: 1 }
        : { dateKey: today, doneCount: state.daily.doneCount + 1 };

      const next: DexState = {
        ...state,
        collected: isNew ? [...state.collected, typeId] : state.collected,
        history: [{ dateKey: today, typeId }, ...state.history].slice(0, 60),
        streak,
        daily,
      };
      update(next);
      return {
        isNew,
        collectedCount: next.collected.length,
        streakCount: streak.count,
      };
    },
    [state, update],
  );

  /** 상세 해석 해금(광고 보상 후) */
  const unlockDetail = useCallback(
    (typeId: number) => {
      if (state.unlocked.includes(typeId)) return;
      update({ ...state, unlocked: [...state.unlocked, typeId] });
    },
    [state, update],
  );

  /** 연속 기록 끊김이 위험한 상태인지 (마지막 기록이 어제도 오늘도 아님 + 기록 있음) */
  const streakAtRisk = useCallback(
    (today: string): boolean => {
      const last = state.streak.lastDateKey;
      if (!last || state.streak.count <= 0) return false;
      if (last === today) return false;
      return !isConsecutive(last, today); // 어제가 아니면 위험
    },
    [state.streak],
  );

  /** 연속 기록 지키기(광고 보상 후): 마지막 기록일을 어제로 당겨 오늘 완료 시 이어지게 함 */
  const keepStreak = useCallback(
    (today: string) => {
      update({
        ...state,
        streak: { ...state.streak, lastDateKey: dayBefore(today) },
      });
    },
    [state, update],
  );

  return {
    state,
    completeTest,
    unlockDetail,
    streakAtRisk,
    keepStreak,
  };
}
