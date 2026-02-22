import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="text-lg font-semibold text-zinc-900">Simple Hiring</span>
          </Link>
          <nav className="flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Pricing</a>
            <Link href="/onboarding">
              <Button className="rounded-full px-5 h-9 bg-zinc-900 hover:bg-zinc-800">Start Setup</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="pt-40 pb-24 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Now with Notion 2.0 integration</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight leading-[1.1]">
              Hiring that actually{' '}
              <span className="text-orange-600">works.</span>
            </h1>
            
            <p className="mt-6 text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              Collect applications, auto-create candidates, and send confirmations — 
              all automatically added to your Notion workspace.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="rounded-full h-12 px-8 text-base bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/25">
                  Start Free Setup <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-base border-zinc-200">
                See How It Works
              </Button>
            </div>

            <p className="mt-6 text-sm text-zinc-400">No credit card required · Setup in 5 minutes</p>
          </div>
        </section>

        <section id="how-it-works" className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">Simple. Powerful. Notion-native.</h2>
              <p className="mt-3 text-lg text-zinc-500">Three steps from start to hiring your first candidate.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Connect Notion', desc: 'Sign in with Notion. We request minimal permissions — just enough to manage your hiring data.' },
                { step: '02', title: 'Pick Databases', desc: 'Select your Candidates, Roles, and Stages databases. We validate everything works perfectly.' },
                { step: '03', title: 'Share Link', desc: 'Get your application URL. Candidates apply, you get notified, data appears in Notion.' },
              ].map((item, i) => (
                <div key={item.step} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative p-8 rounded-2xl border border-zinc-100 bg-white hover:shadow-xl hover:shadow-zinc-100/50 transition-all duration-300">
                    <span className="text-6xl font-bold text-zinc-100">{item.step}</span>
                    <h3 className="mt-4 text-xl font-semibold text-zinc-900">{item.title}</h3>
                    <p className="mt-3 text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-zinc-900 text-white p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold">One price. Forever.</h2>
                <p className="mt-3 text-zinc-400 text-lg">No monthly fees. No surprises. Just one payment.</p>
                
                <div className="mt-10 flex items-center justify-center gap-2">
                  <span className="text-6xl font-bold">$300</span>
                  <span className="text-zinc-400 text-lg">one-time</span>
                </div>
                
                <ul className="mt-10 flex flex-wrap justify-center gap-4">
                  {['Unlimited candidates', 'Unlimited roles', 'Email notifications', 'Webhook integrations', 'Priority support'].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-5 h-5 text-orange-500" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900">Ready to simplify your hiring?</h2>
            <p className="mt-3 text-lg text-zinc-500">Join hundreds of small teams already using Simple Hiring.</p>
            <div className="mt-8">
              <Link href="/onboarding">
                <Button size="lg" className="rounded-full h-12 px-8 text-base bg-orange-600 hover:bg-orange-700">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-900">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900">Terms</Link>
            <span>·</span>
            <span>Built by SAI Technology</span>
          </div>
          <p className="text-sm text-zinc-400">© 2026 Simple Hiring</p>
        </div>
      </footer>
    </div>
  );
}
