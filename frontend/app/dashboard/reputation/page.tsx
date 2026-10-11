'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL, getAccessToken } from '@/lib/auth';

type Reputation = {
  total_feedback: number;
  average_rating: number | null;
  rating_counts: Record<string, number>;
  reviews_generated: number;
  google_clicks: number;
  google_click_rate: number;
};

const empty: Reputation = {
  total_feedback: 0,
  average_rating: null,
  rating_counts: {},
  reviews_generated: 0,
  google_clicks: 0,
  google_click_rate: 0,
};

export default function ReputationPage() {
  const [data, setData] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/reviews/reputation`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.detail || payload?.error?.message || 'Unable to load reputation.');
        setData(payload.data || empty);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const maxRatingCount = Math.max(...Object.values(data.rating_counts), 1);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div><p className="text-sm text-slate-500">Reputation management</p><h1 className="text-2xl font-black text-slate-900">Reputation</h1></div>
          <div className="flex gap-2"><Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link><Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Home</Link></div>
        </header>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Average rating', data.average_rating === null ? '—' : `${data.average_rating}/5`], ['Feedback received', data.total_feedback], ['AI drafts', data.reviews_generated], ['Google click rate', `${data.google_click_rate}%`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-black text-slate-900">{value}</p></div>)}
        </div>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-slate-900">Rating distribution</h2>
          <div className="mt-5 space-y-3">{[5, 4, 3, 2, 1].map((rating) => { const count = data.rating_counts[String(rating)] || 0; return <div key={rating} className="flex items-center gap-3 text-sm"><span className="w-12 font-semibold text-slate-700">{rating} star</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(count / maxRatingCount) * 100}%` }} /></div><span className="w-8 text-right text-slate-500">{count}</span></div>; })}</div>
        </section>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h2 className="text-lg font-black text-slate-900">Google journey</h2><p className="mt-2 text-sm text-slate-600">{data.google_clicks} of {data.total_feedback} feedback submissions continued to Google.</p></section>
      </div>
    </main>
  );
}
