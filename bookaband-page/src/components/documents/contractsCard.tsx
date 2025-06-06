'use client';

import React from 'react';
import { CheckCircle2, Clock, FileSignature, XCircle } from 'lucide-react';
import {
  Contract,
  ContractStatus,
} from '@/service/backend/documents/domain/contract';
import { useTranslation } from '@/app/i18n/client';

interface ContractsCardProps {
  contracts: Contract[];
  language: string;
}

export default function ContractsCard({
  contracts,
  language,
}: ContractsCardProps) {
  const { t } = useTranslation(language, 'documents');

  const statusStyles: Record<
    ContractStatus,
    { label: string; icon: JSX.Element; color: string }
  > = {
    SIGNED: {
      label: t('contractStatus.signed'),
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      color: 'text-green-600 bg-green-100',
    },
    PENDING: {
      label: t('contractStatus.pending'),
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      color: 'text-yellow-600 bg-yellow-100',
    },
    CANCELED: {
      label: t('contractStatus.canceled'),
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      color: 'text-red-600 bg-red-100',
    },
  };

  return (
    <div className="min-h-40 rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <FileSignature className="h-5 w-5 text-[#15b7b9]" />
        <h2 className="text-lg font-semibold text-gray-800">
          {t('contracts')}
        </h2>
      </div>

      {contracts.length === 0 ? (
        <p className="text-sm text-gray-500">{t('noContracts')}</p>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {contracts.map((contract) => {
            const status = statusStyles[contract.status];
            return (
              <li
                key={contract.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    {contract.bandName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(contract.date).toLocaleDateString(language)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                >
                  {status.icon}
                  <span>{status.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
