'use client';

import { useState } from 'react';

const steps = [
  ['01', 'Connect your business', 'Add your locations, services, and the review destination you already use.'],
  ['02', 'Invite real feedback', 'A QR code gives every customer a private, frictionless way to respond.'],
  ['03', 'Turn insight into action', 'See themes, sentiment, and the moments that shape your reputation.'],
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="overflow-hidden bg-[#f7fafc] text-[#071b2f]">
      <nav className="relative z-20 border-b border-slate-200/80 bg-[#f7fafc]/90 backdrop-blur-xl">
        <div className="container-shell flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/expera-logo.svg" alt="Expera" className="h-11 w-auto object-contain" />
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
            <a href="#how-it-works" className="transition hover:text-[#071b2f]">How it works</a>
            <a href="#platform" className="transition hover:text-[#071b2f]">Platform</a>
            <a href="#pricing" className="transition hover:text-[#071b2f]">Pricing</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a href="/login" className="px-3 py-2 text-sm font-bold text-slate-600">Log in</a>
            <a href="/signup" className="rounded-xl bg-[#071b2f] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#071b2f]/15 transition hover:-translate-y-0.5">Start free</a>
          </div>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation" className="rounded-lg border border-slate-200 p-2 text-[#071b2f] md:hidden"><span className="text-xl">{menuOpen ? '×' : '☰'}</span></button>
        </div>
        {menuOpen && <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden"><div className="flex flex-col gap-5 text-sm font-bold"><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a><a href="/login">Log in</a><a href="/signup" className="rounded-xl bg-[#071b2f] px-4 py-3 text-center text-white">Start free</a></div></div>}
      </nav>

      <section className="relative bg-[#f7fafc]">
        <div className="absolute -right-36 top-12 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="container-shell relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[0.94fr_1.06fr] lg:gap-20 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-800"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Customer experience, understood</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.07em] text-[#071b2f] sm:text-6xl lg:text-7xl">Turn feedback into <span className="text-[#087f92]">business growth.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Expera helps local businesses collect honest feedback, understand every customer moment, and build a reputation people can trust.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="/signup" className="rounded-xl bg-[#071b2f] px-6 py-4 text-center text-sm font-bold text-white shadow-xl shadow-[#071b2f]/20 transition hover:-translate-y-0.5">Start free — no card required</a><a href="#how-it-works" className="rounded-xl border border-slate-300 bg-white px-6 py-4 text-center text-sm font-bold text-slate-700 transition hover:border-slate-400">See how it works <span aria-hidden="true">↓</span></a></div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-400"><span>✓ Built for local teams</span><span>✓ Customers stay in control</span><span>✓ Mobile-first</span></div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[38px] bg-cyan-300/20 blur-2xl" />
            <div className="relative rounded-[30px] border border-slate-200 bg-white p-3 shadow-2xl shadow-[#071b2f]/15">
              <div className="rounded-[22px] bg-[#071b2f] p-5 text-white sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Overview</p><p className="mt-1 text-lg font-bold">Customer experience</p></div><div className="rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">↑ 8.4% this month</div></div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-300">Experience score</p><p className="mt-2 text-3xl font-black">92<span className="text-base text-slate-400">/100</span></p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-300">Positive sentiment</p><p className="mt-2 text-3xl font-black">94<span className="text-base text-slate-400">%</span></p></div><div className="col-span-2 rounded-2xl bg-cyan-400 p-4 text-[#062033] sm:col-span-1"><p className="text-xs font-bold">New feedback</p><p className="mt-2 text-3xl font-black">382</p><p className="mt-1 text-xs font-semibold">This month</p></div></div>
                <div className="mt-3 rounded-2xl bg-white/10 p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold">What customers are saying</p><span className="text-xs text-slate-400">Last 30 days</span></div><div className="mt-5 flex h-24 items-end gap-2">{[35, 48, 42, 64, 57, 78, 91, 84, 100, 92, 100, 100].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-500 to-emerald-300" style={{ height: `${height}%`, opacity: index < 3 ? 0.45 : 0.95 }} />)}</div></div>
                <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm text-[#071b2f]">✦</div><div><p className="text-xs font-bold text-cyan-200">Smart insight</p><p className="mt-1 text-sm leading-5 text-slate-200">Faster service is driving your strongest ratings. Watch evening wait times.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-white py-20 sm:py-24">
        <div className="container-shell"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087f92]">One connected loop</p><h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.06em] sm:text-5xl">Every customer interaction is a chance to improve.</h2></div><div className="mt-14 grid gap-4 md:grid-cols-3">{steps.map(([number, title, body]) => <div key={number} className="border-t-2 border-[#071b2f] pt-5"><p className="text-sm font-black text-[#087f92]">{number}</p><h3 className="mt-8 text-xl font-black">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">{body}</p></div>)}</div></div>
      </section>

      <section id="platform" className="bg-[#071b2f] py-20 text-white sm:py-24">
        <div className="container-shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">More than reviews</p><h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.06em] sm:text-5xl">The signal behind your reputation.</h2><p className="mt-6 max-w-md text-base leading-7 text-slate-300">Feedback is not just a score. Expera gives your team the context to understand what happened and what to do next.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><p className="text-2xl text-cyan-300">01</p><h3 className="mt-8 text-lg font-bold">Collect privately</h3><p className="mt-2 text-sm leading-6 text-slate-400">A calm, customer-first QR flow that makes honest feedback easy.</p></div><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><p className="text-2xl text-cyan-300">02</p><h3 className="mt-8 text-lg font-bold">Understand patterns</h3><p className="mt-2 text-sm leading-6 text-slate-400">Spot sentiment, service themes, and changes before they become problems.</p></div><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><p className="text-2xl text-cyan-300">03</p><h3 className="mt-8 text-lg font-bold">Act with confidence</h3><p className="mt-2 text-sm leading-6 text-slate-400">Turn real customer language into focused improvements for your team.</p></div><div className="rounded-3xl border border-cyan-400/30 bg-cyan-400 p-6 text-[#062033]"><p className="text-2xl">✦</p><h3 className="mt-8 text-lg font-black">AI with integrity</h3><p className="mt-2 text-sm leading-6 text-[#164b5a]">AI clarifies what customers said. It never invents what they did not.</p></div></div></div>
      </section>

      <section id="pricing" className="bg-[#f7fafc] py-20 sm:py-24"><div className="container-shell text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087f92]">Start simply</p><h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Your next better day starts here.</h2><p className="mx-auto mt-5 max-w-lg text-slate-500">Give your customers a better way to be heard, and your team a clearer way to grow.</p><a href="/signup" className="mt-8 inline-block rounded-xl bg-[#071b2f] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#071b2f]/20 transition hover:-translate-y-0.5">Create your free account →</a></div></section>

      <footer className="border-t border-slate-200 bg-white py-8"><div className="container-shell flex flex-col items-center justify-between gap-5 sm:flex-row"><img src="/expera-logo.svg" alt="Expera" className="h-12 w-auto object-contain" /><p className="text-sm text-slate-500">Listen. Understand. Improve. Grow.</p></div></footer>
    </main>
  );
}
