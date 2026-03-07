"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useToast } from "@/components/ui/toast";
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
  SIMPLE_HIRING_REGULAR_PRICE_USD,
} from "@/lib/product";
import {
  clearStoredPaymentReference,
  readStoredClientSlug,
  readStoredPaymentReference,
  storeClientSlug,
  storePaymentReference,
} from "@/lib/workspace-storage";

export const dynamic = "force-dynamic";

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";

const EMPTY_SELECTION: DatabaseSelection = {
  candidatesDatabaseId: "",
  rolesDatabaseId: "",
  stagesDatabaseId: "",
};

type CheckoutMode = NonNullable<PaymentInitializeResponse["checkoutMode"]>;

type PaddleEvent = {
  name?: string;
};

declare global {
  interface Window {
    LemonSqueezy?: {
      Url?: {
        Open: (url: string) => void;
      };
      Setup?: (options: {
        eventHandler?: (event: { event?: string }) => void;
      }) => void;
    };
    createLemonSqueezy?: () => void;
    Paddle?: {
      Environment?: {
        set: (environment: string) => void;
      };
      Initialize: (options: {
        token: string;
        eventCallback?: (event: PaddleEvent) => void;
      }) => void;
      Checkout: {
        open: (options: {
          transactionId: string;
          settings?: Record<string, string>;
        }) => void;
      };
    };
    Paystack?: new () => {
      resumeTransaction: (accessCode: string) => void;
    };
    __simpleSystemsOnCheckoutComplete?: () => void;
    __simpleSystemsPaddleInitialized?: boolean;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPaymentProvider(provider?: string | null) {
  if (!provider) {
    return "payment provider";
  }

  switch (provider.toLowerCase()) {
    case "lemonsqueezy":
      return "Lemon Squeezy";
    case "paddle":
      return "Paddle";
    default:
      return provider;
  }
}

function isOverlayMode(mode?: string | null): mode is CheckoutMode {
  return mode === "overlay" || mode === "popup" || mode === "redirect";
}

function loadScript(src: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available."));
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );

    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    if (!existing) {
      document.body.appendChild(script);
    }
  });
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

function hasCompleteSelection(selection: DatabaseSelection) {
  return Boolean(
    selection.candidatesDatabaseId &&
      selection.rolesDatabaseId &&
      selection.stagesDatabaseId
  );
}

function selectionMatchesWorkspace(
  selection: DatabaseSelection,
  workspace: WorkspaceSummary | null
) {
  if (!workspace?.selectedDatabases) {
    return false;
  }

  return (
    selection.candidatesDatabaseId ===
      (workspace.selectedDatabases.candidatesDatabaseId || "") &&
    selection.rolesDatabaseId ===
      (workspace.selectedDatabases.rolesDatabaseId || "") &&
    selection.stagesDatabaseId ===
      (workspace.selectedDatabases.stagesDatabaseId || "")
  );
}

function databaseSelectionStatus(
  selection: DatabaseSelection,
  workspace: WorkspaceSummary | null
) {
  const complete = hasCompleteSelection(selection);
  const saved = complete && selectionMatchesWorkspace(selection, workspace);

  if (!complete) {
    return {
      tone: "info" as const,
      title: "Selection incomplete",
      description:
        "Choose a Candidates, Roles, and Stages database before saving or validating.",
    };
  }

  if (saved && workspace?.databasesSaved) {
    return {
      tone: "success" as const,
      title: "Selection saved",
      description:
        "These database IDs are already stored in your workspace. You can validate any time.",
    };
  }

  return {
    tone: "warning" as const,
    title: "Selection pending save",
    description:
      "You changed the local selection. Save it or click Validate to persist it before schema checks run.",
  };
}

const VALIDATION_DATABASE_LABELS: Record<
  Exclude<ValidationResult["issues"][number]["database"], "workspace">,
  string
