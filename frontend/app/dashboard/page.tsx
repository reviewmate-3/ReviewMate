'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL, getAccessToken, logout } from '@/lib/auth';
import { getStoredUser } from '@/lib/auth';

type Business = { id: string; name: string };
type Overview = { qr_scans: number; feedback_submitted: number; reviews_generated: number; google_clicks: number };
type DailyPoint = { date: string; count: number };

const emptyOverview: Overview = { qr_scans: 0, feedback_submitted: 0, reviews_generated: 0, google_clicks: 0 };

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [overview, setOverview] = useState(emptyOverview);
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAccessToken()) {
      window.location.href = '/login';
      return;
    }
    if (getStoredUser()?.role === 'SUPER_ADMIN') {
      window.location.href = '/admin';
      return;
    }
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    Promise.all([
      fetch(`${API_URL}/api/v1/businesses/`, { headers }),
      fetch(`${API_URL}/api/v1/analytics/overview`, { headers }),
      fetch(`${API_URL}/api/v1/analytics/daily`, { headers }),
    ])
      .then(async ([businessResponse, overviewResponse, dailyResponse]) => {
        const [businessPayload, overviewPayload, dailyPayload] = await Promise.all([
          businessResponse.json(), overviewResponse.json(), dailyResponse.json(),
        ]);
        if (!businessResponse.ok) throw new Error(businessPayload?.error?.message || 'Unable to load business.');
        if (!overviewResponse.ok) throw new Error(overviewPayload?.detail || 'Unable to load analytics.');
        setBusiness(businessPayload.data?.[0] || null);
        setOverview(overviewPayload.data || emptyOverview);
        setDaily(dailyPayload.data || []);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }

  const stats = [
    ['QR Scans', overview.qr_scans],
    ['Feedback Submitted', overview.feedback_submitted],
    ['AI Drafts', overview.reviews_generated],
    ['Google Clicks', overview.google_clicks],
  ];
  const maxDaily = Math.max(...daily.map((point) => point.count), 1);
  const navigation = [['Overview', '/dashboard'], ['Business', '/dashboard/business'], ['Services', '/dashboard/services'], ['Team', '/dashboard/team'], ['Feedback', '/dashboard/feedback'], ['Reputation', '/dashboard/reputation'], ['Billing', '/dashboard/billing'], ['QR Code', '/dashboard/qr']];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div><p className="text-sm text-slate-500">Business dashboard</p><h1 className="text-2xl font-black text-slate-900">{business?.name || 'Your business'}</h1></div>
          <div className="flex items-center gap-3"><Link href="/" className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Home</Link><Link href="/profile" className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Profile</Link><button onClick={handleLogout} className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">Logout</button></div>
        </header>
        {error && <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!business && !error && <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="text-lg font-black text-slate-900">Finish setting up your business</h2><p className="mt-1 text-sm text-slate-600">Create your business profile before generating a QR code or collecting feedback.</p><Link href="/dashboard/business" className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Create business profile</Link></div>}
        <div className="grid gap-6 md:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><div className="text-sm text-slate-500">{label}</div><div className="mt-4 text-3xl font-black text-slate-900">{value.toLocaleString()}</div></div>)}</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[260px,1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><nav className="space-y-2 text-sm font-medium text-slate-700">{navigation.map(([item, href]) => <Link href={href} key={item} className="block rounded-xl px-3 py-2 hover:bg-slate-100">{item}</Link>)}</nav></aside>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><h2 className="text-xl font-black text-slate-900">Performance overview</h2><div className="mt-6 grid gap-6 md:grid-cols-2"><div className="rounded-2xl bg-slate-100 p-5"><div className="text-sm text-slate-500">Recorded events by day</div><div className="mt-4 flex h-40 items-end gap-2">{daily.length ? daily.map((point) => <div key={point.date} className="flex flex-1 flex-col items-center gap-1" title={`${point.date}: ${point.count}`}><div className="w-full rounded-t bg-blue-400" style={{ height: `${Math.max((point.count / maxDaily) * 100, 4)}%` }} /><span className="text-[10px] text-slate-500">{point.date.slice(5)}</span></div>) : <p className="text-sm text-slate-500">No analytics events recorded yet.</p>}</div></div><div className="rounded-2xl bg-slate-100 p-5"><div className="text-sm text-slate-500">Review journey</div><div className="mt-4 space-y-3">{[['QR Scans', overview.qr_scans], ['Feedback Submitted', overview.feedback_submitted], ['AI Drafts', overview.reviews_generated], ['Google Clicks', overview.google_clicks]].map(([label, value]) => <div key={label} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-slate-700"><span>{label}</span><strong>{value}</strong></div>)}</div></div></div></section>
        </div>
      </div>
    </main>
  );
}
