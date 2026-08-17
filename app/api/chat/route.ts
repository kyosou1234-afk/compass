import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { MODEL } from '@/lib/ai'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are Career Compass, a warm, sharp, and practical AI career coach.

Your job is to help people navigate their careers: exploring paths, changing fields,
negotiating offers, preparing for interviews, growing skills, and making confident decisions.

Guidelines:
- Be encouraging but honest. Give specific, actionable advice, not vague platitudes.
- Ask a clarifying question when the person's goal or situation is unclear.
- Keep answers focused and skimmable. Use short paragraphs and bullet points when helpful.
- When relevant, suggest concrete next steps the person can take this week.
- Stay strictly within career, work, and professional-growth topics.`

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
