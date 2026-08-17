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
    label: 'キャリア相談',
    short: '相談',
    icon: MessageSquare,
    tagline: 'AIコーチとキャリアの悩みや決断を気軽に相談できます。',
  },
  {
    id: 'resume',
    label: '職務経歴書の分析',
    short: '経歴書',
    icon: FileText,
    tagline: '職務経歴書を採点し、優先度つきの改善点を提示します。',
  },
  {
    id: 'jobs',
    label: '職種のマッチング',
    short: '職種',
    icon: Briefcase,
    tagline: 'スキル・興味・目標に合った職種を見つけます。',
  },
  {
    id: 'skills',
    label: 'スキルと学習',
    short: 'スキル',
    icon: Target,
    tagline: 'スキルの不足を可視化し、段階的な学習プランを作成します。',
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
              あなた専用のAIキャリアコーチ
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        <section className="mb-8 text-center sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-highlight" />
            キャリアを前に進めるための実践的なアドバイス
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            進むべき方向を見つけ、自信を持って次の一歩を
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground text-pretty sm:text-base">
            AIコーチへの相談、職務経歴書のブラッシュアップ、自分に合う職種の発見、
            スキル不足を埋める学習プランづくり。すべてをこの1つの場所で。
          </p>
        </section>

        <nav
          className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
          aria-label="キャリアツール"
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
          Career Compass AI · アドバイスはAIによって生成されます。重要な決断はご自身の判断で。
        </div>
      </footer>
    </div>
  )
}
