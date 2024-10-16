'use client';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@/service/backend/domain/user';
import { UserBand } from '@/service/backend/domain/userBand';
import { TrashIcon } from '@heroicons/react/solid';
import { deleteBand } from '@/service/backend/api';

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default function ProfileCard({
  language,
  user,
  userBands,
}: {
  language: string;
  user: User | undefined;
  userBands: UserBand[] | undefined;
}) {
  const { t } = useTranslation(language, 'profile');
  const router = useRouter();

  const navigateToCreateBand = () => {
    router.push('/band');
  };

  const handleDeleteBand = (id: string) => {
    deleteBand(id).then(() => {
      router.refresh();
    });
  };

  return (
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
      <div className="mt-8 w-full">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('your-bands')}
        </h3>
        {userBands && userBands.length > 0 ? (
          <ul className="mb-2 mt-4 space-y-2">
            {userBands.map((band) => (
              <li
                key={band.id}
                className="flex items-center justify-between rounded-lg border border-gray-300 p-4 shadow-sm"
              >
                <Link href={`/band?id=${band.id}`}>
                  <span className="font-medium text-blue-600 hover:underline">
                    {band.name}
                  </span>
                </Link>
                <button
                  onClick={() => handleDeleteBand(band.id)}
                  className="ml-4 text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-2 mt-4 text-center text-sm text-gray-500">
            {t('no-bands')}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-row justify-between space-x-2">
        <button className="mr-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]">
          {t('join-band-button')}
        </button>
        <button
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
          onClick={navigateToCreateBand}
        >
          {t('create-band-button')}
        </button>
      </div>
    </div>
  );
}
