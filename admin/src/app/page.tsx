import Link from 'next/link';
import { Users, FileText, BarChart3, Zap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const STATS = [
  { label: 'Active clients', value: '24', change: '+2', icon: Users, color: 'orange' },
  { label: 'Webhooks (24h)', value: '1,247', change: '+12%', icon: Zap, color: 'emerald' },
  { label: 'Emails sent', value: '3,892', change: '+8%', icon: FileText, color: 'blue' },
  { label: 'Error rate', value: '2.3%', change: '-0.5%', icon: AlertCircle, color: 'red' },
];

const RECENT = [
  { client: 'Acme Salon', event: 'New application', time: '2 min ago', type: 'success' },
  { client: 'Tech Startup', event: 'Webhook received', time: '5 min ago', type: 'success' },
  { client: 'Downtown Clinic', event: 'Setup completed', time: '1 hour ago', type: 'success' },
  { client: 'Creative Agency', event: 'Email failed', time: '2 hours ago', type: 'error' },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Overview of your Simple Systems</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${
                stat.color === 'orange' ? 'text-orange-500' :
                stat.color === 'emerald' ? 'text-emerald-500' :
                stat.color === 'blue' ? 'text-blue-500' :
                'text-red-500'
              }`} />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900">{stat.value}</span>
              <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Recent activity</h2>
            <Link href="/logs" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-zinc-900">{item.event}</p>
                  <p className="text-xs text-zinc-500">{item.client}</p>
                </div>
                <span className="text-xs text-zinc-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Quick actions</h2>
          </div>
          <div className="grid gap-3">
            <Link href="/clients" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">View clients</p>
                <p className="text-xs text-zinc-500">Manage client accounts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
            </Link>
            <Link href="/logs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">System logs</p>
                <p className="text-xs text-zinc-500">View recent events</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
            </Link>
            <Link href="/metrics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">Metrics</p>
                <p className="text-xs text-zinc-500">View system performance</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
