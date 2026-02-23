"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileText, BarChart3, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/logs', label: 'Logs', icon: FileText },
  { href: '/metrics', label: 'Metrics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-64 bg-white border-r border-zinc-200">
      <div className="flex h-16 items-center px-6 border-b border-zinc-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">SS</span>
          </div>
          <span className="text-sm font-semibold text-zinc-900">Simple Systems</span>
        </Link>
      </div>
      
      <nav className="p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive && "text-orange-600")} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-zinc-50">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">Operator</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-xl px-8">
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
          <Zap className="w-3 h-3" />
          Staging
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          All systems operational
        </div>
      </div>
    </header>
  );
}
