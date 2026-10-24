import type { Metadata, Viewport } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
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
