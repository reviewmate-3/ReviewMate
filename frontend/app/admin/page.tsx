'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, getStoredUser, logout } from '@/lib/auth';

type AdminStats = { businesses: number; users: number; business_owners: number; feedback_submitted: number };
type AdminBusiness = { id: string; name: string; slug: string; is_active: boolean; created_at: string };
type AdminUser = { id: string; name: string; email: string; role: string; is_active: boolean };

export default function AdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    const user = getStoredUser();
    if (!localStorage.getItem('reviewmate_token')) router.replace('/login');
    else if (user?.role !== 'SUPER_ADMIN') router.replace('/dashboard');
    else {
      const headers = { Authorization: `Bearer ${localStorage.getItem('reviewmate_token')}` };
      Promise.all([
        fetch(`${API_URL}/api/v1/admin/overview`, { headers }),
        fetch(`${API_URL}/api/v1/admin/businesses`, { headers }),
        fetch(`${API_URL}/api/v1/admin/users`, { headers }),
      ]).then(async ([overviewResponse, businessesResponse, usersResponse]) => {
        const overview = await overviewResponse.json();
        const businessList = await businessesResponse.json();
        const userList = await usersResponse.json();
        if (!overviewResponse.ok) throw new Error(overview?.error?.message || 'Unable to load platform data.');
        if (!businessesResponse.ok) throw new Error(businessList?.error?.message || 'Unable to load businesses.');
        if (!usersResponse.ok) throw new Error(userList?.error?.message || 'Unable to load users.');
        setStats(overview.data);
        setBusinesses(businessList.data || []);
        setUsers(userList.data || []);
      }).catch((reason: Error) => setError(reason.message));
    }
  }, [router]);

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        const details = data?.error?.details?.map((item: { field: string; message: string }) => `${item.field}: ${item.message}`).join(' ');
        throw new Error(details || data?.error?.message || 'Unable to create client.');
      }
      setMessage(`Client account created for ${data.data.email}. They can now log in and create their business.`);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create client.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div><p className="text-sm text-slate-500">Platform administration</p><h1 className="text-2xl font-black text-slate-900">ReviewMate Admin</h1></div>
          <div className="flex gap-3"><button onClick={() => router.push('/')} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">Home</button><button onClick={() => router.push('/profile')} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">Profile</button><button onClick={handleLogout} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Logout</button></div>
        </header>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-slate-900">Create client account</h2>
            <p className="mt-2 text-sm text-slate-500">Create login credentials for a business owner. The client will complete business onboarding after login.</p>
            <form onSubmit={createClient} className="mt-6 space-y-4">
              <input required minLength={2} placeholder="Client full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" />
              <input required type="email" placeholder="client@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" />
              <input required minLength={8} type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" />
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
              <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create client account'}</button>
            </form>
          </section>
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-slate-900">Platform users</h2>
            {users.length ? <div className="mt-4 space-y-3">{users.map((platformUser) => <div key={platformUser.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-semibold text-slate-900">{platformUser.name}</p><p className="text-sm text-slate-500">{platformUser.email}</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{platformUser.role}</span></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No platform users found.</p>}
          </section>
          <section className="grid gap-6 sm:grid-cols-2">
            {[
              ['Businesses', stats?.businesses ?? '—'],
              ['Users', stats?.users ?? '—'],
              ['Business owners', stats?.business_owners ?? '—'],
              ['Feedback submitted', stats?.feedback_submitted ?? '—'],
              ['System health', 'Healthy'],
            ].map(([item, value]) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><div className="text-sm text-slate-500">{item}</div><div className="mt-4 text-2xl font-black text-slate-900">{value}</div></div>
            ))}
          </section>
        </div>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-slate-900">Onboarded businesses</h2>
          {businesses.length ? <div className="mt-4 space-y-3">{businesses.map((business) => <div key={business.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-semibold text-slate-900">{business.name}</p><p className="text-sm text-slate-500">/{business.slug}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${business.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{business.is_active ? 'Active' : 'Inactive'}</span></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No businesses have been created yet. Creating a client login does not create the business profile; the client must complete onboarding.</p>}
        </section>
      </div>
    </main>
  );
}
