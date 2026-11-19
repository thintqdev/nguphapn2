"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getReadingGuideData,
  stepMatchesMode,
} from "@/lib/readingGuide";
import type { ReadingModeFilter } from "@/lib/readingGuideTypes";
import {
  Check,
  ChevronDown,
  Compass,
  ListChecks,
  Sparkles,
} from "lucide-react";
import ReadingVocabLearner from "./ReadingVocabLearner";

const CHECK_KEY = "n2_reading_checklist";

const SECTIONS = [
  { id: "mindset", label: "Tư duy" },
  { id: "journey", label: "Hành trình" },
  { id: "checklist", label: "Checklist" },
  { id: "vocab", label: "Từ vựng" },
  { id: "themes", label: "Chủ đề" },
] as const;

const MODES: { id: ReadingModeFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "練習", label: "練習" },
  { id: "本番", label: "本番" },
];

function loadChecks(): boolean[] {
  try {
    const raw = localStorage.getItem(CHECK_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(Boolean) : [];
  } catch {
    return [];
  }
}

export default function ReadingGuideClient() {
  const data = useMemo(() => getReadingGuideData(), []);
  const [mode, setMode] = useState<ReadingModeFilter>("all");
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [checks, setChecks] = useState<boolean[]>([]);

  useEffect(() => {
    const saved = loadChecks();
    setChecks(data.exam_checklist.map((_, i) => Boolean(saved[i])));
  }, [data.exam_checklist]);

  function toggleCheck(i: number) {
    setChecks((prev) => {
      const next = data.exam_checklist.map((_, j) =>
        j === i ? !prev[j] : Boolean(prev[j])
      );
      localStorage.setItem(CHECK_KEY, JSON.stringify(next));
      return next;
    });
  }

  const checkedCount = checks.filter(Boolean).length;

  return (
    <div className="space-y-10 animate-fade-in pb-4">
      <header className="space-y-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent mb-1.5">
            読解メソッド
          </p>
          <h1 className="font-serif font-bold text-[1.75rem] sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb] leading-tight">
            Hành trình đọc hiểu N2
          </h1>
          <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-2 max-w-xl leading-relaxed">
            Từ tư duy → trước khi đọc → trong lúc đọc → chọn đáp án. Lọc{" "}
            <span className="font-semibold text-accent-muted">練習</span> /{" "}
            <span className="font-semibold text-accent-muted">本番</span> tùy ngữ cảnh.
          </p>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-black/[0.04] dark:bg-white/[0.06] text-[#5e554c] dark:text-[#c4b7a8] hover:bg-accent/12 hover:text-accent-muted transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="mindset" className="scroll-mt-24 space-y-4">
        <SectionHead
          icon={Sparkles}
          jp="考え方"
          title="Tư duy cốt lõi"
          sub="Ba điểm cần nhớ trước khi luyện đọc"
        />
        <div className="space-y-3">
          {data.core_mindset.map((m, i) => (
            <article
              key={m.title}
              className="relative pl-4 sm:pl-5 border-l-2 border-accent/50"
            >
              <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent" />
              <p className="text-[11px] font-bold text-accent tabular-nums">
                0{i + 1}
              </p>
              <h3 className="font-serif font-bold text-[16px] sm:text-[17px] text-[#1f1a16] dark:text-[#f5f0eb] mt-0.5 leading-snug">
                {m.title}
              </h3>
              {m.description && (
                <p className="text-[13px] text-[#5e554c] dark:text-[#c4b7a8] mt-1.5 leading-relaxed">
                  {m.description}
                </p>
              )}
              {m.modes && (
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {Object.entries(m.modes).map(([k, v]) => (
                    <div key={k} className="rounded-[12px] bg-accent/8 px-3 py-2.5">
                      <p className="text-[11px] font-bold text-accent-muted mb-0.5">
                        {k}
                      </p>
                      <p className="text-[12px] text-[#5e554c] dark:text-[#c4b7a8] leading-relaxed">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="journey" className="scroll-mt-24 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <SectionHead
            icon={Compass}
            jp="流れ"
            title="Hành trình 4 giai đoạn"
            sub="Mở từng bước để xem tín hiệu & mẹo"
          />
          <div className="flex gap-1 p-1 rounded-[12px] bg-black/[0.04] dark:bg-white/[0.06] self-start">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`px-2.5 py-1.5 rounded-[9px] text-[11px] font-bold cursor-pointer transition-all ${
                  mode === m.id
                    ? "bg-white dark:bg-[#1a1714] text-accent shadow-sm"
                    : "text-[#8a8074]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {data.reading_stages.map((stage, si) => {
            const steps = stage.steps.filter((s) => stepMatchesMode(s, mode));
            if (steps.length === 0) return null;
            return (
              <div key={stage.stage_id} className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-accent text-white text-[12px] font-bold flex items-center justify-center">
                    {si + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-serif font-bold text-[16px] sm:text-lg text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                      {stage.name}
                    </h3>
                    {stage.duration && (
                      <p className="text-[11px] font-semibold text-accent-muted mt-0.5">
                        ≈ {stage.duration}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:ml-4 sm:border-l sm:border-black/[0.08] dark:sm:border-white/[0.1] sm:pl-5 space-y-2">
                  {steps.map((step) => {
                    const id = `${stage.stage_id}-${step.step}`;
                    const open = openStep === id;
                    return (
                      <div
                        key={id}
                        className="rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-[#1a1714]/80 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenStep(open ? null : id)}
                          className="w-full flex items-start gap-2 text-left px-3.5 py-3 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                        >
                          <span className="text-[11px] font-bold text-accent tabular-nums shrink-0 pt-0.5">
                            {step.step}
                          </span>
                          <span className="flex-1 min-w-0 font-semibold text-[13px] sm:text-[14px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                            {step.title}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 text-[#8a8074] transition-transform mt-0.5 ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {open && (
                          <div className="px-3.5 pb-3.5 space-y-3 border-t border-black/[0.05] dark:border-white/[0.06] pt-3">
                            {step.modes && (
                              <div className="flex flex-wrap gap-1">
                                {step.modes.map((m) => (
                                  <span
                                    key={m}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-soft text-accent-muted"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                            {step.note && (
                              <p className="text-[12px] leading-relaxed text-accent-muted bg-accent/10 rounded-[10px] px-3 py-2">
                                {step.note}
                              </p>
                            )}
                            {step.details?.map((d, i) => (
                              <p
                                key={i}
                                className="text-[13px] leading-relaxed text-[#5e554c] dark:text-[#c4b7a8]"
                              >
                                {d}
                              </p>
                            ))}
                            {step.clues?.map((c, i) => (
                              <p
                                key={i}
                                className="text-[13px] leading-relaxed text-[#5e554c] dark:text-[#c4b7a8] pl-3 border-l-2 border-accent/35"
                              >
                                {c}
                              </p>
                            ))}
                            {step.signal_groups?.map((g) => (
                              <div key={g.group} className="space-y-2 pt-1">
                                <p className="text-[12px] font-bold text-[#1f1a16] dark:text-[#f5f0eb]">
                                  {g.group}
                                </p>
                                <p className="text-[12px] text-[#70665a] dark:text-[#b8aba0] leading-relaxed">
                                  {g.meaning_and_handling}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {g.signals.map((sig) => (
                                    <span
                                      key={sig}
                                      className="font-serif text-[13px] px-2 py-1 rounded-[8px] bg-[#f5f3ee] dark:bg-[#0d0c0a] border border-black/[0.06] dark:border-white/[0.08]"
                                    >
                                      {sig}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="checklist" className="scroll-mt-24 space-y-4">
        <SectionHead
          icon={ListChecks}
          jp="本番"
          title="Checklist ngày thi"
          sub={`${checkedCount}/${data.exam_checklist.length} đã tick · lưu trên máy`}
        />
        <ul className="space-y-2">
          {data.exam_checklist.map((item, i) => {
            const on = Boolean(checks[i]);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggleCheck(i)}
                  className={`w-full flex items-start gap-3 text-left rounded-[14px] px-3.5 py-3 border transition-all cursor-pointer active:scale-[0.995] ${
                    on
                      ? "border-accent/40 bg-accent/8"
                      : "border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#1a1714]/70"
                  }`}
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 ${
                      on
                        ? "bg-accent text-white"
                        : "border border-black/20 dark:border-white/25"
                    }`}
                  >
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-[13px] leading-relaxed ${
                      on
                        ? "text-[#70665a] dark:text-[#b8aba0] line-through decoration-accent/40"
                        : "text-[#1f1a16] dark:text-[#f5f0eb]"
                    }`}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="vocab" className="scroll-mt-24">
        <ReadingVocabLearner topics={data.topic_vocabulary} />
      </section>

      <section id="themes" className="scroll-mt-24 space-y-4">
        <SectionHead
          icon={Compass}
          jp="予測"
          title="Chủ đề hay ra đề"
          sub="Góc lập luận + keyword để chuẩn bị trước"
        />
        <div className="space-y-4">
          {data.predicted_themes.map((theme, i) => (
            <article
              key={theme.theme_id}
              className="pl-4 border-l-2 border-accent/40 space-y-2"
            >
              <p className="text-[11px] font-bold text-accent">Theme {i + 1}</p>
              <h3 className="font-serif font-bold text-[16px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                {theme.theme_name}
              </h3>
              <p className="text-[13px] text-[#5e554c] dark:text-[#c4b7a8] leading-relaxed">
                {theme.common_argument_angles}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {theme.keywords.map((k) => (
                  <span
                    key={k.word}
                    className="text-[12px] font-serif px-2 py-1 rounded-[8px] bg-accent/10 text-accent-muted"
                    title={`${k.reading} · ${k.meaning}`}
                  >
                    {k.word}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  icon: Icon,
  jp,
  title,
  sub,
}: {
  icon: typeof Sparkles;
  jp: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 w-8 h-8 rounded-[10px] bg-accent/12 text-accent flex items-center justify-center shrink-0">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-[10px] font-bold tracking-wider text-accent uppercase">
          {jp}
        </p>
        <h2 className="font-serif font-bold text-xl text-[#1f1a16] dark:text-[#f5f0eb]">
          {title}
        </h2>
        <p className="text-[12px] text-[#8a8074] mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
