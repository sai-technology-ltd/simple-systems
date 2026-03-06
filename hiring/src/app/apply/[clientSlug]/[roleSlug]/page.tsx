import Link from "next/link";
import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { ApplicationForm } from "@/components/application-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiBase } from "@/lib/api";
import type { RoleDetail } from "@/lib/contracts";

export const dynamic = "force-dynamic";

interface ApplyPageProps {
  params: Promise<{ clientSlug: string; roleSlug: string }>;
}

async function getRoleDetail(clientSlug: string, roleSlug: string) {
  try {
    const response = await fetch(
      `${apiBase()}/clients/${clientSlug}/roles/${roleSlug}`,
      { cache: "no-store" }
    );

    if (response.status === 404) {
      return { notFound: true as const };
    }

    if (!response.ok) {
      throw new Error("Unable to load this role right now.");
    }

    return { role: (await response.json()) as RoleDetail };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to load this role right now.",
    };
  }
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { clientSlug, roleSlug } = await params;
  const result = await getRoleDetail(clientSlug, roleSlug);

  if ("notFound" in result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <Card className="animate-soft-scale w-full max-w-lg border-zinc-200">
          <CardHeader>
            <CardTitle className="text-2xl">Role not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600">
              This application link doesn’t match a live role.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-orange-600">
              <ArrowLeft className="h-4 w-4" />
              Back to Simple Hiring
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if ("error" in result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <Card className="animate-soft-scale w-full max-w-lg border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{result.error}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { role } = result;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="animate-fade-up mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Simple Hiring
          </Link>
        </div>

        <Card className="animate-soft-scale border-zinc-200 shadow-sm">
          <CardHeader className="space-y-4 border-b border-zinc-100">
            <div className="inline-flex w-fit items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
              {role.companyName || "Simple Hiring"}
            </div>
            <div>
              <CardTitle className="text-3xl">{role.name}</CardTitle>
              {role.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                  {role.description}
                </p>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!role.workspaceActive ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                This workspace is not active yet, so applications are currently paused.
              </div>
            ) : role.formMode === "redirect" && role.formUrl ? (
              <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
                <p className="text-sm text-zinc-600">
                  This role uses an external application form.
                </p>
                <a
                  href={role.formUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Open application form
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <ApplicationForm clientSlug={clientSlug} roleSlug={roleSlug} />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
