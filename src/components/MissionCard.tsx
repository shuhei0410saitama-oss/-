import type { Mission } from "../data/missions";

interface MissionCardProps {
  mission: Mission;
  index: number;
  completed: boolean;
  onToggle: () => void;
}

const categoryColors: Record<string, string> = {
  "体を動かす": "text-green-400 bg-green-400/10 border-green-400/30",
  "人とつながる": "text-blue-400 bg-blue-400/10 border-blue-400/30",
  "自分を整える": "text-purple-400 bg-purple-400/10 border-purple-400/30",
  "発見する": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "楽しむ": "text-pink-400 bg-pink-400/10 border-pink-400/30",
};

export default function MissionCard({ mission, index, completed, onToggle }: MissionCardProps) {
  const badgeClass = categoryColors[mission.category] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer
        ${completed
          ? "bg-dark-card border-success/50 opacity-80"
          : "bg-dark-card border-dark-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
        }
      `}
      aria-pressed={completed}
    >
      <div className="flex items-start gap-4">
        {/* ミッション番号 */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          transition-colors duration-300
          ${completed ? "bg-success text-dark-base" : "bg-dark-border text-text-muted"}
        `}>
          {completed ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            index + 1
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}>
              {mission.icon} {mission.category}
            </span>
          </div>
          <p className={`text-base font-medium leading-snug transition-colors duration-300 ${
            completed ? "line-through text-text-muted" : "text-text-primary"
          }`}>
            {mission.text}
          </p>
        </div>
      </div>
    </button>
  );
}
