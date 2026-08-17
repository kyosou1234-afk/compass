'use client'

import { useState } from 'react'
import { Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScoreRing } from '@/components/score-ring'
import { EmptyPanel, SkeletonPanel } from '@/components/resume-analyzer'
import type { JobRecommendations } from '@/lib/schemas'
import { cn } from '@/lib/utils'

const DEMAND: Record<string, string> = {
  high: 'border-primary/30 bg-primary/10 text-primary',
  medium: 'border-highlight/40 bg-highlight/10 text-highlight',
  low: 'border-border bg-muted text-muted-foreground',
}

const DEMAND_LABEL: Record<string, string> = {
  high: '需要：高',
  medium: '需要：中',
  low: '需要：低',
}

export function JobRecommender() {
  const [skills, setSkills] = useState('')
  const [interests, setInterests] = useState('')
  const [experience, setExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<JobRecommendations | null>(null)

  async function recommend() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, interests, experience }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'おすすめを生成できませんでした')
      setResult(data as JobRecommendations)
    } catch (e) {
      setError(e instanceof Error ? e.message : '問題が発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border bg-card p-5">
        <Field
          label="あなたのスキル"
          hint="カンマ区切り"
          value={skills}
          onChange={setSkills}
          placeholder="例：Python、データ分析、SQL、コミュニケーション"
          textarea
        />
        <Field
          label="興味・関心"
          hint="任意"
          value={interests}
          onChange={setInterests}
          placeholder="例：気候テック、人と関わる仕事、プロダクト開発"
        />
        <Field
          label="経験・経歴"
          hint="任意"
          value={experience}
          onChange={setExperience}
          placeholder="例：小売業で3年、キャリアチェンジ、新卒"
        />
        <Button
          onClick={recommend}
          disabled={loading || skills.trim().length < 3}
          className="mt-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> 職種を探しています…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> 職種をおすすめする
            </>
          )}
        </Button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="min-h-64">
        {loading && <SkeletonPanel label="あなたのプロフィールを需要のある職種と照合しています…" />}
        {!loading && !result && (
          <EmptyPanel text="マッチ度と想定年収つきの、あなたに合った職種のおすすめがここに表示されます。" />
        )}
        {result && (
          <div className="space-y-3">
            {result.roles.map((role, i) => (
              <div key={i} className="rounded-2xl border bg-card p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <ScoreRing value={role.matchScore} size={64} label="マッチ度" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold">
                        {role.title}
                      </h3>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                          DEMAND[role.demand],
                        )}
                      >
                        <TrendingUp className="size-3" />
                        {DEMAND_LABEL[role.demand] ?? role.demand}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground text-pretty">
                      {role.reason}
                    </p>
                    <p className="mt-2 text-sm font-medium text-highlight">
                      {role.salaryRange}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {role.keySkills.map((s, j) => (
                        <Badge key={j} variant="secondary" className="font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  textarea?: boolean
}) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium">
        {label}{' '}
        {hint ? <span className="text-muted-foreground">({hint})</span> : null}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 min-h-20 w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      )}
    </div>
  )
}
