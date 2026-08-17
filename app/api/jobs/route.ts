import { generateObject } from 'ai'
import { MODEL } from '@/lib/ai'
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
      { error: 'Please list at least a few skills so we can find matching roles.' },
      { status: 400 },
    )
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: jobRecommendationsSchema,
    prompt: `You are a career-matching expert. Recommend the best-fit roles for this person.

Skills: ${skills}
Interests: ${interests || 'not specified'}
Experience level / background: ${experience || 'not specified'}

Recommend realistic roles that fit their profile and current job market. Sort by best match first.
Give an honest match score, an approximate salary range, and current market demand for each.`,
  })

  return Response.json(object)
}
