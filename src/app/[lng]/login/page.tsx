import LoginForm from '@/components/login/loginForm';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default function Page({ params: { lng }, searchParams }: PageParams) {
  return (
    <div className="flex h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff]">
      <LoginForm
        language={lng}
        redirectTo={
          searchParams?.redirect_to
            ? `/${searchParams?.redirect_to}`
            : undefined
        }
      />
    </div>
  );
}
