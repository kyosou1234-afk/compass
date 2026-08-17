import { generateObject } from 'ai'
import { hasValidGeminiKey, MODEL } from '@/lib/ai'
import { demoResume } from '@/lib/demo-data'
import { resumeAnalysisSchema } from '@/lib/schemas'

export const maxDuration = 30

export async function POST(req: Request) {
  const { resume, targetRole } = (await req.json()) as {
    resume?: string
    targetRole?: string
  }

  if (!resume || resume.trim().length < 40) {
    return Response.json(
      { error: 'もう少し詳しい職務経歴書を貼り付けてください（数行以上）。' },
      { status: 400 },
    )
  }

  // APIキーが未設定・不正なときは、デモ用の見本データを返します。
  if (!hasValidGeminiKey()) {
    await new Promise((r) => setTimeout(r, 700))
    return Response.json(demoResume)
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: resumeAnalysisSchema,
    prompt: `あなたは経験豊富なテクニカルリクルーター兼キャリアコーチです。以下の職務経歴書を分析してください。
${targetRole ? `候補者はこの職種を目指しています：「${targetRole}」。それに応じて適合度を判断してください。` : '内容から、最も可能性の高い目標職種を推測してください。'}

具体的に、実際の記載内容に触れながら分析してください。改善点はインパクトの大きい順に優先順位をつけてください。
出力のすべてのテキスト（要約・強み・改善点・提案・キーワード）は必ず自然な日本語で記述してください。

職務経歴書:
"""
${resume.slice(0, 12000)}
"""`,
  })

  return Response.json(object)
}
