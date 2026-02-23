"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Upload, Check, CheckCircle2, Database, Settings, Mail, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { CopyField } from '@/components/ui/copy-field';

const STEPS = [
  { id: 1, title: 'Company' },
  { id: 2, title: 'Notion' },
  { id: 3, title: 'Databases' },
  { id: 4, title: 'Ready' },
];

type DbOption = { id: string; title: string };

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [notionConnected, setNotionConnected] = useState(false);
  const [databases] = useState<DbOption[]>([
    { id: 'db-1', title: 'Candidates' },
    { id: 'db-2', title: 'Roles' },
    { id: 'db-3', title: 'Stages' },
  ]);
  const [selectedDbs, setSelectedDbs] = useState({ candidates: '', roles: '', stages: '' });
  const [validated, setValidated] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const handleConnect = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setNotionConnected(true);
    setLoading(false);
  };

  const handleValidate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setValidated(true);
    setLoading(false);
  };

  const dbOptions = databases.map(db => ({ value: db.id, label: db.title }));

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SH</span>
            </div>
            <span className="text-sm font-medium text-zinc-900">Simple Hiring</span>
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600">Exit</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-500">Step {step} of {STEPS.length}</span>
            <span className="text-sm text-zinc-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <span key={s.id} className={`text-xs font-medium ${i + 1 <= step ? 'text-zinc-900' : 'text-zinc-300'}`}>
                {s.title}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100">
          {step === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Company details</h2>
                <p className="mt-1 text-sm text-zinc-500">We&apos;ll use this for notifications.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-zinc-700">Company name</Label>
                  <Input 
                    placeholder="Acme Salon" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1.5 h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-zinc-700">Reply-to email</Label>
                  <Input 
                    type="email"
                    placeholder="hiring@acme.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-zinc-700">Logo (optional)</Label>
                  <div className="mt-1.5 flex items-center gap-3 p-3 rounded-xl border border-zinc-200">
                    <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center overflow-hidden">
                      {logoUrl ? (
                        <Image src={logoUrl} width={36} height={36} alt="Logo" className="object-contain" />
                      ) : (
                        <Upload className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="text-sm font-medium text-orange-600">Upload logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setLogoUrl(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-6 h-6">
                    <path fill="#ea5c1c" d="M6.017 4.313l55.333 -4.087c6.797 -.583 8.543 -.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 .194 -6.023 .39 -8.16 -2.533L3.3 79.94c-2.333 -3.113 -2.91 -5.443 -2.91 -8.167V11.113c0 -3.497 1.94 -5.626 5.627 -6.8z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Connect Notion</h2>
                <p className="mt-1 text-sm text-zinc-500">We&apos;ll need permission to manage candidates.</p>
              </div>

              {notionConnected ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="font-medium text-emerald-900">Connected</p>
                  <p className="text-xs text-emerald-700 mt-1">Workspace: Demo</p>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Connect Notion'}
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Select databases</h2>
                <p className="mt-1 text-sm text-zinc-500">Pick your Notion databases.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-zinc-700">Candidates</Label>
                  <EnhancedSelect
                    value={selectedDbs.candidates}
                    onChange={(v) => setSelectedDbs({ ...selectedDbs, candidates: v })}
                    options={dbOptions}
                    placeholder="Select..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-zinc-700">Roles</Label>
                  <EnhancedSelect
                    value={selectedDbs.roles}
                    onChange={(v) => setSelectedDbs({ ...selectedDbs, roles: v })}
                    options={dbOptions}
                    placeholder="Select..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-zinc-700">Stages</Label>
                  <EnhancedSelect
                    value={selectedDbs.stages}
                    onChange={(v) => setSelectedDbs({ ...selectedDbs, stages: v })}
                    options={dbOptions}
                    placeholder="Select..."
                    className="mt-1.5"
                  />
                </div>

                {validated && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">All set</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">You&apos;re live!</h2>
                <p className="mt-1 text-sm text-zinc-500">Here&apos;s your setup.</p>
              </div>

              <div className="space-y-4">
                <CopyField
                  label="Application link"
                  value={`simplehiring.app/apply/${companyName.toLowerCase().replace(/\s+/g, '-') || 'acme'}/open`}
                />
                <CopyField label="Webhook URL" value="api.simplesystems.app/webhooks/..." />
                <CopyField label="Secret" value="whsec_xxxxx" showReveal />

                <div className="rounded-lg bg-zinc-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700">Email notifications</span>
                  </div>
                  <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-5 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
            >
              Back
            </button>
            
            {step < 4 && (
              <button
                onClick={() => {
                  if (step === 2 && !notionConnected) handleConnect();
                  else if (step === 3 && !validated) handleValidate();
                  else setStep(step + 1);
                }}
                disabled={loading || (step === 1 && !companyName) || (step === 3 && (!selectedDbs.candidates || !selectedDbs.roles || !selectedDbs.stages))}
                className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Loading...' : step === 2 ? (notionConnected ? 'Continue' : 'Connect') : step === 3 ? (validated ? 'Continue' : 'Validate') : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {step === 4 && (
              <Link href="/roles">
                <button className="h-10 px-6 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  View roles <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
