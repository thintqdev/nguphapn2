"use client";

import { useState, useMemo } from "react";
import type { SpecialVerb } from "@/lib/keigoTypes";
import { CheckCircle2, XCircle, RotateCcw, Award, Sparkles, X } from "lucide-react";

interface Question {
  prompt: string;
  verbPlain: string;
  correctAnswer: string;
  type: "sonkeigo" | "kenjougo1" | "kenjougo2";
  options: string[];
}

export default function KeigoQuizModal({
  verbs,
  isOpen,
  onClose,
}: {
  verbs: SpecialVerb[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Generate 10 quiz questions randomly from verbs
  const questions: Question[] = useMemo(() => {
    if (!verbs || verbs.length === 0) return [];

    // Shuffle verbs
    const shuffled = [...verbs].sort(() => 0.5 - Math.random()).slice(0, 10);

    return shuffled.map((v) => {
      // Pick random question type
      const types: Array<"sonkeigo" | "kenjougo1" | "kenjougo2"> = [
        "sonkeigo",
        "kenjougo1",
        "kenjougo2",
      ];
      const qType = types[Math.floor(Math.random() * types.length)];

      let prompt = "";
      let correctAnswer = "";

      if (qType === "sonkeigo") {
        prompt = `Dạng TÔN KÍNH NGỮ (尊敬語) của động từ「${v.plain}」(${v.meaningVn}) là gì?`;
        correctAnswer = v.sonkeigo;
      } else if (qType === "kenjougo1") {
        prompt = `Dạng KHIÊM NHƯỜNG NGỮ Ⅰ (謙譲語Ⅰ - hướng đối tượng) của「${v.plain}」(${v.meaningVn}) là gì?`;
        correctAnswer = v.kenjougo1;
      } else {
        prompt = `Dạng ĐINH TRỌNG NGỮ Ⅱ (謙譲語Ⅱ / 丁重語) của「${v.plain}」(${v.meaningVn}) là gì?`;
        correctAnswer = v.kenjougo2;
      }

      // Collect distractors from other verbs
      const otherVerbs = verbs.filter((other) => other.id !== v.id);
      const distractors = otherVerbs
        .map((ov) => ov[qType])
        .filter((ans) => ans !== correctAnswer && ans.length > 0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

      return {
        prompt,
        verbPlain: v.plain,
        correctAnswer,
        type: qType,
        options,
      };
    });
  }, [verbs, isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(option);
    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a1714] rounded-[26px] p-6 shadow-2xl border border-black/10 dark:border-white/10 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 flex items-center justify-center text-[#8a8074] dark:text-[#9e9285] transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {!isFinished ? (
          <div>
            {/* Header progress */}
            <div className="flex items-center justify-between mb-4 pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#df6e53] dark:text-[#f39882] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Thử thách Kính ngữ N2</span>
              </span>
              <span className="text-xs font-semibold text-[#8a8074]">
                Câu {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-[#df6e53] to-[#ef927c] transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question prompt */}
            {currentQ && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                  {currentQ.prompt}
                </h3>

                {/* Options list */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === currentQ.correctAnswer;
                    const showResult = selectedOption !== null;

                    let btnStyle =
                      "bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] hover:bg-black/[0.06]";

                    if (showResult) {
                      if (isCorrect) {
                        btnStyle =
                          "bg-[#2e7d58]/15 border-[#2e7d58] text-[#2e7d58] dark:text-[#52c28d] font-bold";
                      } else if (isSelected) {
                        btnStyle =
                          "bg-[#c0392b]/15 border-[#c0392b] text-[#c0392b] dark:text-[#e74c3c]";
                      } else {
                        btnStyle = "opacity-50 border-transparent";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        disabled={showResult}
                        className={`w-full text-left p-3.5 rounded-[16px] border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-serif">{opt}</span>
                        {showResult && isCorrect && (
                          <CheckCircle2 size={16} className="text-[#2e7d58] shrink-0" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle size={16} className="text-[#c0392b] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                {selectedOption !== null && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-[14px] bg-[#df6e53] hover:bg-[#c95d43] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-[#df6e53]/25"
                    >
                      {currentIndex + 1 < questions.length ? "Câu tiếp theo ➔" : "Xem kết quả"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Finished screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882] flex items-center justify-center mx-auto">
              <Award size={36} />
            </div>

            <h3 className="font-serif font-bold text-xl text-[#1f1a16] dark:text-[#f5f0eb]">
              Hoàn thành bài luyện tập!
            </h3>

            <p className="text-sm text-[#70665a] dark:text-[#aaa094]">
              Bạn đã trả lời đúng{" "}
              <span className="font-bold text-[#df6e53] dark:text-[#f39882] text-lg">
                {score} / {questions.length}
              </span>{" "}
              câu hỏi kính ngữ.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-[14px] bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>Làm lại</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-[14px] bg-[#df6e53] text-white text-xs sm:text-sm font-semibold hover:bg-[#c95d43] transition-all cursor-pointer shadow-md shadow-[#df6e53]/25"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
