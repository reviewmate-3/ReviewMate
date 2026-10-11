'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL, getAccessToken } from '@/lib/auth';

const defaultQuestions = [
  'What did you like about your experience?',
  'How was the quality of the service?',
  'Was our team helpful and professional?',
];

export default function BusinessProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>(defaultQuestions);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/businesses/`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error?.message || 'Unable to load business.');
        const item = payload.data[0];
        setBusiness(item || { name: '', city: '', phone: '', email: '', google_review_url: '', description: '' });
        setQuestions(item?.feedback_questions?.length ? item.feedback_questions : defaultQuestions);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    const isCreating = !business.id;
    const response = await fetch(`${API_URL}/api/v1/businesses/${isCreating ? '' : business.id}`, {
      method: isCreating ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify({ ...business, feedback_questions: questions }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.error?.message || 'Unable to save business profile.');
      return;
    }
    setBusiness(payload.data);
    setMessage(isCreating ? 'Business created successfully.' : 'Business profile and customer questions saved.');
  }

  if (error && !business) return <main className="p-8 text-red-700">{error}</main>;
  if (loading || !business) return <main className="p-8 text-slate-600">Loading business profile...</main>;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <form onSubmit={save} className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-black text-slate-900">{business.id ? 'Business Profile' : 'Create your business profile'}</h1>{!business.id && <p className="mt-1 text-sm text-slate-500">Complete this once to unlock your dashboard, QR code, and customer feedback flow.</p>}</div><div className="flex gap-2"><Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link><Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Home</Link></div></div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {(['name', 'city', 'phone', 'email', 'google_review_url'] as const).map((field) => <label key={field} className="block text-sm font-semibold text-slate-700">{field === 'google_review_url' ? 'Google review URL' : field}<input required={field === 'name'} value={business[field] || ''} onChange={(e) => setBusiness({ ...business, [field]: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>)}
          <label className="md:col-span-2 block text-sm font-semibold text-slate-700">Description<textarea value={business.description || ''} onChange={(e) => setBusiness({ ...business, description: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" rows={4} /></label>
        </div>
        <div className="mt-8 rounded-2xl bg-slate-50 p-5"><h2 className="text-lg font-black text-slate-900">Customer questions after QR scan</h2><p className="mt-1 text-sm text-slate-500">These questions appear on the public feedback page. Keep them short and relevant.</p><div className="mt-4 space-y-3">{questions.map((question, index) => <div key={index} className="flex gap-2"><input value={question} onChange={(e) => setQuestions(questions.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3" /><button type="button" onClick={() => setQuestions(questions.filter((_, itemIndex) => itemIndex !== index))} className="px-3 text-red-600">Remove</button></div>)}</div><button type="button" onClick={() => setQuestions([...questions, ''])} className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Add question</button></div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}{message && <p className="mt-4 text-sm text-green-700">{message}</p>}<button className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">{business.id ? 'Save Changes' : 'Create Business'}</button>
      </form>
    </main>
  );
}
