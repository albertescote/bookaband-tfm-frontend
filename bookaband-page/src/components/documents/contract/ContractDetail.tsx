'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, User, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import { Contract } from '@/service/backend/documents/domain/contract';

interface ContractDetailProps {
  contract: Contract;
  language: string;
}

export default function ContractDetail({
  contract,
  language,
}: ContractDetailProps) {
  const router = useRouter();
  const { t } = useTranslation(language, 'documents');
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(contract.fileUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setPdfDataUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        toast.error(t('error-loading-contract'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [contract.fileUrl, t]);

  const getStatusConfig = (userSigned: boolean, bandSigned: boolean) => {
    if (userSigned && bandSigned) {
      return {
        bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        status: t('status.signed'),
      };
    } else if (userSigned) {
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        status: t('status.pending-band-signature'),
      };
    } else if (bandSigned) {
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        status: t('status.pending-user-signature'),
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        status: t('status.pending-signatures'),
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(
    contract.userSigned,
    contract.bandSigned,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 space-y-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => router.push(`/${language}/documents`)}
          className="flex items-center text-gray-600 hover:text-[#15b7b9]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('back')}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-[#15b7b9]" />
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('contracts')}
            </h1>
          </div>
          <a
            href={contract.fileUrl}
            download
            className="flex items-center rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#15b7b9]/90"
          >
            <Download className="mr-2 h-5 w-5" />
            {t('download')}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contract Information */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                {t('contractDetails')}
              </h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('eventName')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {contract.eventName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('eventDate')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(contract.eventDate), 'PPP', {
                      locale: language === 'es' ? es : ca,
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('statusLabel')}
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {statusConfig.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('createdAt')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(contract.createdAt), 'PPpp', {
                      locale: language === 'es' ? es : ca,
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('updatedAt')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(contract.updatedAt), 'PPpp', {
                      locale: language === 'es' ? es : ca,
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('parties')}
                  </dt>
                  <dd className="mt-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {contract.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {contract.bandName}
                      </span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="min-h-[calc(100vh-12rem)] w-full">
              {pdfDataUrl ? (
                <iframe
                  src={pdfDataUrl}
                  className="h-full w-full"
                  title="Contract PDF"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-gray-500">{t('loading')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
