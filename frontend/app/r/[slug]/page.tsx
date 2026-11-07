'use client';

import { FormEvent, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ratings = [
  { value: 5, label: 'Excellent' },
  { value: 4, label: 'Good' },
  { value: 3, label: 'Okay' },
  { value: 2, label: 'Could improve' },
  { value: 1, label: 'Not good' },
];

type PublicData = {
  business: { name: string; city?: string | null; logo_url?: string | null; primary_color?: string | null };
  services: { id: string; name: string }[];
  redirect_url: string;
  feedback_questions: string[];
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/public/business/${encodeURIComponent(params.slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('This business profile is unavailable.');
        return response.json();
      })
      .then((payload) => {
        setData(payload.data);
        setService(payload.data.services[0]?.name || 'Other');
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
      if (!response.ok) throw new Error(payload.error?.message || payload.detail || 'We could not create your review draft.');
      setSessionId(payload.data.session_id);
      setReview(payload.data.review);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('We could not copy the draft. You can select and copy it manually.');
    }
  }

  async function continueToGoogle() {
    if (!data || !sessionId) return;
    try {
      await fetch(`${API_URL}/api/v1/public/google-click/${sessionId}`, { method: 'POST' });
    } finally {
      window.open(data.redirect_url, '_blank', 'noopener,noreferrer');
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071b2f] p-6 text-center text-sm text-slate-300" aria-live="polite">
        <div><div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-full bg-cyan-400/80" /><p>Loading your feedback form...</p></div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071b2f] p-6 text-center" role="alert">
        <div className="max-w-sm rounded-3xl bg-white p-8 shadow-2xl"><p className="text-sm font-semibold text-red-600">Profile unavailable</p><h1 className="mt-2 text-xl font-bold text-slate-950">{error}</h1><p className="mt-3 text-sm leading-6 text-slate-500">Please check the QR code or ask the business for a new one.</p></div>
      </main>
    );
  }

  if (!data) return null;
  const brandColor = data.business.primary_color || '#0ea5b7';
  const canCreateDraft = Boolean(rating && service && feedback.trim().length >= 10);
  const step = review ? 2 : 1;

  return (
    <main className="min-h-screen bg-[#061827] px-4 py-4 text-slate-900 sm:px-8 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-black/30 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="relative overflow-hidden bg-[#0b2a3e] px-6 py-7 text-white sm:px-10 sm:py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[40px] border-cyan-400/10" />
          <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-lg font-black text-[#062033]">R</div>
              <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Expera</p><p className="mt-0.5 text-xs text-slate-300">Customer experience intelligence</p></div>
            </div>
            <div className="mt-12 max-w-sm lg:mt-24">
              <p className="text-sm font-semibold text-cyan-300">A moment to make better</p>
              <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-[-0.06em] sm:text-5xl">Your honest words help businesses grow.</h1>
              <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">Tell {data.business.name} what went well and where they can do better. It takes less than a minute.</p>
            </div>
          </div>
          <div className="relative mt-10 grid grid-cols-2 gap-3 lg:mt-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black text-cyan-300">01</p><p className="mt-1 text-xs leading-5 text-slate-300">Share your experience</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black text-cyan-300">02</p><p className="mt-1 text-xs leading-5 text-slate-300">Choose what to do next</p></div>
          </div>
        </aside>

        <section className="bg-white px-6 py-7 sm:px-12 sm:py-10 lg:px-16 lg:py-14">
          <header className="mb-10 flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              {data.business.logo_url ? <img src={data.business.logo_url} alt="" className="h-11 w-11 rounded-xl object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black text-white" style={{ backgroundColor: brandColor }}>{data.business.name.charAt(0).toUpperCase()}</div>}
              <div><p className="text-sm font-bold text-[#071b2f]">{data.business.name}</p>{data.business.city && <p className="mt-0.5 text-xs text-slate-500">{data.business.city}</p>}</div>
            </div>
            <div className="text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your progress</p><p className="mt-1 text-xs font-bold text-slate-700">0{step} / 02</p></div>
          </header>

          <div className="max-w-xl">
            {!review ? (
              <form onSubmit={submitFeedback} className="space-y-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: brandColor }}>Step 01 · Your experience</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] text-[#071b2f] sm:text-4xl">How did it feel?</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">There is no perfect answer. Just tell us what really happened.</p>
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-slate-800">Overall, how would you rate your visit?</legend>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {ratings.map((item) => (
                      <button type="button" key={item.value} onClick={() => setRating(item.value)} aria-label={`${item.label}, ${item.value} out of 5`} aria-pressed={rating === item.value} className={`flex min-h-[72px] flex-col items-center justify-center rounded-2xl border text-xs font-semibold transition-colors ${rating === item.value ? 'border-transparent text-white shadow-lg' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`} style={rating === item.value ? { backgroundColor: brandColor } : undefined}>
                        <span className={`text-lg leading-5 ${rating === item.value ? 'text-white' : 'text-amber-400'}`}>★</span><span className="mt-1">{item.value}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{rating ? ratings.find((item) => item.value === rating)?.label : 'Tap a star rating to continue'}</p>
                </fieldset>

                <label className="block text-sm font-bold text-slate-800">What did you visit us for?
                  <select value={service} onChange={(event) => setService(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base font-normal outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100">
                    {data.services.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}<option value="Other">Other</option>
                  </select>
                </label>

                <label className="block text-sm font-bold text-slate-800">Tell us about it
                  <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} minLength={10} maxLength={1500} rows={5} required className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-base font-normal leading-6 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" placeholder="What stood out? What could be better?" />
                  <span className="mt-1 block text-right text-xs text-slate-400">{feedback.length}/1500</span>
                </label>

                {data.feedback_questions.length > 0 && <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4"><p className="text-xs font-bold uppercase tracking-wide text-cyan-900">Need a prompt?</p><ul className="mt-2 space-y-1.5 text-sm leading-5 text-cyan-950">{data.feedback_questions.map((question) => <li key={question}>• {question}</li>)}</ul></div>}
                {error && <p className="rounded-xl bg-red-50 p-3 text-sm leading-5 text-red-700" role="alert">{error}</p>}
                <button type="submit" disabled={submitting || !canCreateDraft} className="min-h-[52px] w-full rounded-xl px-5 py-4 text-base font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45" style={{ backgroundColor: brandColor }}>{submitting ? 'Understanding your feedback...' : 'Continue with my feedback →'}</button>
                <p className="text-center text-xs leading-5 text-slate-400">Your feedback stays yours. Expera helps you express your own experience.</p>
              </form>
            ) : (
              <section className="space-y-6">
                <div><p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: brandColor }}>Step 02 · Your words</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] text-[#071b2f] sm:text-4xl">Make it yours.</h2><p className="mt-3 text-sm leading-6 text-slate-500">Review, edit, or rewrite this draft before deciding whether to share it.</p></div>
                <textarea value={review} onChange={(event) => setReview(event.target.value)} maxLength={1500} rows={8} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base leading-7 text-slate-800 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" aria-label="Editable review draft" />
                {error && <p className="rounded-xl bg-red-50 p-3 text-sm leading-5 text-red-700" role="alert">{error}</p>}
                <div className="grid grid-cols-2 gap-3"><button type="button" onClick={copyReview} className="min-h-12 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">{copied ? 'Copied to clipboard' : 'Copy review'}</button><button type="button" onClick={() => { setReview(''); setError(''); }} className="min-h-12 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Edit feedback</button></div>
                <button type="button" onClick={continueToGoogle} className="min-h-[52px] w-full rounded-xl px-5 py-4 text-base font-bold text-white transition hover:brightness-95" style={{ backgroundColor: brandColor }}>Continue to Google <span aria-hidden="true">↗</span></button>
                <p className="text-center text-xs leading-5 text-slate-400">You choose whether to use, edit, or post this draft. Expera never submits a review automatically.</p>
              </section>
            )}
          </div>
          <p className="mt-12 text-xs text-slate-400">Powered by Expera · You are always in control of what you share.</p>
        </section>
      </div>
    </main>
  );
}
