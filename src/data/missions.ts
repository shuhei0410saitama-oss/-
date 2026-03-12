export type MissionCategory =
  | "体を動かす"
  | "人とつながる"
  | "自分を整える"
  | "発見する"
  | "楽しむ";

export interface Mission {
  id: number;
  text: string;
  category: MissionCategory;
  icon: string;
}

export const missions: Mission[] = [
  // 体を動かす
  { id: 1, text: "外の空気を5分吸いに行く", category: "体を動かす", icon: "🚶" },
  { id: 2, text: "ストレッチを5分間やってみる", category: "体を動かす", icon: "🧘" },
  { id: 3, text: "いつもより少し遠い道を歩いて帰る", category: "体を動かす", icon: "🏃" },
  { id: 4, text: "階段を使う機会を1回作る", category: "体を動かす", icon: "🪜" },
  { id: 5, text: "10分間の散歩をする", category: "体を動かす", icon: "🌿" },
  { id: 6, text: "深呼吸を10回ゆっくりやる", category: "体を動かす", icon: "💨" },

  // 人とつながる
  { id: 7, text: "誰かに「ありがとう」を伝える", category: "人とつながる", icon: "🤝" },
  { id: 8, text: "久しぶりの人にLINEやメッセージを送る", category: "人とつながる", icon: "💬" },
  { id: 9, text: "誰かに「最近どう？」と声をかける", category: "人とつながる", icon: "😊" },
  { id: 10, text: "誰かを笑わせる一言を言う", category: "人とつながる", icon: "😄" },
  { id: 11, text: "お店の人に一言会話を添えてみる", category: "人とつながる", icon: "🗣️" },

  // 自分を整える
  { id: 12, text: "水を1.5リットル飲む", category: "自分を整える", icon: "💧" },
  { id: 13, text: "今日の良かったことを3つ思い浮かべる", category: "自分を整える", icon: "✨" },
  { id: 14, text: "今日の自分をひとつ褒める", category: "自分を整える", icon: "⭐" },
  { id: 15, text: "デスクや部屋を少しだけ片付ける", category: "自分を整える", icon: "🧹" },
  { id: 16, text: "昨日より30分早めに寝る準備をする", category: "自分を整える", icon: "🌙" },
  { id: 17, text: "スマホを10分置いて好きなことをする", category: "自分を整える", icon: "📵" },
  { id: 18, text: "好きな音楽を1曲、目を閉じて聴く", category: "自分を整える", icon: "🎵" },
  { id: 19, text: "5分間の瞑想や目を閉じる時間を作る", category: "自分を整える", icon: "🧠" },
  { id: 20, text: "ちゃんとした食事を1回きちんととる", category: "自分を整える", icon: "🍱" },

  // 発見する
  { id: 21, text: "帰り道に1つ新しい発見をする", category: "発見する", icon: "🔍" },
  { id: 22, text: "気になっていたことを1つ調べる", category: "発見する", icon: "📖" },
  { id: 23, text: "普段行かない場所に1歩入ってみる", category: "発見する", icon: "🗺️" },
  { id: 24, text: "読みかけの本を10ページ読む", category: "発見する", icon: "📚" },
  { id: 25, text: "空を意識して見上げる瞬間を作る", category: "発見する", icon: "☁️" },
  { id: 26, text: "新しい食べ物や飲み物を1つ試す", category: "発見する", icon: "🍜" },
  { id: 27, text: "窓の外の景色を1分間眺める", category: "発見する", icon: "🌄" },

  // 楽しむ
  { id: 28, text: "笑える動画や漫画を1つ見る", category: "楽しむ", icon: "😂" },
  { id: 29, text: "好きな食べ物を1つ食べる", category: "楽しむ", icon: "🍰" },
  { id: 30, text: "植物や花をゆっくり眺める", category: "楽しむ", icon: "🌸" },
  { id: 31, text: "気になっていた動画や記事を1つ見る", category: "楽しむ", icon: "🎬" },
  { id: 32, text: "今日だけの小さなご褒美を用意する", category: "楽しむ", icon: "🎁" },
  { id: 33, text: "好きな飲み物をゆっくり味わって飲む", category: "楽しむ", icon: "☕" },
];

// 日付文字列からシード付き疑似乱数で3つのミッションを選ぶ
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function getDailyMissions(dateStr: string): Mission[] {
  const seed = dateStr
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rand = seededRandom(seed);

  const pool = [...missions];
  const selected: Mission[] = [];

  while (selected.length < 3 && pool.length > 0) {
    const idx = Math.floor(rand() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  return selected;
}

export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
