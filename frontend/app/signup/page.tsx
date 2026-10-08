export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">R</div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">Create your ReviewMate account</h1>
        </div>
        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="John Smith" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Business email</label>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="owner@business.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Minimum 8 characters" />
          </div>
          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Create account</button>
        </form>
      </div>
    </main>
  );
}
