import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';
import { Toaster } from 'sonner';
import Sidebar from '@/components/layout/sidebar/sidebar';
import { AuthProvider } from '@/providers/authProvider';
import Header from '@/components/layout/header/header';
import Script from 'next/script';
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
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6">
                <Toaster />
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
