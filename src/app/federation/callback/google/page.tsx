import { redirect } from 'next/navigation';
import Callback from '@/components/federation/callback';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({ searchParams }: PageParams) {
  const code: string | undefined = searchParams?.code;
  const role: string | undefined = searchParams?.role;

  if (!code) {
    redirect('/login?error=missing-code');
  }

  return <Callback code={code!} role={role}></Callback>;
}
