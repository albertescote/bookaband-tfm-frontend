import ProfileForm from '@/components/profile/profile-form';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function ProfilePage({ params: { lng } }: PageParams) {
  return (
    <main className="flex-1 p-6">
      <ProfileForm language={lng} />
    </main>
  );
}
