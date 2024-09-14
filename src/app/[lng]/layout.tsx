import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trisbar',
  description: 'Trisbar coming soon',
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>
        <Header language={lng}></Header>
        {children}
        <Footer language={lng}></Footer>
      </body>
    </html>
  );
}
