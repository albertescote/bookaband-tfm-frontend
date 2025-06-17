import StatusFailed from '@/components/email/statusFailed';
import EmailVerification from '@/components/email/emailVerification';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const { t } = await getTranslation(lng, 'verify-email');
  const token: string | undefined = resolvedSearchParams?.token;
  if (!token) {
    return <StatusFailed lng={lng} message={t('noToken')}></StatusFailed>;
  }
  return <EmailVerification lng={lng} token={token} />;
}
