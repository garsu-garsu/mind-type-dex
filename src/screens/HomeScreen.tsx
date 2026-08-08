import { Button, ProgressBar, TextButton, Top, useToast } from "@toss/tds-mobile";

import { canRequestNotifyConsent, requestNotifyConsent } from "../data/notify";
import { EVENT, track } from "../lib/analytics";
import { TOTAL_TYPES, TYPES, rankOf } from "../data/types";
import type { DexState } from "../hooks/useDexState";

interface Props {
  today: string;
  state: DexState;
  atRisk: boolean;
  onStart: () => void; // 오늘의 테스트 시작 / 한 번 더
  onKeepStreak: () => void; // 광고 보고 연속 기록 지키기
  onGoDex: () => void;
}

const PRIMARY = "#7B6EF6";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#2B2B40" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#8A8AA0", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function HomeScreen({
  today,
  state,
  atRisk,
  onStart,
  onKeepStreak,
  onGoDex,
}: Props) {
  const toast = useToast();
  const rank = rankOf(state.collected.length);
  const doneToday = state.daily.dateKey === today && state.daily.doneCount > 0;
  const todayEntry = state.history.find((h) => h.dateKey === today);
  const todayType =
    todayEntry != null ? TYPES[todayEntry.typeId] : null;
  const remaining = TOTAL_TYPES - state.collected.length;

  const onNotify = async () => {
    const r = await requestNotifyConsent();
    if (r != null) {
      track(EVENT.notifyConsent, { result: r });
      if (r !== "agreementRejected") toast.openToast("매일 알림을 받아요!");
    }
  };

  return (
    <div style={{ paddingBottom: 32 }}>
        {/* 앱 이름은 토스 상단 바가 이미 보여줘요. 여기서 또 쓰면 헤더가 겹쳐 보여
        "자체 헤더 중복"으로 심사 반려돼요. 대신 무엇을 얻는지를 적어요. */}
      <Top
        title={
          <Top.TitleParagraph size={28}>6문항 성격 유형 테스트</Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            오늘의 나는 어떤 유형일까요? 여섯 번만 고르면 끝나요.
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        {/* 상태 요약 */}
        <div
          style={{
            display: "flex",
            background: "#F6F5FF",
            borderRadius: 16,
            padding: "16px 8px",
          }}
        >
          <Stat label="등급" value={`${rank.emoji}`} />
          <Stat label="연속 기록" value={`${state.streak.count}일`} />
          <Stat
            label="수집"
            value={`${state.collected.length}/${TOTAL_TYPES}`}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: PRIMARY,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          {rank.label}
        </div>

        {/* 도감 진행률 — 몇 종 남았는지 보이는 게 가장 센 재방문 이유예요 */}
        <div style={{ marginTop: 14 }}>
          <ProgressBar
            size="normal"
            progress={state.collected.length / TOTAL_TYPES}
          />
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontSize: 13,
              color: "#6F6C86",
              lineHeight: 1.5,
            }}
          >
            {remaining > 0
              ? `아직 ${remaining}종이 남았어요. 다르게 답해보면 새 유형을 만나요.`
              : "64종을 모두 모았어요! 마음 박사 등극 🎓"}
          </div>
        </div>

        {/* 연속 기록 위기 → 광고 보고 지키기 */}
        {atRisk && (
          <div
            style={{
              marginTop: 16,
              background: "#FFF4E5",
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: 14, color: "#7A5B22", marginBottom: 10 }}>
              😢 연속 기록이 끊길 위기예요. 지금 지킬 수 있어요.
            </div>
            <Button variant="weak" display="full" onClick={onKeepStreak}>
              📺 광고 보고 연속 기록 지키기
            </Button>
          </div>
        )}

        {/* 오늘 결과 미리보기 */}
        {doneToday && todayType && (
          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              background: "linear-gradient(160deg, #EEE9FF 0%, #FBEAFB 100%)",
              borderRadius: 16,
              padding: "18px",
            }}
          >
            <div style={{ fontSize: 13, color: "#8A8AA0" }}>오늘의 유형</div>
            <div style={{ fontSize: 40, marginTop: 4 }}>{todayType.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2B2B40" }}>
              {todayType.name}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 20 }}>
          <Button size="large" display="full" onClick={onStart}>
            {doneToday ? "성격 테스트 한 번 더 하기" : "오늘의 성격 테스트 시작"}
          </Button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button variant="weak" size="large" display="full" onClick={onGoDex}>
            {`유형 도감 보기 (${state.collected.length}/${TOTAL_TYPES})`}
          </Button>
        </div>

        {canRequestNotifyConsent() && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <TextButton size="medium" onClick={onNotify}>매일 알림 받기</TextButton>
          </div>
        )}
      </div>

    </div>
  );
}
