"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Step = {
  key: string;
  question: string;
  emoji: string;
  options: string[];
  allowCustom?: boolean;
};

const STEPS: Step[] = [
  {
    key: "people",
    question: "몇 명이서 드실 건가요?",
    emoji: "👥",
    options: ["혼자", "2명", "3~4명", "5명 이상"],
  },
  {
    key: "time",
    question: "언제 드실 건가요?",
    emoji: "🕐",
    options: ["아침", "점심", "저녁", "야식"],
  },
  {
    key: "mood",
    question: "지금 기분이 어때요?",
    emoji: "😊",
    options: ["행복해요", "피곤해요", "스트레스받아요", "특별한 날이에요"],
  },
  {
    key: "temperature",
    question: "오늘 날씨/온도는요?",
    emoji: "🌡️",
    options: ["덥고 습해요", "시원해요", "춥고 건조해요", "선선해요"],
  },
  {
    key: "avoidFood",
    question: "못 먹거나 싫어하는 음식이 있나요?",
    emoji: "🚫",
    options: ["없어요", "매운 음식", "날것(회, 육회)", "돼지고기"],
    allowCustom: true,
  },
  {
    key: "budget",
    question: "예산은 얼마나 되나요? (1인 기준)",
    emoji: "💰",
    options: ["1만원 이하", "1~2만원", "2~3만원", "3만원 이상"],
  },
  {
    key: "method",
    question: "어떻게 드실 건가요?",
    emoji: "🍱",
    options: ["식당 방문", "배달", "직접 요리", "간편식"],
  },
];

type MenuResult = {
  name: string;
  emoji: string;
  reason: string;
  tip: string;
};

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [results, setResults] = useState<MenuResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const current = STEPS[step];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [current.key]: value };
    setAnswers(newAnswers);
    setCustomInput("");

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      submitSurvey(newAnswers);
    }
  };

  const handleCustomSubmit = () => {
    const value = customInput.trim() || "없음";
    handleSelect(value);
  };

  const submitSurvey = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/survey-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.menus);
    } catch {
      setError("추천을 불러오는 데 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
    setError("");
    setCustomInput("");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#FAFAF7" }}>
        <div className="flex flex-col items-center gap-4">
          <Image src="/강아지.png" alt="강아지" width={100} height={100} className="object-contain animate-bounce" />
          <p className="text-lg font-bold" style={{ color: "#FF5733" }}>당근이가 열심히 생각 중이에요... 🤔</p>
          <p className="text-sm text-gray-400">딱 맞는 메뉴를 찾고 있어요</p>
        </div>
      </main>
    );
  }

  if (results) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#FAFAF7" }}>
        <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors text-sm">
          ← 홈으로
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Image src="/강아지.png" alt="강아지" width={80} height={80} className="object-contain" />
          <div className="relative ml-3 animate-bubble-pop">
            <div
              className="px-4 py-3 rounded-2xl text-sm font-medium shadow"
              style={{ background: "#fff", border: "2px solid #FF5733", color: "#FF5733" }}
            >
              이 메뉴 어때요? 🐾
            </div>
            <span className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-0 h-0 block"
              style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "11px solid #FF5733" }}
            />
            <span className="absolute top-1/2 -translate-y-1/2 w-0 h-0 block"
              style={{ left: "-7px", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "9px solid #fff" }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6" style={{ color: "#FF5733" }}>당근이의 추천 메뉴 🎯</h2>

        <div className="w-full max-w-lg flex flex-col gap-4">
          {results.map((menu, i) => (
            <div
              key={i}
              className="animate-fade-up rounded-3xl p-6 shadow"
              style={{
                background: "#fff",
                border: "2px solid #FF5733",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{menu.emoji}</span>
                <div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full mr-2"
                    style={{ background: "#FF5733", color: "#fff" }}
                  >
                    {i + 1}순위
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#2D2D2D" }}>{menu.name}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{menu.reason}</p>
              <div
                className="text-xs px-3 py-2 rounded-xl"
                style={{ background: "#FFF8F5", color: "#FF5733" }}
              >
                💡 {menu.tip}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={reset}
          className="mt-8 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
          style={{ background: "#FF5733" }}
        >
          다시 설문하기 🔄
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#FAFAF7" }}>
      <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors text-sm">
        ← 홈으로
      </Link>

      {/* 진행 바 */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>질문 {step + 1} / {STEPS.length}</span>
          <span>{Math.round(((step) / STEPS.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "#E5E5E5" }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%`, background: "#FF5733" }}
          />
        </div>
      </div>

      {/* 강아지 + 말풍선 */}
      <div className="flex items-center gap-3 mb-8">
        <Image src="/강아지.png" alt="강아지" width={90} height={90} className="object-contain" />
        <div className="relative ml-3">
          <div
            key={step}
            className="px-4 py-3 rounded-2xl text-sm font-medium shadow animate-bubble-pop max-w-[220px]"
            style={{ background: "#fff", border: "2px solid #FF5733", color: "#FF5733" }}
          >
            {current.question}
          </div>
          <span className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-0 h-0 block"
            style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "11px solid #FF5733" }}
          />
          <span className="absolute top-1/2 -translate-y-1/2 w-0 h-0 block"
            style={{ left: "-7px", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "9px solid #fff" }}
          />
        </div>
      </div>

      {/* 질문 */}
      <div className="w-full max-w-md animate-fade-up" key={step}>
        <h2 className="text-xl font-bold text-center mb-6" style={{ color: "#2D2D2D" }}>
          {current.emoji} {current.question}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="py-4 px-3 rounded-2xl font-medium text-sm text-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              style={{
                background: "#fff",
                border: "2px solid #FF5733",
                color: "#FF5733",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {current.allowCustom && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
              placeholder="직접 입력..."
              className="flex-1 px-4 py-3 rounded-2xl border-2 text-sm outline-none focus:border-orange-400"
              style={{ borderColor: "#FF5733", background: "#fff" }}
            />
            <button
              onClick={handleCustomSubmit}
              className="px-4 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: "#FF5733" }}
            >
              입력
            </button>
          </div>
        )}

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 이전으로
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
    </main>
  );
}
