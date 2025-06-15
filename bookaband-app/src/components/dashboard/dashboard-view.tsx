'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/authProvider';
import { getBandProfileById } from '@/service/backend/band/service/band.service';
import { useTranslation } from '@/app/i18n/client';
import {
  Calendar,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import MetricCard from '@/components/ui/metric-card';
import { BandProfile } from '@/service/backend/band/domain/bandProfile';
import { toast } from 'react-hot-toast';
import { getAllBandBookings } from '@/service/backend/booking/service/booking.service';
import { getBandChats } from '@/service/backend/chat/service/chat.service';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import { getInvoicesByBandId } from '@/service/backend/documents/service/invoice.service';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Image from 'next/image';

interface DashboardViewProps {
  language: string;
}

interface Metrics {
  totalPerformances: number;
  totalIncome: number;
  activeChats: number;
}

interface BookingStats {
  status: string;
  count: number;
}

export default function DashboardView({ language }: DashboardViewProps) {
  const { t } = useTranslation(language, ['home', 'booking']);
  const { selectedBand } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bandProfile, setBandProfile] = useState<BandProfile | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    totalPerformances: 0,
    totalIncome: 0,
    activeChats: 0,
  });
  const [bookingStats, setBookingStats] = useState<BookingStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBand) {
        setLoading(false);
        return;
      }

      try {
        const [profile, bandBookings, bandChats, bandInvoices] =
          await Promise.all([
            getBandProfileById(selectedBand.id),
            getAllBandBookings(selectedBand.id),
            getBandChats(selectedBand.id),
            getInvoicesByBandId(selectedBand.id),
          ]);

        if (profile) {
          setBandProfile(profile);

          const totalPerformances =
            bandBookings?.filter(
              (booking) => booking.status === BookingStatus.ACCEPTED,
            ).length || 0;

          const totalIncome = Array.isArray(bandInvoices)
            ? bandInvoices
                .filter((invoice) => invoice.status === 'PAID')
                .reduce((sum, invoice) => sum + invoice.amount, 0)
            : 0;

          const activeChats = bandChats?.length || 0;

          const stats = Object.values(BookingStatus).map((status) => ({
            status: t(`status.${status.toLowerCase()}`, { ns: 'booking' }),
            count:
              bandBookings?.filter((booking) => booking.status === status)
                .length || 0,
          }));

          setMetrics({
            totalPerformances,
            totalIncome,
            activeChats,
          });

          setBookingStats(stats);
        }
      } catch (err) {
        const errorMessage = t('errors.fetchData');
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBand, t]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (!selectedBand) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg text-gray-500">{t('no-band-selected')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-32 w-full md:h-40 md:w-1/4">
            <Image
              fill
              src={bandProfile?.imageUrl || '/default-band-image.jpg'}
              alt={bandProfile?.name ?? 'Artist image'}
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center p-4 md:p-6">
            <div className="space-y-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {bandProfile?.name}
                </h1>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                  {bandProfile?.bio}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15b7b9]/10">
                    <Users className="h-4 w-4 text-[#15b7b9]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {bandProfile?.members?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">{t('members')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15b7b9]/10">
                    <Heart className="h-4 w-4 text-[#15b7b9]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {bandProfile?.followers || 0}
                    </p>
                    <p className="text-xs text-gray-500">{t('followers')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15b7b9]/10">
                    <Star className="h-4 w-4 text-[#15b7b9]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {bandProfile?.rating || 0}
                    </p>
                    <p className="text-xs text-gray-500">{t('rating')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {t('bookingStats')}
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {bookingStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          '#FF9800',
                          '#4CAF50',
                          '#1D4ED8',
                          '#9C27B0',
                          '#F44336',
                          '#9E9E9E',
                          '#757575',
                        ][index % 6]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <MetricCard
            title={t('totalPerformances')}
            value={metrics.totalPerformances.toString()}
            icon={
              <div className="rounded-full bg-gradient-to-br from-[#15b7b9] to-[#1fc8ca] p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            }
            className="bg-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          />
          <MetricCard
            title={t('totalIncome')}
            value={`${metrics.totalIncome.toLocaleString()}€`}
            icon={
              <div className="rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            }
            className="bg-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          />
          <MetricCard
            title={t('activeChats')}
            value={metrics.activeChats.toString()}
            icon={
              <div className="rounded-full bg-gradient-to-br from-[#FFC107] to-[#ffb300] p-2">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            }
            className="bg-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
