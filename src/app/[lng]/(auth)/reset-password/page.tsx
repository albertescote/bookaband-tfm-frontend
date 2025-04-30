import ResetPassword from '@/components/reset-password/resetPassword';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <ResetPassword language={lng} />;
}