> = {
  candidates: "Candidates",
  roles: "Roles",
  stages: "Stages",
};

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
  const paystackPollRef = useRef<number | null>(null);
  const paystackPollDeadlineRef = useRef(0);
  const verifyPaymentRef = useRef<(referenceOverride?: string, silent?: boolean) => Promise<void>>(
    async () => {}
  );

  const [companyName, setCompanyName] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const { toast } = useToast();

  const stopPaystackPolling = useCallback(() => {
    if (paystackPollRef.current !== null) {
      window.clearInterval(paystackPollRef.current);
      paystackPollRef.current = null;
    }
    paystackPollDeadlineRef.current = 0;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("clientSlug") || readStoredClientSlug();
    const reference = params.get("reference") || readStoredPaymentReference();

    if (slug) {
      setClientSlug(slug);
      storeClientSlug(slug);
    }

    if (reference) {
      setPaymentReference(reference);
    }
  }, [toast]);

  useEffect(() => stopPaystackPolling, [stopPaystackPolling]);

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
      if (workspaceData.paymentPaid) {
        clearStoredPaymentReference();
      }
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
      const message = err instanceof Error ? err.message : "Unable to load workspace.";
      setError(message);
      toast({ tone: "error", title: message });
    } finally {
      if (!silent) {
        setLoadingWorkspace(false);
      }
    }
  }, [toast]);

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
      toast({
        tone: "success",
        title: "Company details saved",
        description: "Next, connect your Notion workspace.",
      });
      await loadWorkspace(slug, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save your settings.";
      setError(message);
      toast({ tone: "error", title: message });
    } finally {
      setSaving(false);
    }
  }

  async function handleConnectNotion() {
    if (!clientSlug) {
      const message = "Save your company details first.";
      setError(message);
      toast({ tone: "error", title: message });
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
      const message = err instanceof Error ? err.message : "Unable to connect your workspace.";
      setError(message);
      toast({ tone: "error", title: message });
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
      toast({
        tone: "success",
        title: "Database selection saved",
        description: "Validate setup to make sure everything is ready.",
      });
      await loadWorkspace(clientSlug, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save your database selection.";
      setError(message);
      toast({ tone: "error", title: message });
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
      if (!hasCompleteSelection(selection)) {
        throw new Error("Choose your Candidates, Roles, and Stages databases first.");
      }

      if (!selectionMatchesWorkspace(selection, workspace)) {
        await apiPost(
          `/clients/${clientSlug}/notion/databases/select`,
          {
            candidatesDbId: selection.candidatesDatabaseId,
            rolesDbId: selection.rolesDatabaseId,
            stagesDbId: selection.stagesDatabaseId,
          },
          "We couldn't save your database selection."
        );
        await loadWorkspace(clientSlug, true);
      }

      const result = await apiPostWithoutBody<ValidationResult>(
        `/clients/${clientSlug}/validate`,
        "We couldn't validate your setup right now."
      );
      setValidation(result);

      if (result.ok) {
        toast({
          tone: "success",
          title: result.message || "Setup validated",
        });
        await loadWorkspace(clientSlug, true);
      } else {
        toast({
          tone: "error",
          title: result.message || "Setup still needs attention",
          description: result.issues[0]?.message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to validate your setup.";
      setError(message);
      toast({ tone: "error", title: message });
    } finally {
      setValidating(false);
    }
  }

  async function beginPayment() {
    if (!clientSlug || !replyToEmail) {
      const message = "Add your reply-to email before activation.";
      setError(message);
      toast({ tone: "error", title: message });
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiPost<PaymentInitializeResponse>(
        `/clients/${clientSlug}/payments/initialize`,
        {
          email: replyToEmail,
          amount: ONE_TIME_PRICE_USD,
          callbackUrl: `${window.location.origin}/onboarding?clientSlug=${clientSlug}`,
        },
        "We couldn't start your payment checkout."
      );

      if (response.reference) {
        setPaymentReference(response.reference);
        storePaymentReference(response.reference);
      }
      await launchPaymentCheckout(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start payment.";
      setError(message);
      toast({ tone: "error", title: message });
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

      if (response.reference) {
        setPaymentReference(response.reference);
      }
      clearStoredPaymentReference();
      stopPaystackPolling();
      await loadWorkspace(clientSlug, true);
      const providerLabel = formatPaymentProvider(response.provider);
      setFormMessage("Payment confirmed. Your workspace is now active.");
      toast({
        tone: "success",
        title: "Payment confirmed",
        description: `Your workspace is now active via ${providerLabel}.`,
      });
    } catch (err) {
      if (!silent) {
        const message = err instanceof Error ? err.message : "Unable to verify payment.";
        setError(message);
        toast({ tone: "error", title: message });
      }
    } finally {
      if (!silent) {
        setSaving(false);
      }
    }
  }, [clientSlug, paymentReference, loadWorkspace, stopPaystackPolling, toast]);

  useEffect(() => {
    verifyPaymentRef.current = verifyPayment;
  }, [verifyPayment]);

  const startPaystackPolling = useCallback(
    (reference: string) => {
      stopPaystackPolling();
      paystackPollDeadlineRef.current = Date.now() + 2 * 60 * 1000;
      paystackPollRef.current = window.setInterval(() => {
        if (Date.now() >= paystackPollDeadlineRef.current) {
          stopPaystackPolling();
          return;
        }

        void verifyPaymentRef.current(reference, true);
      }, 3000);
    },
    [stopPaystackPolling]
  );

  const ensureLemonSqueezy = useCallback(async () => {
    await loadScript("https://app.lemonsqueezy.com/js/lemon.js");
    window.createLemonSqueezy?.();
    window.LemonSqueezy?.Setup?.({
      eventHandler: (event) => {
        if (event.event === "Checkout.Success") {
          window.__simpleSystemsOnCheckoutComplete?.();
        }
      },
    });
  }, []);

  const ensurePaddle = useCallback(async () => {
    if (!PADDLE_CLIENT_TOKEN) {
      throw new Error("Paddle overlay requires NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.");
    }

    await loadScript("https://cdn.paddle.com/paddle/v2/paddle.js");

    if (!window.__simpleSystemsPaddleInitialized) {
      window.Paddle?.Environment?.set(PADDLE_ENV);
      window.Paddle?.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (event) => {
          if (event.name === "checkout.completed") {
            window.__simpleSystemsOnCheckoutComplete?.();
          }
        },
      });
      window.__simpleSystemsPaddleInitialized = true;
    }
  }, []);

  const ensurePaystack = useCallback(async () => {
    await loadScript("https://js.paystack.co/v2/inline.js");
  }, []);

  const launchPaymentCheckout = useCallback(
    async (response: PaymentInitializeResponse) => {
      const provider = response.provider?.toLowerCase();
      const mode = isOverlayMode(response.checkoutMode)
        ? response.checkoutMode
        : "redirect";
      const reference = response.reference || paymentReference;

      window.__simpleSystemsOnCheckoutComplete = () => {
        if (reference) {
          void verifyPaymentRef.current(reference, true);
        }
      };

      try {
        if (provider === "lemonsqueezy" && mode === "overlay" && response.checkoutUrl) {
          await ensureLemonSqueezy();
          window.LemonSqueezy?.Url?.Open(response.checkoutUrl);
          setSaving(false);
          return;
        }

        if (provider === "paddle" && mode === "overlay" && response.checkoutId) {
          await ensurePaddle();
          window.Paddle?.Checkout.open({
            transactionId: response.checkoutId,
            settings: {
              displayMode: "overlay",
              theme: "light",
              variant: "one-page",
            },
          });
          setSaving(false);
          return;
        }

        if (provider === "paystack" && mode === "popup" && response.accessCode) {
          await ensurePaystack();
          if (!reference) {
            throw new Error("Missing payment reference for Paystack verification.");
          }
          startPaystackPolling(reference);
          const paystack = window.Paystack ? new window.Paystack() : null;
          if (!paystack) {
            throw new Error("Paystack popup is unavailable.");
          }
          paystack.resumeTransaction(response.accessCode);
          setSaving(false);
          return;
        }
      } catch (err) {
        const providerLabel = formatPaymentProvider(response.provider);
        toast({
          tone: "warning",
          title: `Falling back to hosted ${providerLabel} checkout`,
          description: err instanceof Error ? err.message : "Popup checkout failed to open.",
        });
      }

      window.location.href = response.authorizationUrl;
    },
    [ensureLemonSqueezy, ensurePaddle, ensurePaystack, paymentReference, startPaystackPolling, toast]
  );

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
      toast({
        tone: "success",
        title: response.message || "Test application sent successfully.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send a test submission.";
      setError(message);
      toast({ tone: "error", title: message });
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
  const selectionState = databaseSelectionStatus(selection, workspace);
  const selectionComplete = hasCompleteSelection(selection);
  const groupedValidationIssues = useMemo(() => {
    if (!validation?.issues?.length) {
      return [];
    }

    const groups = new Map<string, string[]>();

    for (const issue of validation.issues) {
      const key =
        issue.database === "workspace"
          ? "workspace"
          : VALIDATION_DATABASE_LABELS[issue.database];
      groups.set(key, [...(groups.get(key) || []), issue.message]);
    }

    return Array.from(groups.entries()).map(([database, issues]) => ({
      database,
      issues,
    }));
  }, [validation]);
  const hasRoles = roles.length > 0;
  const canSendTest = Boolean(
    roles.length > 0 &&
      workspace?.settings.replyToEmail &&
      workspace.validationPassed &&
      (workspace.paymentPaid || workspace.previewTestAvailable)
  );
  const testButtonLabel = testing
    ? "Sending test..."
    : workspace?.paymentPaid
      ? "Send test application"
      : "Send preview test";

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
              <span className="text-xs font-bold text-white">SH</span>
            </div>
            <span className="brand-heading text-sm font-semibold text-slate-800">{PRODUCT_NAME}</span>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="animate-fade-up space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">Guided setup</p>
              <h1 className="brand-heading text-3xl font-bold text-slate-800">Set up your hiring workspace</h1>
              <p className="max-w-2xl text-slate-500">
                This flow keeps everything simple: save your company details, connect Notion,
                validate the three required databases, then activate your workspace when you are ready.
              </p>
            </div>

            <SetupStepper steps={ONBOARDING_STEPS} currentStep={activeStep} />

            {loadingWorkspace ? (
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm shadow-slate-900/5">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading your workspace...
                </div>
              </div>
            ) : (
              <>
                <section className="animate-fade-up hover-lift rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5">
                  <div className="border-b border-slate-200 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        <Settings className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="brand-heading text-xl font-semibold text-slate-800">Step 1: Company details</h2>
                        <p className="mt-1 text-sm text-slate-500">
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
                    <div className="md:col-span-2 rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail className="h-4 w-4 text-slate-400" />
                          Confirmation emails
                        </div>
                        <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Emails send from <span className="font-medium">notifications@simplehiring.app</span>{" "}
                        with your reply-to address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end border-t border-slate-200 p-6">
                    <Button
                      onClick={handleSaveCompany}
                      disabled={saving || !companyName || !replyToEmail}
                    >
                      {saving && activeStep === 1 ? "Saving..." : "Save and continue"}
                    </Button>
                  </div>
                </section>

                <section className="animate-fade-up delay-1 hover-lift rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5">
                  <div className="border-b border-slate-200 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        <Link2 className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="brand-heading text-xl font-semibold text-slate-800">Step 2: Connect Notion</h2>
                        <p className="mt-1 text-sm text-slate-500">
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
                          className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Refresh status
                        </button>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="animate-fade-up delay-2 hover-lift rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5">
                  <div className="border-b border-slate-200 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        <Database className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="brand-heading text-xl font-semibold text-slate-800">Step 3: Select databases</h2>
                        <p className="mt-1 text-sm text-slate-500">
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
                        <div key={database.key} className="rounded-xl bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-800">{database.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{database.help}</p>
                        </div>
                      ))}
                    </div>

                    <StatusBanner
                      tone={selectionState.tone}
                      title={selectionState.title}
                      description={selectionState.description}
                    />

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
                            <div className="grid gap-3 md:grid-cols-2">
                              {groupedValidationIssues.map((group) => (
                                <div
                                  key={group.database}
                                  className="rounded-xl border border-slate-200 bg-[rgb(var(--warning-soft))] p-4"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                      {group.database}
                                    </p>
                                    <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-600">
                                      {group.issues.length} fix
                                      {group.issues.length === 1 ? "" : "es"}
                                    </span>
                                  </div>
                                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                    {group.issues.map((message) => (
                                      <li
                                        key={`${group.database}-${message}`}
                                        className="rounded-lg bg-white/55 px-3 py-2"
                                      >
                                        {message}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 p-6">
                    <button
                      type="button"
                      onClick={handleSaveDatabases}
                      disabled={
                        saving ||
                        !workspace?.notionConnected ||
                        !selectionComplete
                      }
                      className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Save selection
                    </button>
                    <Button
                      onClick={handleValidate}
                      disabled={
                        validating ||
                        !workspace?.notionConnected ||
                        !selectionComplete
                      }
                    >
                      {validating ? "Validating..." : "Validate setup"}
                    </Button>
                  </div>
                </section>

                <section className="animate-fade-up delay-3 hover-lift rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5">
                  <div className="border-b border-slate-200 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        <CreditCard className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="brand-heading text-xl font-semibold text-slate-800">Step 4: Activate workspace</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Activation unlocks live application links, webhook processing, and confirmation emails.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-8">
                    <div className="rounded-2xl bg-slate-800 p-6 text-white">
                      <p className="text-sm text-slate-300">One-time activation</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-orange-200">
                        Launch offer
                      </div>
                      <div className="mt-3 flex flex-wrap items-end gap-3">
                        <span className="text-lg text-slate-400 line-through">
                          {formatCurrency(SIMPLE_HIRING_REGULAR_PRICE_USD)}
                        </span>
                        <span className="text-4xl font-bold">{formatCurrency(ONE_TIME_PRICE_USD)}</span>
                        <span className="pb-1 text-sm text-slate-400">paid once</span>
                      </div>
                      <p className="mt-4 max-w-xl text-sm text-slate-300">
                        Launch price for early customers. Regular price {formatCurrency(SIMPLE_HIRING_REGULAR_PRICE_USD)}.
                      </p>
                      <p className="mt-3 max-w-xl text-sm text-slate-300">
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
                            ? "Checkout happens with your configured payment provider. You only pay once."
                            : "Connect your workspace and validate the three databases before payment."
                        }
                      />
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={beginPayment}
                        disabled={saving || !workspace?.validationPassed || workspace?.paymentPaid}
                      >
                        {saving && activeStep === 4
                          ? "Opening checkout..."
                          : "Pay and activate"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => void verifyPayment()}
                        disabled={!paymentReference || saving || workspace?.paymentPaid}
                        className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Verify payment
                      </button>
                    </div>
                  </div>
                </section>

                <section className="animate-fade-up hover-lift rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5">
                  <div className="border-b border-slate-200 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--accent-soft))]">
                        <Sparkles className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h2 className="brand-heading text-xl font-semibold text-slate-800">Step 5: Go live</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Copy your role links, send a test application, and share your roles when ready.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 p-8">
                    <div className="rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,1))] p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                            How test submission works
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-slate-800">
                            We create one sample candidate against one real role
                          </h3>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="rounded-xl border border-white/80 bg-white/85 p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Prerequisite
                              </p>
                              <p className="mt-1 text-sm text-slate-700">
                                Your Roles database must already contain at least one role row.
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/80 bg-white/85 p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                What happens
                              </p>
                              <p className="mt-1 text-sm text-slate-700">
                                We send a sample application so you can verify the full flow before going live.
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/80 bg-white/85 p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Success check
                              </p>
                              <p className="mt-1 text-sm text-slate-700">
                                You should see a candidate appear in Notion with the expected role and stage.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {workspace?.paymentPaid ? (
                      <>
                        <StatusBanner
                          tone="success"
                          title="Your workspace is active"
                          description="Applications can now be processed for your live role links."
                        />
                        {!hasRoles ? (
                          <StatusBanner
                            tone="warning"
                            title="Add a role before sending your test application"
                            description="The test runner needs a real role from your selected Roles database. Create one in Notion, then refresh this page."
                          />
                        ) : null}
                        {roles.length ? (
                          <div className="space-y-4">
                            {roles.map((role) => (
                              <div
                                key={role.id}
                                className="rounded-xl border border-slate-200 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <h3 className="font-medium text-slate-800">{role.name}</h3>
                                    {role.description ? (
                                      <p className="mt-1 max-w-xl text-sm text-slate-500">
                                        {role.description}
                                      </p>
                                    ) : null}
                                  </div>
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
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
                          <div className="rounded-3xl border border-dashed border-amber-300 bg-[linear-gradient(135deg,rgba(255,251,235,1),rgba(255,247,237,1))] p-6">
                            <p className="text-sm font-semibold text-amber-950">Your Roles database is empty</p>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-amber-900/80">
                              Add the first role row in Notion, then refresh this page to generate live links and unlock
                              test submissions.
                            </p>
                          </div>
                        )}

                        {workspace.webhookUrl ? (
                          <CopyField label="Webhook URL" value={workspace.webhookUrl} />
                        ) : null}

                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Roles</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">
                              {hasRoles ? `${roles.length} ready to use` : "No role added yet"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Submission mode</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">Live activated flow</p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Next step</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">
                              {hasRoles ? "Send test and verify Notion" : "Create your first role in Notion"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={handleSendTest}
                            disabled={testing || !canSendTest}
                            title={!hasRoles ? "Add a role in Notion before sending a test application." : undefined}
                          >
                            {testButtonLabel}
                          </Button>
                          <Link
                            href="/roles"
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Open workspace home
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          {workspace.setupGuideUrl ? (
                            <a
                              href={workspace.setupGuideUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Setup guide
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <StatusBanner
                          tone={workspace?.previewTestAvailable ? "info" : "warning"}
                          title={
                            workspace?.previewTestAvailable
                              ? "You can run one preview test before payment"
                              : "Activate your workspace to go live"
                          }
                          description={
                            workspace?.previewTestAvailable
                              ? "We’ll send one backend-driven test application into Notion so you can confirm the setup before activation."
                              : workspace?.previewTestUsed
                                ? "Your free preview test is already used. Complete payment to keep sending test applications and make role links live."
                                : "You can finish setup now, but role links stay inactive until payment is complete."
                          }
                        />
                        {!hasRoles ? (
                          <StatusBanner
                            tone="warning"
                            title="Preview testing is blocked until a role exists"
                            description="Add your first role in the selected Roles database, then refresh this page to unlock the preview test."
                          />
                        ) : null}
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Roles</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">
                              {hasRoles ? `${roles.length} ready to use` : "No role added yet"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Submission mode</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">
                              {workspace?.previewTestAvailable ? "One preview test available" : "Preview unavailable"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Next step</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">
                              {hasRoles ? "Run preview test" : "Create your first role in Notion"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={handleSendTest}
                            disabled={testing || !canSendTest}
                            title={!hasRoles ? "Add a role in Notion before sending a test application." : undefined}
                          >
                            {testButtonLabel}
                          </Button>
                        </div>
                      </div>
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
            <div className="animate-soft-scale rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-900/5">
              <p className="text-sm font-medium text-slate-500">Workspace status</p>
              <h2 className="brand-heading mt-2 text-2xl font-semibold text-slate-800">{setupStatus}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {workspace?.paymentPaid
                  ? "Your application links are live."
                  : "Each step unlocks the next one so setup stays clear and predictable."}
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Client slug</span>
                  <span className="font-medium text-slate-800">{clientSlug || "Not created yet"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notion connected</span>
                  <span className="font-medium text-slate-800">
                    {workspace?.notionConnected ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Setup validated</span>
                  <span className="font-medium text-slate-800">
                    {workspace?.validationPassed ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Activated</span>
                  <span className="font-medium text-slate-800">
                    {workspace?.paymentPaid ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="animate-soft-scale delay-1 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-900/5">
              <p className="text-sm font-medium text-slate-500">What happens after activation</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                  Role links become live.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                  Application processing is enabled.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
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
