'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL, getAccessToken } from '@/lib/auth';

export default function QRPage() {
  const [businessId, setBusinessId] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/businesses/`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      .then((response) => response.json())
      .then((payload) => {
        const business = payload.data?.[0];
        if (business) setBusinessId(business.id);
        else setError('Create your business profile before generating a QR code.');
      })
      .catch(() => setError('Unable to load your business.'));
  }, []);

  async function generateQR() {
    setError('');
    const response = await fetch(`${API_URL}/api/v1/qr/generate?business_id=${businessId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    if (!response.ok) {
      setError('Unable to generate QR code.');
      return;
    }
    const blob = await response.blob();
    setImageUrl(URL.createObjectURL(blob));
    setQrUrl(response.headers.get('X-QR-URL') || '');
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <div className="mb-4 flex justify-between"><Link href="/dashboard" className="text-sm font-semibold text-slate-600">← Back to dashboard</Link><Link href="/" className="text-sm font-semibold text-blue-700">Home</Link></div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">QR setup</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Generate your QR code</h1>
        <p className="mt-3 text-slate-600">Place this QR at your counter, reception, or checkout so customers can share feedback.</p>
        {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={!businessId} onClick={generateQR} className="mt-8 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">Generate QR code</button>
        {imageUrl && <div className="mt-8"><img src={imageUrl} alt="ReviewMate customer feedback QR code" className="mx-auto h-64 w-64" /><a href={imageUrl} download="reviewmate-qr.png" className="mt-4 inline-block rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700">Download QR PNG</a><p className="mt-4 break-all text-xs text-slate-500">{qrUrl}</p></div>}
      </section>
    </main>
  );
}
