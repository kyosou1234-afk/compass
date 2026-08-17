import { generateObject } from 'ai'
import { hasValidGeminiKey, MODEL } from '@/lib/ai'
import { demoSkills } from '@/lib/demo-data'
import { skillsGapSchema } from '@/lib/schemas'

export const maxDuration = 30

export async function POST(req: Request) {
  const { currentSkills, targetRole } = (await req.json()) as {
    currentSkills?: string
    targetRole?: string
  }

  if (!targetRole || targetRole.trim().length < 2) {
    return Response.json(
      { error: '目指したい職種を入力してください。' },
      { status: 400 },
    )
  }

  // APIキーが未設定・不正なときは、デモ用の見本データを返します。
  if (!hasValidGeminiKey()) {
    await new Promise((r) => setTimeout(r, 700))
    return Response.json({ ...demoSkills, targetRole })
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: skillsGapSchema,
    prompt: `あなたはキャリア開発の専門家で、スキルギャップ分析と学習ロードマップを作成します。

目標職種: 「${targetRole}」
今のスキル・経歴: ${currentSkills || '指定なし — キャリア初期の初心者と想定してください'}

目標職種に必要な主要スキルを特定し、各スキルについてこの人の現在のレベルと必要なレベルを見積もり、
ギャップを埋めるための、順序立てた現実的な学習プランを作成してください。
励ましつつ、教材や期間について具体的に示してください。
出力のすべてのテキスト（要約・スキル名・ステップのタイトルや説明・教材など）は必ず自然な日本語で記述してください。`,
  })

  return Response.json(object)
}
