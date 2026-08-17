import type {
  JobRecommendations,
  ResumeAnalysis,
  SkillsGap,
} from '@/lib/schemas'

// APIキーが未設定のときに表示する「見本（デモ）」データです。
// 正しいキーが設定されると、これらは使われず本物のAIが応答します。

export const DEMO_NOTICE =
  'これはデモ用の見本です。無料の Google Gemini APIキーを設定すると、本物のAIがあなたの入力に合わせて回答します。'

export const demoChatReply = `ご相談ありがとうございます。（※これはデモ用の見本回答です）

まず状況を整理しましょう。キャリアの方向性を考えるときは、次の3つの視点が役立ちます。

- **できること（スキル・強み）**：これまでの経験で自然と得意になったこと
- **やりたいこと（興味・価値観）**：時間を忘れて取り組めること
- **求められること（市場・需要）**：世の中で必要とされている仕事

今週できる具体的な一歩として、まずは「これまでで一番やりがいを感じた仕事」を3つ書き出してみてください。そこにあなたの方向性のヒントが隠れています。

無料のAPIキーを設定すると、あなたの状況に合わせた具体的なアドバイスをAIがお返しします。`

export const demoResume: ResumeAnalysis = {
  overallScore: 72,
  summary:
    '（デモ見本）全体的によくまとまった職務経歴書です。実績が具体的な数字で示されている点が強みですが、対象職種に向けたキーワードを補うとさらに通過率が上がります。',
  strengths: [
    '職務内容が具体的な成果（数値）とともに書かれている',
    '時系列が分かりやすく、読み手が経歴を追いやすい',
    '使用ツールや技術が明記されている',
  ],
  improvements: [
    {
      issue: '冒頭に自己紹介・要約（サマリー）がない',
      suggestion:
        '一番上に3〜4行で「何ができる人か」を要約する欄を追加しましょう。採用担当は最初の数秒で判断します。',
      severity: 'high',
    },
    {
      issue: '成果が「担当した」止まりの箇所がある',
      suggestion:
        '「担当した」ではなく「◯◯を改善し、△△%向上させた」のように、行動と結果をセットで書きましょう。',
      severity: 'medium',
    },
    {
      issue: '対象職種向けのキーワードが不足',
      suggestion:
        '応募先の求人票から重要な用語を拾い、自然な形で経歴書に反映させましょう。',
      severity: 'medium',
    },
  ],
  keywords: ['プロジェクト管理', 'データ分析', 'チームリード', '業務改善'],
  missingKeywords: ['KPI設計', 'ステークホルダー調整', '要件定義'],
}

export const demoJobs: JobRecommendations = {
  roles: [
    {
      title: 'プロダクトマネージャー',
      matchScore: 84,
      reason:
        '（デモ見本）チームをまとめた経験と業務改善の実績が、プロダクト開発の優先順位づけに活かせます。',
      salaryRange: '600万〜900万円',
      demand: 'high',
      keySkills: ['要件定義', 'ロードマップ策定', 'データ分析', '調整力'],
    },
    {
      title: 'データアナリスト',
      matchScore: 76,
      reason:
        '数字で成果を語れる点が強みで、分析から示唆を出す仕事と相性が良いです。',
      salaryRange: '500万〜750万円',
      demand: 'high',
      keySkills: ['SQL', 'データ可視化', '統計の基礎', '課題設定'],
    },
    {
      title: 'プロジェクトマネージャー',
      matchScore: 71,
      reason: 'チームリードの経験を、進行管理やリスク管理に直接活かせます。',
      salaryRange: '550万〜800万円',
      demand: 'medium',
      keySkills: ['進行管理', 'リスク管理', 'ステークホルダー調整'],
    },
  ],
}

export const demoSkills: SkillsGap = {
  targetRole: 'データサイエンティスト',
  readinessScore: 45,
  summary:
    '（デモ見本）基礎的な分析力はありますが、機械学習とプログラミングの実践経験を積むことで目標に近づけます。段階的に学べば十分到達可能です。',
  skills: [
    { name: 'Python', currentLevel: 40, requiredLevel: 85, priority: 'high' },
    { name: '統計・確率', currentLevel: 50, requiredLevel: 80, priority: 'high' },
    {
      name: '機械学習',
      currentLevel: 20,
      requiredLevel: 80,
      priority: 'high',
    },
    { name: 'SQL', currentLevel: 60, requiredLevel: 75, priority: 'medium' },
    {
      name: 'データ可視化',
      currentLevel: 55,
      requiredLevel: 70,
      priority: 'medium',
    },
  ],
  learningPlan: [
    {
      step: 1,
      title: 'Python の基礎を固める',
      description:
        'データ処理の土台となる Python を、実際に手を動かしながら学びます。',
      durationWeeks: 4,
      resources: ['入門オンライン講座', '無料の練習問題サイト', '簡単な自動化スクリプト作成'],
    },
    {
      step: 2,
      title: '統計とデータ分析の実践',
      description:
        '平均・分散・相関などの基礎統計を、実データで理解します。',
      durationWeeks: 4,
      resources: ['統計入門書', '公開データセットでの分析練習'],
    },
    {
      step: 3,
      title: '機械学習の入門',
      description:
        '回帰・分類など基本的なモデルを、ライブラリを使って体験します。',
      durationWeeks: 6,
      resources: ['機械学習の入門講座', 'Kaggle の初心者コンペ'],
    },
    {
      step: 4,
      title: 'ポートフォリオ制作',
      description:
        '学んだことを1つのプロジェクトにまとめ、成果として見せられる形にします。',
      durationWeeks: 4,
      resources: ['自分の興味あるテーマでの分析', 'GitHub での公開'],
    },
  ],
}
