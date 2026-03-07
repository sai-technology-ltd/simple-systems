"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { CopyField } from "@/components/ui/copy-field";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/status-banner";
import { useToast } from "@/components/ui/toast";
import { apiGet, apiPostWithoutBody } from "@/lib/api";
import type { RoleSummary, TestSubmissionResponse, WorkspaceSummary } from "@/lib/contracts";
import { readStoredClientSlug } from "@/lib/workspace-storage";

export const dynamic = "force-dynamic";

const MISSING_ROLES_MESSAGE =
  "Add at least one role in your Notion Roles database, then refresh this page before sending a test application.";

export default function RolesPage() {
  const [clientSlug, setClientSlug] = useState("");
  const [workspace, setWorkspace] = useState<WorkspaceSummary | null>(null);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const hasRoles = roles.length > 0;
  const canSendPreviewTest = Boolean(workspace?.previewTestAvailable && hasRoles);
  const canSendLiveTest = Boolean(workspace?.paymentPaid && hasRoles);
  const canSendTest = canSendLiveTest || canSendPreviewTest;
  const testButtonLabel = testing
    ? "Sending..."
    : workspace?.paymentPaid
      ? "Send test application"
      : "Send preview test";

  const loadWorkspace = useCallback(async (slug: string) => {
    setLoading(true);
    setError("");

    try {
      const [workspaceData, rolesData] = await Promise.all([
        apiGet<WorkspaceSummary>(
          `/clients/${slug}`,
          "We couldn't load your workspace."
        ),
        apiGet<RoleSummary[]>(
          `/clients/${slug}/roles`,
          "We couldn't load your roles."
        ),
      ]);

      setWorkspace(workspaceData);
      setRoles(rolesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load workspace.";
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

    void loadWorkspace(slug);
  }, [loadWorkspace]);

  async function handleTestSubmission() {
    if (!clientSlug) {
      return;
    }

    if (!hasRoles) {
      setError(MISSING_ROLES_MESSAGE);
      toast({
        tone: "warning",
        title: "Add a role before testing",
        description: "Test submissions need one live role in your selected Roles database.",
      });
      return;
    }

    setTesting(true);
    setMessage("");
    setError("");

    try {
      const response = await apiPostWithoutBody<TestSubmissionResponse>(
        `/clients/${clientSlug}/test-submission`,
        "We couldn't send a test application."
      );
      setMessage(response.message || "Test application sent.");
      toast({
        tone: "success",
        title: response.message || "Test application sent.",
      });
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "Unable to send a test application.";
      const message = rawMessage.includes("No roles found")
        ? MISSING_ROLES_MESSAGE
        : rawMessage;
      setError(message);
      toast({ tone: "error", title: message });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-zinc-500">Loading workspace...</p>
      </main>
    );
  }

  if (!clientSlug) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-zinc-100 bg-white p-8">
          <h1 className="text-2xl font-semibold text-zinc-900">Finish setup first</h1>
          <p className="mt-2 text-sm text-zinc-500">
            This workspace home needs a connected client. Start onboarding to create one.
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Start onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-12 pt-24">
      <div className="animate-fade-up flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="app-kicker text-orange-600">Workspace home</p>
          <h1 className="brand-heading text-3xl font-bold text-zinc-900 md:text-4xl">
            {workspace?.settings.companyName || "Simple Hiring"}
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-500">
            Keep setup visible, copy role links, and run a test application without jumping back through the full onboarding flow.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadWorkspace(clientSlug)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            href="/onboarding"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Open setup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="animate-fade-up hover-lift app-metric-card rounded-2xl p-5">
          <p className="text-sm text-zinc-500">Setup</p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {workspace?.validationPassed ? "Complete" : "Needs attention"}
          </p>
        </div>
        <div className="animate-fade-up delay-1 hover-lift app-metric-card rounded-2xl p-5">
          <p className="text-sm text-zinc-500">Activation</p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {workspace?.paymentPaid ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="animate-fade-up delay-2 hover-lift app-metric-card rounded-2xl p-5">
          <p className="text-sm text-zinc-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {workspace?.settings.emailEnabled ? "Enabled" : "Paused"}
          </p>
        </div>
        <div className="animate-fade-up delay-3 hover-lift app-metric-card rounded-2xl p-5">
          <p className="text-sm text-zinc-500">Emails this month</p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {workspace?.emailsSentThisMonth ?? 0}
            {workspace?.monthlyEmailQuota ? ` / ${workspace.monthlyEmailQuota}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {workspace?.paymentPaid ? (
          <StatusBanner
            tone={workspace.emailQuotaExceeded ? "warning" : "success"}
            title={
              workspace.emailQuotaExceeded
                ? "Email sending is paused"
                : "Workspace is live"
            }
            description={
              workspace.emailQuotaExceeded
                ? "Your monthly email quota has been reached, so confirmation emails are paused."
                : "Role links are active and applications can flow into Notion."
            }
          />
        ) : (
          <StatusBanner
            tone="warning"
            title="Workspace is not active yet"
            description="You can finish setup now, but role links stay inactive until payment is complete."
          />
        )}

        {message ? <StatusBanner tone="success" title={message} /> : null}
        {error ? <StatusBanner tone="error" title={error} /> : null}
        {!hasRoles ? (
          <StatusBanner
            tone="warning"
            title="Test submission is waiting on your first role"
            description="Create at least one role entry in your Notion Roles database. The test uses that role to generate a sample candidate submission."
          />
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="animate-fade-up hover-lift app-surface rounded-[1.5rem] p-6">
          <div className="rounded-2xl border border-orange-200 bg-[linear-gradient(135deg,rgba(255,247,237,0.95),rgba(255,255,255,1))] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                  How test submission works
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                  One click, one sample candidate, one existing role
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-white/80 bg-white/80 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">1. Prepare</p>
                    <p className="mt-1 text-sm text-zinc-700">
                      Connect Notion, save the Roles database, and add at least one role row.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/80 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">2. Send</p>
                    <p className="mt-1 text-sm text-zinc-700">
                      Use the test button here to post a sample application through the real backend flow.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/80 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">3. Check</p>
                    <p className="mt-1 text-sm text-zinc-700">
                      Confirm the candidate lands in Notion with the expected role and stage mapping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="pt-6">
              <h2 className="text-xl font-semibold text-zinc-900">Role links</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Roles are managed in Notion. Copy links here when they are ready to share.
              </p>
            </div>
            <Button
              onClick={handleTestSubmission}
              disabled={testing || !canSendTest}
              title={!hasRoles ? "Add a role in Notion before sending a test application." : undefined}
            >
              {testButtonLabel}
            </Button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="app-surface-muted rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Roles</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">
                {hasRoles ? `${roles.length} ready to test` : "No role added yet"}
              </p>
            </div>
            <div className="app-surface-muted rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Test access</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">
                {workspace?.paymentPaid
                  ? "Unlimited after activation"
                  : workspace?.previewTestAvailable
                    ? "One preview test available"
                    : "Preview locked"}
              </p>
            </div>
            <div className="app-surface-muted rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Next action</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">
                {hasRoles ? "Send a test and verify it in Notion" : "Create your first role in Notion"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {roles.length ? (
              roles.map((role) => (
                <div key={role.id} className="animate-fade-in app-surface-muted rounded-2xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-900">{role.name}</h3>
                      {role.description ? (
                        <p className="mt-1 text-sm text-zinc-500">{role.description}</p>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {role.status || (workspace?.paymentPaid ? "Active link" : "Inactive")}
                    </span>
                  </div>
                  <CopyField
                    className="mt-4"
                    label="Application link"
                    value={
                      role.applicationUrl ||
                      `${typeof window !== "undefined" ? window.location.origin : "https://simplehiring.app"}/apply/${clientSlug}/${role.slug}`
                    }
                  />
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/70 p-5">
                <p className="text-sm font-medium text-zinc-900">No roles found yet</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Add at least one row in your Notion Roles database with a role name and public slug,
                  then refresh this page. Test submission stays disabled until that role exists.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="app-sticky space-y-4">
          <div className="animate-soft-scale app-surface rounded-[1.5rem] p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Quick links</h2>
            <div className="mt-4 space-y-3">
              {workspace?.webhookUrl ? (
                <CopyField label="Application endpoint" value={workspace.webhookUrl} />
              ) : null}
              {workspace?.setupGuideUrl ? (
                <a
                  href={workspace.setupGuideUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-600"
                >
                  Open setup guide
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 text-sm font-medium text-orange-600"
              >
                Open workspace settings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="animate-soft-scale delay-1 app-surface-muted rounded-[1.5rem] p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Email details</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900">
                    {workspace?.settings.companyName || "Your company"} via Simple Hiring
                  </p>
                  <p className="text-zinc-500">
                    Reply-to: {workspace?.settings.replyToEmail || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p>Sent from notifications@simplehiring.app</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
