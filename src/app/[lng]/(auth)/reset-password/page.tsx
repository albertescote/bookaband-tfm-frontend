import ResetPassword from '@/components/auth/reset-password/resetPassword';
import StatusFailed from '@/components/auth/reset-password/statusFailed';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const { t } = await getTranslation(lng, 'verify-email');
  const token: string | undefined = searchParams?.token;
  if (!token) {
    return <StatusFailed lng={lng} message={t('noToken')}></StatusFailed>;
  }
  return <ResetPassword language={lng} token={token} />;
}
