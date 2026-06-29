"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_MENUS = [
  "김치찌개", "파스타", "초밥", "삼겹살", "짜장면", "피자", "비빔밥", "라멘",
  "타코", "치킨", "된장찌개", "카레", "스테이크", "냉면", "떡볶이", "쌀국수",
  "샤브샤브", "갈비탕", "크림파스타", "햄버거", "순두부찌개", "오므라이스",
  "감자탕", "마라탕", "낙지볶음", "돈까스", "클램차우더", "팟타이", "케밥",
];

type MenuResult = {
  name: string;
  emoji: string;
  description: string;
  origin: string;
};

export default function RandomPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayMenu, setDisplayMenu] = useState("스페이스바를 누르세요!");
  const [result, setResult] = useState<MenuResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [bubbleKey, setBubbleKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  const stopAndFetch = useCallback(async () => {
    if (!isSpinning || loading) return;

    setIsSpinning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/random-menu", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error || !data.name) {
        setDisplayMenu("잠시 후 다시 뽑아주세요 😢");
        return;
      }
      setResult(data);
      setDisplayMenu(data.name);
      setAnimKey((k) => k + 1);
      setBubbleKey((k) => k + 1);
    } catch {
      setDisplayMenu("오류가 발생했어요 😢");
    } finally {
      setLoading(false);
    }
  }, [isSpinning, loading]);

  const startSpinning = useCallback(() => {
    if (loading) return;
    setResult(null);
    setIsSpinning(true);
    setDisplayMenu(PLACEHOLDER_MENUS[0]);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % PLACEHOLDER_MENUS.length;
      setDisplayMenu(PLACEHOLDER_MENUS[indexRef.current]);
    }, 55);
  }, [loading]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (!isSpinning && !loading) {
        startSpinning();
      } else if (isSpinning) {
        stopAndFetch();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSpinning, loading, startSpinning, stopAndFetch]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!isSpinning && !loading) {
      startSpinning();
    } else if (isSpinning) {
      stopAndFetch();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#FAFAF7" }}>
      <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1">
        ← 홈으로
      </Link>

      <h1 className="text-2xl font-bold mb-8" style={{ color: "#FF5733" }}>랜덤 메뉴 뽑기 🎰</h1>

      {/* 강아지 + 말풍선 */}
      <div className="flex items-end gap-4 mb-8">
        <Image
          src="/강아지.png"
          alt="강아지"
          width={120}
          height={120}
          className="object-contain drop-shadow"
        />
        <div key={bubbleKey} className="relative mb-4 ml-3 animate-bubble-pop">
          <div
            className="px-5 py-4 rounded-2xl min-w-[160px] max-w-[260px] shadow text-center"
            style={{ background: "#fff", border: "2.5px solid #FF5733" }}
          >
            {loading ? (
              <span className="text-base font-bold" style={{ color: "#FF5733" }}>
                생각중...✨
              </span>
            ) : (
              <span
                className={`text-lg font-bold block ${isSpinning ? "font-mono" : ""}`}
                style={{ color: "#FF5733" }}
              >
                {displayMenu}
              </span>
            )}
          </div>
          {/* 왼쪽(강아지 방향) 꼭짓점 - 바깥 주황 */}
          <span
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 block"
            style={{
              borderTop: "9px solid transparent",
              borderBottom: "9px solid transparent",
              borderRight: "12px solid #FF5733",
            }}
          />
          {/* 안쪽 흰색으로 테두리 효과 */}
          <span
            className="absolute top-1/2 -translate-y-1/2 w-0 h-0 block"
            style={{
              left: "-9px",
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderRight: "10px solid #fff",
            }}
          />
        </div>
      </div>

      {/* 버튼 */}
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
        style={{ background: loading ? "#ccc" : "#FF5733" }}
      >
        {loading ? "잠깐만요..." : isSpinning ? "⏹ STOP!" : "▶ START!"}
      </button>
      <p className="mt-3 text-sm text-gray-400">
        {isSpinning ? "스페이스바 또는 STOP 버튼으로 멈추기" : "스페이스바 또는 START 버튼으로 시작"}
      </p>

      {/* 결과 카드 */}
      {result && !loading && (
        <div
          key={animKey}
          className="animate-fade-up mt-10 w-full max-w-md rounded-3xl p-7 shadow-lg text-center"
          style={{ background: "#fff", border: "2px solid #FF5733" }}
        >
          <div className="text-5xl mb-3">{result.emoji}</div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#FF5733" }}>{result.name}</h2>
          <p className="text-xs text-gray-400 mb-4">🌍 {result.origin}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{result.description}</p>
          <button
            onClick={startSpinning}
            className="mt-6 px-5 py-2 rounded-full text-sm font-medium border-2 transition-colors hover:bg-orange-50"
            style={{ borderColor: "#FF5733", color: "#FF5733" }}
          >
            다시 뽑기 🔄
          </button>
        </div>
      )}
    </main>
  );
}
