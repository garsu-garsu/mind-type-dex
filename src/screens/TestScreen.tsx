import { Button, TextButton, Top } from "@toss/tds-mobile";
import { useState } from "react";

import { answersToTypeId, todayQuestions } from "../data/types";

interface Props {
  today: string;
  onDone: (typeId: number) => void;
  onBack: () => void;
}

/** 오늘의 4문항 심리 테스트. 답을 모으면 유형 index 를 계산해 onDone 으로 넘겨요. */
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

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={
          <Top.TitleParagraph size={22}>
            {`Q${step + 1}. ${q.q}`}
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {`${step + 1} / ${questions.length}`}
          </Top.SubtitleParagraph>
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
