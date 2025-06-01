import { getUserBands } from '@/service/backend/band/service/band.service';
import { getUserInvitations } from '@/service/backend/invitation/service/invitation.service';
import BandsList from '@/components/bands/BandsList';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import { UserBand } from '@/service/backend/band/domain/userBand';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const [userBands, userInvitations] = await Promise.all([
    getUserBands(),
    getUserInvitations(),
  ]);

  const bands: UserBand[] = userBands || [];
  const invitations: Invitation[] = userInvitations || [];

  return (
    <BandsList
      language={lng}
      initialBands={bands}
      initialInvitations={invitations}
    />
  );
}
