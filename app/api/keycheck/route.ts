import { hasValidGeminiKey } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function GET() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? ''
  return Response.json({
    length: key.length,
    prefix: key.slice(0, 4),
    hasWhitespace: /\s/.test(key),
    valid: hasValidGeminiKey(),
  })
}
