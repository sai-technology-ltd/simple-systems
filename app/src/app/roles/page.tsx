import Link from 'next/link';
import { Copy, Users, Globe } from 'lucide-react';

const ROLES = [
  { id: '1', name: 'Nail Technician', status: 'active', applicants: 12, lastApplied: '2 hours ago' },
  { id: '2', name: 'Front Desk Manager', status: 'active', applicants: 8, lastApplied: '1 day ago' },
  { id: '3', name: 'Esthetician', status: 'paused', applicants: 0, lastApplied: 'Never' },
];

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SH</span>
            </div>
            <span className="text-sm font-medium text-zinc-900">Simple Hiring</span>
          </Link>
          <Link href="/onboarding" className="text-sm text-zinc-400 hover:text-zinc-600">Back to setup</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-900">Your roles</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your open positions.</p>
        </div>

        <div className="space-y-3">
          {ROLES.map((role) => (
            <div
              key={role.id}
              className="rounded-xl border border-zinc-100 p-4 hover:border-zinc-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    role.status === 'active' ? 'bg-orange-50' : 'bg-zinc-50'
                  }`}>
                    <Users className={`w-4 h-4 ${role.status === 'active' ? 'text-orange-600' : 'text-zinc-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900">{role.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs ${role.status === 'active' ? 'text-emerald-600' : 'text-zinc-400'}`}>
                        {role.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                      <span className="text-zinc-200">·</span>
                      <span className="text-xs text-zinc-400">{role.applicants} applicants</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(`https://simplehiring.app/apply/demo/${role.id}`)}
                  className="h-8 px-3 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-50">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Globe className="w-3 h-3" />
                  <code className="font-mono">simplehiring.app/apply/demo/{role.id}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-zinc-50 text-center">
          <p className="text-xs text-zinc-500">
            Roles are managed in your Notion workspace.
          </p>
        </div>
      </main>
    </div>
  );
}
