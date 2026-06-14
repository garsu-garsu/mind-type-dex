import { Button, TextButton, Top, useToast } from "@toss/tds-mobile";

import { BannerAd } from "../components/BannerAd";
import { shareResult } from "../data/share";
import { EVENT, track } from "../lib/analytics";
import { TYPES, TOTAL_TYPES } from "../data/types";

interface Props {
  typeId: number;
  isNew: boolean;
  collectedCount: number;
  streakCount: number;
  unlocked: boolean;
  onUnlock: () => void; // 광고 보고 상세 해석 해금
  onExtraTest: () => void; // 광고 보고 오늘 한 번 더
  onGoDex: () => void;
  onHome: () => void;
}

const PRIMARY = "#7B6EF6";

export function ResultScreen({
  typeId,
  isNew,
  collectedCount,
  streakCount,
  unlocked,
  onUnlock,
  onExtraTest,
  onGoDex,
  onHome,
}: Props) {
  const toast = useToast();
  const type = TYPES[typeId];

  const onShare = async () => {
    const ok = await shareResult(`${type.emoji} ${type.name}`);
    if (ok) {
      track(EVENT.shareCompleted, { context: "result" });
      toast.openToast("공유했어요!");
    }
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={
          <Top.TitleParagraph size={22}>
            오늘의 마음 유형이 나왔어요
          </Top.TitleParagraph>
        }
      />

      <div style={{ padding: "8px 24px 0" }}>
        {/* 결과 카드 */}
        <div
          style={{
            background: "linear-gradient(160deg, #EEE9FF 0%, #FBEAFB 100%)",
            borderRadius: 20,
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1.1 }}>{type.emoji}</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              marginTop: 8,
              color: "#2B2B40",
            }}
          >
            {type.name}
          </div>
          <div style={{ fontSize: 15, color: "#5A5A72", marginTop: 8 }}>
            {type.oneLiner}
          </div>
          {isNew && (
            <div
              style={{
                display: "inline-block",
                marginTop: 14,
                fontSize: 13,
                fontWeight: 700,
                color: PRIMARY,
                background: "#fff",
                borderRadius: 999,
                padding: "6px 12px",
              }}
            >
              ✨ 도감에 새로 추가! ({collectedCount}/{TOTAL_TYPES})
            </div>
          )}
        </div>

        {/* 상세 해석 (광고 게이트) */}
        <div style={{ marginTop: 20 }}>
          {unlocked ? (
            <div
              style={{
                background: "#F6F5FF",
                borderRadius: 16,
                padding: "18px 18px",
                fontSize: 15,
                lineHeight: 1.7,
                color: "#33334A",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>상세 해석</div>
              {type.detail}
            </div>
          ) : (
            <Button size="large" display="full" onClick={onUnlock}>
              📺 광고 보고 상세 해석 해금
            </Button>
          )}
        </div>

        {/* 연속 기록 */}
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 14,
            color: "#5A5A72",
          }}
        >
          🔥 연속 기록 {streakCount}일째
        </div>

        {/* 액션 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 18,
          }}
        >
          <Button variant="weak" display="full" onClick={onShare}>
            결과 공유하기
          </Button>
          <Button variant="weak" display="full" onClick={onExtraTest}>
            📺 광고 보고 오늘 테스트 하나 더
          </Button>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <TextButton size="medium" onClick={onGoDex}>도감 보기</TextButton>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <TextButton size="medium" onClick={onHome}>홈으로</TextButton>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <BannerAd slot="result" />
      </div>
    </div>
  );
}
