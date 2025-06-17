import { Contract } from '@/service/backend/documents/domain/contract';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import { getUserInvoices } from '@/service/backend/documents/service/invoice.service';
import { getUserContracts } from '@/service/backend/documents/service/contract.service';
import { BackendError } from '@/service/backend/shared/domain/backendError';
import { getTranslation } from '@/app/i18n';
import Error from '@/components/shared/error';
import DocumentsList from '@/components/documents/documentsList';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ params, searchParams }: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { t } = await getTranslation(lng, 'documents');

  const contracts: Contract[] | BackendError = await getUserContracts();
  if (!contracts || 'error' in contracts) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }
  const invoices: Invoice[] | BackendError = await getUserInvoices();
  if (!invoices || 'error' in invoices) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }

  return (
    <DocumentsList contracts={contracts} invoices={invoices} language={lng} />
  );
}
