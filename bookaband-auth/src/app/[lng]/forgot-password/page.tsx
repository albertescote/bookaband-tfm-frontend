import ForgotPassword from '@/components/forgot-password/forgotPassword';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
}

export default async function Page({ params }: PageParams) {
  const { lng } = await params;
  return <ForgotPassword language={lng} />;
}
