import { useTranslation } from '@/app/i18n';
import { getUserInfo } from '@/service/backend/api';
import { User } from '@/service/backend/domain/user';

interface PageParams {
  params: {
    lng: string;
  };
}

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'profile');
  const user: User | undefined = await getUserInfo();

  return (
    <div className="flex h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
            style={{
              backgroundColor: getRandomColor(user?.firstName ?? 'dummy'),
            }}
          >
            {user?.firstName ? user.firstName.charAt(0) : '?'}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user?.firstName} {user?.familyName}
          </h2>
          <p className="mt-2 text-gray-500">{user?.email}</p>
          <p className="mt-4 text-sm text-gray-600">
            {t('role')}: <span className="text-gray-800">{user?.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
