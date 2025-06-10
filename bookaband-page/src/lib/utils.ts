import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BookingStatus } from '@/service/backend/booking/domain/booking';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export function getStatusColor(status?: BookingStatus): string {
  switch (status) {
    case BookingStatus.PENDING:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case BookingStatus.ACCEPTED:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case BookingStatus.SIGNED:
      return 'bg-gradient-to-r from-blue-50 to-indigo-50';
    case BookingStatus.PAID:
      return 'bg-gradient-to-r from-purple-50 to-violet-50';
    case BookingStatus.DECLINED:
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case BookingStatus.CANCELED:
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function getStatusText(
  t: (key: string) => string,
  status?: BookingStatus,
) {
  switch (status) {
    case BookingStatus.PENDING:
      return t('pending');
    case BookingStatus.ACCEPTED:
      return t('accepted');
    case BookingStatus.DECLINED:
      return t('declined');
    case BookingStatus.SIGNED:
      return t('signed');
    case BookingStatus.PAID:
      return t('paid');
    case BookingStatus.CANCELED:
      return t('canceled');
    default:
      return status;
  }
}
