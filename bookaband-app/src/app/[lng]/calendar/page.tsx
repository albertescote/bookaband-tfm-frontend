import CalendarView from '@/components/calendar/calendar-view';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
}

export default async function CalendarPage({ params }: PageParams) {
  const { lng } = await params;
  return (
    <main className="flex-1 p-6">
      <CalendarView language={lng} />
    </main>
  );
}
