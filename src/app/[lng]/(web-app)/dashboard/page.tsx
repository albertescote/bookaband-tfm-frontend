import { CalendarDays, Music, Users, Wallet } from 'lucide-react';
import MetricCard from '@/components/web-app/ui/metric-card';
import DataTableWrapper from '@/components/web-app/ui/dataTableWrapper';

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'Performance',
    description: 'Summer Festival 2024',
    date: '2024-07-15',
    status: 'pending',
  },
  {
    id: '2',
    type: 'Payment',
    description: 'Received payment for Club Gig',
    date: '2024-03-10',
    status: 'completed',
  },
  {
    id: '3',
    type: 'Booking',
    description: 'New venue request: Jazz Club',
    date: '2024-03-09',
    status: 'pending',
  },
];

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}
export default async function DashboardPage({
  params: { lng },
  searchParams,
}: PageParams) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Performances"
          value="24"
          icon={<Music className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Bands"
          value="8"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Upcoming Events"
          value="12"
          icon={<CalendarDays className="h-5 w-5" />}
          trend={{ value: 3, isPositive: false }}
        />
        <MetricCard
          title="Monthly Revenue"
          value="$12,450"
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Activities
        </h2>
        <DataTableWrapper language={lng} data={recentActivities} />
      </div>
    </div>
  );
}
