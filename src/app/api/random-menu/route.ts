import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"];

const CATEGORIES = [
  "한식", "한식", "중식(한국식)", "일식(한국식)", "양식(파스타/스테이크)",
  "양식(버거/샌드위치)", "동남아식(쌀국수/팟타이)", "인도식(커리)", "멕시코식(타코/부리또)",
  "분식", "야식(치킨/피자/족발)", "디저트/베이커리", "샐러드/건강식",
];

const FORMATS = [
  "밥 요리", "면 요리", "국/탕/찌개", "구이", "볶음", "튀김", "찜/조림",
  "샌드위치/버거", "샐러드", "만두/딤섬류", "스튜/커리", "코스요리 아무거나",
];

async function tryGenerate(modelName: string, prompt: string) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 1.5,
      maxOutputTokens: 300,
      // @ts-expect-error: thinkingConfig is supported but not in current type defs
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST() {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const format = FORMATS[Math.floor(Math.random() * FORMATS.length)];
  const seed = Math.floor(Math.random() * 1_000_000);
  const prompt = `#${seed} 카테고리:${category} / 형태:${format}.
한국인이 보편적으로 먹는, 네이버·배달앱에 검색하면 흔하게 나오는 친숙한 메뉴 1개.
생소하거나 한국인 대부분이 모를 현지 전통 요리는 절대 금지. 반드시 실제로 흔히 먹는 메뉴여야 함.
같은 카테고리 안에서도 매번 완전히 똑같은 메뉴만 나오지 않게 그 안에서 흔한 것들 중 하나를 랜덤하게 골라줘.
JSON만(코드블록 없이): {"name":"메뉴명","emoji":"이모지","description":"맛 설명 1문장","origin":"나라"}`;

  for (const modelName of MODELS) {
    try {
      const text = (await tryGenerate(modelName, prompt)).replace(/```json|```/g, "").trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;
      const menu = JSON.parse(jsonMatch[0]);
      if (!menu.name) continue;
      return NextResponse.json(menu);
    } catch (err) {
      console.warn(`[random-menu] ${modelName} failed:`, err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({ error: "잠시 후 다시 시도해주세요" }, { status: 503 });
}
