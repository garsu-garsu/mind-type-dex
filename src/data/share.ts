import { getTossShareLink, share } from "@apps-in-toss/web-framework";

import { shareTextOf, type MindType } from "./types";
import { isInTossApp } from "../lib/tossEnv";

// apps-in-toss.config.ts 의 appName 과 같아야 링크가 이 앱으로 들어와요.
const DEEP_LINK = "intoss://mind-type-dex";
const OG_IMAGE =
  "https://static.toss.im/appsintoss/13203/a029f591-1d32-4aed-ac9a-0072d1a5b21a.png";

/**
 * 오늘의 마음 유형 결과를 공유해요. (토스 공유 링크 + 메시지)
 * 공유 시트가 정상적으로 뜨고 끝나면 true. 브라우저(둘러보기)에서는 개발 편의상 통과(true).
 */
export async function shareResult(type: MindType): Promise<boolean> {
  const text = shareTextOf(type);
  if (!isInTossApp()) return true; // 브라우저 개발 환경
  try {
    let link = "";
    try {
      link = await getTossShareLink(DEEP_LINK, OG_IMAGE);
    } catch (err) {
      // 링크가 없으면 공유받은 사람이 앱으로 들어올 방법이 없어요. 조용히 넘기지 말고 남겨요.
      console.error("공유 링크 생성 실패:", err);
    }
    const message = link !== "" ? `${text}\n${link}` : text;
    await share({ message });
    return true;
  } catch {
    return false;
  }
}
