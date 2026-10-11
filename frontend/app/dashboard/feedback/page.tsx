'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL, getAccessToken } from '@/lib/auth';

type Feedback = {
  id: string;
  rating: number | null;
  service: string | null;
  feedback: string | null;
  generated_review: string | null;
  google_clicked: boolean;
  created_at: string;
};

export default function FeedbackPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/reviews/`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.detail || payload?.error?.message || 'Unable to load feedback.');
        setItems(payload.data || []);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div><p className="text-sm text-slate-500">Customer experience</p><h1 className="text-2xl font-black text-slate-900">Feedback</h1></div>
          <div className="flex gap-2"><Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link><Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Home</Link></div>
        </header>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <section className="space-y-4">
          {items.length ? items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-slate-900">{item.rating ? `${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}` : 'No rating'}{item.service && <span className="ml-3 text-sm font-normal text-slate-500">{item.service}</span>}</div>
                <time className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-slate-700">{item.feedback || 'No written feedback.'}</p>
              {item.generated_review && <div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">AI-assisted draft</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{item.generated_review}</p></div>}
              <div className="mt-4 text-xs font-semibold text-slate-500">{item.google_clicked ? 'Customer continued to Google' : 'Customer did not continue to Google'}</div>
            </article>
          )) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No customer feedback has been submitted yet.</div>}
        </section>
      </div>
    </main>
  );
}
