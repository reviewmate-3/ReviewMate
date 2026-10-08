const stats = [
  ['QR Scans', '1,248'],
  ['Feedback Submitted', '846'],
  ['AI Drafts', '792'],
  ['Google Clicks', '731']
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div>
            <p className="text-sm text-slate-500">Business dashboard</p>
            <h1 className="text-2xl font-black text-slate-900">The I-Service</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Profile</div>
            <div className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">Logout</div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-4 text-3xl font-black text-slate-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px,1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <nav className="space-y-2 text-sm font-medium text-slate-700">
              {['Overview', 'Business', 'Services', 'QR Code', 'Feedback', 'Analytics', 'Settings'].map((item) => (
                <div key={item} className="rounded-xl px-3 py-2 hover:bg-slate-100">{item}</div>
              ))}
            </nav>
          </aside>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-slate-900">Performance overview</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-5">
                <div className="text-sm text-slate-500">QR scans by day</div>
                <div className="mt-4 h-40 rounded-xl bg-gradient-to-t from-blue-100 to-blue-200" />
              </div>
              <div className="rounded-2xl bg-slate-100 p-5">
                <div className="text-sm text-slate-500">Google review click funnel</div>
                <div className="mt-4 space-y-3">
                  {['QR Scans', 'Feedback Started', 'Feedback Submitted', 'Review Generated', 'Google Click'].map((step) => (
                    <div key={step} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700">{step}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
