import { createGoogleGenerativeAI } from '@ai-sdk/google'

// Career Compass の全機能で使うモデルをここで一元管理します。
// Google Gemini を「直接」使用します（クレジットカード不要・無料枠あり）。
// createGoogleGenerativeAI に apiKey を明示することで、Vercel AI Gateway を
// 経由せず、Google のAPIへ直通で接続します。
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ?? ''

const googleDirect = createGoogleGenerativeAI({ apiKey })

export const MODEL = googleDirect('gemini-2.5-flash')

// 有効な Gemini APIキーが設定されているかを判定します。
// Gemini のキーは "AIza" で始まる39文字前後の文字列です。
// キーが未設定・不正な場合は、デモ用の見本データを表示します。
export function hasValidGeminiKey(): boolean {
  return apiKey.startsWith('AIza') && apiKey.length >= 30 && apiKey.length <= 100
}
