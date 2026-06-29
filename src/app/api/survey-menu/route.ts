import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { people, time, mood, temperature, avoidFood, budget, method } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 600,
        // @ts-expect-error: thinkingConfig supported but not in current type defs
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const result = await model.generateContent(`다음 조건에 맞는 메뉴 3가지를 추천해줘:
- 인원: ${people}
- 식사 시간: ${time}
- 현재 기분: ${mood}
- 날씨/온도: ${temperature}
- 기피 음식: ${avoidFood || "없음"}
- 예산: ${budget}
- 식사 방법: ${method}

[중요] 한국의 식당·배달앱에서 실제로 자주 볼 수 있고, 한국인이 친숙하게 먹는 메뉴만 추천해줘.
한식/중식/일식/양식/동남아식 모두 괜찮지만, 한국인에게 생소한 희귀 음식은 절대 추천하지 마.
메뉴 3개는 서로 겹치지 않게 다양하게 골라줘.

JSON만 출력 (마크다운 코드블록 없이):
{"menus":[{"name":"메뉴명","emoji":"이모지1개","reason":"조건에 맞는 이유 2문장","tip":"팁 1문장"}]}`);

    const text = result.response.text().replace(/```json|```/g, "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not found");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "추천 생성 실패" }, { status: 500 });
  }
}
