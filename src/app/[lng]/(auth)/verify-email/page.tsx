import StatusFailed from '@/components/auth/email/statusFailed';
import EmailVerification from '@/components/auth/email/emailVerification';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function VerifyEmailPage({
  params: { lng },
  searchParams,
}: PageParams) {
  const { t } = await getTranslation(lng, 'verify-email');
  const token: string | undefined = searchParams?.token;
  if (!token) {
    return <StatusFailed lng={lng} message={t('noToken')}></StatusFailed>;
  }
  return <EmailVerification lng={lng} token={token} />;
}
