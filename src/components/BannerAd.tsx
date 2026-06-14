import { TossAds } from "@apps-in-toss/web-framework";
import { useEffect, useRef, useState } from "react";

import { AD_GROUP_ID_BANNER } from "../lib/env";
import { EVENT, track } from "../lib/analytics";

interface BannerAdProps {
  /** 분석용 노출 위치 구분값 (예: 'home' | 'dex') */
  slot?: string;
}

// TossAds.attachBanner 는 네이티브 광고 SDK를 대상 DOM에 붙여요.
// 브라우저/미지원 환경에서는 isSupported() 가 false → 아무것도 렌더링하지 않아요.
/** 화면 하단에 붙이는 배너 광고(화면당 1개). 지원 안 되면 공간을 차지하지 않아요. */
export function BannerAd({ slot }: BannerAdProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (AD_GROUP_ID_BANNER === "" || target == null) return;

    let detach: (() => void) | undefined;

    try {
      if (!TossAds.attachBanner.isSupported()) return;

      try {
        if (TossAds.initialize.isSupported()) {
          TossAds.initialize({});
        }
      } catch {
        /* 초기화 중복/미지원 무시 */
      }

      const { destroy } = TossAds.attachBanner(AD_GROUP_ID_BANNER, target, {
        theme: "auto",
        variant: "card",
        callbacks: {
          onAdRendered: () => {
            setVisible(true);
            track(EVENT.adBannerImpression, { slot: slot ?? "" }, "impression");
          },
          onAdFailedToRender: (payload) => {
            console.error("배너 광고 렌더 실패:", payload.error);
            setVisible(false);
          },
          onNoFill: () => setVisible(false),
        },
      });
      detach = destroy;
    } catch (err) {
      console.error("배너 광고 연결 실패:", err);
    }

    return () => {
      try {
        detach?.();
      } catch {
        /* noop */
      }
    };
  }, [slot]);

  if (AD_GROUP_ID_BANNER === "") return null;

  return (
    <div
      ref={targetRef}
      style={{
        minHeight: visible ? undefined : 0,
        overflow: "hidden",
      }}
    />
  );
}
