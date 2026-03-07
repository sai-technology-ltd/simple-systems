const outcomes = [
  "Applications land in Notion automatically",
  "Each candidate is attached to the right role and first stage",
  "Confirmation emails can send without manual follow-up",
];

const flow = [
  {
    title: "Tally captures the form",
    copy:
      "Use Tally for the public application form. It handles the form UI, submission layer, and webhook delivery.",
  },
  {
    title: "Simple Systems verifies and routes",
    copy:
      "A signed webhook hits the Simple Systems API, which validates the payload and creates the candidate in your workspace.",
  },
  {
    title: "Notion stays the system of record",
    copy:
      "Your team reviews candidates, stages them, and keeps hiring operations inside the Notion databases you already use.",
  },
];

const setup = [
  "Create a Tally form for the role.",
  "Add fields for name and email. Phone, CV URL, and notes are optional.",
  "Include a hidden `roleId` value so the submission attaches to the right Notion role.",
  "Point the webhook to your Simple Systems Tally endpoint and add the signing secret.",
];

const privacy = [
  {
    title: "Form layer",
    copy:
      "Tally handles the hosted form and secures the public submission experience. Their privacy and security policies apply at that layer.",
  },
  {
    title: "Processing layer",
    copy:
      "Simple Systems receives the signed webhook, validates it, and routes the submission into your connected workspace.",
  },
  {
    title: "Workspace layer",
    copy:
      "Candidate records live in your Notion workspace. Simple Systems is not trying to become another long-term ATS database.",
  },
];

