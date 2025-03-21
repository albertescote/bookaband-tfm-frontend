export default function BookingActions({
  handleBooking,
  handleSendMessage,
  isDateSelected,
  t,
}: {
  handleBooking: () => void;
  handleSendMessage: () => void;
  isDateSelected: boolean;
  t: (key: string) => string;
}) {
  return (
    <>
      <button
        onClick={handleBooking}
        disabled={!isDateSelected}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition ${
          isDateSelected
            ? 'hover:from-[#1d4ed8] hover:to-[#0e7490]'
            : 'opacity-50'
        }`}
      >
        {t('book-now')}
      </button>
      <button
        onClick={handleSendMessage}
        className={`mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#1d4ed8] hover:to-[#0e7490]`}
      >
        {t('send-message')}
      </button>
    </>
  );
}
