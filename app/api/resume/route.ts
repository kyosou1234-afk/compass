import { generateObject } from 'ai'
import { MODEL } from '@/lib/ai'
import { resumeAnalysisSchema } from '@/lib/schemas'

export const maxDuration = 30

export async function POST(req: Request) {
  const { resume, targetRole } = (await req.json()) as {
    resume?: string
    targetRole?: string
  }

  if (!resume || resume.trim().length < 40) {
    return Response.json(
      { error: 'Please paste a more complete resume (at least a few lines).' },
      { status: 400 },
    )
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: resumeAnalysisSchema,
    prompt: `Analyze the following resume as an expert technical recruiter and career coach.
${targetRole ? `The candidate is targeting this role: "${targetRole}". Judge fit accordingly.` : 'Infer the most likely target role from the content.'}

Be specific and reference the actual content. Prioritize the improvements by impact.

RESUME:
"""
${resume.slice(0, 12000)}
"""`,
  })

  return Response.json(object)
}
