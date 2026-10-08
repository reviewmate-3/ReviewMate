export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-slate-900">Admin dashboard</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {['Businesses', 'Users', 'Categories', 'Analytics', 'AI Usage', 'System Health'].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-sm text-slate-500">{item}</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{item === 'System Health' ? 'Healthy' : '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
