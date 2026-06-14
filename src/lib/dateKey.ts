import { getServerTime } from "@apps-in-toss/web-framework";

// KST(UTC+9) 기준 "오늘" 날짜 키. 일일 리셋·연속 기록 판정에 사용해요.
// 토스 서버 시간을 우선 쓰고(클라 시계 조작 방지), 미지원/실패 시 기기 시각으로 폴백해요.

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** Unix ms → "YYYY-MM-DD" (KST) */
function toKstDateKey(unixMs: number): string {
  const kst = new Date(unixMs + KST_OFFSET_MS);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 서버(또는 폴백) 시각 기준 KST 오늘 날짜 키를 반환해요. */
export async function getTodayKey(): Promise<string> {
  try {
    if (getServerTime.isSupported()) {
      const serverMs = await getServerTime();
      if (typeof serverMs === "number" && Number.isFinite(serverMs)) {
        return toKstDateKey(serverMs);
      }
    }
  } catch {
    /* 미지원/실패 → 기기 시각 폴백 */
  }
  return toKstDateKey(Date.now());
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** dateKey(YYYY-MM-DD)가 prev 의 바로 다음날인지 (연속 기록 판정용) */
export function isConsecutive(prev: string, today: string): boolean {
  if (!prev) return false;
  const p = new Date(`${prev}T00:00:00Z`).getTime();
  const t = new Date(`${today}T00:00:00Z`).getTime();
  return t - p === DAY_MS;
}

/** dateKey 의 하루 전 날짜 키 */
export function dayBefore(dateKey: string): string {
  const t = new Date(`${dateKey}T00:00:00Z`).getTime() - DAY_MS;
  const d = new Date(t);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
