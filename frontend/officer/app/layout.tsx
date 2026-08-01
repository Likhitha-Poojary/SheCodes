import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "../lib/context/LanguageContext";
import { RealTimeProvider } from "../lib/context/RealTimeProvider";
import LayoutClientWrapper from "./LayoutClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CityMind AI Karnataka - Officer Portal",
  description: "Field responder operational tracking and resolution dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <LanguageProvider>
          <RealTimeProvider>
            <LayoutClientWrapper>{children}</LayoutClientWrapper>
          </RealTimeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
