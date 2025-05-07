'use client';
import Contact from '@/components/contact/contact';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function ContactPage({ params: { lng } }: PageParams) {
  return <Contact language={lng}></Contact>;
}
