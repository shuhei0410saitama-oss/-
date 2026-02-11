import { useState } from "react";
import { topics, topicCategories } from "../data/topics";
import TopicCard from "../components/TopicCard";

export default function TopicList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  const filteredTopics = topics.filter((topic) => {
    // Category filter
    if (selectedCategory !== "all" && topic.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.titleJa.includes(query) ||
        topic.category.toLowerCase().includes(query) ||
        topic.categoryJa.includes(query)
      );
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary">論点一覧</h1>
        <p className="mt-2 text-text-secondary">
          FARの主要論点を体系的に学習
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="mb-6 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              selectedCategory === "all"
                ? "bg-accent text-white"
                : "bg-dark-card text-text-secondary border border-dark-border hover:text-text-primary"
            }`}
          >
            すべて
          </button>
          {topicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                selectedCategory === cat.id
                  ? "bg-accent text-white"
                  : "bg-dark-card text-text-secondary border border-dark-border hover:text-text-primary"
              }`}
            >
              {cat.nameJa}
            </button>
          ))}
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="論点を検索..."
          className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      {/* Filtered count */}
      <p className="mb-4 text-sm text-text-muted">
        {filteredTopics.length}件の論点
      </p>

      {/* Topic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            slug={topic.slug}
            title={topic.title}
            titleJa={topic.titleJa}
            category={topic.category}
            categoryJa={topic.categoryJa}
            difficulty={topic.difficulty}
            themeColor={topic.themeColor}
            description={topic.description}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredTopics.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg">
            該当する論点が見つかりませんでした
          </p>
        </div>
      )}
    </div>
  );
}
