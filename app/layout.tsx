import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeRegistry from './ThemeRegistry';
import SWRegister from './sw-register';
import "./globals.css";

const base = process.env.NEXT_PUBLIC_GITHUB_ACTIONS === "true" ? "/accum-sim" : "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "積立シミュレーション - 資産運用・逆算シミュレータ (PWA)",
  description: "毎月の積立額から将来の資産額を計算するシミュレーションと、目標金額から必要な積立額・期間・利回りを逆算する高機能なPWA対応シミュレータです。",
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: "積立シミュ",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: `${base}/icon-192x192.png`, sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: `${base}/icon-192x192.png`, sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0529e1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <SWRegister />
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
