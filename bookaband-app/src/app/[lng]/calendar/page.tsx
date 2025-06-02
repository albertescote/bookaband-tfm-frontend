import CalendarView from '@/components/calendar/calendar-view';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function CalendarPage({ params: { lng } }: PageParams) {
  return (
    <main className="flex-1 p-6">
      <CalendarView language={lng} />
    </main>
  );
}
