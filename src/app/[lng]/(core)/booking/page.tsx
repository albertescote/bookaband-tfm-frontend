import { Role } from '@/service/backend/user/domain/role';
import { SelectBand } from '@/components/booking/selectBand';
import { BookingsList } from '@/components/booking/bookingsList';
import { getUserInfo } from '@/service/backend/user/service/user.service';

export const dynamic = 'force-dynamic';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const user = await getUserInfo();

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <div className="w-full min-w-[90vh] max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        {user?.role === Role.Musician ? (
          <SelectBand language={lng}></SelectBand>
        ) : (
          <BookingsList language={lng} userId={user?.id}></BookingsList>
        )}
      </div>
    </div>
  );
}
