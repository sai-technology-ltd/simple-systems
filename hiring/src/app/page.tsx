"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Database,
  Link2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LANDING_AUDIENCE,
  LANDING_FAQS,
  LANDING_HOW_IT_WORKS,
  ONE_TIME_PRICE_USD,
  PRODUCT_SUBTITLE,
  PRODUCT_TAGLINE,
} from "@/lib/product";

const APPLICATIONS = [
  {
    name: "Sarah Johnson",
    role: "Operations Assistant",
    time: "2m ago",
    status: "new",
  },
  {
    name: "Mike Chen",
    role: "Client Success Lead",
    time: "14m ago",
    status: "reviewing",
  },
  {
    name: "Emily Davis",
    role: "Project Coordinator",
    time: "1h ago",
    status: "interview",
  },
  {
    name: "James Wilson",
    role: "Studio Manager",
    time: "3h ago",
    status: "new",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [appIndex, setAppIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAppIndex((current) => (current + 1) % APPLICATIONS.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_36%)]" />

        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up relative">
            <div className="animate-soft-scale mb-6 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
              <Sparkles className="h-4 w-4" />
              Notion-native hiring for small teams
            </div>

            <h1 className="animate-fade-up delay-1 text-4xl font-bold leading-[1.05] text-zinc-900 md:text-5xl lg:text-6xl">
              {PRODUCT_TAGLINE}
            </h1>

            <p className="animate-fade-up delay-2 mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
              {PRODUCT_SUBTITLE}
            </p>

            <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button size="lg" className="bg-zinc-900 px-6 hover:bg-zinc-800">
                  Start setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center rounded-lg border border-zinc-200 px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                View pricing
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Guided onboarding
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Pay only when ready to go live
              </span>
            </div>
          </div>

          <div className="animate-soft-scale delay-2 relative hidden lg:block">
            <div className="absolute -left-6 top-6 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-56 w-56 rounded-full bg-zinc-200/70 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/60">
              <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Hiring pipeline</p>
                  <p className="text-xs text-zinc-400">Lives in your Notion workspace</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>

              <div className="space-y-2 p-3">
                {APPLICATIONS.map((application, index) => (
                  <div
                    key={application.name}
                    className={`rounded-xl border p-3 transition-all duration-500 ${
                      appIndex === index
                        ? "border-orange-100 bg-orange-50"
                        : "border-transparent bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                            application.status === "interview"
                              ? "bg-emerald-100 text-emerald-700"
                              : application.status === "reviewing"
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {application.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{application.name}</p>
                          <p className="text-xs text-zinc-500">{application.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium capitalize text-zinc-700">
                          {application.status}
                        </p>
                        <p className="text-xs text-zinc-400">{application.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-100 p-3 text-xs text-zinc-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Application saved to Notion and confirmation email sent
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-zinc-100 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">How it works</h2>
            <p className="mt-3 text-lg text-zinc-500">
              A calm, guided setup built for teams that already work inside Notion.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {LANDING_HOW_IT_WORKS.map((item, index) => {
              const Icon = index === 0 ? Link2 : index === 1 ? Database : CreditCard;

              return (
                <div key={item.title} className="animate-fade-up hover-lift rounded-2xl border border-zinc-100 bg-white p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                    <Icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-3 text-zinc-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">Who it&apos;s for</h2>
            <p className="mt-3 max-w-2xl text-lg text-zinc-500">
              Simple Hiring is for small businesses, agencies, and operators who want a reliable hiring workflow without adopting a full ATS.
            </p>

            <div className="mt-8 space-y-4">
              {LANDING_AUDIENCE.map((item) => (
                <div key={item} className="animate-fade-up hover-lift flex gap-3 rounded-xl border border-zinc-100 bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm text-zinc-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="pricing" className="animate-soft-scale rounded-3xl bg-zinc-900 p-8 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-300">Pricing</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold">{formatCurrency(ONE_TIME_PRICE_USD)}</span>
              <span className="pb-2 text-sm text-zinc-400">one-time activation</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              Finish setup first. Pay only when you are ready to activate live application links and automation.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-zinc-200">
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Guided onboarding for company setup, connection, and validation
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Live role-specific application links after activation
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Transactional confirmation emails sent through Simple Hiring
              </li>
            </ul>

            <div className="mt-8">
              <Link href="/onboarding">
                <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700">
                  Start onboarding
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900">Questions</h2>
          <div className="mt-10 space-y-4">
            {LANDING_FAQS.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-zinc-100">
                <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                  <span className="font-medium text-zinc-900">{faq.question}</span>
                  <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-zinc-500">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            Turn Notion into your hiring system
          </h2>
          <p className="mt-3 text-lg text-zinc-500">
            Setup is guided, activation is one-time, and your workflow stays in the tools you already use.
          </p>
          <div className="mt-8">
            <Link href="/onboarding">
              <Button size="lg" className="bg-zinc-900 px-8 hover:bg-zinc-800">
                Start setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="#" className="hover:text-zinc-900">
              Terms
            </Link>
            <Link href="mailto:support@simplehiring.app" className="hover:text-zinc-900">
              Support
            </Link>
          </div>
          <p className="text-sm text-zinc-400">© 2026 Simple Hiring</p>
        </div>
      </footer>
    </main>
  );
}
