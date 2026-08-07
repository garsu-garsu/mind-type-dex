import { Button, ProgressBar, TextButton, Top } from "@toss/tds-mobile";
import { useState } from "react";

import { answersToTypeId, todayQuestions } from "../data/types";

interface Props {
  today: string;
  onDone: (typeId: number) => void;
  onBack: () => void;
}

/** 오늘의 6문항 성격 유형 테스트. 답을 모으면 유형 index 를 계산해 onDone 으로 넘겨요. */
export function TestScreen({ today, onDone, onBack }: Props) {
  const questions = todayQuestions(today);
  const [step, setStep] = useState(0);
  const [bits, setBits] = useState<number[]>([]);

  const pick = (bit: number) => {
    const nextBits = [...bits, bit];
    if (step + 1 >= questions.length) {
      onDone(answersToTypeId(nextBits));
      return;
    }
    setBits(nextBits);
    setStep(step + 1);
  };

  const q = questions[step];

  // 남은 질문이 몇 개인지 눈에 보여야 중간에 안 나가요.
  const left = questions.length - (step + 1);

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ padding: "16px 24px 0" }}>
        <ProgressBar size="normal" progress={(step + 1) / questions.length} />
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#8A8AA0",
            fontWeight: 600,
          }}
        >
          {`성격 유형 테스트 ${step + 1}/${questions.length}` +
            (left > 0 ? ` · ${left}문항만 더 답하면 끝나요` : " · 마지막 질문이에요")}
        </div>
      </div>

      <Top
        title={
          <Top.TitleParagraph size={22}>
            {`Q${step + 1}. ${q.q}`}
          </Top.TitleParagraph>
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "24px",
        }}
      >
        <Button size="large" onClick={() => pick(0)}>
          {q.a}
        </Button>
        <Button size="large" variant="weak" onClick={() => pick(1)}>
          {q.b}
        </Button>
      </div>

      <div style={{ textAlign: "center", marginTop: 8 }}>
        <TextButton size="medium" onClick={onBack}>그만두기</TextButton>
      </div>
    </div>
  );
}
