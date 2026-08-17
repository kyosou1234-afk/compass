import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { MODEL } from '@/lib/ai'

export const maxDuration = 30

const SYSTEM_PROMPT = `あなたは「Career Compass」という、あたたかく、鋭く、実践的なAIキャリアコーチです。

あなたの役割は、人々がキャリアを歩む手助けをすることです。キャリアパスの探索、
職種の転換、オファーの交渉、面接対策、スキルの向上、自信を持った意思決定を支援します。

ガイドライン:
- 必ず日本語で、自然で丁寧な言葉づかいで回答してください。
- 励ましつつも正直に。あいまいな一般論ではなく、具体的で実行可能なアドバイスを。
- 相手の目標や状況が不明確なときは、確認のための質問をしてください。
- 回答は要点を絞り、読みやすく。短い段落や箇条書きを適切に使ってください。
- 適切な場合は、今週から実行できる具体的な次の一歩を提案してください。
- キャリア・仕事・専門的な成長に関する話題のみを扱ってください。`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
