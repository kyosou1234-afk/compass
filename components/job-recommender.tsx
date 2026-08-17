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
      if (!res.ok) throw new Error(data.error || 'Could not generate recommendations')
      setResult(data as JobRecommendations)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border bg-card p-5">
        <Field
          label="Your skills"
          hint="comma separated"
          value={skills}
          onChange={setSkills}
          placeholder="e.g. Python, data analysis, SQL, communication"
          textarea
        />
        <Field
          label="Interests"
          hint="optional"
          value={interests}
          onChange={setInterests}
          placeholder="e.g. climate tech, working with people, building products"
        />
        <Field
          label="Experience / background"
          hint="optional"
          value={experience}
          onChange={setExperience}
          placeholder="e.g. 3 years in retail, career changer, recent grad"
        />
        <Button
          onClick={recommend}
          disabled={loading || skills.trim().length < 3}
          className="mt-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Finding roles…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> Recommend roles
            </>
          )}
        </Button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="min-h-64">
        {loading && <SkeletonPanel label="Matching your profile to in-demand roles…" />}
        {!loading && !result && (
          <EmptyPanel text="Tailored role recommendations with match scores and salary ranges will appear here." />
        )}
        {result && (
          <div className="space-y-3">
            {result.roles.map((role, i) => (
              <div key={i} className="rounded-2xl border bg-card p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <ScoreRing value={role.matchScore} size={64} label="match" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold">
                        {role.title}
                      </h3>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                          DEMAND[role.demand],
                        )}
                      >
                        <TrendingUp className="size-3" />
                        {role.demand} demand
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
