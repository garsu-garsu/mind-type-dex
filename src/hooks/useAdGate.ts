import {
  loadFullScreenAd,
  showFullScreenAd,
} from "@apps-in-toss/web-framework";
import { useToast } from "@toss/tds-mobile";
import { useCallback, useEffect, useRef, useState } from "react";

import { AD_GROUP_ID_REWARDED } from "../lib/env";
import { EVENT, track } from "../lib/analytics";

interface UseAdGateReturn {
  ready: boolean;
  /**
   * 광고를 보여주고 보상을 받으면 onReward 를 실행해요.
   * 미지원/미설정(브라우저·개발)이면 즉시 onReward. context 는 분석용 구분값.
   */
  watchThen: (onReward: () => void, context?: string) => void;
}

/** "광고 보고 → 액션 실행" 보상형 게이트. 상세 해석 해금·추가 테스트·연속 지키기에 사용. */
export function useAdGate(): UseAdGateReturn {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const supportedRef = useRef(false);
  const unloadRef = useRef<(() => void) | null>(null);

  const load = useCallback(() => {
    if (AD_GROUP_ID_REWARDED === "") return;
    try {
      if (!loadFullScreenAd.isSupported()) return;
      supportedRef.current = true;
      unloadRef.current = loadFullScreenAd({
        options: { adGroupId: AD_GROUP_ID_REWARDED },
        onEvent: (e) => {
          if (e.type === "loaded") setReady(true);
        },
        onError: (err) => console.error("광고 로드 실패:", err),
      });
    } catch (err) {
      console.error("광고 환경 확인 실패:", err);
    }
  }, []);

  useEffect(() => {
    load();
    return () => unloadRef.current?.();
  }, [load]);

  const watchThen = useCallback(
    (onReward: () => void, context?: string) => {
      // 미설정/미지원 → 즉시 통과 (개발 편의)
      if (AD_GROUP_ID_REWARDED === "" || !supportedRef.current) {
        onReward();
        return;
      }
      if (!ready) {
        toast.openToast("광고를 준비 중이에요. 잠시 후 다시 시도해 주세요.");
        load();
        return;
      }

      let rewarded = false;
      try {
        showFullScreenAd({
          options: { adGroupId: AD_GROUP_ID_REWARDED },
          onEvent: (e) => {
            if (e.type === "userEarnedReward") {
              rewarded = true;
              track(EVENT.adRewarded, { context: context ?? "" });
            } else if (e.type === "dismissed") {
              setReady(false);
              load();
              if (rewarded) onReward();
            } else if (e.type === "failedToShow") {
              setReady(false);
              load();
            }
          },
          onError: (err) => {
            console.error("광고 표시 실패:", err);
            setReady(false);
            load();
          },
        });
      } catch (err) {
        console.error("광고 표시 실패:", err);
      }
    },
    [ready, load, toast],
  );

  return { ready, watchThen };
}
