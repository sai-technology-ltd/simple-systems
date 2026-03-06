import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simple Hiring',
  description: 'Notion-native hiring by Simple Systems',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <span className="text-lg font-semibold text-zinc-900">Simple Hiring</span>
            </Link>
            <nav className="flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Pricing</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
