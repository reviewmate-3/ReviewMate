'use client';

import { FormEvent, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ratings = [
  { value: 5, label: 'Great', icon: '😊' },
  { value: 4, label: 'Good', icon: '🙂' },
  { value: 3, label: 'Okay', icon: '😐' },
  { value: 2, label: 'Could improve', icon: '☹️' },
  { value: 1, label: 'Not good', icon: '😕' },
];

type PublicData = {
  business: { name: string; city?: string | null; logo_url?: string | null; primary_color?: string | null };
  services: { id: string; name: string }[];
  redirect_url: string;
};

export default function CustomerPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<PublicData | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [service, setService] = useState('');
  const [feedback, setFeedback] = useState('');
  const [review, setReview] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/public/business/${encodeURIComponent(params.slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('This business profile is unavailable.');
        return response.json();
      })
      .then((payload) => {
        setData(payload.data);
        setService(payload.data.services[0]?.name || '');
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [params.slug]);

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data || !rating || !service || feedback.trim().length < 10) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/v1/public/review-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: params.slug, service, rating, feedback }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'We could not create your review draft.');
      setSessionId(payload.data.session_id);
      setReview(payload.data.review);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  async function continueToGoogle() {
    if (!data || !sessionId) return;
    await fetch(`${API_URL}/api/v1/public/google-click/${sessionId}`, { method: 'POST' });
    window.open(data.redirect_url, '_blank', 'noopener,noreferrer');
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center p-6 text-slate-600">Loading business profile...</main>;
  if (error && !data) return <main className="flex min-h-screen items-center justify-center p-6 text-center text-red-700">{error}</main>;
  if (!data) return null;

  const brandColor = data.business.primary_color || '#2563eb';
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
        <header className="p-6 text-center" style={{ borderTop: `6px solid ${brandColor}` }}>
          {data.business.logo_url ? <img src={data.business.logo_url} alt="" className="mx-auto mb-4 h-16 w-16 rounded-2xl object-cover" /> : <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white" style={{ backgroundColor: brandColor }}>{data.business.name.charAt(0).toUpperCase()}</div>}
          <h1 className="text-2xl font-black text-slate-900">{data.business.name}</h1>
          {data.business.city && <p className="mt-1 text-sm text-slate-500">{data.business.city}</p>}
        </header>
        <div className="px-6 pb-6">
          {!review ? <form onSubmit={submitFeedback} className="space-y-6">
            <div><p className="text-center text-sm text-slate-500">Step 1 of 3</p><h2 className="mt-2 text-center text-2xl font-black text-slate-900">How was your experience?</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{ratings.map((item) => <button type="button" key={item.value} onClick={() => setRating(item.value)} aria-pressed={rating === item.value} className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${rating === item.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><span className="mr-1 text-lg">{item.icon}</span>{item.label}</button>)}</div></div>
            <label className="block text-sm font-semibold text-slate-700">What service did you receive?<select value={service} onChange={(event) => setService(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal outline-none focus:border-blue-600">{data.services.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}<option value="Other">Other</option></select></label>
            <label className="block text-sm font-semibold text-slate-700">Tell us about your experience.<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} minLength={10} maxLength={1500} rows={5} required className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal outline-none focus:border-blue-600" placeholder="Share what happened in your own words" /></label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={submitting || !rating || !service} className="w-full rounded-2xl px-5 py-4 text-base font-bold text-white disabled:opacity-50" style={{ backgroundColor: brandColor }}>{submitting ? 'Creating your draft...' : 'Create my review draft'}</button>
          </form> : <section className="space-y-5"><div><p className="text-center text-sm text-slate-500">Step 3 of 3</p><h2 className="mt-2 text-center text-2xl font-black text-slate-900">Your review draft</h2></div><textarea value={review} onChange={(event) => setReview(event.target.value)} maxLength={1500} rows={7} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base leading-7 text-slate-800 outline-none focus:border-blue-600" aria-label="Editable review draft" /><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => navigator.clipboard.writeText(review)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Copy review</button><button type="button" onClick={() => setReview('')} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Edit feedback</button></div><button type="button" onClick={continueToGoogle} className="w-full rounded-2xl px-5 py-4 text-base font-bold text-white" style={{ backgroundColor: brandColor }}>Continue to Google</button><p className="text-center text-xs leading-5 text-slate-500">You choose whether to use, edit, or post this draft. ReviewMate never submits a review automatically.</p></section>}
        </div>
      </div>
    </main>
  );
}
