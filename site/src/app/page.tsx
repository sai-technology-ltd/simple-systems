import Link from "next/link";

const products = [
  {
    name: "Simple Hiring",
    status: "Available now",
    summary: "A hiring workflow for teams that already run on Notion.",
    description:
      "Collect applications, organize candidates, and manage hiring stages directly inside your Notion workspace.",
    ctaLabel: "Open Simple Hiring",
    ctaHref: "https://simplehiring.app",
    featured: true,
  },
  {
    name: "Simple Helpdesk",
    status: "Coming soon",
    summary:
      "A support workflow for teams that want clear ownership and structured request handling in Notion.",
    description:
      "Capture support requests, assign owners, and keep follow-up visible without adding another platform.",
    ctaLabel: "Join the waitlist",
    ctaHref: "mailto:support@simplesystems.app?subject=Simple%20Helpdesk",
    featured: false,
  },
  {
    name: "Simple Intake",
    status: "Planned",
    summary:
      "A submission and review workflow for recurring intake processes.",
    description:
      "Collect structured submissions, review them in order, and keep internal follow-up clear in Notion.",
    ctaLabel: "Ask about access",
    ctaHref: "mailto:support@simplesystems.app?subject=Simple%20Intake",
    featured: false,
  },
  {
    name: "Simple Requests",
    status: "Planned",
    summary:
      "A request workflow for teams that need a clear way to submit, route, and track work.",
    description:
      "Replace ad hoc request handling with a simple operating system built around submission, ownership, and status.",
    ctaLabel: "Ask about access",
    ctaHref: "mailto:support@simplesystems.app?subject=Simple%20Requests",
    featured: false,
  },
  {
    name: "Simple CRM",
    status: "Planned",
    summary:
      "A lightweight CRM workflow for teams that want visible follow-up in Notion.",
    description:
      "Keep leads, conversations, and next steps organized with a focused customer workflow rather than a heavy sales platform.",
    ctaLabel: "Ask about access",
    ctaHref: "mailto:support@simplesystems.app?subject=Simple%20CRM",
    featured: false,
  },
] as const;

const principles = [
  {
    title: "Built for Notion-based teams",
    copy:
      "Every system is designed to live inside the workspace your team already uses each day.",
  },
  {
    title: "Focused workflows",
    copy:
      "Each product solves one operational problem well instead of bundling extra software administration.",
  },
  {
    title: "Practical setup",
    copy:
      "The goal is to help teams get to a working process quickly, with clear structure and low ongoing complexity.",
  },
] as const;

const stats = [
  { label: "Flagship product", value: "Simple Hiring" },
  { label: "Delivery model", value: "Focused Notion workflows" },
  { label: "Buying motion", value: "Start with one system" },
] as const;

const steps = [
  {
    title: "Choose the workflow you need",
    description:
      "Start with the operational system that solves the clearest problem in your current process.",
  },
  {
    title: "Set up the workspace",
    description:
      "Configure the workflow structure so it matches how your team already operates in Notion.",
  },
  {
    title: "Launch with clarity",
    description:
      "Share the relevant form, request flow, or operating view and begin using the system day to day.",
  },
  {
    title: "Expand only when needed",
    description:
      "Add another Simple Systems workflow later if another operational area needs the same level of clarity.",
  },
] as const;

const faqs = [
  {
    question: "Who is Simple Systems for?",
    answer:
      "Simple Systems is for companies that already run on Notion and want lightweight operational workflows without moving work into a heavy SaaS platform.",
  },
  {
    question: "Which product can I use today?",
    answer:
      "Simple Hiring is the first live product. The broader site explains the product line, while Simple Hiring has its own dedicated onboarding and product experience.",
  },
  {
    question: "Do all products work inside Notion?",
    answer:
      "Yes. The product line is built around teams that want their working process to remain visible inside Notion.",
  },
  {
    question: "How do I start?",
    answer:
      "If hiring is your immediate need, go directly to Simple Hiring. For upcoming products, contact support to join the waitlist or ask about access.",
  },
] as const;

const flagshipBenefits = [
  "Live product with its own onboarding flow and public application pages",
  "One-time license model for teams that want simple adoption",
  "Clear bridge from the Simple Systems marketing site into the hiring experience",
] as const;

