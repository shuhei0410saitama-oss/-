import { useState } from "react";

interface QuizOption {
  id: string;
  text: string;
  textJa: string;
}

interface QuizQuestion {
  id: string | number;
  question: string;
  questionJa: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  explanationJa: string;
}

interface QuizMCProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext?: () => void;
  onPrev?: () => void;
  showNavigation?: boolean;
}

export default function QuizMC({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onPrev,
  showNavigation = false,
}: QuizMCProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selectedAnswer === question.correctAnswer;

  function handleSelect(optionId: string) {
    if (showResult) return;
    setSelectedAnswer(optionId);
    setShowResult(true);
  }

  function getOptionClasses(optionId: string): string {
    const base =
      "w-full text-left p-4 rounded-lg border transition-all duration-200";

    if (!showResult) {
      // Before answering
      return `${base} bg-dark-surface border-dark-border hover:border-accent hover:bg-dark-card cursor-pointer`;
    }

    // After answering
    if (optionId === question.correctAnswer) {
      // This is the correct answer — always highlight green
      return `${base} bg-success/10 border-success cursor-default`;
    }

    if (optionId === selectedAnswer) {
      // This is the selected answer and it's wrong
      return `${base} bg-error/10 border-error cursor-default`;
    }

    // Unselected, non-correct options after answering
    return `${base} bg-dark-surface border-dark-border opacity-50 cursor-default`;
  }

  function getOptionIcon(optionId: string): React.ReactNode {
    if (!showResult) return null;

    if (optionId === question.correctAnswer) {
      return (
        <span className="ml-auto shrink-0 text-success font-bold text-lg">
          &#10003;
        </span>
      );
    }

    if (optionId === selectedAnswer && optionId !== question.correctAnswer) {
      return (
        <span className="ml-auto shrink-0 text-error font-bold text-lg">
          &#10007;
        </span>
      );
    }

    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question number indicator */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-accent">
          Q{questionNumber}{" "}
          <span className="text-text-muted">/ {totalQuestions}</span>
        </span>
        {/* Progress bar */}
        <div className="ml-4 flex-1 max-w-[120px] h-1 rounded-full bg-dark-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="mb-6">
        <h2 className="font-serif text-xl text-text-primary leading-relaxed">
          {question.question}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
          {question.questionJa}
        </p>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={getOptionClasses(option.id)}
            onClick={() => handleSelect(option.id)}
            disabled={showResult}
          >
            <div className="flex items-start gap-3">
              {/* Option letter/id indicator */}
              <span
                className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold border transition-colors duration-200 ${
                  showResult && option.id === question.correctAnswer
                    ? "border-success text-success"
                    : showResult && option.id === selectedAnswer
                      ? "border-error text-error"
                      : "border-dark-border text-text-muted"
                }`}
              >
                {option.id.toUpperCase()}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm leading-snug">
                  {option.text}
                </p>
                <p className="mt-0.5 text-xs text-text-muted leading-snug">
                  {option.textJa}
                </p>
              </div>

              {getOptionIcon(option.id)}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation panel */}
      {showResult && (
        <div className="mt-6 p-5 bg-dark-surface rounded-lg border border-dark-border animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-sm font-semibold ${isCorrect ? "text-success" : "text-error"}`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
            <span className="text-xs text-text-muted">
              {isCorrect ? "\u2014 Great job!" : "\u2014 Review the explanation below."}
            </span>
          </div>

          <p className="text-sm text-text-primary leading-relaxed">
            {question.explanation}
          </p>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            {question.explanationJa}
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      {showNavigation && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border border-dark-border text-text-secondary transition-colors duration-200 hover:bg-dark-card hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr; Previous
          </button>

          <button
            onClick={onNext}
            disabled={!onNext}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-dark-base transition-colors duration-200 hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
