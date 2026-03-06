import type { Metadata } from 'next';
import Link from 'next/link';
import { Manrope, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const headingFont = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700', '800'],
});

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Simple Hiring',
  description: 'Notion-native hiring by Simple Systems',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen text-slate-800 antialiased`}
      >
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 shadow-sm">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <span className="brand-heading text-lg font-semibold text-slate-800">Simple Hiring</span>
            </Link>
            <nav className="flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">Pricing</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
