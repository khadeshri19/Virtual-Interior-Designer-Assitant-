import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ChatAssistant } from "@/components/chat/ChatAssistant";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "VD Assistant | AI-Powered Virtual Interior Designer",
  description: "Transform your empty rooms into inspiring homes with AI-powered interior design. Upload a photo and get instant redesigned versions in multiple styles.",
  keywords: ["interior design", "AI design", "room redesign", "virtual designer", "home decoration", "furniture"],
  authors: [{ name: "VD Assistant Team" }],
  openGraph: {
    title: "VD Assistant | AI-Powered Virtual Interior Designer",
    description: "Transform your empty rooms into inspiring homes with AI-powered interior design.",
    type: "website",
    locale: "en_US",
    siteName: "VD Assistant",
  },
  twitter: {
    card: "summary_large_image",
    title: "VD Assistant | AI-Powered Virtual Interior Designer",
    description: "Transform your empty rooms into inspiring homes with AI-powered interior design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ChatAssistant />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
