'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL, getAccessToken } from '@/lib/auth';

type Plan = { code: string; name: string; monthly_price_inr: number; monthly_feedback_limit: number; location_limit: number; ai_enabled: boolean };
type Subscription = { business_id: string; business_name: string; status: string; plan: Plan; usage: { feedback_used: number; feedback_limit: number; feedback_remaining: number } };

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/billing/overview`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.detail || payload?.error?.message || 'Unable to load billing.');
        setSubscriptions(payload.data?.subscriptions || []);
        setPlans(payload.data?.available_plans || []);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div><p className="text-sm text-slate-500">Subscription and usage</p><h1 className="text-2xl font-black text-slate-900">Billing</h1></div>
          <div className="flex gap-2"><Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link><Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Home</Link></div>
        </header>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <section className="space-y-4">{subscriptions.length ? subscriptions.map((subscription) => { const percent = Math.min((subscription.usage.feedback_used / subscription.usage.feedback_limit) * 100, 100); return <article key={subscription.business_id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-slate-500">{subscription.business_name}</p><h2 className="text-xl font-black text-slate-900">{subscription.plan.name} plan</h2></div><span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">{subscription.status}</span></div><div className="mt-5"><div className="flex justify-between text-sm text-slate-600"><span>Monthly feedback usage</span><span>{subscription.usage.feedback_used.toLocaleString()} / {subscription.usage.feedback_limit.toLocaleString()}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${percent >= 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }} /></div><p className="mt-2 text-sm text-slate-500">{subscription.usage.feedback_remaining.toLocaleString()} responses remaining this month</p></div></article>; }) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No business subscription is available yet.</div>}</section>
        <section className="mt-6"><h2 className="mb-4 text-xl font-black text-slate-900">Available plans</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{plans.map((plan) => <article key={plan.code} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="text-lg font-black text-slate-900">{plan.name}</h3><p className="mt-2 text-2xl font-black text-blue-700">₹{plan.monthly_price_inr}<span className="text-sm font-normal text-slate-500">/month</span></p><ul className="mt-4 space-y-2 text-sm text-slate-600"><li>{plan.monthly_feedback_limit.toLocaleString()} feedback responses</li><li>{plan.location_limit} location{plan.location_limit === 1 ? '' : 's'}</li><li>{plan.ai_enabled ? 'AI assistance included' : 'Limited AI assistance'}</li></ul><button disabled className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-400">Payment setup coming next</button></article>)}</div></section>
      </div>
    </main>
  );
}
