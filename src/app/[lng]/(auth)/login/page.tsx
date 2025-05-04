import LoginForm from '@/components/login/loginForm';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default function Page({ params: { lng }, searchParams }: PageParams) {
  const error: string | undefined = searchParams?.error;
  return <LoginForm language={lng} error={error} />;
}
