"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Database,
  ExternalLink,
  Link2,
  Loader2,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyField } from "@/components/ui/copy-field";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { SetupStepper } from "@/components/setup-stepper";
import { StatusBanner } from "@/components/status-banner";
import { apiGet, apiPatch, apiPost, apiPostWithoutBody } from "@/lib/api";
import type {
  DatabaseOption,
  DatabaseSelection,
  NotionConnectResponse,
  PaymentInitializeResponse,
  PaymentVerifyResponse,
  RoleSummary,
  StartOnboardingResponse,
  TestSubmissionResponse,
  ValidationResult,
  WorkspaceSummary,
} from "@/lib/contracts";
import {
  ONBOARDING_STEPS,
  ONE_TIME_PRICE_USD,
  PRODUCT_NAME,
  REQUIRED_DATABASES,
} from "@/lib/product";
import { readStoredClientSlug, storeClientSlug } from "@/lib/workspace-storage";

export const dynamic = "force-dynamic";

const EMPTY_SELECTION: DatabaseSelection = {
  candidatesDatabaseId: "",
  rolesDatabaseId: "",
  stagesDatabaseId: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getActiveStep(workspace: WorkspaceSummary | null, clientSlug: string) {
  if (!clientSlug || !workspace) {
    return 1;
  }

  if (!workspace.notionConnected) {
    return 2;
  }

  if (!workspace.validationPassed) {
    return 3;
  }

  if (!workspace.paymentPaid) {
    return 4;
  }

  return 5;
}

export default function OnboardingPage() {
  const [clientSlug, setClientSlug] = useState("");
  const [workspace, setWorkspace] = useState<WorkspaceSummary | null>(null);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [databases, setDatabases] = useState<DatabaseOption[]>([]);
  const [selection, setSelection] = useState<DatabaseSelection>(EMPTY_SELECTION);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("clientSlug") || readStoredClientSlug();
    const reference = params.get("reference") || "";

    if (slug) {
      setClientSlug(slug);
      storeClientSlug(slug);
    }

    if (reference) {
      setPaymentReference(reference);
    }
  }, []);

  const loadWorkspace = useCallback(async (slug: string, silent: boolean) => {
    if (!silent) {
      setLoadingWorkspace(true);
    }

    try {
      const [workspaceData, rolesData] = await Promise.all([
        apiGet<WorkspaceSummary>(
          `/clients/${slug}`,
          "We couldn't load your workspace right now."
        ),
        apiGet<RoleSummary[]>(
          `/clients/${slug}/roles`,
          "We couldn't load your roles right now."
        ).catch(() => []),
      ]);

      setWorkspace(workspaceData);
      setRoles(rolesData);
      setCompanyName(workspaceData.settings.companyName || "");
      setReplyToEmail(workspaceData.settings.replyToEmail || "");
      setLogoUrl(workspaceData.settings.logoUrl || "");
      setEmailEnabled(workspaceData.settings.emailEnabled);
      setSelection({
        candidatesDatabaseId:
          workspaceData.selectedDatabases?.candidatesDatabaseId || "",
        rolesDatabaseId: workspaceData.selectedDatabases?.rolesDatabaseId || "",
        stagesDatabaseId:
          workspaceData.selectedDatabases?.stagesDatabaseId || "",
      });

      if (workspaceData.notionConnected) {
        void loadDatabases(slug);
      }

      if (workspaceData.validationPassed) {
        setValidation({
          ok: true,
          message:
            workspaceData.validationMessage ||
            "Your workspace is ready. You can activate it whenever you’re ready.",
          issues: [],
        });
      } else if (workspaceData.validationMessage) {
        setValidation({
          ok: false,
          message: workspaceData.validationMessage,
          issues: [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workspace.");
    } finally {
      if (!silent) {
        setLoadingWorkspace(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!clientSlug) {
      setLoadingWorkspace(false);
      return;
    }

    void loadWorkspace(clientSlug, false);
  }, [clientSlug, loadWorkspace]);

  async function loadDatabases(slug: string) {
    try {
      const data = await apiGet<DatabaseOption[]>(
        `/clients/${slug}/notion/databases`,
        "We couldn't load your databases yet."
      );
      setDatabases(data);
    } catch {
      setDatabases([]);
    }
  }

  async function handleSaveCompany() {
    setSaving(true);
    setError("");
    setFormMessage("");

    try {
      let slug = clientSlug;

      if (!slug) {
        const created = await apiPost<StartOnboardingResponse>(
          "/onboarding/start",
          {
            companyName,
            replyToEmail,
          },
          "We couldn't start your setup right now."
        );
        slug = created.clientSlug;
        setClientSlug(created.clientSlug);
        storeClientSlug(created.clientSlug);
      }

      await apiPatch(
        `/clients/${slug}/settings`,
        {
          companyName,
          replyToEmail,
          logoUrl: logoUrl || null,
          emailEnabled,
        },
        "We couldn't save your company details."
      );

      setFormMessage("Company details saved. Next, connect your Notion workspace.");
      await loadWorkspace(slug, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConnectNotion() {
    if (!clientSlug) {
      setError("Save your company details first.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiPost<NotionConnectResponse>(
        `/clients/${clientSlug}/notion/connect`,
        {
          returnUrl: `${window.location.origin}/onboarding?clientSlug=${clientSlug}`,
        },
        "We couldn't start the Notion connection."
      );

      window.location.href = response.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect your workspace.");
      setSaving(false);
    }
  }

  async function handleSaveDatabases() {
    if (!clientSlug) {
      return;
    }

    setSaving(true);
    setError("");
    setFormMessage("");

    try {
      await apiPost(
        `/clients/${clientSlug}/notion/databases/select`,
        {
          candidatesDbId: selection.candidatesDatabaseId,
          rolesDbId: selection.rolesDatabaseId,
          stagesDbId: selection.stagesDatabaseId,
        },
        "We couldn't save your database selection."
      );
      setFormMessage("Database selection saved. Validate setup to make sure everything is ready.");
      await loadWorkspace(clientSlug, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your database selection.");
    } finally {
      setSaving(false);
    }
  }

  async function handleValidate() {
    if (!clientSlug) {
      return;
    }

    setValidating(true);
    setError("");
    setFormMessage("");

    try {
      const result = await apiPostWithoutBody<ValidationResult>(
        `/clients/${clientSlug}/validate`,
        "We couldn't validate your setup right now."
      );
      setValidation(result);

      if (result.ok) {
        await loadWorkspace(clientSlug, true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to validate your setup.");
    } finally {
      setValidating(false);
    }
  }

  async function beginPayment() {
    if (!clientSlug || !replyToEmail) {
      setError("Add your reply-to email before activation.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiPost<PaymentInitializeResponse>(
        `/clients/${clientSlug}/payments/initialize`,
        {
          email: replyToEmail,
          callbackUrl: `${window.location.origin}/onboarding?clientSlug=${clientSlug}`,
        },
        "We couldn't start your Paystack checkout."
      );

      window.location.href = response.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start payment.");
      setSaving(false);
    }
  }

  const verifyPayment = useCallback(async (referenceOverride?: string, silent = false) => {
    if (!clientSlug || !(referenceOverride || paymentReference)) {
      return;
    }

    if (!silent) {
      setSaving(true);
    }
    setError("");

    try {
      const response = await apiGet<PaymentVerifyResponse>(
        `/clients/${clientSlug}/payments/verify?reference=${encodeURIComponent(
          referenceOverride || paymentReference
        )}`,
        "We couldn't verify your payment yet."
      );

      if (!response.paid) {
        throw new Error("Payment is still pending. Finish checkout, then verify again.");
      }

      await loadWorkspace(clientSlug, true);
      setFormMessage("Payment confirmed. Your workspace is now active.");
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Unable to verify payment.");
      }
    } finally {
      if (!silent) {
        setSaving(false);
      }
    }
  }, [clientSlug, paymentReference, loadWorkspace]);

  useEffect(() => {
    if (!clientSlug || !paymentReference) {
      return;
    }

    void verifyPayment(paymentReference, true);
  }, [clientSlug, paymentReference, verifyPayment]);

  async function handleSendTest() {
    if (!clientSlug) {
      return;
    }

    setTesting(true);
    setError("");
    setFormMessage("");

    try {
      const response = await apiPostWithoutBody<TestSubmissionResponse>(
        `/clients/${clientSlug}/test-submission`,
        "We couldn't send a test application right now."
      );
      setFormMessage(response.message || "Test application sent successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send a test submission.");
    } finally {
      setTesting(false);
    }
  }

  const activeStep = getActiveStep(workspace, clientSlug);
  const databaseOptions = useMemo(
    () =>
      databases.map((db) => ({
        value: db.id,
        label: db.title,
      })),
    [databases]
  );

  const setupStatus = workspace?.paymentPaid
    ? "Active"
    : workspace?.validationPassed
      ? "Ready to activate"
      : workspace?.notionConnected
        ? "Needs validation"
        : clientSlug
          ? "In progress"
          : "Not started";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <span className="text-xs font-bold text-white">SH</span>
            </div>
            <span className="text-sm font-medium text-zinc-900">{PRODUCT_NAME}</span>
          </Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="animate-fade-up space-y-3">
              <p className="text-sm font-medium text-orange-600">Guided setup</p>
              <h1 className="text-3xl font-bold text-zinc-900">Set up your hiring workspace</h1>
              <p className="max-w-2xl text-zinc-500">
                This flow keeps everything simple: save your company details, connect Notion,
                validate the three required databases, then activate your workspace when you are ready.
              </p>
            </div>

            <SetupStepper steps={ONBOARDING_STEPS} currentStep={activeStep} />

            {loadingWorkspace ? (
              <div className="rounded-2xl border border-zinc-100 bg-white p-8">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading your workspace...
                </div>
              </div>
            ) : (
              <>
                <section className="animate-fade-up hover-lift rounded-2xl border border-zinc-100 bg-white">
                  <div className="border-b border-zinc-100 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <Settings className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">Step 1: Company details</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Add the details used in your confirmation emails and workspace setup.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 p-8 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="companyName">Company name</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="replyToEmail">Reply-to email</Label>
                      <Input
                        id="replyToEmail"
                        type="email"
                        value={replyToEmail}
                        onChange={(event) => setReplyToEmail(event.target.value)}
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                      <Input
                        id="logoUrl"
                        value={logoUrl}
                        onChange={(event) => setLogoUrl(event.target.value)}
                        className="mt-1.5 h-11"
                        placeholder="https://"
                      />
                    </div>
                    <div className="md:col-span-2 rounded-xl bg-zinc-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-700">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          Confirmation emails
                        </div>
                        <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">
                        Emails send from <span className="font-medium">notifications@simplehiring.app</span>{" "}
                        with your reply-to address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end border-t border-zinc-100 p-6">
                    <Button
                      onClick={handleSaveCompany}
                      disabled={saving || !companyName || !replyToEmail}
                    >
                      {saving && activeStep === 1 ? "Saving..." : "Save and continue"}
                    </Button>
                  </div>
                </section>

                <section className="animate-fade-up delay-1 hover-lift rounded-2xl border border-zinc-100 bg-white">
                  <div className="border-b border-zinc-100 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <Link2 className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">Step 2: Connect Notion</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Connect the Notion workspace where you want candidates, roles, and stages to live.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-8">
                    {workspace?.notionConnected ? (
                      <StatusBanner
                        tone="success"
                        title="Workspace connected"
                        description="You can now choose the three databases needed for your hiring workflow."
                      />
                    ) : (
                      <StatusBanner
                        title="Connect your workspace"
                        description="We’ll ask you to choose which Notion workspace and pages Simple Hiring can use."
                      />
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleConnectNotion} disabled={!clientSlug || saving}>
                        {saving && activeStep === 2 ? "Connecting..." : "Connect Notion"}
                      </Button>
                      {clientSlug ? (
                        <button
                          type="button"
                          onClick={() => void loadWorkspace(clientSlug, true)}
                          className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          Refresh status
                        </button>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="animate-fade-up delay-2 hover-lift rounded-2xl border border-zinc-100 bg-white">
                  <div className="border-b border-zinc-100 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <Database className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">Step 3: Select databases</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Choose the three Notion databases that power your hiring workflow.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 p-8">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label>Candidates database</Label>
                        <EnhancedSelect
                          value={selection.candidatesDatabaseId}
                          onChange={(value) =>
                            setSelection((current) => ({
                              ...current,
                              candidatesDatabaseId: value,
                            }))
                          }
                          options={databaseOptions}
                          placeholder="Choose a database"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Roles database</Label>
                        <EnhancedSelect
                          value={selection.rolesDatabaseId}
                          onChange={(value) =>
                            setSelection((current) => ({
                              ...current,
                              rolesDatabaseId: value,
                            }))
                          }
                          options={databaseOptions}
                          placeholder="Choose a database"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Stages database</Label>
                        <EnhancedSelect
                          value={selection.stagesDatabaseId}
                          onChange={(value) =>
                            setSelection((current) => ({
                              ...current,
                              stagesDatabaseId: value,
                            }))
                          }
                          options={databaseOptions}
                          placeholder="Choose a database"
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {REQUIRED_DATABASES.map((database) => (
                        <div key={database.key} className="rounded-xl bg-zinc-50 p-4">
                          <p className="text-sm font-medium text-zinc-800">{database.title}</p>
                          <p className="mt-1 text-sm text-zinc-500">{database.help}</p>
                        </div>
                      ))}
                    </div>

                    {validation ? (
                      validation.ok ? (
                        <StatusBanner
                          tone="success"
                          title="Setup validated"
                          description={
                            validation.message ||
                            "Everything looks good. Your workspace is ready for activation."
                          }
                        />
                      ) : (
                        <div className="space-y-3">
                          <StatusBanner
                            tone="warning"
                            title="A few things still need attention"
                            description={
                              validation.message ||
                              "Update the missing fields in Notion, then validate again."
                            }
                          />
                          {validation.issues.length ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                              <ul className="space-y-2 text-sm text-amber-900">
                                {validation.issues.map((issue) => (
                                  <li key={`${issue.database}-${issue.message}`}>{issue.message}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      )
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 p-6">
                    <button
                      type="button"
                      onClick={handleSaveDatabases}
                      disabled={
                        saving ||
                        !workspace?.notionConnected ||
                        !selection.candidatesDatabaseId ||
                        !selection.rolesDatabaseId ||
                        !selection.stagesDatabaseId
                      }
                      className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Save selection
                    </button>
                    <Button
                      onClick={handleValidate}
                      disabled={
                        validating ||
                        !workspace?.notionConnected ||
                        !selection.candidatesDatabaseId ||
                        !selection.rolesDatabaseId ||
                        !selection.stagesDatabaseId
                      }
                    >
                      {validating ? "Validating..." : "Validate setup"}
                    </Button>
                  </div>
                </section>

                <section className="animate-fade-up delay-3 hover-lift rounded-2xl border border-zinc-100 bg-white">
                  <div className="border-b border-zinc-100 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                        <CreditCard className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">Step 4: Activate workspace</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Activation unlocks live application links, webhook processing, and confirmation emails.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-8">
                    <div className="rounded-2xl bg-zinc-900 p-6 text-white">
                      <p className="text-sm text-zinc-300">One-time activation</p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-4xl font-bold">{formatCurrency(ONE_TIME_PRICE_USD)}</span>
                        <span className="pb-1 text-sm text-zinc-400">paid once</span>
                      </div>
                      <p className="mt-4 max-w-xl text-sm text-zinc-300">
                        Complete setup first, then activate when you’re ready to accept live applications.
                      </p>
                    </div>

                    {workspace?.paymentPaid ? (
                      <StatusBanner
                        tone="success"
                        title="Workspace activated"
                        description="Your application links are live and automation is enabled."
                      />
                    ) : (
                      <StatusBanner
                        tone={workspace?.validationPassed ? "info" : "warning"}
                        title={
                          workspace?.validationPassed
                            ? "Ready for activation"
                            : "Finish validation before activation"
                        }
                        description={
                          workspace?.validationPassed
                            ? "Checkout happens with Paystack. You only pay once."
                            : "Connect your workspace and validate the three databases before payment."
                        }
                      />
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={beginPayment}
                        disabled={saving || !workspace?.validationPassed || workspace?.paymentPaid}
                      >
                        {saving && activeStep === 4 ? "Opening Paystack..." : "Pay with Paystack"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => void verifyPayment()}
                        disabled={!paymentReference || saving || workspace?.paymentPaid}
                        className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Verify payment
                      </button>
                    </div>
                  </div>
                </section>

                <section className="animate-fade-up hover-lift rounded-2xl border border-zinc-100 bg-white">
                  <div className="border-b border-zinc-100 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                        <Sparkles className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900">Step 5: Go live</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Copy your role links, send a test application, and share your roles when ready.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 p-8">
                    {workspace?.paymentPaid ? (
                      <>
                        <StatusBanner
                          tone="success"
                          title="Your workspace is active"
                          description="Applications can now be processed for your live role links."
                        />
                        {roles.length ? (
                          <div className="space-y-4">
                            {roles.map((role) => (
                              <div
                                key={role.id}
                                className="rounded-xl border border-zinc-100 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <h3 className="font-medium text-zinc-900">{role.name}</h3>
                                    {role.description ? (
                                      <p className="mt-1 max-w-xl text-sm text-zinc-500">
                                        {role.description}
                                      </p>
                                    ) : null}
                                  </div>
                                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                                    {role.status || "Live link"}
                                  </span>
                                </div>
                                <CopyField
                                  className="mt-4"
                                  label="Application link"
                                  value={
                                    role.applicationUrl ||
                                    `${window.location.origin}/apply/${clientSlug}/${role.slug}`
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <StatusBanner
                            tone="warning"
                            title="No roles found yet"
                            description="Add roles in your Notion Roles database, then refresh this page to see live links."
                          />
                        )}

                        {workspace.webhookUrl ? (
                          <CopyField label="Webhook URL" value={workspace.webhookUrl} />
                        ) : null}

                        <div className="flex flex-wrap gap-3">
                          <Button onClick={handleSendTest} disabled={testing}>
                            {testing ? "Sending test..." : "Send test application"}
                          </Button>
                          <Link
                            href="/roles"
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                          >
                            Open workspace home
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          {workspace.setupGuideUrl ? (
                            <a
                              href={workspace.setupGuideUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                              Setup guide
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <StatusBanner
                        tone="warning"
                        title="Activate your workspace to go live"
                        description="You can finish setup now, but role links stay inactive until payment is complete."
                      />
                    )}
                  </div>
                </section>
              </>
            )}

            {formMessage ? (
              <StatusBanner tone="success" title={formMessage} />
            ) : null}
            {error ? <StatusBanner tone="error" title={error} /> : null}
          </div>

          <aside className="space-y-4">
            <div className="animate-soft-scale rounded-2xl border border-zinc-100 bg-white p-6">
              <p className="text-sm font-medium text-zinc-500">Workspace status</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-900">{setupStatus}</h2>
              <p className="mt-2 text-sm text-zinc-500">
                {workspace?.paymentPaid
                  ? "Your application links are live."
                  : "Each step unlocks the next one so setup stays clear and predictable."}
              </p>
              <div className="mt-5 space-y-3 text-sm text-zinc-600">
                <div className="flex items-center justify-between">
                  <span>Client slug</span>
                  <span className="font-medium text-zinc-900">{clientSlug || "Not created yet"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notion connected</span>
                  <span className="font-medium text-zinc-900">
                    {workspace?.notionConnected ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Setup validated</span>
                  <span className="font-medium text-zinc-900">
                    {workspace?.validationPassed ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Activated</span>
                  <span className="font-medium text-zinc-900">
                    {workspace?.paymentPaid ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="animate-soft-scale delay-1 rounded-2xl border border-zinc-100 bg-white p-6">
              <p className="text-sm font-medium text-zinc-500">What happens after activation</p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Role links become live.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Application processing is enabled.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Confirmation emails can send if email is turned on.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
