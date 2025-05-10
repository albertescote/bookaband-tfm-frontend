import CompleteProfile from '@/components/complete-profile/complete-profile';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <CompleteProfile language={lng} />;
}
