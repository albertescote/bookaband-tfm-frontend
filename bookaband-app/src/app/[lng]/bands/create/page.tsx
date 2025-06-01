import CreateBandForm from '@/components/bands/CreateBandForm';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return <CreateBandForm language={lng} />;
}
