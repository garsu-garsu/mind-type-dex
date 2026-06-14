// 환경 변수 접근 (Vite). 값은 .env 또는 배포 환경에서 주입돼요. 비워도 동작해요.

/** 배너 광고 그룹 ID (TossAds.attachBanner). 비어있으면 배너를 렌더링하지 않아요. */
export const AD_GROUP_ID_BANNER = import.meta.env.VITE_AD_GROUP_ID_BANNER ?? "";

/** 전면형 광고 그룹 ID (loadFullScreenAd). 비어있으면 전면 광고를 건너뛰어요. */
export const AD_GROUP_ID_INTERSTITIAL =
  import.meta.env.VITE_AD_GROUP_ID_INTERSTITIAL ?? "";

/** 보상형 광고 그룹 ID (loadFullScreenAd + userEarnedReward). 비어있으면 즉시 통과(개발 편의). */
export const AD_GROUP_ID_REWARDED =
  import.meta.env.VITE_AD_GROUP_ID_REWARDED ?? "";

/** 알림 수신 동의 템플릿 코드 (콘솔 > 스마트 발송). 비어있으면 동의 요청을 건너뛰어요. */
export const NOTIFY_TEMPLATE_CODE =
  import.meta.env.VITE_NOTIFY_TEMPLATE_CODE ?? "";
