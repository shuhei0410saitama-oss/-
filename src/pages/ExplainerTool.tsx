import { useState } from "react";

interface ExplanationDetail {
  icon: string;
  heading: string;
  content: string;
}

interface Explanation {
  title: string;
  emoji: string;
  summary: string;
  details: ExplanationDetail[];
  analogy: string;
  keyPoints: string[];
  relatedTopics: string[];
}

const SYSTEM_PROMPT = `あなたは何でも分かりやすく解説する専門家です。
ユーザーが入力したトピックについて、以下のJSON形式で回答してください。
必ず日本語で、中学生でも理解できるくらい分かりやすく説明してください。

{
  "title": "トピックのタイトル",
  "emoji": "トピックを表す絵文字1文字",
  "summary": "一言で言うと何か（50文字以内）",
  "details": [
    {"icon": "絵文字", "heading": "セクション見出し", "content": "詳しい説明（100文字程度）"},
    {"icon": "絵文字", "heading": "セクション見出し", "content": "詳しい説明（100文字程度）"},
    {"icon": "絵文字", "heading": "セクション見出し", "content": "詳しい説明（100文字程度）"}
  ],
  "analogy": "身近なものに例えた説明（150文字程度）",
  "keyPoints": ["ポイント1", "ポイント2", "ポイント3", "ポイント4"],
  "relatedTopics": ["関連トピック1", "関連トピック2", "関連トピック3"]
}

必ずJSONのみを返してください。前後に説明文やコードブロック記号を付けないでください。`;

const CARD_GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-pink-700",
  "from-emerald-600 to-teal-700",
];

export default function ExplainerTool() {
  const [query, setQuery] = useState("");
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("anthropic_api_key") || ""
  );
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [error, setError] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("anthropic_api_key", key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (!apiKey) {
      setShowKeyInput(true);
      setError("Anthropic APIキーを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setExplanation(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: query }],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          `APIエラー (${response.status}): ${
            (errData as { error?: { message?: string } }).error?.message || "不明なエラー"
          }`
        );
      }

      const data = await response.json();
      const text: string = data.content[0].text;
      // Strip possible markdown code fences
      const cleaned = text.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim();
      const parsed: Explanation = JSON.parse(cleaned);
      setExplanation(parsed);
      setAnimationKey((k) => k + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRelatedClick = (topic: string) => {
    setQuery(topic);
  };

  return (
    <div className="min-h-screen bg-dark-base py-12 px-4">
      {/* Page header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="text-5xl mb-3">🔍</div>
        <h1 className="text-4xl font-black text-text-primary mb-3">
          なんでも解説
        </h1>
        <p className="text-text-secondary text-lg">
          気になるキーワードを入力すると、めっちゃわかりやすく解説します！
        </p>
      </div>

      {/* API Key Setup */}
      <div className="max-w-2xl mx-auto mb-4">
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-text-muted text-sm hover:text-text-secondary transition-colors flex items-center gap-1"
        >
          <span>⚙️ APIキー設定</span>
          {apiKey ? (
            <span className="text-success text-xs">（設定済み ✓）</span>
          ) : (
            <span className="text-error text-xs">（未設定）</span>
          )}
        </button>
        {showKeyInput && (
          <div className="mt-2 flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="sk-ant-api..."
              className="flex-1 px-3 py-2 rounded-lg bg-dark-card text-text-primary border border-dark-border text-sm focus:border-accent focus:outline-none"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm transition-colors"
            >
              保存
            </button>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: 量子コンピュータ、光合成、インフレ、recursion..."
            className="flex-1 px-5 py-4 text-base rounded-xl bg-dark-card text-text-primary
                       placeholder-text-muted border-2 border-dark-border
                       focus:border-accent focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-accent hover:bg-accent-hover disabled:opacity-40
                       text-white font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            {loading ? "解説中…" : "解説する！"}
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto text-center py-12">
          <div className="text-6xl animate-bounce mb-4">🤔</div>
          <p className="text-text-secondary text-lg mb-6">考え中...</p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="max-w-2xl mx-auto bg-error/10 border border-error/30 rounded-xl p-4 text-error text-center text-sm">
          {error}
        </div>
      )}

      {/* Explanation */}
      {explanation && !loading && (
        <div key={animationKey} className="max-w-3xl mx-auto space-y-5">
          {/* Hero card */}
          <div className="explainer-card-fade bg-dark-card border border-dark-border rounded-3xl p-8 text-center">
            <div className="text-7xl mb-4">{explanation.emoji}</div>
            <h2 className="text-3xl font-black text-text-primary mb-4">
              {explanation.title}
            </h2>
            <div className="inline-block bg-accent/20 border border-accent/40 rounded-full px-6 py-2">
              <p className="text-accent-light font-semibold text-lg">
                {explanation.summary}
              </p>
            </div>
          </div>

          {/* Detail cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {explanation.details.map((detail, i) => (
              <div
                key={i}
                className={`explainer-card-fade bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}
                            rounded-2xl p-5 text-white`}
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{detail.icon}</div>
                <h3 className="font-bold text-base mb-2">{detail.heading}</h3>
                <p className="text-white/85 text-sm leading-relaxed">
                  {detail.content}
                </p>
              </div>
            ))}
          </div>

          {/* Analogy */}
          <div
            className="explainer-card-fade bg-warning/10 border border-warning/30 rounded-2xl p-6"
            style={{ animationDelay: "0.4s" }}
          >
            <h3 className="text-warning font-bold text-lg mb-3">💡 例え話</h3>
            <p className="text-text-primary text-base leading-relaxed">
              {explanation.analogy}
            </p>
          </div>

          {/* Key points */}
          <div
            className="explainer-card-fade bg-dark-card border border-dark-border rounded-2xl p-6"
            style={{ animationDelay: "0.5s" }}
          >
            <h3 className="text-text-primary font-bold text-lg mb-4">
              ✨ ポイントまとめ
            </h3>
            <ol className="space-y-3">
              {explanation.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 bg-accent rounded-full flex items-center
                                justify-center text-white font-bold text-xs"
                  >
                    {i + 1}
                  </span>
                  <p className="text-text-secondary text-sm leading-relaxed pt-0.5">
                    {point}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Related topics */}
          <div
            className="explainer-card-fade bg-dark-card border border-dark-border rounded-2xl p-6"
            style={{ animationDelay: "0.6s" }}
          >
            <h3 className="text-text-primary font-bold text-lg mb-4">
              🔗 関連トピック
            </h3>
            <div className="flex flex-wrap gap-2">
              {explanation.relatedTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleRelatedClick(topic)}
                  className="px-4 py-2 bg-dark-surface hover:bg-accent/20 text-text-secondary
                             hover:text-accent-light rounded-full text-sm transition-colors
                             border border-dark-border hover:border-accent/40"
                >
                  {topic} →
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
