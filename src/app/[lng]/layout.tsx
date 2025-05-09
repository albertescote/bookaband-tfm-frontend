import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookaBand',
  description: 'BookaBand coming soon',
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={`${inter.className}`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
