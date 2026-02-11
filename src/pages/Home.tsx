import { Link } from "react-router-dom";
import { topics } from "../data/topics";
import TopicCard from "../components/TopicCard";

const features = [
  {
    icon: "📊",
    title: "図解でわかりやすい",
    description:
      "複雑な会計基準を図解とチャートで視覚的に理解。暗記ではなく「なぜそうなるか」がわかる解説。",
  },
  {
    icon: "✏️",
    title: "実戦形式の問題演習",
    description:
      "本試験と同じMC形式で演習。即時フィードバックと日英両方の解説で確実に定着。",
  },
  {
    icon: "🎯",
    title: "合格者の実体験ベース",
    description:
      "FAR合格者が「ここが出る」「ここで差がつく」を徹底解説。効率的な学習をサポート。",
  },
];

export default function Home() {
  const pickupTopics = topics.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Radial glow background */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-text-primary leading-tight">
            FARを、確実に。
          </h1>
          <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            USCPA FAR合格者が作る、FAR特化の学習ポータル
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/topics"
              className="bg-accent text-white rounded-lg px-8 py-3 font-medium transition-colors duration-200 hover:bg-accent-hover"
            >
              学習を始める
            </Link>
            <Link
              to="/exam-guide"
              className="border border-accent text-accent rounded-lg px-8 py-3 font-medium transition-colors duration-200 hover:bg-accent/10"
            >
              受験ガイドを見る
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-text-primary text-center mb-12">
            FAR Study Lab の特徴
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-dark-card rounded-xl p-6 border border-dark-border"
              >
                <span className="text-3xl" role="img" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-medium text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Topics Pickup Section ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-text-primary mb-8">
            論点ピックアップ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pickupTopics.map((topic) => (
              <TopicCard key={topic.slug} {...topic} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/topics"
              className="inline-block text-accent hover:text-accent-light transition-colors duration-200 font-medium"
            >
              すべての論点を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Exam Guide Banner Section ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-card rounded-xl border border-dark-border p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl text-text-primary">
              受験方法がわからない方へ
            </h2>
            <p className="mt-3 text-text-secondary max-w-xl mx-auto">
              出願から当日の流れまで、USCPAの受験プロセスをわかりやすく解説します。
            </p>
            <div className="mt-6">
              <Link
                to="/exam-guide"
                className="inline-block bg-accent text-white rounded-lg px-8 py-3 font-medium transition-colors duration-200 hover:bg-accent-hover"
              >
                受験ガイドを読む →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Final CTA Section ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl text-text-primary">
            今すぐ学習を始めよう
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">
            基本コンテンツはすべて無料。FAR合格への第一歩を踏み出そう。
          </p>
          <div className="mt-8">
            <Link
              to="/topics"
              className="inline-block bg-accent text-white rounded-lg px-8 py-3 font-medium transition-colors duration-200 hover:bg-accent-hover"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
