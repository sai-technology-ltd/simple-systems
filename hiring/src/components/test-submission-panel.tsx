"use client";

import type { ReactNode } from "react";
import { CheckCircle2, CircleDot, Mail, Send, Sparkles, Users, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

type TestSubmissionPanelProps = {
  paid: boolean;
  rolesCount: number;
  replyToEmail?: string | null;
  validationPassed: boolean;
  previewTestAvailable?: boolean;
  previewTestUsed?: boolean;
  className?: string;
  children?: ReactNode;
};

type ChecklistItem = {
  label: string;
  detail: string;
  ready: boolean;
};

function ChecklistRow({ item }: { item: ChecklistItem }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3",
        item.ready
          ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
          : "border-amber-200 bg-amber-50/90 text-amber-950"
      )}
    >
      {item.ready ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CircleDot className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div>
        <p className="text-sm font-semibold">{item.label}</p>
        <p className="mt-1 text-sm opacity-80">{item.detail}</p>
      </div>
    </div>
  );
}

export function TestSubmissionPanel({
  paid,
  rolesCount,
  replyToEmail,
  validationPassed,
  previewTestAvailable,
  previewTestUsed,
  className,
  children,
}: TestSubmissionPanelProps) {
  const checklist: ChecklistItem[] = [
    {
      label:
        rolesCount > 0
          ? `${rolesCount} role${rolesCount === 1 ? "" : "s"} ready in Notion`
          : "Add at least one role in Notion",
      detail:
        rolesCount > 0
          ? "The test uses the first role in your selected Roles database."
          : "Test submission pulls the first row from your Roles database. No role rows means nothing to test against.",
      ready: rolesCount > 0,
    },
    {
      label: replyToEmail ? "Reply-to email is set" : "Set a reply-to email",
      detail: replyToEmail
        ? `The confirmation lands at ${replyToEmail}.`
        : "The test candidate email is sent to your reply-to address so you can verify the notification flow.",
      ready: Boolean(replyToEmail),
    },
    {
      label: validationPassed ? "Workspace validation passed" : "Finish database validation",
      detail: validationPassed
        ? "Your Roles, Candidates, and Stages databases are structured well enough for a full intake run."
        : "Validation checks that Notion has the required fields before the backend creates a candidate record.",
      ready: validationPassed,
    },
    {
      label: paid
        ? "Workspace is active"
        : previewTestAvailable
          ? "One preview test is available"
          : previewTestUsed
            ? "Preview test already used"
            : "Activation or preview access is still blocked",
      detail: paid
        ? "Paid workspaces can send test applications whenever needed."
        : previewTestAvailable
          ? "Before payment, you get one backend-driven preview test."
          : previewTestUsed
            ? "Complete payment to keep sending test applications after the free preview is used."
            : "Preview tests only unlock after the workspace validates successfully.",
      ready: paid || Boolean(previewTestAvailable),
    },
  ];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_24px_80px_-48px_rgba(24,24,27,0.45)]",
        className
      )}
    >
      <div className="border-b border-zinc-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,1),_rgba(250,250,250,1))] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
              <Sparkles className="h-3.5 w-3.5" />
              Test Submission
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-zinc-950">Run the exact backend path before you share links</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              We create a synthetic candidate, attach them to the first role in your Roles database, place them into the
              first stage in Notion, and send the confirmation email to your reply-to inbox.
            </p>
          </div>
          <div className="min-w-[240px] rounded-3xl border border-zinc-200 bg-white/90 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">What this verifies</p>
            <div className="mt-3 space-y-3 text-sm text-zinc-700">
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <span>A role row exists and can be read from Notion</span>
              </div>
              <div className="flex items-start gap-2">
                <Workflow className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <span>A candidate can be created and dropped into the first stage</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <span>Your email notification path is working end to end</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Before you press send</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <ChecklistRow key={item.label} item={item} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex items-center gap-2 text-zinc-900">
            <Send className="h-4 w-4" />
            <p className="text-sm font-semibold">Expected result</p>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
            <p>
              You should see a new candidate named <span className="font-medium text-zinc-900">Test Candidate</span> in
              Notion.
            </p>
            <p>
              The candidate uses your first available role and starts in your earliest stage, so this is a workflow test,
              not a content test.
            </p>
            <p>
              If roles are empty, the button stays unavailable because the backend has nothing to attach the candidate to.
            </p>
          </div>
          {children ? <div className="mt-5 flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
