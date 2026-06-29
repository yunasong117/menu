"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#FAFAF7" }}>
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#FF5733" }}>
          오늘 뭐 먹지? 🍽️
        </h1>
        <p className="text-gray-500 text-base">당근이가 딱 맞는 메뉴를 추천해드려요</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
        <Link
          href="/random"
          className="flex-1 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          style={{ background: "#FFF8F5", border: "2px solid #FF5733" }}
        >
          <span className="text-5xl">🎰</span>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: "#FF5733" }}>랜덤 뽑기</p>
            <p className="text-sm text-gray-500 mt-1">당근이의 추천 메뉴!</p>
          </div>
        </Link>

        <Link
          href="/survey"
          className="flex-1 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          style={{ background: "#FFF8F5", border: "2px solid #FF5733" }}
        >
          <span className="text-5xl">📋</span>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: "#FF5733" }}>설문으로 추천</p>
            <p className="text-sm text-gray-500 mt-1">7가지 취향 분석 후 추천</p>
          </div>
        </Link>
      </div>

      <div className="mt-14 flex items-center gap-4">
        <Image
          src="/강아지.png"
          alt="귀여운 강아지"
          width={100}
          height={100}
          className="object-contain drop-shadow"
        />
        <div className="relative ml-3">
          <div
            className="px-4 py-3 rounded-2xl text-sm font-medium shadow-sm"
            style={{ background: "#fff", border: "2px solid #FF5733", color: "#FF5733" }}
          >
            오늘도 맛있는 하루 되세요! 🐾
          </div>
          <span className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-0 h-0 block"
            style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "11px solid #FF5733" }}
          />
          <span className="absolute top-1/2 -translate-y-1/2 w-0 h-0 block"
            style={{ left: "-7px", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "9px solid #fff" }}
          />
        </div>
      </div>
    </main>
  );
}
