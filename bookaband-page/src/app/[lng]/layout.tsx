import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/providers/authProvider';
import Header from '@/components/layout/header/header';
import Footer from '@/components/layout/footer/footer';
import { GOOGLE_MAPS_API_KEY } from '@/config';

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
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          async
          defer
        ></script>
      </head>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <Header language={lng} />
          <Toaster position="top-center" />
          {children}
          <Footer language={lng} />
        </AuthProvider>
      </body>
    </html>
  );
}
