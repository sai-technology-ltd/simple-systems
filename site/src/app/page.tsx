const principles = [
  {
    index: "01",
    title: "Extreme simplicity",
    description:
      "Every product should make sense in under a minute. If setup needs a walkthrough, it is too complex.",
  },
  {
    index: "02",
    title: "One problem only",
    description:
      "Each tool solves a single operational workflow for a small business. No bundled platforms. No kitchen-sink software.",
  },
  {
    index: "03",
    title: "Built on tools teams already use",
    description:
      "Simple Systems sits on top of Notion, forms, email, and payments instead of replacing a company’s operating system.",
  },
  {
    index: "04",
    title: "Low operational burden",
    description:
      "Products are designed for self-serve setup, minimal support, and predictable maintenance.",
  },
];

const products = [
  {
    name: "Simple Hiring",
    status: "Available now",
    summary: "Collect and manage job applications in Notion.",
  },
  {
    name: "Simple Helpdesk",
    status: "Next in line",
    summary: "Handle customer support requests inside Notion.",
  },
  {
    name: "Simple Intake",
    status: "Planned",
    summary: "Capture and organize inbound client inquiries.",
  },
  {
    name: "Simple Requests",
    status: "Planned",
    summary: "Run internal team request management without extra software.",
  },
  {
    name: "Simple CRM",
    status: "Planned",
    summary: "Keep lightweight client management simple and usable.",
  },
];

const journey = [
  "Understand the product in 60 seconds.",
  "Complete onboarding in about 15 minutes.",
  "Pay once to activate the workspace.",
  "Go live with links, automations, and a test flow.",
];

const channels = [
  "Notion templates, creators, and community distribution",
  "Agency and consultant reseller partnerships",
  "Educational content around practical workflows",
  "Simple niche campaigns for small business operators",
];

const metrics = [
  "Onboarding completion rate",
  "Payment conversion rate",
  "First successful workflow event",
  "Support requests per customer",
  "Total licenses sold across the portfolio",
];

