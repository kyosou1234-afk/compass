import { google } from '@ai-sdk/google'

// Career Compass の全機能で使うモデルをここで一元管理します。
// Google Gemini を使用（クレジットカード不要・無料枠あり）。
// APIキーは環境変数 GOOGLE_GENERATIVE_AI_API_KEY から自動で読み込まれます。
export const MODEL = google('gemini-2.5-flash')

// 有効な Gemini APIキーが設定されているかを判定します。
// Gemini のキーは "AIza" で始まる39文字前後の文字列です。
// キーが未設定・不正な場合は、デモ用の見本データを表示します。
export function hasValidGeminiKey(): boolean {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ?? ''
  return key.startsWith('AIza') && key.length >= 30 && key.length <= 100
}
