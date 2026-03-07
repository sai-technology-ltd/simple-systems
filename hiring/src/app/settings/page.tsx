"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Settings2 } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import { StatusBanner } from "@/components/status-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/toast";
import type { WorkspaceSummary } from "@/lib/contracts";
import { readStoredClientSlug } from "@/lib/workspace-storage";

export default function SettingsPage() {
  const [clientSlug, setClientSlug] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const loadSettings = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const workspace = await apiGet<WorkspaceSummary>(
        `/clients/${slug}`,
        "We couldn't load your settings."
      );
      setCompanyName(workspace.settings.companyName || "");
      setReplyToEmail(workspace.settings.replyToEmail || "");
      setLogoUrl(workspace.settings.logoUrl || "");
      setEmailEnabled(workspace.settings.emailEnabled);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load settings.";
      setError(message);
      toast({ tone: "error", title: message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const slug = readStoredClientSlug();
    setClientSlug(slug);

    if (!slug) {
      setLoading(false);
      return;
    }

    void loadSettings(slug);
  }, [loadSettings]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clientSlug) {
      const message = "Start onboarding before editing settings.";
      setError(message);
      toast({ tone: "error", title: message });
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await apiPatch(
        `/clients/${clientSlug}/settings`,
        {
          companyName,
          replyToEmail,
          logoUrl: logoUrl || null,
          emailEnabled,
        },
        "We couldn't save your settings."
      );
      setMessage("Settings saved.");
      toast({ tone: "success", title: "Settings saved." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save settings.";
      setError(message);
      toast({ tone: "error", title: message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-12 pt-24">
      <Link href="/roles" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" />
        Back to workspace home
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="app-surface rounded-[1.5rem]">
          <div className="border-b border-zinc-100 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                <Settings2 className="h-6 w-6" />
              </div>
              <div>
                <p className="app-kicker">Workspace settings</p>
                <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Company and email settings</h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Keep your company details and email preferences current so confirmations and workspace copy stay consistent.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-8">
          {loading ? <p className="text-sm text-zinc-500">Loading settings...</p> : null}
          {message ? <StatusBanner tone="success" title={message} /> : null}
          {error ? <StatusBanner tone="error" title={error} /> : null}

          {!loading ? (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="replyToEmail">Reply-to email</Label>
                  <Input
                    id="replyToEmail"
                    type="email"
                    value={replyToEmail}
                    onChange={(event) => setReplyToEmail(event.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(event) => setLogoUrl(event.target.value)}
                    placeholder="https://"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="app-surface-muted rounded-2xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Confirmation emails</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Pause or resume customer confirmation emails.
                    </p>
                  </div>
                  <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
                </div>
              </div>

              <Button type="submit" disabled={saving || !companyName || !replyToEmail}>
                {saving ? "Saving..." : "Save settings"}
              </Button>
            </form>
          ) : null}
          </div>
        </div>

        <aside className="app-sticky space-y-4">
          <div className="app-surface rounded-[1.5rem] p-6">
            <p className="app-kicker">Email delivery</p>
            <div className="mt-4 space-y-4 text-sm text-zinc-600">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900">Simple Hiring sender</p>
                  <p className="text-zinc-500">notifications@simplehiring.app</p>
                </div>
              </div>
              <p>Your reply-to email controls where candidate replies are sent.</p>
            </div>
          </div>

          <div className="app-surface-muted rounded-[1.5rem] p-6">
            <p className="app-kicker">Workspace actions</p>
            <div className="mt-4 space-y-3">
              <Link href="/roles" className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900">
                Open workspace home
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/onboarding" className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900">
                Return to setup
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
