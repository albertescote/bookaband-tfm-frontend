import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/layout/sidebar/sidebar';
import WebAppHeader from '@/components/layout/web-app-header/web-app-header';
import { AuthProvider } from '@/providers/authProvider';

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
        <AuthProvider>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <WebAppHeader />
              <main className="flex-1 p-6">
                <Toaster position="top-center" />
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
