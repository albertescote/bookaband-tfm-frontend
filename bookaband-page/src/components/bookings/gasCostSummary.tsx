'use client';

import { useEffect, useState } from 'react';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

interface GasCostSummaryProps {
  artist: ArtistDetails;
  bookingLocation: {
    city: string;
    country: string;
  };
  language: string;
  t: (key: string) => string;
  onGasCostCalculated: (cost: number | null) => void;
}

interface DistanceResponse {
  distance: number;
}

export function GasCostSummary({
  artist,
  bookingLocation,
  language,
  t,
  onGasCostCalculated,
}: GasCostSummaryProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const [gasCost, setGasCost] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateGasCost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const distanceResponse = await fetch(
          `/api/distance?origin=${encodeURIComponent(artist.location)}&destination=${encodeURIComponent(
            `${bookingLocation.city}, ${bookingLocation.country}`,
          )}`,
        );

        if (!distanceResponse.ok) {
          throw new Error('Failed to calculate distance');
        }

        const distanceData: DistanceResponse = await distanceResponse.json();
        setDistance(distanceData.distance);

        let gasPriceReceived: number;

        if (artist.performanceArea?.gasPriceCalculation?.useDynamicPricing) {
          const gasPriceResponse = await fetch('/api/gas-price');
          if (!gasPriceResponse.ok) {
            throw new Error('Failed to fetch gas price');
          }
          const gasPriceData = await gasPriceResponse.json();
          gasPriceReceived = gasPriceData.price;
        } else {
          gasPriceReceived =
            artist.performanceArea?.gasPriceCalculation?.pricePerLiter || 0;
        }
        setGasPrice(gasPriceReceived);

        const fuelConsumption =
          artist.performanceArea?.gasPriceCalculation?.fuelConsumption || 0;

        const totalDistance = distanceData.distance * 2;
        const totalGasCost =
          (totalDistance * fuelConsumption * gasPriceReceived) / 100;

        setGasCost(totalGasCost);
        onGasCostCalculated(totalGasCost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        onGasCostCalculated(null);
      } finally {
        setIsLoading(false);
      }
    };

    calculateGasCost();
  }, [artist, bookingLocation, onGasCostCalculated]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          {t('gasCostSummary')}
        </h3>
        <p className="text-sm text-gray-500">{t('calculating')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-600">{t('gasCostSummary.fetchError')}</p>
      </div>
    );
  }

  if (!distance || !gasCost) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        {t('gasCostSummary.title')}
      </h3>
      <dl className="space-y-3">
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">
            {t('gasCostSummary.distance')}
          </dt>
          <dd className="text-sm text-gray-900">
            {distance.toFixed(2)} {t('gasCostSummary.kilometers')}{' '}
            {t('gasCostSummary.oneWay')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">
            {t('gasCostSummary.totalDistance')}
          </dt>
          <dd className="text-sm text-gray-900">
            {(distance * 2).toFixed(2)} {t('gasCostSummary.kilometers')}{' '}
            {t('gasCostSummary.roundTrip')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">
            {t('gasCostSummary.fuelConsumption')}
          </dt>
          <dd className="text-sm text-gray-900">
            {artist.performanceArea?.gasPriceCalculation?.fuelConsumption}{' '}
            {t('gasCostSummary.litersPer100km')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">
            {t('gasCostSummary.pricePerLiter')}
          </dt>
          <dd className="text-sm text-gray-900">
            {gasPrice?.toFixed(3) ?? '-'} {t('gasCostSummary.eurosPerLiter')}
          </dd>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <dt className="text-base font-semibold text-gray-900">
              {t('gasCostSummary.gasCost')}
            </dt>
            <dd className="text-base font-semibold text-gray-900">
              {gasCost.toLocaleString(
                language === 'es'
                  ? 'es-ES'
                  : language === 'ca'
                    ? 'ca-ES'
                    : 'en-US',
                { style: 'currency', currency: 'EUR' },
              )}
            </dd>
          </div>
        </div>
        {artist.performanceArea?.otherComments && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                {t('gasCostSummary.additionalInfo')}
              </h4>
              <p className="text-sm text-gray-600">
                {artist.performanceArea.otherComments}
              </p>
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}
