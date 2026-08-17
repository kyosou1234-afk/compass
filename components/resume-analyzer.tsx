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
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data as ResumeAnalysis)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border bg-card p-5">
        <label className="text-sm font-medium" htmlFor="target-role">
          Target role <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="target-role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="resume">
          Paste your resume
        </label>
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste the full text of your resume here..."
          className="mt-1.5 min-h-56 w-full resize-y rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />

        <Button
          onClick={analyze}
          disabled={loading || resume.trim().length < 40}
          className="mt-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> Analyze my resume
            </>
          )}
        </Button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="min-h-64">
        {loading && <SkeletonPanel label="Reading your resume and scoring it…" />}

        {!loading && !result && (
          <EmptyPanel text="Your analysis — score, strengths, and prioritized fixes — will appear here." />
        )}

        {result && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
              <ScoreRing value={result.overallScore} label="score" />
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {result.summary}
              </p>
            </div>

            <Section title="Strengths" icon={<CircleCheck className="size-4 text-primary" />}>
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
              title="Prioritized improvements"
              icon={<TriangleAlert className="size-4 text-highlight" />}
            >
              <div className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <div key={i} className="rounded-xl border bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-pretty">{imp.issue}</p>
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                          SEVERITY[imp.severity],
                        )}
                      >
                        {imp.severity}
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
              <Section title="Detected keywords">
                <TagList items={result.keywords} tone="primary" />
              </Section>
              <Section title="Consider adding">
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
    return <p className="text-sm text-muted-foreground">None found.</p>
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
