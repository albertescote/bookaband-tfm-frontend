import LoginForm from '@/components/login/loginForm';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ params, searchParams }: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const error: string | undefined = resolvedSearchParams?.error;
  return <LoginForm language={lng} error={error} />;
}
