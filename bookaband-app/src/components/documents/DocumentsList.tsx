'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Contract } from '@/service/backend/documents/domain/contract';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import { getContractsByBandId } from '@/service/backend/documents/service/contract.service';
import { getInvoicesByBandId } from '@/service/backend/documents/service/invoice.service';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import { useAuth } from '@/providers/authProvider';

interface DocumentsListProps {
  language: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DocumentsList({ language }: DocumentsListProps) {
  const router = useRouter();
  const { t } = useTranslation(language, 'documents');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedBand } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [contractsData, invoicesData] = await Promise.all([
          getContractsByBandId(selectedBand?.id ?? ''),
          getInvoicesByBandId(selectedBand?.id ?? ''),
        ]);
        if (!('error' in contractsData)) {
          // Sort contracts by updatedAt in descending order
          const sortedContracts = [...contractsData].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setContracts(sortedContracts);
        }
        if (!('error' in invoicesData)) {
          // Sort invoices by updatedAt in descending order
          const sortedInvoices = [...invoicesData].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setInvoices(sortedInvoices);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedBand?.id) {
      fetchDocuments();
    }
  }, [selectedBand?.id]);

  const getContractStatus = (userSigned: boolean, bandSigned: boolean) => {
    if (userSigned && bandSigned) {
      return 'signed';
    } else if (userSigned) {
      return 'pending-band-signature';
    } else if (bandSigned) {
      return 'pending-user-signature';
    }
    return 'pending-signatures';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending-band-signature':
      case 'pending-user-signature':
      case 'pending-signatures':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRowClick = (id: string, type: 'contract' | 'invoice') => {
    router.push(`/${language}/documents/${type}/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
        </div>
      </div>

      <div className="mt-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-[#15b7b9] shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#15b7b9]',
                )
              }
            >
              {t('contracts')}
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-[#15b7b9] shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#15b7b9]',
                )
              }
            >
              {t('invoices')}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              {contracts.length === 0 ? (
                <div className="text-center text-gray-500">
                  {t('noContracts')}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('eventName')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('eventDate')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('updatedAt')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {contracts.map((contract) => {
                        const status = getContractStatus(
                          contract.userSigned,
                          contract.bandSigned,
                        );
                        return (
                          <tr
                            key={contract.id}
                            onClick={() =>
                              handleRowClick(contract.id, 'contract')
                            }
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {contract.eventName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {format(new Date(contract.eventDate), 'PPP', {
                                locale: language === 'es' ? es : ca,
                              })}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                  status,
                                )}`}
                              >
                                {t(`status.${status}`)}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {format(new Date(contract.updatedAt), 'PPP', {
                                locale: language === 'es' ? es : ca,
                              })}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(contract.fileUrl, '_blank');
                                }}
                                className="text-[#15b7b9] hover:text-[#15b7b9]/80"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              {invoices.length === 0 ? (
                <div className="text-center text-gray-500">
                  {t('noInvoices')}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('createdAt')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('amount')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('updatedAt')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          {t('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {invoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          onClick={() => handleRowClick(invoice.id, 'invoice')}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {format(new Date(invoice.createdAt), 'PPP', {
                              locale: language === 'es' ? es : ca,
                            })}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {invoice.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                invoice.status,
                              )}`}
                            >
                              {t(`status.${invoice.status.toLowerCase()}`)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {format(new Date(invoice.updatedAt), 'PPP', {
                              locale: language === 'es' ? es : ca,
                            })}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(invoice.fileUrl, '_blank');
                              }}
                              className="text-[#15b7b9] hover:text-[#15b7b9]/80"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
