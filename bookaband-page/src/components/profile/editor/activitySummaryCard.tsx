'use client';

import React from 'react';
import { CalendarCheck, Users } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

interface ActivitySummaryCardProps {
  musiciansContacted: number;
  eventsOrganized: number;
  language: string;
}

export default function ActivitySummaryCard({
  musiciansContacted,
  eventsOrganized,
  language,
}: ActivitySummaryCardProps) {
  const { t } = useTranslation(language, 'profile');

  const stats = [
    {
      label: t('musiciansContacted'),
      value: musiciansContacted,
      icon: <Users className="h-6 w-6 text-white" />,
      bg: 'bg-[#15b7b9]',
    },
    {
      label: t('eventsOrganized'),
      value: eventsOrganized,
      icon: <CalendarCheck className="h-6 w-6 text-white" />,
      bg: 'bg-[#15b7b9]',
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <h2 className="mb-5 text-lg font-semibold text-gray-800">
        {t('activitySummary')}
      </h2>
      <div className="space-y-4">
        {stats.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
