import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "G-Wagon - 군인 가족을 위한 PX 지도",
  description:
    "전국 군마트(PX) 위치, 신분 확인, 실시간 운영 정보를 제공합니다.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import Header from "@/components/Layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased h-screen w-screen overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </body>
    </html>
  );
}