export default function Home() {
  return (
    <main className="pt-6 md:pt-8">
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              SS
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Simple Systems
              </p>
              <p className="text-xs text-zinc-500">
                Operational systems for Notion-based teams
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-zinc-500 md:flex">
            <a href="#products" className="hover:text-zinc-900">
              Products
            </a>
            <a href="#flagship" className="hover:text-zinc-900">
              Simple Hiring
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900">
              How it works
            </a>
            <a href="#faq" className="hover:text-zinc-900">
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_34%)]" />

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:items-center">
          <div className="animate-fade-up relative">
            <div className="animate-soft-scale mb-6 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
              Operated by SAI Technology Ltd
            </div>

            <h1 className="brand-heading animate-fade-up delay-1 max-w-4xl text-4xl font-bold leading-[1.02] text-zinc-900 md:text-5xl lg:text-6xl">
              Simple systems for teams that already run on Notion.
            </h1>

            <p className="animate-fade-up delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
              Simple Systems is the product line behind focused operational
              workflows like Simple Hiring. Start with one clear system, keep
              work inside Notion, and avoid adding bloated software to your
              stack.
            </p>

            <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
              <a
                href="https://simplehiring.app"
                className="inline-flex h-11 items-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Visit Simple Hiring
              </a>
              <a
                href="#products"
                className="inline-flex h-11 items-center rounded-lg border border-zinc-200 px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Explore the suite
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Built for Notion-based teams
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                One focused workflow at a time
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Bridge from brand site to product site
              </span>
            </div>
          </div>

          <aside className="animate-soft-scale delay-2 app-surface relative rounded-3xl p-5">
            <div className="absolute -left-6 top-6 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Product suite overview
                  </p>
                  <p className="text-xs text-zinc-400">
                    Simple Systems product line
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Simple Hiring live
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {stats.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl border p-4 ${
                      index === 0
                        ? "border-orange-100 bg-orange-50"
                        : "border-zinc-100 bg-white"
                    }`}
                  >
                    <p className="text-sm text-zinc-500">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-zinc-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Best entry point
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  If hiring is the workflow you need now, move straight into the
                  dedicated Simple Hiring site for product details and setup.
                </p>
                <a
                  href="https://simplehiring.app"
                  className="mt-4 inline-flex text-sm font-medium text-zinc-900 hover:text-orange-600"
                >
                  Go to simplehiring.app
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-zinc-100 bg-white/88 p-6 shadow-sm shadow-zinc-200/50">
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((item) => (
              <div key={item.title} className="app-surface-muted rounded-2xl p-5">
                <p className="app-kicker">Principle</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="app-kicker">Products</p>
            <h2 className="brand-heading mt-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              A small suite of operational systems with one consistent model.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-500">
              Each product is narrow by design: one workflow, one clear
              structure, and a setup path that fits how Notion teams already
              work.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className={`hover-lift rounded-3xl border p-6 ${
                  product.featured
                    ? "border-orange-100 bg-orange-50/70"
                    : "border-zinc-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {product.featured ? "Flagship" : "Roadmap"}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                    {product.status}
                  </span>
                </div>

                <h3 className="brand-heading mt-5 text-2xl font-semibold text-zinc-900">
                  {product.name}
                </h3>
                <p className="mt-3 text-base font-medium leading-7 text-zinc-700">
                  {product.summary}
                </p>
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {product.description}
                </p>

                <a
                  href={product.ctaHref}
                  className="mt-8 inline-flex text-sm font-medium text-zinc-900 hover:text-orange-600"
                >
                  {product.ctaLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="flagship"
        className="border-y border-zinc-100 bg-white/72 px-6 py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <p className="app-kicker">Simple Hiring</p>
            <h2 className="brand-heading mt-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              A dedicated product site for the first live Simple Systems
              workflow.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-500">
              Simple Hiring has its own product experience because teams buying
              a hiring workflow need a direct path into onboarding, setup, and
              activation. The brand site introduces the suite. The product site
              gets customers into the workflow.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {flagshipBenefits.map((item) => (
                <div
                  key={item}
                  className="hover-lift rounded-2xl border border-zinc-100 bg-white p-5"
                >
                  <p className="text-sm leading-6 text-zinc-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="app-surface rounded-3xl bg-zinc-900 p-8 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-300">
              Cross-site path
            </p>
            <h3 className="brand-heading mt-4 text-2xl font-semibold">
              Start on Simple Systems. Convert on Simple Hiring.
            </h3>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              The two sites now support each other: this site frames the product
              suite, and Simple Hiring links back to the wider Simple Systems
              story for teams that want to understand the product line.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-zinc-200">
              <li>Simple Systems explains the suite and product philosophy.</li>
              <li>Simple Hiring handles buying intent and onboarding.</li>
              <li>Support remains shared at support@simplesystems.app.</li>
            </ul>

            <div className="mt-8 space-y-3">
              <a
                href="https://simplehiring.app"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-orange-600 px-6 text-sm font-medium text-white hover:bg-orange-700"
              >
                Open Simple Hiring
              </a>
              <a
                href="mailto:support@simplesystems.app?subject=Simple%20Systems"
                className="block text-center text-sm text-zinc-300 hover:text-white"
              >
                Talk to support
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="app-kicker">How it works</p>
            <h2 className="brand-heading mt-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              A clean journey from product discovery to live workflow.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-500">
              The brand site gives context, the product site handles the
              purchase path, and the workflow stays inside Notion where your
              team already operates.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="hover-lift rounded-3xl border border-zinc-100 bg-white p-6"
              >
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Step {index + 1}
                </p>
                <h3 className="brand-heading mt-4 text-xl font-semibold text-zinc-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article>
            <p className="app-kicker">FAQ</p>
            <h2 className="brand-heading mt-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              Questions before choosing a Simple Systems workflow.
            </h2>

            <div className="mt-8 space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-5"
                >
                  <summary className="cursor-pointer list-none text-lg font-semibold text-zinc-900">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl bg-zinc-900 p-8 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-300">
              Operator
            </p>
            <h3 className="brand-heading mt-4 text-2xl font-semibold">
              SAI Technology Ltd
            </h3>
            <div className="mt-4 space-y-2 text-sm text-zinc-300">
              <p>Accra, Ghana</p>
              <a
                href="mailto:support@simplesystems.app"
                className="hover:text-white"
              >
                support@simplesystems.app
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-white/5 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Best next step
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                If you are evaluating the hiring workflow specifically, skip the
                extra clicks and go straight to the dedicated Simple Hiring
                experience.
              </p>
              <a
                href="https://simplehiring.app"
                className="mt-4 inline-flex text-sm font-medium text-orange-300 hover:text-orange-200"
              >
                Visit simplehiring.app
              </a>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900">Simple Systems</p>
            <p className="text-sm text-zinc-500">
              A Simple Systems product line operated by SAI Technology Ltd,
              Accra, Ghana
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <a href="https://simplehiring.app" className="hover:text-zinc-900">
              Simple Hiring
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
