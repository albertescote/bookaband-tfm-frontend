import SignUpForm from '@/components/signUp/signUpForm';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <SignUpForm language={lng} />;
}
