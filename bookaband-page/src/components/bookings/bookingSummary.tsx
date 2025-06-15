'use client';

import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { CostSummary } from './costSummary';
import { GasCostSummary } from './gasCostSummary';
import { useEffect, useState } from 'react';

interface BookingSummaryProps {
  formData: {
    initDate: Date;
    endDate: Date;
    name: string;
    country: string;
    city: string;
    venue: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string;
    eventTypeId: string;
    isPublic: boolean;
  };
  artist: ArtistDetails;
  eventTypes: EventType[];
  language: string;
  t: (key: string) => string;
  onTotalCostCalculated: (cost: number | null) => void;
}

export function BookingSummary({
  formData,
  artist,
  eventTypes,
  language,
  t,
  onTotalCostCalculated,
}: BookingSummaryProps) {
  const [gasCost, setGasCost] = useState<number | null>(null);

  useEffect(() => {
    const total = (gasCost ?? 0) + (artist.price ?? 0);
    const totalCostRounded = Math.round(total * 100) / 100;
    onTotalCostCalculated(totalCostRounded);
  }, [gasCost]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('bookingSummary')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('bookingSummaryDesc')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('eventDetails')}
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('eventName')}
                  </dt>
                  <dd className="text-sm text-gray-900">{formData.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('date')}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formData.initDate.toLocaleDateString(
                      language === 'es'
                        ? 'es-ES'
                        : language === 'ca'
                          ? 'ca-ES'
                          : 'en-US',
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('time')}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formData.initDate.toLocaleTimeString(
                      language === 'es'
                        ? 'es-ES'
                        : language === 'ca'
                          ? 'ca-ES'
                          : 'en-US',
                      { hour: '2-digit', minute: '2-digit' },
                    )}{' '}
                    -{' '}
                    {formData.endDate.toLocaleTimeString(
                      language === 'es'
                        ? 'es-ES'
                        : language === 'ca'
                          ? 'ca-ES'
                          : 'en-US',
                      { hour: '2-digit', minute: '2-digit' },
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('location')}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formData.addressLine1}, {formData.postalCode}{' '}
                    {formData.city}, {formData.country}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('bandDetails')}
              </h3>
              <div className="flex items-start gap-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('bandName')}
                    </dt>
                    <dd className="text-sm text-gray-900">{artist.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('eventType')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {formData.eventTypeId
                        ? eventTypes.find(
                            (et) => et.id === formData.eventTypeId,
                          )?.label[language]
                        : t('notSpecified')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('publicEvent')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {formData.isPublic ? t('yes') : t('no')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {artist.technicalRider && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              {t('technicalRider')}
            </h3>
            <div className="space-y-4">
              {artist.technicalRider.soundSystem && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('soundSystem')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.technicalRider.soundSystem}
                  </p>
                </div>
              )}
              {artist.technicalRider.microphones && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('microphones')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.technicalRider.microphones}
                  </p>
                </div>
              )}
              {artist.technicalRider.backline && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('backline')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.technicalRider.backline}
                  </p>
                </div>
              )}
              {artist.technicalRider.lighting && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('lighting')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.technicalRider.lighting}
                  </p>
                </div>
              )}
              {artist.technicalRider.otherRequirements && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('otherRequirements')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.technicalRider.otherRequirements}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {artist.hospitalityRider && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              {t('hospitalityRider')}
            </h3>
            <div className="space-y-4">
              {artist.hospitalityRider.accommodation && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('accommodation')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.hospitalityRider.accommodation}
                  </p>
                </div>
              )}
              {artist.hospitalityRider.catering && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('catering')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.hospitalityRider.catering}
                  </p>
                </div>
              )}
              {artist.hospitalityRider.beverages && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('beverages')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.hospitalityRider.beverages}
                  </p>
                </div>
              )}
              {artist.hospitalityRider.specialRequirements && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('specialRequirements')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {artist.hospitalityRider.specialRequirements}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <GasCostSummary
          artist={artist}
          bookingLocation={{
            city: formData.city,
            country: formData.country,
          }}
          language={language}
          t={t}
          onGasCostCalculated={setGasCost}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <CostSummary
            formData={formData}
            artist={artist}
            language={language}
            t={t}
            gasCost={gasCost}
          />
        </div>
      </div>
    </div>
  );
}
