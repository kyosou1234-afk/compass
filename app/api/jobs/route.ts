import { generateObject } from 'ai'
import { hasValidGeminiKey, MODEL } from '@/lib/ai'
import { demoJobs } from '@/lib/demo-data'
import { jobRecommendationsSchema } from '@/lib/schemas'

export const maxDuration = 30

export async function POST(req: Request) {
  const { skills, interests, experience } = (await req.json()) as {
    skills?: string
    interests?: string
    experience?: string
  }

  if (!skills || skills.trim().length < 3) {
    return Response.json(
      { error: 'マッチする職種を探すために、いくつかスキルを入力してください。' },
      { status: 400 },
    )
  }

  // APIキーが未設定・不正なときは、デモ用の見本データを返します。
  if (!hasValidGeminiKey()) {
    await new Promise((r) => setTimeout(r, 700))
    return Response.json(demoJobs)
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: jobRecommendationsSchema,
    prompt: `あなたはキャリアマッチングの専門家です。この人に最も合う職種を提案してください。

スキル: ${skills}
興味・関心: ${interests || '指定なし'}
経験レベル・経歴: ${experience || '指定なし'}

この人のプロフィールと現在の求人市場に合った、現実的な職種を提案してください。マッチ度の高い順に並べてください。
各職種について、正直なマッチ度、おおよその想定年収（日本円）、現在の市場での需要を示してください。
出力のすべてのテキスト（職種名・理由・スキルなど）は必ず自然な日本語で記述してください。想定年収は「500万〜700万円」のように日本円で表記してください。`,
  })

  return Response.json(object)
}
