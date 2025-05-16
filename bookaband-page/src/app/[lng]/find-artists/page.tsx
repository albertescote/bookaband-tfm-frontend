import { fetchFilteredArtists } from '@/service/backend/artist/service/artist.service';
import FindArtistsContent from '@/components/find-artists/find-artists-content';
import Error from '@/components/shared/error';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const { t } = await getTranslation(lng, 'profile');

  const location = searchParams?.location ?? '';
  const date = searchParams?.date ?? '';
  const query = searchParams?.q ?? '';

  const hasSearched = !!searchParams?.location && !!searchParams?.date;
  const data = await fetchFilteredArtists(
    1,
    6,
    hasSearched ? { location, date, searchQuery: query } : {},
  );

  if (!data || 'error' in data) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }

  return (
    <div className="min-h-screen">
      <FindArtistsContent
        language={lng}
        initialData={data}
        hasSearchedInitial={hasSearched}
        initialFilters={{ location, date, query }}
      />
    </div>
  );
}
