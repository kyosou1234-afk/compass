'use client'

import { useState } from 'react'
import { GraduationCap, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LevelBar, ScoreRing } from '@/components/score-ring'
import { EmptyPanel, SkeletonPanel } from '@/components/resume-analyzer'
import type { SkillsGap } from '@/lib/schemas'
import { cn } from '@/lib/utils'

const PRIORITY: Record<string, string> = {
  high: 'text-destructive',
  medium: 'text-highlight',
  low: 'text-muted-foreground',
}

const PRIORITY_LABEL: Record<string, string> = {
  high: '優先度：高',
  medium: '優先度：中',
  low: '優先度：低',
}

export function SkillsPlanner() {
  const [targetRole, setTargetRole] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SkillsGap | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, currentSkills }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'プランを作成できませんでした')
      setResult(data as SkillsGap)
    } catch (e) {
      setError(e instanceof Error ? e.message : '問題が発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="rounded-2xl border bg-card p-5">
        <label className="text-sm font-medium" htmlFor="goal-role">
          目指したい職種
        </label>
        <input
          id="goal-role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="例：データサイエンティスト"
          className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="current-skills">
          今持っているスキル{' '}
          <span className="text-muted-foreground">(任意)</span>
        </label>
        <textarea
          id="current-skills"
          value={currentSkills}
          onChange={(e) => setCurrentSkills(e.target.value)}
          placeholder="例：Excel、少しPython、基礎的な統計"
          className="mt-1.5 min-h-32 w-full resize-y rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />

        <Button
          onClick={generate}
          disabled={loading || targetRole.trim().length < 2}
          className="mt-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> プランを作成中…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> 学習プランを作成する
            </>
          )}
        </Button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="min-h-64">
        {loading && (
          <SkeletonPanel label="スキルの不足を分析し、ロードマップを作成しています…" />
        )}
        {!loading && !result && (
          <EmptyPanel text="スキル不足の内訳と、段階的な学習ロードマップがここに表示されます。" />
        )}
        {result && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
              <ScoreRing value={result.readinessScore} label="達成度" />
              <div>
                <p className="font-display text-sm font-semibold">
                  {result.targetRole}
                </p>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {result.summary}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <h3 className="mb-4 font-display text-sm font-semibold tracking-wide text-muted-foreground">
                スキルの不足
              </h3>
              <div className="space-y-4">
                {result.skills.map((s, i) => (
                  <div key={i}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span
                        className={cn(
                          'text-[11px] font-medium',
                          PRIORITY[s.priority],
                        )}
                      >
                        {PRIORITY_LABEL[s.priority] ?? s.priority}
                      </span>
                    </div>
                    <LevelBar current={s.currentLevel} required={s.requiredLevel} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-4 rounded-full bg-primary" />
                  現在のレベル
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-0.5 rounded bg-highlight" />
                  目標レベル
                </span>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <GraduationCap className="size-4 text-primary" />
                学習ロードマップ
              </h3>
              <ol className="relative space-y-5 border-l pl-6">
                {result.learningPlan
                  .slice()
                  .sort((a, b) => a.step - b.step)
                  .map((step) => (
                    <li key={step.step} className="relative">
                      <span className="absolute -left-[31px] flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                        {step.step}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{step.title}</h4>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          約{step.durationWeeks}週間
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {step.description}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {step.resources.map((r, j) => (
                          <li
                            key={j}
                            className="rounded-md border border-dashed px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
