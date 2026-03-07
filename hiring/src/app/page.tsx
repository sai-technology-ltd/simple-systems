"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Inbox,
  MailCheck,
  ShieldCheck,
  UserRoundSearch,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LANDING_AUDIENCE,
  LANDING_BENEFITS,
  LANDING_FAQS,
  LANDING_HOW_IT_WORKS,
  PRODUCT_SUBTITLE,
  PRODUCT_TAGLINE,
  SIMPLE_HIRING_LAUNCH_PRICE_USD,
  SIMPLE_HIRING_REGULAR_PRICE_USD,
  SITE_NAME,
  SITE_SUBTITLE,
  SITE_TAGLINE,
} from "@/lib/product";

const DASHBOARD_ITEMS = [
  {
    label: "Applications received",
    value: "24",
    detail: "This week",
    tone: "bg-orange-100 text-orange-700",
  },
  {
    label: "Candidates in review",
    value: "12",
    detail: "Across active roles",
    tone: "bg-slate-100 text-slate-700",
  },
  {
    label: "Average response",
    value: "4h",
    detail: "Confirmation workflow",
    tone: "bg-emerald-100 text-emerald-700",
  },
] as const;

const BENEFIT_ICONS = [
  Inbox,
  UserRoundSearch,
  MailCheck,
  Workflow,
  ShieldCheck,
  CircleDollarSign,
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  return (
    <main className="pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_36%)]" />

        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up relative">
            <div className="animate-soft-scale mb-6 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
              <ShieldCheck className="h-4 w-4" />
              Operated by SAI Technology Ltd
            </div>

            <h1 className="animate-fade-up delay-1 text-4xl font-bold leading-[1.05] text-zinc-900 md:text-5xl lg:text-6xl">
              {SITE_TAGLINE}
            </h1>

            <p className="animate-fade-up delay-2 mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
              {SITE_SUBTITLE}
            </p>

            <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex h-11 items-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center rounded-lg border border-zinc-200 px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                How It Works
              </a>
              <a
                href="https://simplesystem.app"
                className="inline-flex h-11 items-center rounded-lg border border-transparent px-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
              >
                Explore Simple Systems
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Built for Notion-based teams
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                One-time license
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Guided setup after purchase
              </span>
            </div>
          </div>

          <div className="animate-soft-scale delay-2 relative hidden lg:block">
            <div className="absolute -left-6 top-6 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-56 w-56 rounded-full bg-zinc-200/70 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/60">
              <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {SITE_NAME}
                  </p>
                  <p className="text-xs text-zinc-400">
                    A hiring workflow for teams already using Notion
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Live in Notion
                </span>
              </div>

              <div className="space-y-3 p-3">
                {DASHBOARD_ITEMS.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border p-4 transition-all duration-500 ${
                      index === 0
                        ? "border-orange-100 bg-orange-50"
                        : "border-transparent bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-zinc-500">{item.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-zinc-900">
                          {item.value}
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${item.tone}`}
                      >
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-100 p-3 text-xs text-zinc-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Set up the workflow, connect Notion, and start receiving
                candidates
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="problem"
        className="border-y border-zinc-100 bg-white px-6 py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
                What Simple Hiring replaces
              </h2>
              <p className="mt-3 text-lg text-zinc-500">
                Simple Hiring replaces spreadsheets, scattered application
                emails, manual candidate tracking, and messy hiring workflows
                with one clear process in Notion.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {LANDING_BENEFITS.map((item, index) => {
                const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];

                return (
                  <div
                    key={item.title}
                    className="animate-fade-up hover-lift flex aspect-square flex-col rounded-2xl border border-zinc-100 bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <Icon className="h-5 w-5 text-orange-500" />
                      </div>
                      {/*<span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                        Workflow
                      </span>*/}
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-xl font-semibold leading-tight text-zinc-900">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            id="pricing"
            className="animate-soft-scale flex min-h-[420px] flex-col rounded-3xl bg-zinc-900 p-8 text-white lg:aspect-square"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-300">
                  Pricing
                </p>
                <h3 className="mt-4 text-2xl font-semibold">Simple Hiring</h3>
              </div>
              <div className="inline-flex items-center rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-orange-200">
                Launch offer
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-3">
              <span className="text-base text-zinc-500 line-through">
                {formatCurrency(SIMPLE_HIRING_REGULAR_PRICE_USD)}
              </span>
              <span className="text-5xl font-bold leading-none">
                {formatCurrency(SIMPLE_HIRING_LAUNCH_PRICE_USD)}
              </span>
              <span className="pb-1 text-sm text-zinc-400">
                one-time license
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-300">
              Launch price for early customers. Regular price{" "}
              {formatCurrency(SIMPLE_HIRING_REGULAR_PRICE_USD)}.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-zinc-200">
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Hiring workflow setup
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Application system
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Candidate automation
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Email confirmations
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                Optional done-for-you setup
              </li>
            </ul>

            <div className="mt-auto pt-8">
              <p className="text-sm leading-6 text-zinc-300">
                Includes the application system, candidate automation, and
                confirmation emails when enabled.
              </p>

              <div className="mt-6 space-y-3">
                <Link href="/onboarding">
                  <Button
                    size="lg"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="mailto:support@simplesystems.app"
                  className="block text-center text-sm text-zinc-300 hover:text-white"
                >
                  support@simplesystems.app
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              The hiring workflow
            </h2>
            <p className="mt-3 text-lg text-zinc-500">
              Share an application form, receive applications, create candidates
              in Notion, move them through hiring stages, and manage the entire
              workflow in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {LANDING_BENEFITS.slice(0, 4).map((item, index) => {
              const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];

              return (
                <div
                  key={item.title}
                  className="animate-fade-up hover-lift rounded-2xl border border-zinc-100 bg-white p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-zinc-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-zinc-100 bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-lg text-zinc-500">
              Set up the workspace, connect Notion, share your application link,
              and start receiving candidates.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {LANDING_HOW_IT_WORKS.map((item, index) => (
              <div
                key={item.title}
                className="animate-fade-up hover-lift rounded-2xl border border-zinc-100 bg-white p-8"
              >
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              {PRODUCT_TAGLINE}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-zinc-500">
              {PRODUCT_SUBTITLE}
            </p>

            <div className="mt-8 space-y-4">
              {LANDING_AUDIENCE.map((item) => (
                <div
                  key={item}
                  className="animate-fade-up hover-lift flex gap-3 rounded-xl border border-zinc-100 bg-white p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm text-zinc-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">
              After purchase
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-zinc-900">
              What happens next
            </h3>
            <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-600">
              <p>You receive setup details by email.</p>
              <p>
                You connect your Notion workspace and choose the databases for
                candidates, roles, and stages.
              </p>
              <p>
                You review your application links and go live with a hiring
                workflow your team can run inside Notion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900">
            Questions
          </h2>
          <div className="mt-10 space-y-4">
            {LANDING_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-100"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                  <span className="font-medium text-zinc-900">
                    {faq.question}
                  </span>
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
            Simple hiring for teams that run on Notion
          </h2>
          <p className="mt-3 text-lg text-zinc-500">
            Buy once, set up the workflow, and start managing applications and
            candidates in one simple system your team can maintain.
          </p>
          <div className="mt-8">
            <Link href="/onboarding">
              <Button size="lg" className="bg-zinc-900 px-8 hover:bg-zinc-800">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl border border-zinc-100 bg-zinc-50 p-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">
              Part of the suite
            </p>
            <h2 className="mt-4 text-3xl font-bold text-zinc-900">
              Simple Hiring is the first live Simple Systems workflow.
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-500">
              If you want the broader product story, upcoming workflows, or a
              clearer view of how the suite fits together, visit the Simple
              Systems marketing site.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://simplesystem.app"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Visit Simple Systems
            </a>
            <a
              href="mailto:support@simplesystems.app"
              className="text-center text-sm text-zinc-500 hover:text-zinc-900"
            >
              support@simplesystems.app
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900">Simple Hiring</p>
            <p className="text-sm text-zinc-500">
              A Simple Systems product operated by SAI Technology Ltd, Accra,
              Ghana
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <a href="https://simplesystem.app" className="hover:text-zinc-900">
              Simple Systems
            </a>
            <Link href="/privacy-policy" className="hover:text-zinc-900">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-zinc-900">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-zinc-900">
              Refund Policy
            </Link>
            <a
              href="mailto:support@simplesystems.app"
              className="hover:text-zinc-900"
            >
              support@simplesystems.app
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
