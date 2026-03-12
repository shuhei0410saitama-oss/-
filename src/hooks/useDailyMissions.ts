import { useState, useEffect } from "react";
import { getDailyMissions, getTodayStr, type Mission } from "../data/missions";

export interface DayRecord {
  date: string;
  missionIds: number[];
  completed: boolean[];
  completedAt: (string | null)[];
}

const STORAGE_KEY = "daily-mission-records";

function loadRecords(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRecords(records: Record<string, DayRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function useDailyMissions() {
  const today = getTodayStr();
  const todayMissions: Mission[] = getDailyMissions(today);

  const [records, setRecords] = useState<Record<string, DayRecord>>(() => {
    const stored = loadRecords();
    // 今日のレコードがなければ初期化
    if (!stored[today]) {
      stored[today] = {
        date: today,
        missionIds: todayMissions.map((m) => m.id),
        completed: [false, false, false],
        completedAt: [null, null, null],
      };
      saveRecords(stored);
    }
    return stored;
  });

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const todayRecord = records[today];
  const completedCount = todayRecord.completed.filter(Boolean).length;
  const allCompleted = completedCount === 3;

  function toggleMission(index: number) {
    setRecords((prev) => {
      const rec = prev[today];
      const newCompleted = [...rec.completed];
      const newCompletedAt = [...rec.completedAt];

      if (newCompleted[index]) {
        // チェックを外す
        newCompleted[index] = false;
        newCompletedAt[index] = null;
      } else {
        // チェックを入れる
        newCompleted[index] = true;
        newCompletedAt[index] = new Date().toISOString();
      }

      return {
        ...prev,
        [today]: { ...rec, completed: newCompleted, completedAt: newCompletedAt },
      };
    });
  }

  // 過去の記録（今日を除く、日付降順）
  const pastRecords = Object.values(records)
    .filter((r) => r.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    today,
    todayMissions,
    todayRecord,
    completedCount,
    allCompleted,
    toggleMission,
    pastRecords,
  };
}
