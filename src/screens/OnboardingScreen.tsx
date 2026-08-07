import { Button, Top } from "@toss/tds-mobile";

interface Props {
  onStart: () => void;
}

const TEXT = "#2B2A3D";
const SUB = "#6F6C86";

const STEPS = [
  { emoji: "🧠", title: "6문항, 1분이면 끝나요" },
  { emoji: "🐶", title: "64종 동물 유형 중 오늘의 나는?" },
  { emoji: "📒", title: "만난 유형은 도감에 모여요" },
];

/** 첫 실행에 한 번만 보여주는 소개 화면. */
export function OnboardingScreen({ onStart }: Props) {
  return (
    <div style={{ paddingBottom: 32 }}>
        {/* 앱 이름은 토스 상단 바가 이미 보여줘요 — 여기서 또 쓰면 헤더가 겹쳐 보여요. */}
      <Top
        title={<Top.TitleParagraph size={28}>성격 유형 테스트</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            6문항으로 보는 성격 유형 테스트. 오늘의 나는 64종 중 어떤 유형일까요?
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STEPS.map((s) => (
            <div
              key={s.title}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                background: "#F6F5FF",
                borderRadius: 16,
                padding: "14px 18px",
              }}
            >
              <div style={{ fontSize: 26, lineHeight: 1.2 }}>{s.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
                {s.title}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <Button size="xlarge" display="full" onClick={onStart}>
            첫 번째 질문 보기
          </Button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 13,
            color: SUB,
          }}
        >
          고른 답에 따라 유형이 정해져요. 랜덤 뽑기가 아니에요.
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 12,
            color: "#9C99B4",
            lineHeight: 1.6,
          }}
        >
          정답도 점수도 없이 가볍게 즐기는 재미 콘텐츠예요.
          <br />
          모든 보상은 앱 내 가상 보상이에요.
        </div>
      </div>
    </div>
  );
}
