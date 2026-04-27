import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RateMyRestroom",
  description: "Find and rate restrooms at your college campus.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader user={user} />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-gray-50 py-8 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-base font-black tracking-tight">
              <span className="text-gray-900">RateMy</span>
              <span className="text-primary">Restroom</span>
            </span>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/schools" className="hover:text-primary transition-colors">Schools</Link>
              <Link href="/signup" className="hover:text-primary transition-colors">Sign up</Link>
              <Link href="/login" className="hover:text-primary transition-colors">Log in</Link>
            </div>
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} RateMyRestroom</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
