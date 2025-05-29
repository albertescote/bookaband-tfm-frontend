import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { languages } from '@/app/i18n/settings';
import { dir } from 'i18next';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/layout/sidebar/sidebar';
import { AuthProvider } from '@/providers/authProvider';
import Header from '@/components/layout/header/header';

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
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 p-6 overflow-y-auto">
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
