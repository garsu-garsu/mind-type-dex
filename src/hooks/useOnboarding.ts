import { useCallback, useState } from "react";

import { trackScreen } from "../lib/analytics";

const KEY = "mtd:onboarded";
const STEP_KEY = "mtd:onboarded:step";

/** 저장이 막힌 환경(프라이빗 모드 등)에서는 매번 뜨는 걸 막기 위해 읽기 실패를
 * "이미 봤음"으로 처리해요. */
function readOnboarded(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

function readSavedStep(total: number): number {
  try {
    const saved = Number(localStorage.getItem(STEP_KEY));
    return Number.isInteger(saved) && saved > 0 && saved < total ? saved : 0;
  } catch {
    return 0;
  }
}

function writeStep(index: number): void {
  try {
    localStorage.setItem(STEP_KEY, String(index));
  } catch {
    /* noop */
  }
}

function writeDone(): void {
  try {
    localStorage.setItem(KEY, "1");
    localStorage.removeItem(STEP_KEY);
  } catch {
    /* noop */
  }
  trackScreen("onboarding_done");
}

/**
 * 첫 실행에만 도는 코치마크. 화면을 한 번씩 누르면 다음으로 넘어가요.
 *
 * 첫 단계에서 넘어가면 테스트 화면으로 이동해 홈이 언마운트돼요 — 진행 단계를
 * localStorage 에 저장해 두고 돌아왔을 때 이어서 보여줍니다.
 */
export function useOnboarding(steps: string[]) {
  const [index, setIndex] = useState(() =>
    readOnboarded() ? -1 : readSavedStep(steps.length),
  );

  const finish = useCallback(() => {
    writeDone();
    setIndex(-1);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => {
      if (prev < 0) return prev;
      const nextIndex = prev + 1;
      if (nextIndex >= steps.length) {
        writeDone();
        return -1;
      }
      writeStep(nextIndex);
      return nextIndex;
    });
  }, [steps.length]);

  return {
    current: index >= 0 ? steps[index] : undefined,
    index,
    total: steps.length,
    next,
    skip: finish,
  };
}
