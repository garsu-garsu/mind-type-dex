// 그로스 카피·유형 매핑 자체 검증. 실행: npm run check:growth
// "64종", "N종 남았어요", 공유 문구 같은 사용자에게 보이는 약속이 깨지면 즉시 throw.
import assert from "node:assert/strict";

import {
  TOTAL_TYPES,
  TYPES,
  answersToTypeId,
  shareTextOf,
  todayQuestions,
} from "../src/data/types.ts";

// ── 화면 곳곳에 "64종" 이라고 쓰고 있어요. 실제로 64종이어야 해요 ──
assert.equal(TOTAL_TYPES, 64);
assert.equal(new Set(TYPES.map((t) => t.id)).size, 64, "유형 id 가 중복돼요");
assert.equal(new Set(TYPES.map((t) => t.name)).size, 64, "유형 이름이 중복돼요");
TYPES.forEach((t, i) => assert.equal(t.id, i, `TYPES[${i}].id 가 index 와 달라요`));

// ── 6문항 답 조합이 64종을 빠짐없이, 겹치지 않게 채워야 해요 ──
// (겹치면 도감이 절대 안 차고, 범위를 벗어나면 결과 화면이 터져요)
const hit = new Set<number>();
for (let mask = 0; mask < 64; mask++) {
  const bits = [0, 1, 2, 3, 4, 5].map((i) => (mask >> i) & 1);
  const id = answersToTypeId(bits);
  assert.ok(id >= 0 && id < TOTAL_TYPES, `범위를 벗어난 유형 id: ${id}`);
  hit.add(id);
}
assert.equal(hit.size, 64, "답 조합이 64종을 다 못 채워요");

// ── 오늘의 문항은 축마다 정확히 하나씩, 6개여야 진행률(n/6)이 맞아요 ──
for (const day of ["2026-08-07", "2026-01-01", "2027-12-31"]) {
  const qs = todayQuestions(day);
  assert.equal(qs.length, 6, `${day} 문항 수가 6개가 아니에요`);
  qs.forEach((q) => assert.ok(q.q && q.a && q.b, `${day} 빈 문항이 있어요`));
}

// ── 공유 문구에는 앱 이름이 들어가야 유입으로 이어져요 ──
for (const t of TYPES) {
  const text = shareTextOf(t);
  assert.ok(text.includes("마음 유형 도감"), `공유 문구에 앱 이름이 없어요: ${t.name}`);
  assert.ok(text.includes(t.name), `공유 문구에 유형 이름이 없어요: ${t.name}`);
  assert.ok(text.includes(t.oneLiner), `공유 문구에 한 줄 요약이 없어요: ${t.name}`);
}

console.log("growth-check 통과 ✅");
