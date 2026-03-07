import type { Metadata } from 'next';
import { AppShellHeader } from '@/components/app-shell-header';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simple Hiring | Simple hiring for teams that run on Notion',
  description:
    'Simple Hiring helps teams that run on Notion collect applications, organize candidates, and manage hiring workflows in one simple system.',
  openGraph: {
    title: 'Simple Hiring',
    description:
      'Simple Hiring helps teams that run on Notion collect applications, organize candidates, and manage hiring workflows in one simple system.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800 antialiased">
        <ToastProvider>
          <AppShellHeader />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
