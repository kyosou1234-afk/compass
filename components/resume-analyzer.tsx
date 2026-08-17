'use client'

import { useState } from 'react'
import {
  CircleCheck,
  Loader2,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScoreRing } from '@/components/score-ring'
import type { ResumeAnalysis } from '@/lib/schemas'
import { cn } from '@/lib/utils'

const SEVERITY: Record<string, string> = {
  high: 'border-destructive/30 bg-destructive/10 text-destructive',
  medium: 'border-highlight/40 bg-highlight/10 text-highlight',
  low: 'border-primary/30 bg-primary/10 text-primary',
}

const SEVERITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export function ResumeAnalyzer() {
  const [resume, setResume] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResumeAnalysis | null>(null)

  async function analyze() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, targetRole }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '分析に失敗しました')
      setResult(data as ResumeAnalysis)
    } catch (e) {
      setError(e instanceof Error ? e.message : '問題が発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border bg-card p-5">
        <label className="text-sm font-medium" htmlFor="target-role">
          希望する職種 <span className="text-muted-foreground">(任意)</span>
        </label>
        <input
          id="target-role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="例：シニアフロントエンドエンジニア"
          className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="resume">
          職務経歴書を貼り付け
        </label>
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="ここに職務経歴書の全文を貼り付けてください..."
          className="mt-1.5 min-h-56 w-full resize-y rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />

        <Button
          onClick={analyze}
          disabled={loading || resume.trim().length < 40}
          className="mt-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> 分析中…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> 職務経歴書を分析する
            </>
          )}
        </Button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="min-h-64">
        {loading && <SkeletonPanel label="職務経歴書を読み取り、採点しています…" />}

        {!loading && !result && (
          <EmptyPanel text="スコア、強み、優先度つきの改善点など、分析結果がここに表示されます。" />
        )}

        {result && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
              <ScoreRing value={result.overallScore} label="スコア" />
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {result.summary}
              </p>
            </div>

            <Section title="強み" icon={<CircleCheck className="size-4 text-primary" />}>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-pretty">{s}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              title="優先度つきの改善点"
              icon={<TriangleAlert className="size-4 text-highlight" />}
            >
              <div className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <div key={i} className="rounded-xl border bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-pretty">{imp.issue}</p>
                      <span
                        className={cn(
                          'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                          SEVERITY[imp.severity],
                        )}
                      >
                        優先度：{SEVERITY_LABEL[imp.severity] ?? imp.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground text-pretty">
                      {imp.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <div className="grid gap-4 sm:grid-cols-2">
              <Section title="検出されたキーワード">
                <TagList items={result.keywords} tone="primary" />
              </Section>
              <Section title="追加を検討したいキーワード">
                <TagList items={result.missingKeywords} tone="highlight" />
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  )
}

function TagList({
  items,
  tone,
}: {
  items: string[]
  tone: 'primary' | 'highlight'
}) {
  if (!items.length)
    return <p className="text-sm text-muted-foreground">見つかりませんでした。</p>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <Badge
          key={i}
          variant="outline"
          className={cn(
            tone === 'primary'
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-highlight/40 bg-highlight/10 text-highlight',
          )}
        >
          {t}
        </Badge>
      ))}
    </div>
  )
}

export function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed bg-card/50 p-8 text-center">
      <p className="max-w-xs text-sm text-muted-foreground text-pretty">{text}</p>
    </div>
  )
}

export function SkeletonPanel({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-8 text-center">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground text-pretty">{label}</p>
    </div>
  )
}
