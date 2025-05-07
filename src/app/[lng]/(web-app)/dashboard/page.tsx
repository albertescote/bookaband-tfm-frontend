'use client';

import { CalendarDays, Music, Users, Wallet } from 'lucide-react';
import MetricCard from '@/components/ui/metric-card';
import DataTable from '@/components/ui/data-table';

interface RecentActivity {
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

const activityColumns = [
  { header: 'Type', accessor: 'type' as const },
  { header: 'Description', accessor: 'description' as const },
  { header: 'Date', accessor: 'date' as const },
  {
    header: 'Status',
    accessor: 'status' as const,
    cell: (item: RecentActivity) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          item.status === 'completed'
            ? 'bg-green-100 text-green-800'
            : item.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
      </span>
    ),
  },
];

export default function DashboardPage() {
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
        <DataTable
          columns={activityColumns}
          data={recentActivities}
          onRowClick={(item) => console.log('Clicked:', item)}
        />
      </div>
    </div>
  );
}
