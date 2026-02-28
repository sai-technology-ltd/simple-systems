"use client";

import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Database, Mail, Settings, Sparkles, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { CopyField } from "@/components/ui/copy-field";
import { apiGet, apiPatch, apiPost } from "@/lib/api";

const STEPS = [
  { id: 1, title: "Company" },
  { id: 2, title: "Payment" },
  { id: 3, title: "Notion" },
  { id: 4, title: "Databases" },
  { id: 5, title: "Ready" },
];

type DbOption = { id: string; title: string };

export default function OnboardingPage() {
  const [paymentRef, setPaymentRef] = useState("");
  const [callbackClientSlug, setCallbackClientSlug] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [clientSlug, setClientSlug] = useState("");

  const [paymentPaid, setPaymentPaid] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);

  const [notionConnected, setNotionConnected] = useState(false);
  const [databases] = useState<DbOption[]>([
    { id: "db-1", title: "Candidates" },
    { id: "db-2", title: "Roles" },
    { id: "db-3", title: "Stages" },
  ]);
  const [selectedDbs, setSelectedDbs] = useState({ candidates: "", roles: "", stages: "" });
  const [validated, setValidated] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;
  const dbOptions = useMemo(() => databases.map((db) => ({ value: db.id, label: db.title })), [databases]);


  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    setPaymentRef(p.get("reference") || "");
    setCallbackClientSlug(p.get("clientSlug") || "");
  }, []);
  useEffect(() => {
    if (callbackClientSlug && !clientSlug) setClientSlug(callbackClientSlug);
  }, [callbackClientSlug, clientSlug]);

  useEffect(() => {
    if (!paymentRef || !clientSlug || paymentPaid) return;
    (async () => {
      try {
        const res = await apiGet<{ paid: boolean }>(`/clients/${clientSlug}/payments/verify?reference=${encodeURIComponent(paymentRef)}`);
        if (res.paid) {
          setPaymentPaid(true);
          setStep((s) => (s < 3 ? 3 : s));
        }
      } catch {
        // ignore and let user retry manually
      }
    })();
  }, [paymentRef, clientSlug, paymentPaid]);

  async function startOnboarding() {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<{ clientSlug: string }>("/onboarding/start", {
        companyName,
        replyToEmail: email || undefined,
      });
      setClientSlug(res.clientSlug);
      await apiPatch(`/clients/${res.clientSlug}/settings`, {
        companyName,
        replyToEmail: email,
        logoUrl,
        emailEnabled,
      });
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start onboarding");
    } finally {
      setLoading(false);
    }
  }

  async function beginPayment() {
    if (!clientSlug) return;
    setLoading(true);
    setError("");
    setPaymentPending(true);
    try {
      const callbackUrl = `${window.location.origin}/onboarding?clientSlug=${clientSlug}`;
      const res = await apiPost<{ authorizationUrl: string }>(`/clients/${clientSlug}/payments/initialize`, {
        email,
        callbackUrl,
      });
      window.location.href = res.authorizationUrl;
    } catch (e: unknown) {
      setPaymentPending(false);
      setError(e instanceof Error ? e.message : "Payment initialization failed");
      setLoading(false);
    }
  }

  async function verifyPayment() {
    if (!clientSlug || !paymentRef) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiGet<{ paid: boolean }>(`/clients/${clientSlug}/payments/verify?reference=${encodeURIComponent(paymentRef)}`);
      if (!res.paid) throw new Error("Payment not successful yet");
      setPaymentPaid(true);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleValidate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setValidated(true);
    setLoading(false);
  }

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
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100">
          {step === 1 && (
            <div className="p-8 space-y-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Company details</h2>
              </div>
              <div>
                <Label>Company name</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1.5 h-10" />
              </div>
              <div>
                <Label>Reply-to email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-10" />
              </div>
              <div>
                <Label>Logo URL (optional)</Label>
                <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="mt-1.5 h-10" placeholder="https://..." />
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700">Email notifications</span>
                </div>
                <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Activate subscription</h2>
                <p className="mt-1 text-sm text-zinc-500">Secure checkout with Paystack.</p>
              </div>

              {paymentPaid ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-6 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="font-medium text-emerald-900">Payment confirmed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={beginPayment} disabled={loading || paymentPending || !email} className="w-full h-11 rounded-xl bg-zinc-900 text-white font-medium disabled:opacity-50">
                    {paymentPending ? "Redirecting to Paystack..." : "Pay with Paystack"}
                  </button>
                  {paymentRef ? (
                    <button onClick={verifyPayment} disabled={loading} className="w-full h-10 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-medium">
                      I have completed payment, verify now
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">Connect Notion</h2>
              {notionConnected ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-6 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="font-medium text-emerald-900">Connected</p>
                </div>
              ) : (
                <button onClick={() => setNotionConnected(true)} className="w-full h-11 rounded-xl bg-orange-600 text-white font-medium">
                  Connect Notion
                </button>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="p-8 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Select databases</h2>
              </div>

              <div>
                <Label>Candidates</Label>
                <EnhancedSelect value={selectedDbs.candidates} onChange={(v) => setSelectedDbs({ ...selectedDbs, candidates: v })} options={dbOptions} placeholder="Select..." className="mt-1.5" />
              </div>
              <div>
                <Label>Roles</Label>
                <EnhancedSelect value={selectedDbs.roles} onChange={(v) => setSelectedDbs({ ...selectedDbs, roles: v })} options={dbOptions} placeholder="Select..." className="mt-1.5" />
              </div>
              <div>
                <Label>Stages</Label>
                <EnhancedSelect value={selectedDbs.stages} onChange={(v) => setSelectedDbs({ ...selectedDbs, stages: v })} options={dbOptions} placeholder="Select..." className="mt-1.5" />
              </div>

              {validated ? <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-900">All set</div> : null}
            </div>
          )}

          {step === 5 && (
            <div className="p-8 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">You are live</h2>
              </div>

              <CopyField label="Client slug" value={clientSlug || "-"} />
              <CopyField label="Application link" value={`simplehiring.app/apply/${clientSlug || "demo"}/open`} />
            </div>
          )}

          {error ? <div className="px-8 pb-2 text-sm text-red-600">{error}</div> : null}

          <div className="px-8 py-5 border-t border-zinc-100 flex items-center justify-between">
            <button onClick={() => setStep(step - 1)} disabled={step === 1 || loading} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-30">Back</button>

            {step === 1 && (
              <button onClick={startOnboarding} disabled={loading || !companyName || !email} className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-medium disabled:opacity-50 flex items-center gap-2">
                {loading ? "Starting..." : "Continue"} <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && paymentPaid && (
              <button onClick={() => setStep(3)} className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-medium flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button onClick={() => setStep(4)} disabled={!notionConnected} className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-medium disabled:opacity-50 flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={async () => {
                  if (!validated) await handleValidate();
                  else setStep(5);
                }}
                disabled={loading || !selectedDbs.candidates || !selectedDbs.roles || !selectedDbs.stages}
                className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {validated ? "Continue" : "Validate"} <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 5 && (
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
