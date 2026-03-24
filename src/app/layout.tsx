import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Musify",
  description: "Your personal music streaming app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}>
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}