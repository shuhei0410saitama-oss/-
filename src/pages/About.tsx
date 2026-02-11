import { Link } from "react-router-dom";

const achievements = [
  { label: "USCPA", value: "全科目合格" },
  { label: "FAR", value: "一発合格" },
  { label: "学習期間", value: "約1年半" },
  { label: "使用教材", value: "Becker + 独自教材" },
];

export default function About() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Profile Section ===== */}
        <section className="mb-12">
          <h1 className="font-serif text-3xl text-text-primary mb-8">About</h1>

          <div className="bg-dark-card rounded-xl p-8 border border-dark-border">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-accent">S</span>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-text-primary">
                  Shuhei
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  USCPA合格者 / FAR Study Lab 運営者
                </p>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  日本の大学を卒業後、会計業界でキャリアをスタート。働きながらUSCPAの学習を開始し、FARをはじめ全科目に合格。自身の学習経験を活かし、FAR合格を目指す方のための学習ポータル「FAR
                  Study Lab」を立ち上げました。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Why Section ===== */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            このサイトを作った理由
          </h2>

          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {`USCPAの学習、特にFARは範囲が広く、どこから手をつけていいかわからない方も多いと思います。予備校の教材だけでは理解しにくい論点も、図解や実際の出題パターンを知ることで格段に理解が深まります。

自分が学習中に「こんなサイトがあったら良かったのに」と感じていたものを形にしました。合格者だからこそわかる「ここが出る」「ここで差がつく」ポイントを、できるだけわかりやすくお伝えします。`}
            </p>
          </div>
        </section>

        {/* ===== Achievements Section ===== */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4">合格実績</h2>

          <div className="grid grid-cols-2 gap-4">
            {achievements.map((item) => (
              <div
                key={item.label}
                className="bg-dark-card rounded-xl p-6 border border-dark-border text-center"
              >
                <p className="text-sm text-text-muted">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="text-center py-8">
          <h2 className="font-serif text-2xl text-text-primary">
            一緒にFAR合格を目指しましょう！
          </h2>
          <div className="mt-6">
            <Link
              to="/topics"
              className="inline-block bg-accent text-white rounded-lg px-8 py-3 font-medium transition-colors duration-200 hover:bg-accent-hover"
            >
              学習を始める →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
