import ClientProfileEditor from '@/components/profile/editor/clientProfileEditor';
import Error from '@/components/shared/error';
import { getUserProfileDetails } from '@/service/backend/user/service/user.service';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await getTranslation(lng, 'profile');

  const userProfileDetails = await getUserProfileDetails();
  if (!userProfileDetails || 'error' in userProfileDetails) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <ClientProfileEditor
        userProfileDetails={userProfileDetails}
        language={lng}
      />
    </div>
  );
}
