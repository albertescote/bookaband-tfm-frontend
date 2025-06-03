import DashboardView from '@/components/dashboard/dashboard-view';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function DashboardPage({ params: { lng } }: PageParams) {
  return <DashboardView language={lng} />;
}
