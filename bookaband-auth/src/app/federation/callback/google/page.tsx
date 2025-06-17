import { redirect } from 'next/navigation';
import Callback from '@/components/federation/callback';

interface PageParams {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: PageParams) {
  const resolvedSearchParams = await searchParams;
  const code: string | undefined = resolvedSearchParams?.code;
  const role: string | undefined = resolvedSearchParams?.role;

  if (!code) {
    redirect('/login?error=missing-code');
  }

  return <Callback code={code!} role={role}></Callback>;
}
