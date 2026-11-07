'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL, getAccessToken, getStoredUser, logout } from '@/lib/auth';

type Business = { id: string; name: string };
type Overview = { qr_scans: number; feedback_submitted: number; reviews_generated: number; google_clicks: number };
type DailyPoint = { date: string; count: number };

const emptyOverview: Overview = { qr_scans: 0, feedback_submitted: 0, reviews_generated: 0, google_clicks: 0 };
const navigation = [
  ['Overview', '/dashboard', '⌂'],
  ['Feedback', '/dashboard/feedback', '◌'],
  ['Reputation', '/dashboard/reputation', '✦'],
  ['QR code', '/dashboard/qr', '⌁'],
  ['Business', '/dashboard/business', '▣'],
  ['Services', '/dashboard/services', '◇'],
  ['Team', '/dashboard/team', '◫'],
  ['Billing', '/dashboard/billing', '◈'],
];

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [overview, setOverview] = useState(emptyOverview);
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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

  const maxDaily = Math.max(...daily.map((point) => point.count), 1);
  const conversionRate = overview.qr_scans ? Math.round((overview.google_clicks / overview.qr_scans) * 100) : 0;
  const initials = (business?.name || 'Expera').slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f4f7f9] text-[#071b2f]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-[#071b2f] px-5 py-6 text-white transition-transform lg:relative lg:translate-x-0`}>
          <div className="flex items-center gap-3 px-2"><img src="/expera-logo.svg" alt="Expera" className="h-10 w-auto brightness-0 invert" /></div>
          <div className="mt-12 px-2"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p><p className="mt-2 truncate text-sm font-bold">{business?.name || 'Your business'}</p></div>
          <nav className="mt-7 space-y-1">
            {navigation.map(([label, href, icon]) => <Link href={href} key={label} onClick={() => setMenuOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${label === 'Overview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base text-cyan-300">{icon}</span>{label}{label === 'Overview' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />}</Link>)}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold text-cyan-300">Expera intelligence</p><p className="mt-2 text-xs leading-5 text-slate-400">Turn customer signals into your next best action.</p><Link href="/dashboard/feedback" className="mt-4 inline-block text-xs font-bold text-white">View feedback →</Link></div>
        </aside>
        {menuOpen && <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-20 bg-[#071b2f]/50 lg:hidden" />}

        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3"><button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg border border-slate-200 p-2 text-lg lg:hidden" aria-label="Open navigation">☰</button><div><p className="text-xs font-semibold text-slate-400">Good morning</p><h1 className="text-lg font-black sm:text-xl">{business?.name || 'Your business'}</h1></div></div>
            <div className="flex items-center gap-2 sm:gap-4"><Link href="/profile" className="hidden text-sm font-semibold text-slate-500 hover:text-[#071b2f] sm:block">Profile</Link><button type="button" onClick={handleLogout} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#087f92] text-sm font-black text-white" title="Log out">{getStoredUser()?.name?.slice(0, 1).toUpperCase() || initials}</button></div>
          </header>

          <div className="p-5 sm:p-8 lg:p-10">
            {error && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
            {!business && !error && <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-6"><h2 className="text-lg font-black">Set up your business workspace</h2><p className="mt-1 text-sm text-slate-600">Create your business profile before generating a QR code or collecting feedback.</p><Link href="/dashboard/business" className="mt-4 inline-block rounded-xl bg-[#071b2f] px-4 py-3 text-sm font-bold text-white">Create business profile →</Link></div>}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087f92]">Overview</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">See what your customers see.</h2><p className="mt-2 text-sm text-slate-500">A clear view of your customer experience, updated as feedback comes in.</p></div><Link href="/dashboard/qr" className="rounded-xl bg-[#071b2f] px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#071b2f]/10">Share your QR code ↗</Link></div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Feedback collected', overview.feedback_submitted, 'Responses from customers', 'bg-cyan-50', 'text-cyan-800'],
                ['Experience signals', overview.qr_scans, 'QR scans this period', 'bg-amber-50', 'text-amber-800'],
                ['AI drafts created', overview.reviews_generated, 'Customer-owned drafts', 'bg-indigo-50', 'text-indigo-800'],
                ['Google actions', overview.google_clicks, `${conversionRate}% from QR scans`, 'bg-emerald-50', 'text-emerald-800'],
              ].map(([label, value, caption, color, textColor]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${color} ${textColor}`}>Live</span></div><p className="mt-5 text-3xl font-black tracking-tight">{Number(value).toLocaleString()}</p><p className="mt-1 text-xs text-slate-400">{caption}</p></div>)}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Activity</p><h3 className="mt-2 text-xl font-black">Customer signals over time</h3></div><span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">Recent activity</span></div><div className="mt-8 flex h-52 items-end gap-1.5 sm:gap-3">{daily.length ? daily.map((point) => <div key={point.date} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${point.date}: ${point.count}`}><div className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-[#087f92] to-cyan-300 transition group-hover:from-[#071b2f]" style={{ height: `${Math.max((point.count / maxDaily) * 100, 4)}%` }} /><span className="text-[9px] text-slate-400 sm:text-[10px]">{point.date.slice(5)}</span></div>) : <p className="self-center text-sm text-slate-400">No customer activity recorded yet.</p>}</div></section>
              <section className="rounded-2xl bg-[#071b2f] p-5 text-white sm:p-7"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-[#071b2f]">✦</span><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Expera insight</p></div><h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.04em]">Your next best action.</h3><p className="mt-4 text-sm leading-6 text-slate-300">{overview.feedback_submitted ? `You have collected ${overview.feedback_submitted} customer signal${overview.feedback_submitted === 1 ? '' : 's'}. Review the latest feedback to spot what is helping or hurting the experience.` : 'Once customers start responding, Expera will surface the themes and moments worth acting on.'}</p><Link href="/dashboard/feedback" className="mt-7 inline-block rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-[#071b2f]">Explore feedback →</Link></section>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Journey health</p><h3 className="mt-2 text-xl font-black">From scan to action</h3></div><Link href="/dashboard/reputation" className="text-sm font-bold text-[#087f92]">View reputation →</Link></div><div className="mt-7 grid gap-3 md:grid-cols-4">{[['QR scans', overview.qr_scans], ['Feedback', overview.feedback_submitted], ['AI drafts', overview.reviews_generated], ['Google actions', overview.google_clicks]].map(([label, value], index) => <div key={label} className="relative rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{Number(value).toLocaleString()}</p>{index < 3 && <span className="absolute -right-2 top-1/2 z-10 hidden text-lg text-slate-300 md:block">→</span>}</div>)}</div></section>
          </div>
        </section>
      </div>
    </main>
  );
}
