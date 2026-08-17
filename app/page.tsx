'use client'

import { useState } from 'react'
import {
  Briefcase,
  Compass,
  FileText,
  MessageSquare,
  Target,
} from 'lucide-react'
import { ChatAdvisor } from '@/components/chat-advisor'
import { ResumeAnalyzer } from '@/components/resume-analyzer'
import { JobRecommender } from '@/components/job-recommender'
import { SkillsPlanner } from '@/components/skills-planner'
import { cn } from '@/lib/utils'

const TOOLS = [
  {
    id: 'chat',
    label: 'Career Chat',
    short: 'Chat',
    icon: MessageSquare,
    tagline: 'Talk through any career decision with your AI coach.',
  },
  {
    id: 'resume',
    label: 'Resume Analysis',
    short: 'Resume',
    icon: FileText,
    tagline: 'Get a scored breakdown and prioritized fixes for your resume.',
  },
  {
    id: 'jobs',
    label: 'Role Matches',
    short: 'Roles',
    icon: Briefcase,
    tagline: 'Discover roles that fit your skills, interests, and goals.',
  },
  {
    id: 'skills',
    label: 'Skills & Learning',
    short: 'Skills',
    icon: Target,
    tagline: 'See your skill gaps and get a step-by-step learning plan.',
  },
] as const

type ToolId = (typeof TOOLS)[number]['id']

export default function Page() {
  const [active, setActive] = useState<ToolId>('chat')
  const current = TOOLS.find((t) => t.id === active)!

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold tracking-tight">
              Career Compass
              <span className="text-primary"> AI</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Your personal AI career coach
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        <section className="mb-8 text-center sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-highlight" />
            Guidance that actually moves your career forward
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Find your direction and take the next step with confidence
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground text-pretty sm:text-base">
            Chat with an AI coach, sharpen your resume, discover roles that fit,
            and build a plan to close your skill gaps — all in one place.
          </p>
        </section>

        <nav
          className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
          aria-label="Career tools"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            const isActive = tool.id === active
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActive(tool.id)}
                aria-pressed={isActive}
                className={cn(
                  'group flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all',
                  isActive
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'bg-card hover:border-primary/30 hover:bg-accent',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-8 items-center justify-center rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium">{tool.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mb-5 flex items-baseline gap-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {current.label}
          </h2>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {current.tagline}
          </p>
        </div>

        {active === 'chat' && <ChatAdvisor />}
        {active === 'resume' && <ResumeAnalyzer />}
        {active === 'jobs' && <JobRecommender />}
        {active === 'skills' && <SkillsPlanner />}
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          Career Compass AI · Guidance is AI-generated — use your own judgment for
          important decisions.
        </div>
      </footer>
    </div>
  )
}
