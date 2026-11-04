import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FavoritesProvider } from "@/components/FavoritesContext";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "N2 文法 - JLPT N2 日本語文法",
  description: "JLPT N2の文法を、やさしく、わかりやすく。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('n2_theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    var skins = ['terracotta','matcha','ai','ume','kincha','sora'];
    var s = localStorage.getItem('n2_skin');
    if (!s || skins.indexOf(s) === -1) s = 'terracotta';
    document.documentElement.setAttribute('data-skin', s);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <Script id="n2-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <FavoritesProvider>
            {children}
            <BottomTabBar />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
