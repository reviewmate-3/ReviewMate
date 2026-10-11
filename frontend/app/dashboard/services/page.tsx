'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { API_URL, getAccessToken } from '@/lib/auth';

type Service = { id: string; name: string; description?: string; is_active: boolean };
type Business = { id: string };

export default function ServicesPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    fetch(`${API_URL}/api/v1/businesses/`, { headers })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.data?.[0]) throw new Error(payload?.error?.message || 'Create a business profile first.');
        setBusiness(payload.data[0]);
        const serviceResponse = await fetch(`${API_URL}/api/v1/services/?business_id=${payload.data[0].id}`, { headers });
        const servicePayload = await serviceResponse.json();
        if (!serviceResponse.ok) throw new Error(servicePayload?.detail || 'Unable to load services.');
        setServices(servicePayload.data || []);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  async function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business || !name.trim()) return;
    setError('');
    setMessage('');
    const response = await fetch(`${API_URL}/api/v1/services/?business_id=${business.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify({ name: name.trim(), description: description.trim(), is_active: true }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.detail || payload?.error?.message || 'Unable to add service.');
      return;
    }
    setServices((current) => [payload.data, ...current]);
    setName('');
    setDescription('');
    setMessage('Service added.');
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6"><div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-slate-500">Business setup</p><h1 className="text-2xl font-black text-slate-900">Services</h1></div><div className="flex gap-2"><Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link><Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Home</Link></div></div>
      <form onSubmit={addService} className="grid gap-3 rounded-2xl bg-slate-50 p-5 md:grid-cols-[1fr,1fr,auto]"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Service name" className="rounded-xl border border-slate-200 bg-white px-4 py-3" /><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" className="rounded-xl border border-slate-200 bg-white px-4 py-3" /><button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Add service</button></form>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p className="mt-4 text-sm text-green-700">{message}</p>}
      <div className="mt-6 space-y-3">{services.length ? services.map((service) => <div key={service.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"><div><div className="font-semibold text-slate-800">{service.name}</div>{service.description && <div className="mt-1 text-sm text-slate-500">{service.description}</div>}</div><span className={`rounded-full px-2 py-1 text-sm ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>{service.is_active ? 'Active' : 'Inactive'}</span></div>) : <p className="py-8 text-center text-sm text-slate-500">No services configured yet.</p>}</div>
    </div></main>
  );
}
