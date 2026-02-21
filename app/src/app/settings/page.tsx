"use client";

import { FormEvent, useState } from 'react';
import { apiPatch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [clientSlug, setClientSlug] = useState('demo-co');
  const [companyName, setCompanyName] = useState('Demo Co');
  const [replyToEmail, setReplyToEmail] = useState('hiring@democo.com');
  const [logoUrl, setLogoUrl] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [monthlyEmailQuota, setMonthlyEmailQuota] = useState(500);
  const [msg, setMsg] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setMsg('Saving...');
      await apiPatch(`/clients/${clientSlug}/settings`, {
        companyName,
        replyToEmail,
        logoUrl,
        emailEnabled,
        monthlyEmailQuota,
      });
      setMsg('Saved ✅');
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Client Settings</CardTitle>
          <CardDescription>Update branding, reply-to, and email quota.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Client slug</Label>
              <Input value={clientSlug} onChange={(e) => setClientSlug(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Company name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Reply-to email</Label>
              <Input value={replyToEmail} onChange={(e) => setReplyToEmail(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Logo URL</Label>
              <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
            </div>

            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
              Email enabled
            </label>

            <div className="grid gap-2">
              <Label>Monthly email quota</Label>
              <Input
                type="number"
                value={monthlyEmailQuota}
                onChange={(e) => setMonthlyEmailQuota(Number(e.target.value || 0))}
              />
            </div>

            <Button type="submit">Save settings</Button>
          </form>

          {msg ? <p className="mt-4 rounded-lg border bg-zinc-50 p-3 text-sm dark:bg-zinc-900">{msg}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
