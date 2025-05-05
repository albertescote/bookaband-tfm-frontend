import SignUpForm from '@/components/sign-up/signUpForm';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default function Page({ params: { lng }, searchParams }: PageParams) {
  const error: string | undefined = searchParams?.error;
  return <SignUpForm language={lng} error={error} />;
}
