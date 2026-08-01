import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { RealTimeProvider } from "../lib/context/RealTimeProvider";
import LayoutClientWrapper from "./LayoutClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CityMind AI Karnataka - Admin command center",
  description: "Statewide digital governance command center for local municipal departments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <RealTimeProvider>
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </RealTimeProvider>
      </body>
    </html>
  );
}
