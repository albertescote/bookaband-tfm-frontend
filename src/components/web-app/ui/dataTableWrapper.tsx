'use client';

import { useTranslation } from '@/app/i18n/client';
import DataTable from '@/components/web-app/ui/data-table';
import { RecentActivity } from '@/app/[lng]/(web-app)/dashboard/page';

interface Props {
  language: string;
  data: RecentActivity[];
}

export default function DataTableWrapper({ language, data }: Props) {
  const { t } = useTranslation(language, 'home');

  const columns = [
    { key: 'type', label: t('type') },
    { key: 'description', label: t('description') },
    { key: 'date', label: t('date') },
    {
      key: 'status',
      label: t('status'),
      render: (item: RecentActivity) => (
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

  return (
    <DataTable
      language={language}
      columns={columns}
      data={data}
      onRowClick={(item) => console.log(item)}
    />
  );
}
