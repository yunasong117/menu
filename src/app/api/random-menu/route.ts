import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"];

const CATEGORIES = [
  "한식", "한식", "한식",
  "중식(한국식)", "일식(한국식)", "양식(파스타/스테이크/버거)",
  "동남아식(쌀국수/팟타이)", "인도식(커리)", "멕시코식(타코/부리또)",
];

async function tryGenerate(modelName: string, prompt: string) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 1.8,
      maxOutputTokens: 300,
      // @ts-expect-error: thinkingConfig is supported but not in current type defs
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST() {
  const pick = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const seed = Math.floor(Math.random() * 100000);
  const prompt = `#${seed} 카테고리:${pick}. 한국 식당·배달앱에서 자주 보이는 친숙한 메뉴 1개.
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
