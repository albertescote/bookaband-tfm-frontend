'use client';

import { useTranslation } from '@/app/i18n/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import { getInvoiceById } from '@/service/backend/documents/service/invoice.service';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/authProvider';
import { toast } from 'sonner';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const language = params.lng as string;
  const invoiceId = params.id as string;
  const { t } = useTranslation(language, 'documents');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedBand } = useAuth();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const invoiceData = await getInvoiceById(invoiceId);
        if (!('error' in invoiceData)) {
          setInvoice(invoiceData);
        } else {
          toast.error('Error loading invoice');
          router.push(`/${language}/documents`);
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Error loading invoice');
        router.push(`/${language}/documents`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, language, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push(`/${language}/documents`)}
          className="flex items-center text-gray-600 hover:text-[#15b7b9]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('back')}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('date')}</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                    invoice.status,
                  )}`}
                >
                  {t(`status.${invoice.status.toLowerCase()}`)}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('amount')}</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(invoice.amount)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contract ID</h3>
              <p className="mt-1 text-sm text-gray-900">{invoice.contractId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 