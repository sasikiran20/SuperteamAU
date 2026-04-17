import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/smooth-scroll";
import { StairsTransitionProvider } from "@/components/transitions/stairs-transition";
import Header from "@/components/nav/header";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superteam Australia | Building Solana in Australia",
  description:
    "Accelerating builders, founders, creatives and institutions working towards internet capital markets on Solana in Australia.",
  openGraph: {
    title: "Superteam Australia",
    description:
      "Accelerating builders, founders, creatives and institutions working towards internet capital markets on Solana.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Superteam Australia",
    description:
      "Accelerating builders, founders, creatives and institutions working towards internet capital markets on Solana.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SmoothScrollProvider>
          <StairsTransitionProvider>
            <Header />
            {children}
          </StairsTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
