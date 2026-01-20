import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Faceless Reel Generator',
  description: 'Create viral faceless reels with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
