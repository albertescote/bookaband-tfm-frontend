import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';
import { Providers } from '@/components/providers';

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
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Providers>
          <Header language={lng} />
          {children}
          <Footer language={lng} />
        </Providers>
      </body>
    </html>
  );
}
