'use client';

import React from 'react';
import { useTranslation } from '@/app/i18n/client';
import { Contract } from '@/service/backend/documents/domain/contract';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import ContractsCard from '@/components/documents/contractsCard';
import InvoicesCard from '@/components/documents/invoicesCard';

interface ActivityPageProps {
  contracts: Contract[];
  invoices: Invoice[];
  language: string;
}

export default function DocumentsPage({
  contracts,
  invoices,
  language,
}: ActivityPageProps) {
  const { t } = useTranslation(language, 'documents');

  return (
    <div className="mx-auto h-[calc(100vh-4rem)] max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {t('activityTitle')}
      </h1>

      <div className="space-y-6">
        <ContractsCard contracts={contracts} language={language} />
        <InvoicesCard invoices={invoices} language={language} />
      </div>
    </div>
  );
}
