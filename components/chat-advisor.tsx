'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'マーケティングからプロダクトマネージャーに転向するには？',
  '面接で希望年収を聞かれたら何と答えればいい？',
  'シニアエンジニアの面接対策を手伝ってほしい。',
  'キャリアで行き詰まっています。どう方向性を見つければいい？',
]

export function ChatAdvisor() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, status])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput('')
  }

  return (
    <div className="flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-2xl border bg-card">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">
              キャリアコーチに何でも相談
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
              転職、面接、給与交渉、成長 — あなたの状況に合わせた、正直で具体的なアドバイスをお届けします。
            </p>
            <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="group flex items-center gap-2 rounded-xl border bg-background p-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <span className="flex-1 text-pretty">{s}</span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-muted text-foreground',
                )}
              >
                {message.parts.map((part, i) =>
                  part.type === 'text' ? <span key={i}>{part.text}</span> : null,
                )}
              </div>
            </div>
          ))
        )}

        {status === 'submitted' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
              <Dot /> <Dot className="[animation-delay:150ms]" />{' '}
              <Dot className="[animation-delay:300ms]" />
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-destructive">
            問題が発生しました。もう一度お試しください。
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="flex items-end gap-2 border-t bg-card p-3 sm:p-4"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              submit(input)
            }
          }}
          rows={1}
          placeholder="キャリアについて質問する..."
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <Button
          type="submit"
          size="icon"
          disabled={busy || !input.trim()}
          className="size-11 shrink-0 rounded-xl"
          aria-label="メッセージを送信"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}

function Dot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'size-2 animate-bounce rounded-full bg-muted-foreground/60',
        className,
      )}
    />
  )
}
