import { useState } from "react";
import { useDailyMissions } from "../hooks/useDailyMissions";
import MissionCard from "../components/MissionCard";
import { getDailyMissions } from "../data/missions";

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateJa(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const wd = WEEKDAYS_JA[date.getDay()];
  return `${y}年${m}月${d}日（${wd}）`;
}

const completionMessages = [
  "今日も悪くなかったな。",
  "小さな一歩が積み重なっていく。",
  "よく頑張った。本当に。",
  "今日のあなたは、確かにいた。",
  "明日もこの調子で。",
];

function getCompletionMessage(dateStr: string): string {
  const idx =
    dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    completionMessages.length;
  return completionMessages[idx];
}

export default function DailyMission() {
  const {
    today,
    todayMissions,
    todayRecord,
    completedCount,
    allCompleted,
    toggleMission,
    pastRecords,
  } = useDailyMissions();

  const [showHistory, setShowHistory] = useState(false);

  const progressPercent = (completedCount / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* ヘッダー */}
      <div className="mb-8">
        <p className="text-text-muted text-sm mb-1">{formatDateJa(today)}</p>
        <h1 className="font-serif text-3xl text-text-primary mb-2">
          今日のミッション
        </h1>
        <p className="text-text-secondary text-sm">
          3つこなせたら、今日も悪くなかったと思えるはず。
        </p>
      </div>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">達成度</span>
          <span className="text-text-primary text-sm font-medium">
            {completedCount} / 3
          </span>
        </div>
        <div className="h-2 bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: allCompleted
                ? "var(--color-success)"
                : "var(--color-accent)",
            }}
          />
        </div>
      </div>

      {/* 全完了メッセージ */}
      {allCompleted && (
        <div className="mb-8 p-5 rounded-xl bg-success/10 border border-success/30 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-success font-medium text-lg">
            全ミッション達成！
          </p>
          <p className="text-text-secondary text-sm mt-1">
            {getCompletionMessage(today)}
          </p>
        </div>
      )}

      {/* ミッションカード */}
      <div className="space-y-4 mb-10">
        {todayMissions.map((mission, i) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            index={i}
            completed={todayRecord.completed[i]}
            onToggle={() => toggleMission(i)}
          />
        ))}
      </div>

      {/* 過去の記録 */}
      <div>
        <button
          type="button"
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm font-medium mb-4"
          onClick={() => setShowHistory((v) => !v)}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showHistory ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          過去の記録
          {pastRecords.length > 0 && (
            <span className="text-text-muted">（{pastRecords.length}日分）</span>
          )}
        </button>

        {showHistory && (
          <div className="space-y-3">
            {pastRecords.length === 0 ? (
              <p className="text-text-muted text-sm py-4 text-center">
                まだ記録がありません
              </p>
            ) : (
              pastRecords.map((record) => {
                const missions = getDailyMissions(record.date);
                const doneCount = record.completed.filter(Boolean).length;
                return (
                  <div
                    key={record.date}
                    className="p-4 rounded-xl bg-dark-card border border-dark-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-secondary text-sm">
                        {formatDateJa(record.date)}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          doneCount === 3
                            ? "text-success"
                            : doneCount > 0
                            ? "text-accent"
                            : "text-text-muted"
                        }`}
                      >
                        {doneCount === 3 ? "✓ 全完了" : `${doneCount} / 3`}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {missions.map((mission, i) => (
                        <div
                          key={mission.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full text-xs ${
                              record.completed[i]
                                ? "bg-success/20 text-success"
                                : "bg-dark-border text-text-muted"
                            }`}
                          >
                            {record.completed[i] ? "✓" : "–"}
                          </span>
                          <span
                            className={
                              record.completed[i]
                                ? "text-text-muted line-through"
                                : "text-text-secondary"
                            }
                          >
                            {mission.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
