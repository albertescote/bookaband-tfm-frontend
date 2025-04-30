import ForgotPassword from '@/components/forgot-password/forgotPassword';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <ForgotPassword language={lng} />;
}
