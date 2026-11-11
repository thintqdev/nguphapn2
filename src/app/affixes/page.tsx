import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AffixClient from "@/components/affix/AffixClient";
import { getAffixData, getAllAffixes } from "@/lib/affixes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiền tố & Hậu tố N2 | JLPT 接辞",
  description:
    "Học 60 tiền tố & hậu tố JLPT N2: study desk từng chữ và quiz ví dụ.",
};

export default function AffixesPage() {
  const data = getAffixData();
  const items = getAllAffixes();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <AffixClient items={items} title={data.title} />
        </main>
      </div>
    </div>
  );
}
