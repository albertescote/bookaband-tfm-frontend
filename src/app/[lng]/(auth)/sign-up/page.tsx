import SignUpForm from '@/components/sign-up/signUpForm';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <SignUpForm language={lng} />;
}
