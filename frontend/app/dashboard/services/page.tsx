const services = [
  ['Screen Replacement', 'Active'],
  ['Battery Replacement', 'Active'],
  ['Charging Port Repair', 'Active'],
  ['Camera Repair', 'Active'],
  ['Water Damage', 'Disabled']
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">Services</h1>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Add Service</button>
        </div>
        <div className="space-y-3">
          {services.map(([name, state]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-base font-semibold text-slate-800">{name}</div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-700">{state}</span>
                <button className="text-slate-600">Edit</button>
                <button className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
