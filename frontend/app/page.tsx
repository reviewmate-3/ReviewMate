export default function HomePage() {
  return (
    <main>
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">R</div>
            <div>
              <div className="text-xl font-black text-slate-900">ReviewMate</div>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Login</a>
            <a href="/signup" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-soft">Get Started</a>
          </div>
        </div>
      </nav>

      <section className="container-shell grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">AI + local business growth</div>
          <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Turn genuine customer feedback into better Google reviews.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-600">
            ReviewMate makes it easy for customers to share their experience and turn their own words into polished, natural reviews without inventing anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="/signup" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-soft">Get Started</a>
            <a href="#how-it-works" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700">See How It Works</a>
          </div>
          <div className="mt-8 flex items-center gap-8 text-sm text-slate-500">
            <div><span className="font-bold text-slate-900">1,200+</span> businesses</div>
            <div><span className="font-bold text-slate-900">4.9/5</span> customer experience</div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500" />
                <div>
                  <div className="font-bold">The I-Service</div>
                  <div className="text-xs text-slate-300">Mobile Repair</div>
                </div>
              </div>
              <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Live</div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex gap-2 text-2xl">
                <span>😊</span><span>🙂</span><span>😐</span><span>☹️</span>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4 text-sm text-slate-200">
                “I got my iPhone screen replaced here. The staff was helpful and the phone is working perfectly now.”
              </div>
              <div className="rounded-2xl bg-blue-500 p-4 text-sm font-medium text-white">AI draft ready for review</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="container-shell">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Simple flow for businesses and customers</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {[
              'Create your business profile',
              'Generate your QR code',
              'Customers scan and share feedback',
              'AI helps polish their words',
              'Customer chooses whether to post on Google'
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{index + 1}</div>
                <p className="text-base font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="container-shell py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Features</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Built for trust, conversion, and easy ops</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Customer-first workflow', 'Mobile-first pages and clean review drafts with editing before redirecting to Google.'],
            ['AI writing assistance', 'Natural language rewriting that preserves the actual customer experience and avoids hallucinations.'],
            ['Business analytics', 'Track QR scans, feedback submissions, review draft generation, and Google review clicks.']
          ].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-4 h-12 w-12 rounded-2xl bg-blue-100" />
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-slate-950 py-20 text-white">
        <div className="container-shell">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Pricing</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Simple options for growing local businesses</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['Free', '1 business', '1 QR code', 'Basic analytics', 'Limited AI generations'],
              ['Starter', 'Multiple QR codes', 'Advanced analytics', 'More AI generations', 'Custom branding'],
              ['Business', 'Multiple locations', 'Advanced analytics', 'AI review replies', 'Team members']
            ].map(([title, ...features]) => (
              <div key={title} className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
                <div className="text-xl font-bold">{title}</div>
                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  {features.map((feature) => (
                    <div key={feature}>• {feature}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container-shell py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Questions businesses ask most</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ['Is ReviewMate a fake review tool?', 'No. ReviewMate helps customers turn their own feedback into a clearer, more natural review draft. It never fabricates experiences or auto-posts reviews.'],
            ['Does it require a Google account?', 'No. Customers choose whether to open the business review URL and paste or edit the generated draft before submitting.'],
            ['Can I track customer feedback?', 'Yes. Business owners can view QR scans, submissions, review generation activity, and Google review clicks from the dashboard.']
          ].map(([question, answer]) => (
            <div key={question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-bold text-slate-900">{question}</h3>
              <p className="mt-3 text-slate-600">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
