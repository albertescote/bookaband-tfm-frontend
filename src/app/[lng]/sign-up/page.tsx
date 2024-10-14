import SignUpForm from '@/components/signUp/signUpForm';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] py-12">
      <SignUpForm language={lng} />
    </div>
  );
}
