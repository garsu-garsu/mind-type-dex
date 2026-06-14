// 분석 이벤트 로깅 — 앱인토스 콘솔 "분석" 대시보드로 흘러가요.
// eventLog 는 init 없이 동작하고, 브라우저(둘러보기)·미지원 환경에서는 조용히 무시해요.
import { eventLog } from "@apps-in-toss/web-framework";

type Primitive = string | number | boolean;
type Params = Record<string, Primitive | null | undefined>;
type LogType = "event" | "screen" | "click" | "impression";

/** undefined/null 값을 제거해 eventLog 규격으로 정리 */
function clean(params: Params): Record<string, Primitive> {
  const out: Record<string, Primitive> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v != null) out[k] = v;
  }
  return out;
}

/** 커스텀 이벤트 기록 */
export function track(
  name: string,
  params: Params = {},
  type: LogType = "event",
): void {
  try {
    void eventLog({ log_name: name, log_type: type, params: clean(params) }).catch(
      () => {},
    );
  } catch {
    /* 미지원 환경 무시 */
  }
}

/** 화면 조회 기록 */
export function trackScreen(name: string, params: Params = {}): void {
  track(`screen_${name}`, params, "screen");
}

// 공통 이벤트(앱 간 비교 가능) + 앱 고유 이벤트
export const EVENT = {
  signup: "signup_complete", // { method: 'guest' }
  adRewarded: "ad_rewarded", // { context: 'detail_unlock' | 'extra_test' | 'streak_save' }
  adInterstitial: "ad_interstitial_shown", // { context }
  adBannerImpression: "ad_banner_impression", // { slot }
  shareCompleted: "share_completed", // { context }
  notifyConsent: "notify_consent", // { result }
  // 앱 고유
  testCompleted: "test_completed", // { type_id }
  typeCollected: "type_collected", // { type_id, total }
  detailUnlocked: "detail_unlocked", // { type_id }
} as const;
