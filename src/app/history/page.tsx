import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import grammarDataRaw from "../../../public/data/grammar.json";
import type { GrammarData } from "@/lib/types";

const data = grammarDataRaw as GrammarData;

export default function HistoryPage() {
  const totalCategories = data.categories.length;
  const totalGrammar = data.grammar.length;

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#1f1a16] dark:text-[#f5f0eb]">
              学習記録
            </h1>
            <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1">
              Tổng quan nội dung học N2
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-3.5 text-center">
              <p className="text-2xl font-bold text-[#1f1a16] dark:text-[#f5f0eb]">
                {totalGrammar}
              </p>
              <p className="text-[11px] text-[#8a8074] mt-0.5">Ngữ pháp</p>
            </div>
            <div className="rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-3.5 text-center">
              <p className="text-2xl font-bold text-[#1f1a16] dark:text-[#f5f0eb]">
                {totalCategories}
              </p>
              <p className="text-[11px] text-[#8a8074] mt-0.5">Nhóm</p>
            </div>
            <div className="rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-3.5 text-center">
              <p className="text-2xl font-bold text-accent">
                N2
              </p>
              <p className="text-[11px] text-[#8a8074] mt-0.5">Mức tiêu</p>
            </div>
          </div>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-3">
              Theo nhóm
            </h2>
            <div className="space-y-3">
              {data.categories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1f1a16] dark:text-[#f5f0eb]">
                      {cat.roman}. {cat.nameVn || cat.name}
                    </span>
                    <span className="text-[11px] text-[#8a8074]">
                      {cat.count} mục
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent/70"
                      style={{
                        width: `${Math.min(100, (cat.count / 20) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
