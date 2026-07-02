import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM",
  description: "Contact management for the CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <span className="font-semibold text-zinc-900">CRM</span>
            <nav className="flex gap-4 text-sm text-zinc-600">
              <Link href="/" className="hover:text-zinc-900">
                Contacts
              </Link>
              <Link href="/jobs" className="hover:text-zinc-900">
                Jobs
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
