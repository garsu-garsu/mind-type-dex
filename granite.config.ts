import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mind-type-dex",
  brand: {
    displayName: "마음 유형 도감", // 화면에 노출될 한글 앱 이름
    primaryColor: "#7B6EF6", // 발랄·귀여운 페리윙클 (심리/마음 테마)
    icon: "", // 배포 시 아이콘 이미지 주소
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
  navigationBar: { withBackButton: true, withHomeButton: false },
});
