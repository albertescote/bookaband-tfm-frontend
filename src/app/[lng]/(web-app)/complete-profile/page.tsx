import CompleteProfile from '@/components/web-app/complete-profile/complete-profile';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <CompleteProfile language={lng} />;
}
