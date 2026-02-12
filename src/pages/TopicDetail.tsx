import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { topics } from "../data/topics";
import { questions } from "../data/questions";
import QuizMC from "../components/QuizMC";

type TabId = "explanation" | "mc" | "tbs";

export default function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<TabId>("explanation");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-text-muted text-lg mb-6">
          論点が見つかりませんでした
        </p>
        <Link
          to="/topics"
          className="inline-block px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200"
        >
          論点一覧に戻る
        </Link>
      </div>
    );
  }

  const topicQuestions = questions.filter((q) => q.topicSlug === topic.slug);
  const currentQuestion = topicQuestions[currentQuestionIndex];

  const difficultyDots = Array.from({ length: 3 }, (_, i) => (
    <span key={i} style={{ color: topic.themeColor }} className="text-sm">
      {i < topic.difficulty ? "\u25CF" : "\u25CB"}
    </span>
  ));

  const relatedTopicObjects = topic.content.relatedTopics
    .map((relSlug) => topics.find((t) => t.slug === relSlug))
    .filter(Boolean);

  const tabs: { id: TabId; label: string }[] = [
    { id: "explanation", label: "解説" },
    { id: "mc", label: "MC問題" },
    { id: "tbs", label: "TBS問題" },
  ];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      prev < topicQuestions.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      prev > 0 ? prev - 1 : topicQuestions.length - 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link
          to="/topics"
          className="text-text-muted hover:text-accent transition-colors duration-200"
        >
          論点一覧
        </Link>
        <span className="mx-2 text-text-muted">&gt;</span>
        <span className="text-text-secondary">{topic.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Category badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${topic.themeColor}33`,
              color: topic.themeColor,
            }}
          >
            {topic.category}
          </span>

          {/* Difficulty dots */}
          <div className="flex items-center gap-1">{difficultyDots}</div>
        </div>

        <h1 className="font-serif text-3xl text-text-primary">{topic.title}</h1>
        <p className="mt-1 text-lg text-text-secondary">{topic.titleJa}</p>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-6 border-b border-dark-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-accent text-accent"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "explanation" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-dark-card rounded-xl p-6">
            <h2 className="font-serif text-xl text-text-primary mb-4">
              概要
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {topic.content.summary}
            </p>
          </div>

          {/* Key Points */}
          <div className="bg-dark-card rounded-xl p-6">
            <h2 className="font-serif text-xl text-text-primary mb-4">
              重要ポイント
            </h2>
            <ol className="space-y-3">
              {topic.content.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-3 text-text-secondary">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5"
                    style={{
                      backgroundColor: `${topic.themeColor}33`,
                      color: topic.themeColor,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Exam Tips */}
          <div className="bg-dark-card rounded-xl p-6">
            <h2 className="font-serif text-xl text-text-primary mb-4">
              試験対策のポイント
            </h2>
            <ul className="space-y-3">
              {topic.content.examTips.map((tip, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-text-secondary"
                >
                  <span className="flex-shrink-0 text-accent mt-0.5">
                    &#x2022;
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Topics */}
          {relatedTopicObjects.length > 0 && (
            <div className="bg-dark-card rounded-xl p-6">
              <h2 className="font-serif text-xl text-text-primary mb-4">
                関連トピック
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedTopicObjects.map((related) => (
                  <Link
                    key={related!.slug}
                    to={`/topics/${related!.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: related!.themeColor }}
                    />
                    {related!.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "mc" && (
        <div>
          {topicQuestions.length > 0 && currentQuestion ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  問題 {currentQuestionIndex + 1} / {topicQuestions.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevQuestion}
                    className="px-3 py-1.5 text-sm bg-dark-card border border-dark-border rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    前へ
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-3 py-1.5 text-sm bg-dark-card border border-dark-border rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    次へ
                  </button>
                </div>
              </div>
              <QuizMC
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={topicQuestions.length}
                onNext={handleNextQuestion}
                onPrev={handlePrevQuestion}
                showNavigation={false}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg">
                この論点のMC問題はまだ準備中です。
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "tbs" && (
        <div className="flex items-center justify-center py-16">
          <div className="bg-dark-card rounded-xl p-8 text-center max-w-md">
            <p className="text-text-muted text-lg mb-2">Coming Soon</p>
            <p className="text-text-secondary">
              TBS問題は準備中です。今後追加予定です。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
