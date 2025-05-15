import DocumentsPage from '@/components/documents/documentsPage';
import { Contract } from '@/service/backend/documents/domain/contract';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import { getInvoices } from '@/service/backend/documents/service/invoice.service';
import { getContracts } from '@/service/backend/documents/service/contract.service';
import { BackendError } from '@/service/backend/shared/domain/backendError';
import { getTranslation } from '@/app/i18n';
import Error from '@/components/shared/error';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await getTranslation(lng, 'documents');

  const contracts: Contract[] | BackendError = await getContracts();
  if (!contracts || 'error' in contracts) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }
  const invoices: Invoice[] | BackendError = await getInvoices();
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
    <DocumentsPage contracts={contracts} invoices={invoices} language={lng} />
  );
}
