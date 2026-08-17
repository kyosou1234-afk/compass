import { CareerCompass } from '@/components/career-compass'
import { hasValidGeminiKey } from '@/lib/ai'

export default function Page() {
  // サーバー側でAPIキーの有効性を判定し、無効ならデモモードで表示します。
  const demoMode = !hasValidGeminiKey()
  return <CareerCompass demoMode={demoMode} />
}
