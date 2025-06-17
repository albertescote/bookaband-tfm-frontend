import DocumentsList from '@/components/documents/DocumentsList';

interface PageProps {
  params: Promise<{
    lng: string;
  }>;
}

export default async function DocumentsPage({ params }: PageProps) {
  const { lng: language } = await params;
  return <DocumentsList language={language} />;
}
