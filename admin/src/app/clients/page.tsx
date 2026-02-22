import Link from 'next/link';
import { Search, Eye, Pause, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Client {
  id: string;
  companyName: string;
  slug: string;
  productType: 'HIRING' | 'HELPDESK';
  status: 'active' | 'suspended';
  setupComplete: boolean;
  emailsSent: number;
  lastWebhook: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', companyName: 'Acme Salon', slug: 'acme-salon', productType: 'HIRING', status: 'active', setupComplete: true, emailsSent: 47, lastWebhook: '2 min ago' },
  { id: '2', companyName: 'Tech Startup Inc', slug: 'tech-startup', productType: 'HIRING', status: 'active', setupComplete: true, emailsSent: 123, lastWebhook: '5 min ago' },
  { id: '3', companyName: 'Downtown Clinic', slug: 'downtown-clinic', productType: 'HIRING', status: 'active', setupComplete: false, emailsSent: 0, lastWebhook: 'Never' },
  { id: '4', companyName: 'Creative Agency', slug: 'creative-agency', productType: 'HELPDESK', status: 'suspended', setupComplete: true, emailsSent: 89, lastWebhook: '1 day ago' },
  { id: '5', companyName: 'Fitness Studio', slug: 'fitness-studio', productType: 'HIRING', status: 'active', setupComplete: true, emailsSent: 12, lastWebhook: '10 min ago' },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage and monitor all client accounts</p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-zinc-100">
          <CardTitle className="text-base font-semibold">All Clients</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input placeholder="Search clients..." className="pl-9 h-9 bg-zinc-50 border-zinc-200" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Setup</th>
                  <th className="px-6 py-3">Emails</th>
                  <th className="px-6 py-3">Last Webhook</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_CLIENTS.map((client) => (
                  <tr key={client.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/clients/${client.slug}`} className="font-medium text-zinc-900 hover:text-orange-600 transition-colors">
                        {client.companyName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{client.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs font-medium">{client.productType}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {client.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.setupComplete ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Check className="w-3 h-3" /> Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                          Incomplete
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{client.emailsSent}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{client.lastWebhook}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                          <Link href={`/clients/${client.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {client.status === 'active' ? (
                            <Pause className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Play className="h-4 w-4 text-emerald-600" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <p className="text-sm text-zinc-500">Showing {MOCK_CLIENTS.length} clients</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
              <Button variant="outline" size="sm" disabled className="h-8">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
