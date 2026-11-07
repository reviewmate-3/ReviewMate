import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expera — Customer Experience Intelligence Platform',
  description: 'Expera helps businesses collect customer feedback, understand customer experience, improve reputation, and turn customer insights into business growth.',
  openGraph: {
    title: 'Expera — Customer Experience Intelligence',
    description: 'Turn customer feedback into business growth.',
    type: 'website',
    images: ['/expera-logo.svg'],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
