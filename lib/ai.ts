import { createGoogleGenerativeAI } from '@ai-sdk/google'

// Career Compass の全機能で使うモデルをここで一元管理します。
// Google Gemini を「直接」使用します（クレジットカード不要・無料枠あり）。
// createGoogleGenerativeAI に apiKey を明示することで、Vercel AI Gateway を
// 経由せず、Google のAPIへ直通で接続します。
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ?? ''

const googleDirect = createGoogleGenerativeAI({ apiKey })

export const MODEL = googleDirect('gemini-3.6-flash')

// 有効な Gemini APIキーが設定されているかを判定します。
// Gemini のキーは、新しい "AQ." 形式（2026年以降）と、
// 従来の "AIza" 形式のどちらかで始まります。
// 空白を含む値（curlコマンドの貼り間違いなど）や、
// 未設定・不正な場合は、デモ用の見本データを表示します。
export function hasValidGeminiKey(): boolean {
  if (/\s/.test(apiKey)) return false
  const looksLikeKey = apiKey.startsWith('AQ.') || apiKey.startsWith('AIza')
  return looksLikeKey && apiKey.length >= 20 && apiKey.length <= 120
}
