import DashboardView from '@/components/dashboard/dashboard-view';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
}

export default async function DashboardPage({ params }: PageParams) {
  const { lng } = await params;
  return <DashboardView language={lng} />;
}
