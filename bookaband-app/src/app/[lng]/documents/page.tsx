import DocumentsList from '@/components/documents/DocumentsList';

interface PageProps {
  params: {
    lng: string;
  };
}

export default function DocumentsPage({ params }: PageProps) {
  const { lng: language } = params;

  return <DocumentsList language={language} />;
}
