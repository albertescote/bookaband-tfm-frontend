import ProfileForm from '@/components/profile/profile-form';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
}

export default async function ProfilePage({ params }: PageParams) {
  const { lng } = await params;
  return (
    <main className="flex-1 p-6">
      <ProfileForm language={lng} />
    </main>
  );
}