const previewProducts = [
  {
    name: "Simple Hiring",
    summary: "Collect applications and route candidates into Notion.",
    status: "Now",
    active: true,
  },
  {
    name: "Simple Helpdesk",
    summary: "Turn incoming support requests into a calm Notion queue.",
    status: "Next",
    active: false,
  },
  {
    name: "Simple Intake",
    summary: "Capture inquiries without another CRM taking over the process.",
    status: "Later",
    active: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="brand-mark">SS</span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
              Simple Systems
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-zinc-500 md:flex">
            <a href="#products" className="nav-link">Products</a>
            <a href="#approach" className="nav-link">Approach</a>
            <a href="#simple-hiring" className="nav-link">Simple Hiring</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.16),_transparent_32%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_440px] lg:items-center">
          <div className="relative">
            <p className="eyebrow animate-rise">
              Boring, reliable business tools for teams already running on Notion
            </p>
            <h1 className="display animate-rise delay-1 mt-5 max-w-4xl">
              Simple tools for narrow workflows.
              <span className="block text-[rgb(var(--accent-strong))]">
                Built to quietly make money and just work.
              </span>
            </h1>
            <p className="lead animate-rise delay-2 mt-6 max-w-2xl">
              Simple Systems is a product line of low-maintenance, one-time-purchase tools that
              sit on top of platforms small businesses already use. No giant dashboard. No
              enterprise implementation. One problem solved at a time.
            </p>

            <div className="animate-rise delay-3 mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#simple-hiring" className="button-primary">
                Explore Simple Hiring
              </a>
              <a href="#products" className="button-secondary">
                View product roadmap
              </a>
            </div>

            <div className="animate-rise delay-3 mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="trust-pill">Self-serve onboarding</span>
              <span className="trust-pill">One-time payment</span>
              <span className="trust-pill">Notion-native workflows</span>
            </div>

            <div className="animate-rise delay-3 mt-10 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <p className="stat-label">Model</p>
                <p className="stat-value">One-time license</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Primary stack</p>
                <p className="stat-value">Notion, Tally, Postmark, Paystack</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Target customer</p>
                <p className="stat-value">Small teams with simple operations</p>
              </div>
            </div>
          </div>

          <aside className="animate-rise delay-2 relative hidden lg:block">
            <div className="absolute -left-6 top-6 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-56 w-56 rounded-full bg-zinc-200/70 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/60">
              <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Product portfolio</p>
                  <p className="text-xs text-zinc-400">Simple products, shared engine</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>

              <div className="space-y-2 p-3">
                {previewProducts.map((product) => (
                  <div
                    key={product.name}
                    className={`preview-row ${product.active ? "preview-row-active" : ""}`}
                  >
                    <div>
                      <p className="preview-title">{product.name}</p>
                      <p className="preview-copy">{product.summary}</p>
                    </div>
                    <p className="preview-meta">{product.status}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-100 p-3 text-xs text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Forms to API to Notion to email and payment automation
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-zinc-100 bg-white/90 p-6 shadow-sm shadow-zinc-200/50">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="feature-row-light">
                <span className="feature-kicker-light">Purpose</span>
                <p>Build stable cashflow, fund other ventures, and compound distribution leverage.</p>
              </div>
              <div className="feature-row-light">
                <span className="feature-kicker-light">Boundary</span>
                <p>Not a giant platform. These products replace manual processes and brittle spreadsheets.</p>
              </div>
              <div className="feature-row-light">
                <span className="feature-kicker-light">Design rule</span>
                <p>Every offer should feel understandable before a sales call would ever be needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="px-5 py-12 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="section-intro">
            <p className="eyebrow">The operating philosophy</p>
            <h2 className="section-title">Keep the products narrow so the business stays calm.</h2>
            <p className="section-copy">
              Simple Systems is designed around predictable revenue, low support load, and a product
              experience that respects the fact that most small businesses do not want more software.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className={`panel animate-rise ${index > 1 ? "delay-1" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                      {principle.index}
                    </p>
                    <h3 className="mt-3 text-2xl text-zinc-900">{principle.title}</h3>
                  </div>
                  <span className="mini-chip">Core rule</span>
                </div>
                <p className="mt-4 text-base leading-7 text-zinc-500">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="px-5 py-12 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="section-intro split">
            <div>
              <p className="eyebrow">Product portfolio</p>
              <h2 className="section-title">A suite of small tools built on the same engine.</h2>
            </div>
            <p className="section-copy max-w-xl">
              Each product handles one operational job. The backend stays shared. The customer promise
              stays simple. The portfolio gets stronger with every additional workflow shipped.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {products.map((product, index) => (
              <article
                key={product.name}
                className={`product-card animate-rise ${index % 2 === 1 ? "delay-1" : ""}`}
              >
                <span className="mini-chip">{product.status}</span>
                <h3 className="mt-5 text-2xl text-zinc-900">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {product.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="simple-hiring" className="px-5 py-12 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="panel panel-accent animate-rise">
            <p className="eyebrow">First product</p>
            <h2 className="section-title mt-4">Simple Hiring</h2>
            <p className="section-copy mt-4 max-w-2xl">
              Hiring in Notion without the mess. Simple Hiring collects applications, creates
              candidates automatically, places them into stages, sends confirmation emails, and keeps
              everything inside the Notion workspace the business already uses.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="check-card">
                <h3>What it replaces</h3>
                <ul>
                  <li>Manual spreadsheet tracking</li>
                  <li>Messy form exports</li>
                  <li>One-off confirmation emails</li>
                </ul>
              </div>
              <div className="check-card">
                <h3>What it delivers</h3>
                <ul>
                  <li>Application links</li>
                  <li>Candidate automation</li>
                  <li>Notion-native hiring workflow</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid gap-5 border-t border-zinc-200 pt-6 md:grid-cols-4">
              {journey.map((step, index) => (
                <div key={step}>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-900">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <aside id="pricing" className="panel panel-dark animate-rise delay-1 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-300">Pricing</p>
            <div className="mt-4 border-b border-zinc-700 pb-5">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Launch offer</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-6xl leading-none text-white">$349</span>
                <span className="pb-2 text-sm text-zinc-400">one-time license</span>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-zinc-200">
              <p>Includes onboarding, Notion integration, candidate automation, application links, and confirmation emails.</p>
              <p>Optional done-for-you setup can sit beside the core offer without turning the product into a service business.</p>
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Activation flow</p>
              <ol className="mt-4 space-y-3 text-sm text-zinc-100">
                <li>1. Finish onboarding</li>
                <li>2. Activate workspace</li>
                <li>3. Pay with Paystack</li>
                <li>4. Verify payment</li>
                <li>5. Go live</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_1fr]">
          <article className="panel animate-rise">
            <p className="eyebrow">Distribution strategy</p>
            <h2 className="section-title mt-4">Distribution matters more than feature count.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {channels.map((channel) => (
                <div key={channel} className="subtle-card">
                  <p>{channel}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel animate-rise delay-1">
            <p className="eyebrow">Success metrics</p>
            <h2 className="section-title mt-4">Measure proof, not vanity.</h2>
            <ul className="mt-8 space-y-3">
              {metrics.map((metric) => (
                <li key={metric} className="list-row">
                  <span className="list-dot" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-[1.5rem] bg-zinc-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Revenue ambition</p>
              <p className="mt-3 text-2xl text-zinc-900">$5k to $50k+ per month across the portfolio</p>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Growth comes from stacking simple products, not bloating one tool into a heavy platform.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 pb-20 pt-6 md:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="callout animate-rise">
            <div>
              <p className="eyebrow text-orange-300">Long-term vision</p>
              <h2 className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl">
                A quiet portfolio of simple products that just work.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-zinc-300">
              Simple Systems is meant to become a durable revenue engine: lightweight tools, built on
              existing platforms, sold with clear boundaries, and maintained with restraint.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200/80 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>Simple Systems is a product line of narrow, reliable tools for teams already running on Notion.</p>
          <a
            href="https://saitechnology.co"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-zinc-700 transition-colors hover:text-orange-600"
          >
            Built by SAI Technology
          </a>
        </div>
      </footer>
    </main>
  );
}
