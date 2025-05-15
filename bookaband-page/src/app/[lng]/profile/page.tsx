import ClientProfileEditor from '@/components/profile/editor/clientProfileEditor';
import Error from '@/components/shared/error';
import { getUserProfileDetails } from '@/service/backend/user/service/user.service';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const userProfileDetails = await getUserProfileDetails();
  if (!userProfileDetails || 'error' in userProfileDetails) {
    return <Error></Error>;
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
