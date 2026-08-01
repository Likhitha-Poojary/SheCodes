import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "../context/LanguageContext";
import { AccessibilityProvider } from "../context/AccessibilityContext";
import { RealTimeStatusProvider } from "../utils/websocket";
import LayoutClientWrapper from "./LayoutClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CityMind AI Karnataka - Citizen Portal",
  description: "Report civic grievances, track field responders, and receive AI-driven redressal resolutions in Karnataka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 transition-colors duration-300`}>
        <LanguageProvider>
          <AccessibilityProvider>
            <RealTimeStatusProvider>
              <LayoutClientWrapper>{children}</LayoutClientWrapper>
            </RealTimeStatusProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
