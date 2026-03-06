"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import { StatusBanner } from "@/components/status-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
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

  useEffect(() => {
    const slug = readStoredClientSlug();
    setClientSlug(slug);

    if (!slug) {
      setLoading(false);
      return;
    }

    void loadSettings(slug);
  }, []);

  async function loadSettings(slug: string) {
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
      setError(err instanceof Error ? err.message : "Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clientSlug) {
      setError("Start onboarding before editing settings.");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/roles" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" />
        Back to workspace home
      </Link>

      <div className="mt-6 rounded-2xl border border-zinc-100 bg-white">
        <div className="border-b border-zinc-100 p-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Workspace settings</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Keep your company details and email preferences up to date.
          </p>
        </div>

        <div className="space-y-4 p-8">
          {loading ? <p className="text-sm text-zinc-500">Loading settings...</p> : null}
          {message ? <StatusBanner tone="success" title={message} /> : null}
          {error ? <StatusBanner tone="error" title={error} /> : null}

          {!loading ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="replyToEmail">Reply-to email</Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={replyToEmail}
                  onChange={(event) => setReplyToEmail(event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(event) => setLogoUrl(event.target.value)}
                  placeholder="https://"
                />
              </div>

              <div className="rounded-xl bg-zinc-50 p-4">
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
    </main>
  );
}
