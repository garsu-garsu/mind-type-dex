import { TextButton, Top } from "@toss/tds-mobile";
import { useState } from "react";

import { BannerAd } from "../components/BannerAd";
import { TYPES, TOTAL_TYPES, rankOf } from "../data/types";

interface Props {
  collected: number[];
  onBack: () => void;
}

const PRIMARY = "#7B6EF6";

export function DexScreen({ collected, onBack }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const collectedSet = new Set(collected);
  const rank = rankOf(collected.length);

  return (
    <div style={{ paddingBottom: 32 }}>
      <Top
        title={<Top.TitleParagraph size={22}>마음 유형 도감</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {`${rank.emoji} ${rank.label} · ${collected.length}/${TOTAL_TYPES} 수집`}
          </Top.SubtitleParagraph>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          padding: "16px 20px 0",
        }}
      >
        {TYPES.map((t) => {
          const has = collectedSet.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => has && setOpen(open === t.id ? null : t.id)}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 14,
                border: "none",
                background: has ? "#F2F0FF" : "#F3F4F6",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                cursor: has ? "pointer" : "default",
                outline:
                  open === t.id ? `2px solid ${PRIMARY}` : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 26, filter: has ? "none" : "grayscale(1)" }}>
                {has ? t.emoji : "❓"}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: has ? "#33334A" : "#AEAEBE",
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.1,
                  padding: "0 2px",
                }}
              >
                {has ? t.name : "잠금"}
              </span>
            </button>
          );
        })}
      </div>

      {/* 선택한 유형 상세 */}
      {open != null && (
        <div style={{ padding: "16px 20px 0" }}>
          <div
            style={{
              background: "#F6F5FF",
              borderRadius: 16,
              padding: "18px",
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2B2B40" }}>
              {TYPES[open].emoji} {TYPES[open].name}
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "#33334A",
                marginTop: 8,
              }}
            >
              {TYPES[open].detail}
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <TextButton size="medium" onClick={onBack}>홈으로</TextButton>
      </div>

      <div style={{ marginTop: 16 }}>
        <BannerAd slot="dex" />
      </div>
    </div>
  );
}
