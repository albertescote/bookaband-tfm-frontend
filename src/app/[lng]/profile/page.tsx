import { useTranslation } from '@/app/i18n';
import { getUserInfo } from '@/service/backend/api';
import { User } from '@/service/backend/domain/user';

interface PageParams {
  params: {
    lng: string;
  };
}

function getRandomColor(bandName: string) {
  let hash = 0;
  for (let i = 0; i < bandName.length; i++) {
    hash = bandName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'profile');
  const user: User | undefined = await getUserInfo();

  return (
    <div className="flex h-[75vh] flex-col items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white"
            style={{
              backgroundColor: getRandomColor(user?.firstName ?? 'dummy'),
            }}
          >
            {user?.firstName ? user.firstName.charAt(0) : ' '}
          </div>
          <h2 className="text-xl font-semibold">
            {user?.firstName} {user?.familyName}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="mt-2 text-gray-500">
            {t('role')}: {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
