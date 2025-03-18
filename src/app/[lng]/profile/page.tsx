import ProfileCard from '@/components/profile/profileCard';
import { getUserInfo, getUserInvitations } from '@/service/backend/api';
import { InvitationStatus } from '@/service/backend/domain/invitation';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const userInfo = await getUserInfo();
  const invitations = await getUserInvitations();
  const pendingInvitations = invitations?.filter((invitation) => {
    return invitation.status === InvitationStatus.PENDING;
  });
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        <ProfileCard
          language={lng}
          user={userInfo}
          invitations={pendingInvitations}
        ></ProfileCard>
      </div>
    </div>
  );
}
