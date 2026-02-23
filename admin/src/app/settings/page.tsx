"use client";

import { useState } from 'react';
import { Save, Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk_test_your_key_here');
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your admin settings</p>
      </div>

      <div className="rounded-xl border border-zinc-100 bg-white p-6">
        <h2 className="font-semibold text-zinc-900">API Configuration</h2>
        <p className="mt-1 text-sm text-zinc-500 mb-6">Configure your API keys and endpoints</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">API Key</label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={revealed ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-200 px-3 pr-20 text-sm font-mono"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setRevealed(!revealed)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600"
                  >
                    {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Webhook Endpoint</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                value="https://api.simplesystems.app/webhooks"
                readOnly
                className="flex-1 h-10 rounded-lg border border-zinc-200 px-3 text-sm font-mono text-zinc-500"
              />
              <button
                onClick={() => navigator.clipboard.writeText('https://api.simplesystems.app/webhooks')}
                className="h-10 px-3 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-100 bg-white p-6">
        <h2 className="font-semibold text-zinc-900">Email Settings</h2>
        <p className="mt-1 text-sm text-zinc-500 mb-6">Configure email sending</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">Sender Email</label>
            <input
              type="email"
              defaultValue="noreply@simplesystems.app"
              className="mt-1.5 w-full h-10 rounded-lg border border-zinc-200 px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Sender Name</label>
            <input
              type="text"
              defaultValue="Simple Systems"
              className="mt-1.5 w-full h-10 rounded-lg border border-zinc-200 px-3 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-100 bg-white p-6">
        <h2 className="font-semibold text-zinc-900">Environment</h2>
        <p className="mt-1 text-sm text-zinc-500 mb-6">Current deployment settings</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-zinc-600">Environment</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Staging
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-zinc-600">Database</span>
            <span className="text-sm text-zinc-900">PostgreSQL (render-prod)</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-zinc-600">Last deployed</span>
            <span className="text-sm text-zinc-500">Feb 22, 2026 at 10:30 AM</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="h-10 px-5 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
