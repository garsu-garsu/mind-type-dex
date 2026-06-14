// 마음 유형 도감 — 전체 화면 스크린샷 (Playwright)
// 사전조건: vite dev 서버(http://localhost:5173) 실행. 광고/서버 키 없이도 흐름이 돌아가요.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:5173/";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const VIEWPORT = { width: 390, height: 844 };
let n = 0;

async function shot(page, name) {
  n += 1;
  const file = `${OUT}/${String(n).padStart(2, "0")}-${name}.png`;
  await page.waitForTimeout(400);
  await page.screenshot({ path: file });
  console.log("📸", file);
}

/** 활성화된 버튼 중 idx 번째 클릭 (비활성 버튼 제외) */
async function tapButton(page, idx) {
  const btn = page.locator("button:not([disabled])").nth(idx);
  await btn.waitFor({ state: "visible", timeout: 10000 });
  await btn.click();
}

async function tapText(page, text) {
  await page.getByText(text, { exact: false }).first().click();
}

async function waitText(page, text, timeout = 12000) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout });
}

/** 4문항 테스트를 bits 패턴대로 응답 (옵션 버튼 0/1) */
async function answerTest(page, bits) {
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(300);
    await tapButton(page, bits[i]); // 0=첫째 옵션, 1=둘째 옵션
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

// 1) 홈 (신규)
await page.goto(BASE, { waitUntil: "networkidle" });
await waitText(page, "마음 유형 도감");
await shot(page, "home-fresh");

// 2) 오늘의 테스트 시작 → 문항
await tapText(page, "오늘의 테스트 시작");
await waitText(page, "Q1.");
await shot(page, "test-question");

// 3) 응답 완료 → 결과
await answerTest(page, [0, 0, 0, 0]);
await waitText(page, "오늘의 마음 유형");
await shot(page, "result");

// 4) 상세 해석 해금 (브라우저에선 광고가 즉시 통과)
await tapText(page, "상세 해석 해금");
await waitText(page, "상세 해석");
await shot(page, "result-unlocked");

// 5) 도감을 채우기 위해 추가 테스트 여러 번 (다양한 유형 수집)
await tapText(page, "홈으로");
await waitText(page, "오늘 테스트 한 번 더");

const patterns = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 0],
  [1, 0, 1, 1],
  [0, 1, 1, 1],
  [1, 1, 1, 1],
];
for (const bits of patterns) {
  await tapText(page, "오늘 테스트 한 번 더");
  await waitText(page, "Q1.");
  await answerTest(page, bits);
  await waitText(page, "오늘의 마음 유형");
  await tapText(page, "홈으로");
  await waitText(page, "오늘 테스트 한 번 더");
}

// 6) 홈 (기록 쌓인 상태)
await shot(page, "home-active");

// 7) 도감
await tapText(page, "마음 유형 도감 보기");
await waitText(page, "수집");
await shot(page, "dex");

// 8) 도감에서 유형 상세 열기 (첫 수집 유형 클릭)
await tapButton(page, 0); // 그리드 첫 칸
await page.waitForTimeout(400);
await shot(page, "dex-detail");

await browser.close();
console.log(`\n✅ ${n}장 캡처 완료 → ${OUT}/`);
