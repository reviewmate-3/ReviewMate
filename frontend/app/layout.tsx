import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReviewMate — Turn Customer Feedback Into Better Reviews',
  description: 'ReviewMate helps businesses collect feedback and turn it into a better Google review draft.',
  openGraph: {
    title: 'ReviewMate',
    description: 'Turn genuine customer feedback into better reviews.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
