import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Workflow, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.12),transparent_35%)]" />

      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs text-zinc-700 shadow-sm dark:bg-zinc-900/80 dark:text-zinc-200">
            <Sparkles className="h-3.5 w-3.5" /> Notion-native hiring for fast teams
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Hire faster with <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Simple Hiring</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-zinc-600 dark:text-zinc-300 md:text-lg">
            Connect Notion, validate your schema, and process applicants through one secure multi-tenant backend.
            No per-client workflows. No SMTP chaos.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding">
              <Button size="lg">
                Start onboarding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="lg" variant="secondary">Client settings</Button>
            </Link>
          </div>
        </div>

        <Card className="border-zinc-200/80 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          <CardHeader>
            <CardTitle>Why this setup wins</CardTitle>
            <CardDescription>Built for speed, reliability, and low ops overhead.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Feature icon={<Workflow className="h-4 w-4" />} text="Single multi-tenant automation engine" />
            <Feature icon={<ShieldCheck className="h-4 w-4" />} text="Signed webhooks + replay protection" />
            <Feature icon={<CheckCircle2 className="h-4 w-4" />} text="Notion OAuth + schema validation with clear fixes" />
          </CardContent>
        </Card>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3">
        {[
          ['1. Connect', 'Connect your Notion workspace via OAuth.'],
          ['2. Validate', 'Select Candidates/Roles/Stages and validate schema instantly.'],
          ['3. Ship', 'Receive applicants and track every event cleanly.'],
        ].map(([title, desc]) => (
          <Card key={title} className="bg-white/85 backdrop-blur dark:bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </main>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-zinc-50 p-3 dark:bg-zinc-900">
      {icon}
      <span>{text}</span>
    </div>
  );
}
