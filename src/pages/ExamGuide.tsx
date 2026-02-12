import { useParams, Link } from "react-router-dom";
import { examGuideSections } from "../data/examGuide";

export default function ExamGuide() {
  const { slug } = useParams<{ slug: string }>();

  // If no slug, show the hub/index page
  if (!slug) {
    return <HubPage />;
  }

  // If slug, show the specific section
  return <SectionPage slug={slug} />;
}

/* ===== Hub Page (no slug) ===== */

function HubPage() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-12">
          <h1 className="font-serif text-3xl text-text-primary">受験ガイド</h1>
          <p className="mt-3 text-text-secondary">
            USCPAの受験プロセスをわかりやすく解説
          </p>
        </div>

        {/* Section cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examGuideSections.map((section) => (
            <Link
              key={section.slug}
              to={`/exam-guide/${section.slug}`}
              className="group bg-dark-card rounded-xl p-6 border border-dark-border hover:border-accent transition-colors duration-300"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {section.icon}
              </span>
              <h2 className="mt-4 text-lg font-medium text-text-primary group-hover:text-accent-light transition-colors duration-200">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                詳しく見る →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Section Page (with slug) ===== */

function SectionPage({ slug }: { slug: string }) {
  const sectionIndex = examGuideSections.findIndex((s) => s.slug === slug);
  const section = examGuideSections[sectionIndex];

  // Not found
  if (!section) {
    return (
      <div className="min-h-screen py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-secondary text-lg mb-6">
            指定されたガイドセクションが見つかりませんでした。
          </p>
          <Link
            to="/exam-guide"
            className="inline-block text-accent hover:text-accent-light transition-colors duration-200 font-medium"
          >
            ← 受験ガイド一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const prevSection =
    sectionIndex > 0 ? examGuideSections[sectionIndex - 1] : null;
  const nextSection =
    sectionIndex < examGuideSections.length - 1
      ? examGuideSections[sectionIndex + 1]
      : null;

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-text-muted">
          <Link
            to="/exam-guide"
            className="hover:text-accent transition-colors duration-200"
          >
            受験ガイド
          </Link>
          <span className="mx-2">›</span>
          <span className="text-text-secondary">{section.title}</span>
        </nav>

        {/* Section heading */}
        <div className="mb-10">
          <span className="text-3xl" role="img" aria-hidden="true">
            {section.icon}
          </span>
          <h1 className="mt-3 font-serif text-3xl text-text-primary">
            {section.title}
          </h1>
        </div>

        {/* Content sections */}
        {section.content.map((item, index) => (
          <div
            key={index}
            className="bg-dark-card rounded-xl p-6 mb-6 border border-dark-border"
          >
            <h2 className="text-xl font-bold text-text-primary mb-3">
              {item.heading}
            </h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {item.body}
            </p>
          </div>
        ))}

        {/* Prev / Next navigation */}
        <div className="mt-12 flex items-center justify-between gap-4">
          {prevSection ? (
            <Link
              to={`/exam-guide/${prevSection.slug}`}
              className="group flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200"
            >
              <span aria-hidden="true">←</span>
              <span className="text-sm">{prevSection.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextSection ? (
            <Link
              to={`/exam-guide/${nextSection.slug}`}
              className="group flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200"
            >
              <span className="text-sm">{nextSection.title}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
