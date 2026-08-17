import { z } from 'zod'

export const resumeAnalysisSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall resume quality score from 0 to 100.'),
  summary: z
    .string()
    .describe('A concise 2-3 sentence overview of the resume quality.'),
  strengths: z
    .array(z.string())
    .describe('3-5 concrete strengths of the resume.'),
  improvements: z
    .array(
      z.object({
        issue: z.string().describe('A specific weakness or gap.'),
        suggestion: z
          .string()
          .describe('An actionable way to fix or improve it.'),
        severity: z.enum(['high', 'medium', 'low']),
      }),
    )
    .describe('3-6 prioritized, actionable improvements.'),
  keywords: z
    .array(z.string())
    .describe('Relevant keywords/skills detected in the resume.'),
  missingKeywords: z
    .array(z.string())
    .describe('Important keywords likely missing for the target role.'),
})
export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>

export const jobRecommendationsSchema = z.object({
  roles: z
    .array(
      z.object({
        title: z.string().describe('Job/role title.'),
        matchScore: z
          .number()
          .min(0)
          .max(100)
          .describe('How well the person fits this role, 0-100.'),
        reason: z
          .string()
          .describe('Why this role is a good fit for the person.'),
        salaryRange: z
          .string()
          .describe('Approximate salary range, e.g. "$90k–$130k".'),
        demand: z
          .enum(['high', 'medium', 'low'])
          .describe('Current market demand for this role.'),
        keySkills: z
          .array(z.string())
          .describe('3-5 key skills this role requires.'),
      }),
    )
    .describe('4-6 recommended roles, sorted by best match first.'),
})
export type JobRecommendations = z.infer<typeof jobRecommendationsSchema>

export const skillsGapSchema = z.object({
  targetRole: z.string().describe('The role the plan is targeting.'),
  readinessScore: z
    .number()
    .min(0)
    .max(100)
    .describe('How ready the person is for the target role, 0-100.'),
  summary: z.string().describe('A short overview of the gap analysis.'),
  skills: z
    .array(
      z.object({
        name: z.string(),
        currentLevel: z
          .number()
          .min(0)
          .max(100)
          .describe('Estimated current proficiency, 0-100.'),
        requiredLevel: z
          .number()
          .min(0)
          .max(100)
          .describe('Proficiency needed for the target role, 0-100.'),
        priority: z.enum(['high', 'medium', 'low']),
      }),
    )
    .describe('5-8 relevant skills for the target role.'),
  learningPlan: z
    .array(
      z.object({
        step: z.number().describe('Ordered step number, starting at 1.'),
        title: z.string().describe('Short title of this learning milestone.'),
        description: z
          .string()
          .describe('What to learn and why it matters.'),
        durationWeeks: z
          .number()
          .describe('Estimated time to complete, in weeks.'),
        resources: z
          .array(z.string())
          .describe('2-3 concrete resource suggestions (types of courses, books, projects).'),
      }),
    )
    .describe('4-6 ordered learning milestones forming a roadmap.'),
})
export type SkillsGap = z.infer<typeof skillsGapSchema>
