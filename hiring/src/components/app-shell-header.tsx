"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BriefcaseBusiness, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const appNav = [
  { href: "/onboarding", label: "Setup", icon: Sparkles },
  { href: "/roles", label: "Workspace", icon: BriefcaseBusiness },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShellHeader() {
  const pathname = usePathname();
  const isMarketingHome = pathname === "/";
  const isApplicationPage = pathname.startsWith("/apply/");

  if (isMarketingHome) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 shadow-sm">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="brand-heading text-lg font-semibold text-slate-800">Simple Hiring</span>
          </Link>
          <nav className="flex items-center gap-8">
            <a href="#workflow" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">Workflow</a>
            <a href="#problem" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">Problem</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">Pricing</a>
          </nav>
        </div>
      </header>
    );
  }

  if (isApplicationPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              SS
            </div>
            <div>
              <p className="brand-heading text-sm font-semibold text-slate-900">Simple Hiring</p>
              <p className="text-xs text-slate-500">Application form</p>
            </div>
          </Link>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Secure submission
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-[rgba(248,250,252,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm shadow-slate-900/15">
            SS
          </div>
          <div>
            <p className="brand-heading text-sm font-semibold text-slate-900">Simple Hiring</p>
            <p className="text-xs text-slate-500">Workspace app</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {appNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
        >
          View site
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
