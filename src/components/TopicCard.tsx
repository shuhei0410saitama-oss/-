import { Link } from "react-router-dom";

interface TopicCardProps {
  slug: string;
  title: string;
  titleJa: string;
  category: string;
  categoryJa: string;
  difficulty: number;
  themeColor: string;
  description: string;
}

export default function TopicCard({
  slug,
  title,
  titleJa,
  category,
  categoryJa,
  difficulty,
  themeColor,
  description,
}: TopicCardProps) {
  const difficultyDots = Array.from({ length: 3 }, (_, i) => (
    <span key={i} style={{ color: themeColor }} className="text-sm">
      {i < difficulty ? "\u25CF" : "\u25CB"}
    </span>
  ));

  return (
    <Link
      to={`/topics/${slug}`}
      className="group block bg-dark-card rounded-xl border border-dark-border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: themeColor,
        boxShadow: undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 16px ${themeColor}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="p-5">
        {/* Category badge */}
        <div className="mb-3">
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${themeColor}33`,
              color: themeColor,
            }}
          >
            {category}
            <span className="ml-1 text-text-muted">{categoryJa}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg text-text-primary leading-snug group-hover:text-accent-light transition-colors duration-200">
          {title}
        </h3>
        <p className="mt-0.5 text-sm text-text-secondary">{titleJa}</p>

        {/* Difficulty dots */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-xs text-text-muted mr-1">Difficulty</span>
          {difficultyDots}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
