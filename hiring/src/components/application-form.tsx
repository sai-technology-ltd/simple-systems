"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBanner } from "@/components/status-banner";
import { apiPost } from "@/lib/api";

interface ApplicationFormProps {
  clientSlug: string;
  roleSlug: string;
}

export function ApplicationForm({
  clientSlug,
  roleSlug,
}: ApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cvUrl: "",
    notes: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await apiPost(
        `/apply/${clientSlug}/${roleSlug}`,
        formData,
        "We couldn't submit your application. Please try again."
      );
      setMessage("Application received. We’ve sent it to the hiring workspace.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        cvUrl: "",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-up space-y-4">
      {message ? <StatusBanner tone="success" title={message} /> : null}
      {error ? <StatusBanner tone="error" title={error} /> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="animate-fade-up space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="animate-fade-up delay-1 space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="jane@company.com"
            required
          />
        </div>

        <div className="animate-fade-up delay-2 grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(event) =>
                setFormData((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="+1 555 123 4567"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cvUrl">CV URL (optional)</Label>
            <Input
              id="cvUrl"
              type="url"
              value={formData.cvUrl}
              onChange={(event) =>
                setFormData((current) => ({ ...current, cvUrl: event.target.value }))
              }
              placeholder="https://"
            />
          </div>
        </div>

        <div className="animate-fade-up delay-3 space-y-1.5">
          <Label htmlFor="notes">Anything else? (optional)</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(event) =>
              setFormData((current) => ({ ...current, notes: event.target.value }))
            }
            className="min-h-32 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#ea5c1c]/40"
            placeholder="Share a short note with your application."
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit application
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
