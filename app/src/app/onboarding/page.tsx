"use client";

import { FormEvent, useState } from 'react';
import { apiBase, apiGet, apiPost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

type Db = { id: string; title: string };

export default function OnboardingPage() {
  const [clientSlug, setClientSlug] = useState('demo-co');
  const [dbs, setDbs] = useState<Db[]>([]);
  const [selected, setSelected] = useState({ candidatesDbId: '', rolesDbId: '', stagesDbId: '' });
  const [msg, setMsg] = useState('');

  async function loadDatabases() {
    try {
      setMsg('Loading databases...');
      const data = await apiGet<Db[]>(`/clients/${clientSlug}/notion/databases`);
      setDbs(data);
      setMsg(`Loaded ${data.length} databases`);
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  async function submitSelection(e: FormEvent) {
    e.preventDefault();
    try {
      setMsg('Saving selection...');
      const res = await apiPost<{ valid: boolean; fixes?: string[] }>(
        `/clients/${clientSlug}/notion/databases/select`,
        selected,
      );
      setMsg(res.valid ? 'Schema valid ✅' : `Schema invalid: ${(res.fixes || []).join(' | ')}`);
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <CardDescription>Connect Notion and map your Candidates, Roles, and Stages databases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="slug">Client slug</Label>
            <Input id="slug" value={clientSlug} onChange={(e) => setClientSlug(e.target.value)} />
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex h-10 items-center rounded-lg border px-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
              href={`${apiBase()}/notion/oauth/start?clientSlug=${clientSlug}&product=HIRING`}
              target="_blank"
            >
              Connect Notion (OAuth)
            </a>
            <Button type="button" variant="secondary" onClick={loadDatabases}>
              Load Notion Databases
            </Button>
          </div>

          <form onSubmit={submitSelection} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Candidates DB</Label>
              <Select
                value={selected.candidatesDbId}
                onChange={(e) => setSelected((s) => ({ ...s, candidatesDbId: e.target.value }))}
              >
                <option value="">Select...</option>
                {dbs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Roles DB</Label>
              <Select value={selected.rolesDbId} onChange={(e) => setSelected((s) => ({ ...s, rolesDbId: e.target.value }))}>
                <option value="">Select...</option>
                {dbs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Stages DB</Label>
              <Select
                value={selected.stagesDbId}
                onChange={(e) => setSelected((s) => ({ ...s, stagesDbId: e.target.value }))}
              >
                <option value="">Select...</option>
                {dbs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </Select>
            </div>

            <Button type="submit">Save & Validate</Button>
          </form>

          {msg ? <p className="rounded-lg border bg-zinc-50 p-3 text-sm dark:bg-zinc-900">{msg}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
