"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, ExternalLink, Send, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { CopyField } from '@/components/ui/copy-field';

const STEPS = [
  { id: 1, title: 'Company', short: 'Co' },
  { id: 2, title: 'Connect', short: 'Connect' },
  { id: 3, title: 'Databases', short: 'DBs' },
  { id: 4, title: 'Live', short: 'Live' },
  { id: 5, title: 'Test', short: 'Test' },
];

type DbOption = { id: string; title: string };

interface CompanyData {
  companyName: string;
  replyToEmail: string;
  logoUrl: string;
}

interface NotionData {
  workspaceId: string;
  workspaceName: string;
  connected: boolean;
}

interface DatabaseSelection {
  candidatesDbId: string;
  rolesDbId: string;
  stagesDbId: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: '',
    replyToEmail: '',
    logoUrl: '',
  });
  
  const [notionData, setNotionData] = useState<NotionData>({
    workspaceId: '',
    workspaceName: '',
    connected: false,
  });
  
  const [databases] = useState<DbOption[]>([
    { id: 'db-1', title: 'Candidates' },
    { id: 'db-2', title: 'Roles' },
    { id: 'db-3', title: 'Stages' },
  ]);
  const [dbSelection, setDbSelection] = useState<DatabaseSelection>({
    candidatesDbId: '',
    rolesDbId: '',
    stagesDbId: '',
  });
  
  const [setupValidated, setSetupValidated] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const progressValue = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const dbOptions = databases.map(db => ({
    value: db.id,
    label: db.title,
  }));

  async function connectNotion() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNotionData({
      workspaceId: 'ws_demo_123',
      workspaceName: 'Demo Workspace',
      connected: true,
    });
    setLoading(false);
  }

  async function validateSetup() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSetupValidated(true);
    setLoading(false);
  }

  async function sendTestApplication() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestSent(true);
    setLoading(false);
  }

  function handleNext() {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return companyData.companyName && companyData.replyToEmail;
      case 2: return notionData.connected;
      case 3: return dbSelection.candidatesDbId && dbSelection.rolesDbId && dbSelection.stagesDbId;
      case 4: return setupValidated;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="text-lg font-semibold text-zinc-900">Simple Hiring</span>
          </Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">Exit setup</Link>
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500">Step {currentStep} of {STEPS.length}</span>
              <span className="text-sm text-zinc-400">{Math.round(progressValue)}% complete</span>
            </div>
            <Progress value={progressValue} className="h-1.5 bg-zinc-100" />
            <div className="flex justify-between mt-3">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                    step.id === currentStep
                      ? 'text-orange-600'
                      : step.id < currentStep
                      ? 'text-emerald-600'
                      : 'text-zinc-300'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.short}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-xl shadow-zinc-100/50">
            {currentStep === 1 && (
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Tell us about your company</h2>
                  <p className="mt-2 text-zinc-500">We&apos;ll use this for email notifications.</p>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium text-zinc-700">Company name</Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Salon"
                      value={companyData.companyName}
                      onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                      className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="replyToEmail" className="text-sm font-medium text-zinc-700">Reply-to email</Label>
                    <Input
                      id="replyToEmail"
                      type="email"
                      placeholder="hiring@acme.com"
                      value={companyData.replyToEmail}
                      onChange={(e) => setCompanyData({ ...companyData, replyToEmail: e.target.value })}
                      className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white"
                    />
                    <p className="text-xs text-zinc-400">Where candidate confirmations will be sent from</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-zinc-700">Logo (optional)</Label>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50">
                      <div className="w-12 h-12 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                        {companyData.logoUrl ? (
                          <img src={companyData.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <Upload className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-orange-600 cursor-pointer hover:text-orange-700">
                          Upload logo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setCompanyData({ ...companyData, logoUrl: ev.target?.result as string });
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                        <p className="text-xs text-zinc-400">PNG or JPG, max 1MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 2 && (
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 100 100" className="w-6 h-6">
                      <path fill="#ea5c1c" d="M6.017 4.313l55.333 -4.087c6.797 -.583 8.543 -.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 .194 -6.023 .39 -8.16 -2.533L3.3 79.94c-2.333 -3.113 -2.91 -5.443 -2.91 -8.167V11.113c0 -3.497 1.94 -5.626 5.627 -6.8z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Connect your Notion</h2>
                  <p className="mt-2 text-zinc-500">We&apos;ll need permission to read and write to your databases.</p>
                </div>

                {notionData.connected ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-emerald-900">Connected to {notionData.workspaceName}</p>
                    <p className="text-sm text-emerald-700 mt-1">You&apos;re all set!</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-200 p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                      <svg viewBox="0 0 100 100" className="w-8 h-8">
                        <path fill="#ea5c1c" d="M6.017 4.313l55.333 -4.087c6.797 -.583 8.543 -.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 .194 -6.023 .39 -8.16 -2.533L3.3 79.94c-2.333 -3.113 -2.91 -5.443 -2.91 -8.167V11.113c0 -3.497 1.94 -5.626 5.627 -6.8z"/>
                      </svg>
                    </div>
                    <p className="text-zinc-600 mb-6">Click below to connect your Notion workspace. We&apos;ll only access what we need.</p>
                    <Button onClick={connectNotion} disabled={loading} size="lg" className="bg-zinc-900 hover:bg-zinc-800">
                      {loading ? 'Connecting...' : 'Connect Notion'}
                    </Button>
                  </div>
                )}
              </CardContent>
            )}

            {currentStep === 3 && (
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Select your databases</h2>
                  <p className="mt-2 text-zinc-500">Pick the Notion databases for your hiring workflow.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-zinc-700">Candidates database</Label>
                    <EnhancedSelect
                      value={dbSelection.candidatesDbId}
                      onChange={(value) => setDbSelection({ ...dbSelection, candidatesDbId: value })}
                      options={dbOptions}
                      placeholder="Select database..."
                    />
                    <p className="text-xs text-zinc-400">Where new applications will be created</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-zinc-700">Roles database</Label>
                    <EnhancedSelect
                      value={dbSelection.rolesDbId}
                      onChange={(value) => setDbSelection({ ...dbSelection, rolesDbId: value })}
                      options={dbOptions}
                      placeholder="Select database..."
                    />
                    <p className="text-xs text-zinc-400">Your open positions</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-zinc-700">Stages database</Label>
                    <EnhancedSelect
                      value={dbSelection.stagesDbId}
                      onChange={(value) => setDbSelection({ ...dbSelection, stagesDbId: value })}
                      options={dbOptions}
                      placeholder="Select database..."
                    />
                    <p className="text-xs text-zinc-400">Your hiring pipeline stages</p>
                  </div>
                </div>

                {setupValidated && (
                  <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-900">All databases validated</p>
                      <p className="text-sm text-emerald-700">Your setup is ready to go!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            )}

            {currentStep === 4 && (
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">You&apos;re live! 🎉</h2>
                  <p className="mt-2 text-zinc-500">Here&apos;s your setup. Share this link with candidates.</p>
                </div>

                <div className="space-y-4">
                  <CopyField
                    label="Application link"
                    value={`simplehiring.app/apply/${companyData.companyName.toLowerCase().replace(/\s+/g, '-') || 'acme'}/open-role`}
                  />
                  
                  <CopyField
                    label="Webhook URL"
                    value={`api.simplesystems.app/webhooks/hiring/${companyData.companyName.toLowerCase().replace(/\s+/g, '-') || 'acme'}`}
                  />
                  
                  <CopyField
                    label="Webhook secret"
                    value="whsec_xxxxxxxxxxxxxxxxxxxxx"
                    showReveal
                  />
                </div>

                <div className="mt-6 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900">Email notifications</p>
                      <p className="text-sm text-zinc-500">Send confirmations to applicants</p>
                    </div>
                    <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="flex-1 border-zinc-200">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    View guide
                  </Button>
                </div>
              </CardContent>
            )}

            {currentStep === 5 && (
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Test your setup</h2>
                  <p className="mt-2 text-zinc-500">Send a test application to verify everything works.</p>
                </div>

                {testSent ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-semibold text-emerald-900 text-lg">Test successful!</p>
                    <p className="text-sm text-emerald-700 mt-2">Check your Notion database for the test entry.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-200 p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-zinc-600 mb-6">Click below to create a test candidate in your database.</p>
                    <Button onClick={sendTestApplication} disabled={loading} size="lg" className="bg-orange-600 hover:bg-orange-700">
                      {loading ? 'Sending...' : 'Send Test Application'}
                    </Button>
                  </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-zinc-50 text-sm text-zinc-600">
                  <p className="font-medium text-zinc-900 mb-2">What happens next:</p>
                  <ul className="space-y-1 text-zinc-500">
                    <li>1. Share your application link with candidates</li>
                    <li>2. New applications appear automatically in Notion</li>
                    <li>3. You&apos;ll get email notifications for each submission</li>
                  </ul>
                </div>
              </CardContent>
            )}

            <div className="px-8 py-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="text-zinc-500">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              
              {currentStep < 4 && (
                <Button 
                  onClick={currentStep === 2 ? (notionData.connected ? handleNext : connectNotion) : (currentStep === 3 ? validateSetup : handleNext)} 
                  disabled={!canProceed() || loading}
                  className="bg-zinc-900 hover:bg-zinc-800"
                >
                  {loading ? 'Loading...' : currentStep === 2 ? (notionData.connected ? 'Continue' : 'Connect') : 
                   currentStep === 3 ? (setupValidated ? 'Continue' : 'Validate') : 'Continue'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              {currentStep === 4 && (
                <Button onClick={handleNext} className="bg-zinc-900 hover:bg-zinc-800">
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              {currentStep === 5 && (
                <Link href="/roles">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    View Your Roles
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
