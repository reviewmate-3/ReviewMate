export default function BusinessProfilePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">Business Profile</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Business name</label><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" defaultValue="The I-Service" /></div>
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Category</label><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" defaultValue="Mobile Repair" /></div>
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">City</label><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" defaultValue="Hyderabad" /></div>
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" defaultValue="+91 98765 43210" /></div>
          <div className="md:col-span-2"><label className="mb-2 block text-sm font-semibold text-slate-700">Google review URL</label><input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" defaultValue="https://example.com/review" /></div>
          <div className="md:col-span-2"><label className="mb-2 block text-sm font-semibold text-slate-700">Description</label><textarea className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" rows={4} defaultValue="Premium mobile repair and servicing for smartphones, tablets, and accessories." /></div>
        </div>
        <button className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Save Changes</button>
      </div>
    </main>
  );
}
