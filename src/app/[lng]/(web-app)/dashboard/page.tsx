import Dashboard from '@/components/dashboard/dashboard';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return (
    <div>
      <Dashboard language={lng}></Dashboard>
    </div>
  );
}
