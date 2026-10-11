'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { API_URL, getAccessToken } from '@/lib/auth';

type Business = { id: string };
type Member = { id: string; name: string; email: string; role: string; status: string };

export default function TeamPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MANAGER' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadTeam() {
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    const businessResponse = await fetch(`${API_URL}/api/v1/businesses/`, { headers });
    const businessPayload = await businessResponse.json();
    if (!businessResponse.ok || !businessPayload.data?.[0]) throw new Error(businessPayload?.error?.message || 'Create your business profile first.');
    setBusiness(businessPayload.data[0]);
    const memberResponse = await fetch(`${API_URL}/api/v1/members/?business_id=${businessPayload.data[0].id}`, { headers });
    const memberPayload = await memberResponse.json();
    if (!memberResponse.ok) throw new Error(memberPayload?.error?.message || memberPayload?.detail || 'Unable to load team.');
    setMembers(memberPayload.data || []);
  }

  useEffect(() => { loadTeam().catch((reason: Error) => setError(reason.message)); }, []);

  async function createMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business) return;
    setError('');
    setMessage('');
    const response = await fetch(`${API_URL}/api/v1/members/create?business_id=${business.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.error?.message || payload?.detail || 'Unable to create team member.');
      return;
    }
    setMembers((current) => [...current, payload.data]);
    setForm({ name: '', email: '', password: '', role: 'MANAGER' });
    setMessage('Team member created. Share the login credentials securely.');
  }

  return <main className="min-h-screen bg-slate-100 p-4 sm:p-6"><div className="mx-auto max-w-5xl">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div><p className="text-sm text-slate-500">Business access</p><h1 className="text-2xl font-black text-slate-900">Team</h1></div><div className="flex gap-2"><Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link><Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Home</Link></div></header>
    <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><h2 className="text-xl font-black text-slate-900">Create client team login</h2><p className="mt-2 text-sm text-slate-500">Create a manager or staff login for this business. This does not create a platform administrator.</p><form onSubmit={createMember} className="mt-5 space-y-3"><input required minLength={2} placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" /><input required type="email" placeholder="team@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" /><input required minLength={8} type="password" placeholder="Temporary password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" /><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="MANAGER">Manager</option><option value="STAFF">Staff</option></select>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}<button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Create login</button></form></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><h2 className="text-xl font-black text-slate-900">Current team</h2><div className="mt-4 space-y-3">{members.length ? members.map((member) => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-semibold text-slate-900">{member.name}</p><p className="text-sm text-slate-500">{member.email}</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{member.role}</span></div>) : <p className="text-sm text-slate-500">No team members yet.</p>}</div></section></div>
  </div></main>;
}
