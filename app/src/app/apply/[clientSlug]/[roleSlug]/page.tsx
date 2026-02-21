import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiBase } from '@/lib/api';

type Props = {
  params: Promise<{ clientSlug: string; roleSlug: string }>;
};

export default async function ApplyPage({ params }: Props) {
  const { clientSlug, roleSlug } = await params;
  const res = await fetch(`${apiBase()}/apply/${clientSlug}/${roleSlug}`, { cache: 'no-store' });

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Role not found</CardTitle>
            <CardDescription>Check client slug and role slug.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const data = await res.json();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Apply for {data.roleName || roleSlug}</CardTitle>
          <CardDescription>Client: {clientSlug}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            Role Page ID: <code>{data.rolePageId}</code>
          </p>
          <p>Next: embed your Tally form and pass rolePageId as a hidden field.</p>
        </CardContent>
      </Card>
    </main>
  );
}