const pricing = [
  {
    tool: "Simple Hiring",
    price: "$349 once",
    note: "One-time license for the product itself.",
  },
  {
    tool: "Tally",
    price: "Free to start",
    note: "Webhooks are available on the free plan. Pro is $29/mo and Business is $89/mo if you need more control.",
  },
  {
    tool: "Notion",
    price: "Free to start",
    note: "Free is often enough for a lean setup. Plus starts at $10/member/mo when the workspace needs more.",
  },
  {
    tool: "Postmark",
    price: "Optional",
    note: "100 emails/month free for testing and low volume. Paid plans start at $15/mo if you need more email volume.",
  },
  {
    tool: "Paystack",
    price: "No setup fee",
    note: "Used for the Simple Systems checkout. Paystack charges transaction fees on live payments.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="brand-mark">SS</span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900">
              Simple Systems
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-zinc-500 md:flex">
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#tally" className="nav-link">
              Tally
            </a>
            <a href="#privacy" className="nav-link">
              Privacy
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.16),_transparent_34%)]" />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="relative">
            <p className="eyebrow animate-rise">Simple Hiring</p>
            <h1 className="display animate-rise delay-1 mt-5 max-w-4xl">
              Hiring in Notion,
              <span className="block text-[rgb(var(--accent-strong))]">
                with Tally handling the front door.
              </span>
            </h1>
            <p className="lead animate-rise delay-2 mt-6 max-w-2xl">
              Simple Hiring gives small teams a clean hiring workflow without adding a heavyweight ATS.
              Tally collects the application, Simple Systems routes it, and Notion stays where the work happens.
            </p>

            <div className="animate-rise delay-3 mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#pricing" className="button-primary">
                See pricing
              </a>
              <a href="#tally" className="button-secondary">
                View Tally setup
              </a>
            </div>

            <div className="animate-rise delay-3 mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="trust-pill">Tally webhook flow</span>
              <span className="trust-pill">Notion-native hiring</span>
              <span className="trust-pill">Usually no extra SaaS cost to start</span>
            </div>
          </div>

          <aside className="panel animate-rise delay-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Stack
            </p>
            <div className="mt-5 space-y-4">
              <div className="preview-row preview-row-active">
                <div>
                  <p className="preview-title">Tally</p>
                  <p className="preview-copy">Hosted application form and signed webhook trigger.</p>
                </div>
                <p className="preview-meta">Input</p>
              </div>
              <div className="preview-row">
                <div>
                  <p className="preview-title">Simple Systems API</p>
                  <p className="preview-copy">Validates the webhook and creates the candidate record.</p>
                </div>
                <p className="preview-meta">Routing</p>
              </div>
              <div className="preview-row">
                <div>
                  <p className="preview-title">Notion</p>
                  <p className="preview-copy">Candidates, roles, stages, and team workflow stay here.</p>
                </div>
                <p className="preview-meta">Workspace</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-6 md:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-zinc-100 bg-white/90 p-6 shadow-sm shadow-zinc-200/50">
          <div className="grid gap-4 md:grid-cols-3">
            {outcomes.map((item) => (
              <div key={item} className="feature-row-light">
                <span className="feature-kicker-light">Outcome</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-12 md:px-8 md:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="section-intro">
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">One narrow workflow, three clear layers.</h2>
            <p className="section-copy max-w-3xl">
              This is intentionally simple. You do not replace your stack. You connect a form tool,
              route submissions through the API, and keep your operating workflow in Notion.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {flow.map((item, index) => (
              <article key={item.title} className={`panel animate-rise ${index > 0 ? "delay-1" : ""}`}>
                <span className="mini-chip">Step {index + 1}</span>
                <h3 className="mt-5 text-2xl text-zinc-900">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-zinc-500">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tally" className="px-5 py-12 md:px-8 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="panel panel-accent animate-rise">
            <p className="eyebrow">Tally integration</p>
            <h2 className="section-title mt-4">Direct Tally webhook support.</h2>
            <p className="section-copy mt-4 max-w-2xl">
              Simple Hiring now supports a signed Tally webhook path directly. No Zapier layer is required just to move an application into Notion.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {setup.map((step) => (
                <div key={step} className="subtle-card">
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="panel animate-rise delay-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Required fields
            </p>
            <ul className="mt-5 space-y-3">
              <li className="list-row">
                <span className="list-dot" />
                <span>`candidateName` from a Name field</span>
              </li>
              <li className="list-row">
                <span className="list-dot" />
                <span>`candidateEmail` from an Email field</span>
              </li>
              <li className="list-row">
                <span className="list-dot" />
                <span>`roleId` from a hidden field</span>
              </li>
              <li className="list-row">
                <span className="list-dot" />
                <span>`phone`, `cvUrl`, and `notes` are optional</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section id="privacy" className="px-5 py-12 md:px-8 md:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="section-intro split">
            <div>
              <p className="eyebrow">Privacy and data</p>
              <h2 className="section-title">Clear boundaries by design.</h2>
            </div>
            <p className="section-copy max-w-xl">
              The product works better when each layer has a clear responsibility. That also makes the privacy story easier to understand.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {privacy.map((item) => (
              <article key={item.title} className="panel">
                <h3 className="text-2xl text-zinc-900">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-zinc-500">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-12 md:px-8 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="panel animate-rise">
            <p className="eyebrow">Pricing</p>
            <h2 className="section-title mt-4">You can usually go live without extra tool spend.</h2>
            <p className="section-copy mt-4 max-w-3xl">
              For most early setups, the additional cost is just the Simple Hiring license. Tally and Notion both have usable free plans. Paid upgrades are mostly about volume, branding, admin controls, or bigger teams.
            </p>

            <div className="mt-8 grid gap-4">
              {pricing.map((item) => (
                <div key={item.tool} className="flex flex-col gap-3 rounded-[1.25rem] border border-zinc-200 bg-white/80 p-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-zinc-900">{item.tool}</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{item.note}</p>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[rgb(var(--accent-strong))]">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="panel panel-dark animate-rise delay-1 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-300">
              Simple Hiring
            </p>
            <div className="mt-4 border-b border-zinc-700 pb-5">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">License</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-6xl leading-none text-white">$349</span>
                <span className="pb-2 text-sm text-zinc-400">one-time</span>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-zinc-200">
              <p>Includes the hiring workflow, Notion connection, Tally webhook intake, and candidate automation.</p>
              <p>Optional email sending works with Postmark when you want confirmation emails turned on.</p>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-zinc-200/80 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>Simple Systems builds narrow tools that sit on top of software small teams already use.</p>
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
