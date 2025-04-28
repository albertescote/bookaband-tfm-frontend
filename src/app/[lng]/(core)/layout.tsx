import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';
import { languages } from '@/app/i18n/settings';
import { Providers } from '@/components/providers';

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
    <main>
      <Providers>
        <Header language={lng} />
        {children}
        <Footer language={lng} />
      </Providers>
    </main>
  );
}
