import ResetPassword from '@/components/reset-password/resetPassword';
import StatusFailed from '@/components/reset-password/statusFailed';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ params, searchParams }: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const { t } = await getTranslation(lng, 'verify-email');
  const token: string | undefined = resolvedSearchParams?.token;
  if (!token) {
    return <StatusFailed lng={lng} message={t('noToken')}></StatusFailed>;
  }
  return <ResetPassword language={lng} token={token} />;
}
