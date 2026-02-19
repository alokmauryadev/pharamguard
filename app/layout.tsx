import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AnalysisProvider } from "@/context/AnalysisContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PharmaGuard | AI Pharmacogenomic Risk Analysis",
  description: "Upload your genomic VCF data and get AI-powered pharmacogenomic risk predictions based on CPIC clinical guidelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen">
        <AnalysisProvider>
          {children}
        </AnalysisProvider>
      </body>
    </html>
  );
}
