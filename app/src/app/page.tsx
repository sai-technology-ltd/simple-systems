"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Check, Zap, Database, Link2, CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const APPLICATIONS = [
  { name: 'Sarah Johnson', role: 'Nail Technician', time: '2m ago', status: 'new' },
  { name: 'Mike Chen', role: 'Front Desk', time: '15m ago', status: 'reviewing' },
  { name: 'Emily Davis', role: 'Esthetician', time: '1h ago', status: 'new' },
  { name: 'James Wilson', role: 'Nail Technician', time: '3h ago', status: 'interview' },
];

const LOGOS = [
  { name: 'Salon', icon: '💅' },
  { name: 'Clinic', icon: '🏥' },
  { name: 'Agency', icon: '💼' },
  { name: 'Startup', icon: '🚀' },
  { name: 'Studio', icon: '🎨' },
];

const FAQS = [
  { q: 'Do I need Notion Pro?', a: 'No! Any Notion plan works, including the free plan.' },
  { q: 'What if I already have candidates in Notion?', a: 'You can import them or just start fresh - whatever works.' },
  { q: 'Can I change my databases later?', a: 'Yes, you can update your database selection anytime from settings.' },
  { q: 'Is there a trial?', a: 'Yes, you can try the full setup for free. No credit card needed.' },
];

export default function Home() {
  const [appIndex, setAppIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAppIndex((prev) => (prev + 1) % APPLICATIONS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent" />
        
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Notion-native hiring</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 leading-[1.1]">
                Finally, hiring<br />
                <span className="text-orange-600">that makes sense.</span>
              </h1>
              
              <p className="mt-6 text-lg text-zinc-500 max-w-md leading-relaxed">
                Connect your Notion. Share a link. Get candidates — no spreadsheets, 
                no extra tools, no headache.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/onboarding">
                  <Button size="lg" className="h-11 px-6 bg-zinc-900 hover:bg-zinc-800">
                    Start setup <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> 5 min setup
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> No credit card
                </span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30" />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-zinc-200 rounded-full blur-3xl opacity-50" />
                
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
                  <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900">Recent applications</span>
                    <span className="text-xs text-zinc-400">Live</span>
                  </div>
                  
                  <div className="p-2">
                    {APPLICATIONS.map((app, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl mb-1 transition-all duration-500 ${
                          i === appIndex ? 'bg-orange-50 border border-orange-100' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              app.status === 'new' ? 'bg-orange-100 text-orange-600' :
                              app.status === 'interview' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-zinc-100 text-zinc-600'
                            }`}>
                              {app.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-900">{app.name}</p>
                              <p className="text-xs text-zinc-500">{app.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-medium ${
                              app.status === 'new' ? 'text-orange-600' :
                              app.status === 'interview' ? 'text-emerald-600' :
                              'text-zinc-500'
                            }`}>
                              {app.status}
                            </span>
                            <p className="text-xs text-zinc-400">{app.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Added to Notion
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-zinc-100 p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700">Email sent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white border-y border-zinc-100">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-zinc-400 mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {LOGOS.map((logo) => (
              <div key={logo.name} className="flex items-center gap-2 text-zinc-400">
                <span className="text-2xl">{logo.icon}</span>
                <span className="text-sm font-medium">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">How it works</h2>
            <p className="mt-3 text-lg text-zinc-500">Three steps. That&apos;s it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Connect Notion', desc: 'Sign in with Notion. We only access what we need.' },
              { icon: Database, title: 'Pick databases', desc: 'Choose your Candidates, Roles, and Stages databases.' },
              { icon: Link2, title: 'Share link', desc: 'Get your application URL. Start receiving candidates.' },
            ].map((item, i) => (
              <div key={item.title} className="relative p-8 rounded-2xl border border-zinc-100 bg-white">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-xs font-medium text-zinc-400">Step {i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-zinc-900">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>One-time payment</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            $300<span className="text-zinc-500 text-2xl font-normal">, forever</span>
          </h2>
          
          <p className="mt-4 text-zinc-400 text-lg">
            No monthly fees. No surprises. Use it as long as you want.
          </p>
          
          <ul className="mt-10 flex flex-wrap justify-center gap-6">
            {['Unlimited candidates', 'Email notifications', 'Webhook integrations', 'Priority support'].map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-zinc-300">
                <Check className="w-5 h-5 text-orange-500" /> {feat}
              </li>
            ))}
          </ul>
          
          <div className="mt-10">
            <Link href="/onboarding">
              <Button size="lg" className="h-12 px-10 bg-orange-600 hover:bg-orange-700">
                Get started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-zinc-500">No credit card required</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">Questions?</h2>
          
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-zinc-100">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="font-medium text-zinc-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-zinc-500">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">Ready?</h2>
          <p className="mt-3 text-lg text-zinc-500">Setup takes 5 minutes.</p>
          <div className="mt-8">
            <Link href="/onboarding">
              <Button size="lg" className="h-12 px-10 bg-orange-600 hover:bg-orange-700">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-900">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900">Terms</Link>
            <span>·</span>
            <a href="https://saitechnology.co" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">SAI Technology</a>
          </div>
          <p className="text-sm text-zinc-400">© 2026 Simple Hiring</p>
        </div>
      </footer>
    </main>
  );
}
