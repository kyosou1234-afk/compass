import { google } from '@ai-sdk/google'

// Career Compass の全機能で使うモデルをここで一元管理します。
// Google Gemini を使用（クレジットカード不要・無料枠あり）。
// APIキーは環境変数 GOOGLE_GENERATIVE_AI_API_KEY から自動で読み込まれます。
export const MODEL = google('gemini-2.5-flash')
