import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mind-type-dex",
  brand: {
    displayName: "마음 유형 도감", // 화면에 노출될 한글 앱 이름
    primaryColor: "#7B6EF6", // 발랄·귀여운 페리윙클 (심리/마음 테마)
    icon: "https://static.toss.im/appsintoss/13203/a029f591-1d32-4aed-ac9a-0072d1a5b21a.png", // 배포 시 아이콘 이미지 주소
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
  // 심사 반려(관상 셀프 분석): 네이티브 뒤로가기와 앱 자체 화면 이동이 겹쳐 보인다는
  // 지적을 받아 네이티브 뒤로가기를 껐어요. 화면 안의 버튼과 시스템 뒤로가기로 이동해요.
  navigationBar: {
    // 앱인토스 비게임 표준 내비게이션 바 — 좌측 뒤로가기는 모든 화면에서 동작해야 해요.
    // 끄면 "표준 내비게이션 바 미적용"으로 심사 반려돼요.
    withBackButton: true,
    withHomeButton: false,
  },
});
