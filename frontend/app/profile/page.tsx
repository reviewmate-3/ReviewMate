'use client';

import { useRouter } from 'next/navigation';
import { getStoredUser, logout } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const user = getStoredUser();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">Profile</h1>
        <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
          <p><strong>Name:</strong> {user?.name || 'Unknown'}</p>
          <p><strong>Email:</strong> {user?.email || 'Unknown'}</p>
          <p><strong>Role:</strong> {user?.role || 'Unknown'}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => router.back()} className="rounded-xl bg-slate-200 px-4 py-3 font-semibold">Back</button>
          <button onClick={handleLogout} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Logout</button>
        </div>
      </section>
    </main>
  );
}
