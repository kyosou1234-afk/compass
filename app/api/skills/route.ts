import { generateObject } from 'ai'
import { MODEL } from '@/lib/ai'
import { skillsGapSchema } from '@/lib/schemas'

export const maxDuration = 30

export async function POST(req: Request) {
  const { currentSkills, targetRole } = (await req.json()) as {
    currentSkills?: string
    targetRole?: string
  }

  if (!targetRole || targetRole.trim().length < 2) {
    return Response.json(
      { error: 'Please tell us the role you want to grow into.' },
      { status: 400 },
    )
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: skillsGapSchema,
    prompt: `You are a career-development expert building a skills-gap analysis and learning roadmap.

Target role: "${targetRole}"
Current skills / background: ${currentSkills || 'not specified — assume an early-career beginner'}

Identify the key skills required for the target role, estimate the person's current level vs the
required level for each, and build an ordered, realistic learning plan to close the gaps.
Be encouraging and concrete about resources and timelines.`,
  })

  return Response.json(object)
}
