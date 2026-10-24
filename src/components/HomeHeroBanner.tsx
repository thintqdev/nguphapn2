export default function HomeHeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-[20px] sm:rounded-[26px] bg-gradient-to-r from-[#d8e7ee] via-[#f1e6e0] to-[#fceee8] dark:from-[#1b2b36] dark:via-[#2b2220] dark:to-[#382321] border border-black/[0.06] dark:border-white/[0.09] ios-card-shadow mb-4 sm:mb-6 transition-all duration-300">
      {/* Background artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"
          alt="Fuji cherry blossom landscape"
          className="w-full h-full object-cover object-[center_35%] opacity-45 dark:opacity-25 mix-blend-multiply dark:mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f5]/92 dark:from-[#14110f]/92 via-[#fbf8f5]/65 dark:via-[#14110f]/65 to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#fedde5]/30 dark:from-[#e26d85]/10 to-transparent pointer-events-none" />
      </div>

      {/* Decorative cherry blossom petals */}
      <div className="absolute top-4 right-5 sm:top-5 sm:right-8 pointer-events-none text-xl sm:text-2xl opacity-60 select-none animate-pulse">
        🌸
      </div>
      <div className="absolute bottom-4 right-12 sm:bottom-6 sm:right-20 pointer-events-none text-base sm:text-xl opacity-40 select-none">
        🌸
      </div>

      {/* Content Area */}
      <div className="relative z-10 py-6 px-5 sm:py-10 sm:px-12 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.1] backdrop-blur-md text-[#a44d36] dark:text-[#f39882] text-[10px] sm:text-[11px] font-semibold tracking-wider mb-2.5 sm:mb-3.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a44d36] dark:bg-[#f39882]" />
          <span>日本語能力試験対策</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-[#1e1915] dark:text-[#f5f0eb] tracking-tight mb-1.5 sm:mb-2.5">
          N2 文法
        </h2>
        <p className="font-serif text-xs sm:text-base text-[#6f6458] dark:text-[#aba093] leading-relaxed">
          JLPT N2 の文法を、やさしく、わかりやすく。
        </p>
      </div>
    </div>
  );
}
