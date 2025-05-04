import { redirect } from 'next/navigation';
import Callback from '@/components/federation/callback';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const code: string | undefined = searchParams?.code;

  if (!code) {
    redirect('/login?error=missing-code');
  }

  return <Callback code={code!}></Callback>;
}
