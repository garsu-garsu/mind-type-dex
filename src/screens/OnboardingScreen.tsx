import { Button, Top } from "@toss/tds-mobile";

interface Props {
  onStart: () => void;
}

const TEXT = "#2B2A3D";
const SUB = "#6F6C86";

const STEPS = [
  {
    emoji: "🧠",
    title: "여섯 가지 질문에 답해요",
    body: "에너지·결정 방식·하루 리듬·시선·도전·표현. 고른 답에 따라 유형이 정해져요(랜덤 아님).",
  },
  {
    emoji: "🐶",
    title: "오늘의 마음 유형이 나와요",
    body: "64종 동물 유형 중 하나가 나와요. 광고를 보면 상세 해석까지 열리고, 한 번 연 유형은 계속 볼 수 있어요.",
  },
  {
    emoji: "📒",
    title: "도감을 채워요",
    body: "만난 유형은 도감에 쌓여요. 매일 확인하면 연속 기록이 이어지고 새싹 분석가에서 마음 박사까지 올라가요.",
  },
];

/** 첫 실행에 한 번만 보여주는 소개 화면. */
export function OnboardingScreen({ onStart }: Props) {
  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={<Top.TitleParagraph size={26}>마음 유형 도감</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            매일 한 번, 오늘의 나를 알아봐요
          </Top.SubtitleParagraph>
        }
      />

      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map((s) => (
            <div
              key={s.title}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                background: "#F6F5FF",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 28, lineHeight: 1.2 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: SUB,
                    marginTop: 4,
                  }}
                >
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <Button size="xlarge" display="full" onClick={onStart}>
            시작하기
          </Button>
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
