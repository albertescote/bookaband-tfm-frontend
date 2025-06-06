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

export function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.PENDING:
      return '#EAB308';
    case BookingStatus.ACCEPTED:
      return '#22C55E';
    case BookingStatus.DECLINED:
      return '#EF4444';
    case BookingStatus.CANCELED:
      return '#6B7280';
    default:
      return '#6B7280';
  }
}
