import { closeView, graniteEvent } from "@apps-in-toss/web-framework";
import { Loader } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";

import "./App.css";
import { BannerAd, ImageBannerAd } from "./components/BannerAd";
import { DexScreen } from "./screens/DexScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { TestScreen } from "./screens/TestScreen";
import { useAdGate } from "./hooks/useAdGate";
import { useDexState } from "./hooks/useDexState";
import { useInterstitialAd } from "./hooks/useInterstitialAd";
import { getTodayKey } from "./lib/dateKey";
import { EVENT, track, trackScreen } from "./lib/analytics";

type View = "home" | "test" | "result" | "dex";

interface ResultInfo {
  typeId: number;
  isNew: boolean;
  collectedCount: number;
  streakCount: number;
}

function AppScreens() {
  const { state, completeTest, unlockDetail, streakAtRisk, keepStreak } =
    useDexState();
  const { watchThen } = useAdGate();
  const { maybeShow } = useInterstitialAd(3);

  const [today, setToday] = useState<string>("");
  const [view, setView] = useState<View>("home");
  const [result, setResult] = useState<ResultInfo | null>(null);

  // KST 오늘 날짜 키 로드
  useEffect(() => {
    let alive = true;
    void getTodayKey().then((k) => {
      if (alive) setToday(k);
    });
    return () => {
      alive = false;
    };
  }, []);

  // 최초 1회 게스트 가입 이벤트
  const signedRef = useRef(false);
  useEffect(() => {
    if (signedRef.current) return;
    signedRef.current = true;
    if (localStorage.getItem("mtd:signed") == null) {
      localStorage.setItem("mtd:signed", "1");
      track(EVENT.signup, { method: "guest" });
    }
  }, []);

  useEffect(() => {
    trackScreen(view);
  }, [view]);

  // 토스 네이티브 뒤로가기 → 홈이 아니면 홈으로, 홈이면 앱 닫기
  const viewRef = useRef(view);
  viewRef.current = view;
  useEffect(() => {
    try {
      return graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          if (viewRef.current !== "home") {
            setView("home");
          } else {
            try {
              closeView();
            } catch {
              /* 브라우저 무시 */
            }
          }
        },
      });
    } catch {
      return undefined;
    }
  }, []);

  // 우측 상단 닫기(홈) 버튼 — 어느 화면에 있든 앱을 닫아요.
  // backEvent 만 구독하면 이 버튼을 아무도 처리하지 않아 눌러도 안 닫혀요.
  useEffect(() => {
    try {
      return graniteEvent.addEventListener("homeEvent", {
        onEvent: () => {
          try {
            void closeView();
          } catch {
            /* 브라우저 등 미지원 환경 */
          }
        },
      });
    } catch {
      return undefined;
    }
  }, []);

  const goTest = () => setView("test");

  const onStart = () => {
    const doneToday =
      state.daily.dateKey === today && state.daily.doneCount > 0;
    if (doneToday) {
      watchThen(goTest, "extra_test"); // 추가 테스트는 광고 보상
    } else {
      goTest();
    }
  };

  const onTestDone = (typeId: number) => {
    const res = completeTest(today, typeId);
    track(EVENT.testCompleted, { type_id: typeId });
    if (res.isNew) {
      track(EVENT.typeCollected, {
        type_id: typeId,
        total: res.collectedCount,
      });
    }
    setResult({ typeId, ...res });
    maybeShow(() => setView("result"), "result");
  };

  const onUnlock = () => {
    if (result == null) return;
    const id = result.typeId;
    watchThen(() => {
      unlockDetail(id);
      track(EVENT.detailUnlocked, { type_id: id });
    }, "detail_unlock");
  };

  const onExtraTest = () => watchThen(goTest, "extra_test");

  const onKeepStreak = () =>
    watchThen(() => keepStreak(today), "streak_save");

  if (today === "") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (view === "test") {
    return (
      <TestScreen today={today} onDone={onTestDone} onBack={() => setView("home")} />
    );
  }

  if (view === "result" && result != null) {
    return (
      <ResultScreen
        typeId={result.typeId}
        isNew={result.isNew}
        collectedCount={result.collectedCount}
        streakCount={result.streakCount}
        unlocked={state.unlocked.includes(result.typeId)}
        onUnlock={onUnlock}
        onExtraTest={onExtraTest}
        onGoDex={() => setView("dex")}
        onHome={() => setView("home")}
      />
    );
  }

  if (view === "dex") {
    return <DexScreen collected={state.collected} onBack={() => setView("home")} />;
  }

  return (
    <HomeScreen
      today={today}
      state={state}
      atRisk={streakAtRisk(today)}
      onStart={onStart}
      onKeepStreak={onKeepStreak}
      onGoDex={() => setView("dex")}
    />
  );
}

export default function App() {
  return (
    <>
      <AppScreens />
      {/* 이미지 강조형 배너 — 본문(문서 스크롤)의 맨 끝. 공통 화면 틀이 없어서
          화면마다 넣는 대신 여기 한 곳에 둬요. 어느 화면이든 하나만 보여요. */}
      <div style={{ padding: "24px 20px 0" }}>
        <ImageBannerAd />
      </div>
      {/* 배너는 화면마다 두지 않고 여기 하나만 띄워요 — 한 화면에 배너는 하나입니다.
          가려짐은 #root 의 padding-bottom(App.css)으로 막아요. */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: "#FFFFFF",
          padding: "0 20px",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <BannerAd />
      </div>
    </>
  );
}
