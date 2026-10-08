'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@reviewmate.app');
  const [password, setPassword] = useState('DemoOwner123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || data?.detail || 'Login failed.');
      }

      const token = data?.data?.access_token;
      if (!token) {
        throw new Error('No access token returned by the server.');
      }

      localStorage.setItem('reviewmate_token', token);
      localStorage.setItem('reviewmate_user', JSON.stringify(data.data.user || {}));
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">R</div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">ReviewMate</h1>
          <p className="mt-2 text-sm text-slate-600">Business owner login</p>
        </div>

        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Demo login: owner@reviewmate.app / DemoOwner123!
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0"
              placeholder="owner@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
