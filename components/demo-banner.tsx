import { Info } from 'lucide-react'

export function DemoBanner() {
  return (
    <div className="border-b border-highlight/30 bg-highlight/10">
      <div className="mx-auto flex max-w-5xl items-start gap-2.5 px-4 py-2.5 sm:px-6">
        <Info className="mt-0.5 size-4 shrink-0 text-highlight" />
        <p className="text-xs leading-relaxed text-foreground/80 text-pretty">
          <span className="font-medium text-foreground">デモモードで動作中です。</span>{' '}
          今は見本の回答を表示しています。無料の Google Gemini
          APIキーを設定すると、あなたの入力に合わせて本物のAIが回答します。
        </p>
      </div>
    </div>
  )
}
