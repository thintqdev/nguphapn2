import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KeigoView from "@/components/keigo/KeigoView";
import { keigoData } from "@/lib/keigo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "敬語・謙譲語マスター | JLPT N2 Kính ngữ",
  description:
    "Bảng tra cứu Tôn kính ngữ (Sonkeigo), Khiêm nhường ngữ (Kenjougo), Đinh trọng ngữ, công thức biến đổi và cụm từ thương mại phục vụ kỳ thi JLPT N2.",
};

export default function KeigoPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* iOS Translucent Navigation Bar */}
        <Header backHref="/" backLabel="ホームに戻る" />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <KeigoView data={keigoData} />
        </main>
      </div>
    </div>
  );
}
