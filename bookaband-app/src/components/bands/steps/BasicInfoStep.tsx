import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { SingleSelect } from '@/components/ui/single-select';
import { FileUpload } from '@/components/ui/file-upload';
import { useState } from 'react';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { BandSize } from '@/service/backend/band/domain/bandSize';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';

interface FormDataWithFiles extends Partial<UpsertBandRequest> {
  imageFile?: File;
}

interface BasicInfoStepProps {
  formData: FormDataWithFiles;
  onFormDataChange: (data: FormDataWithFiles) => void;
  hasError: boolean;
  musicalStyles: MusicalStyle[];
  eventTypes: EventType[];
}

const BAND_SIZES = Object.values(BandSize);

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function BasicInfoStep({
  formData,
  onFormDataChange,
  hasError,
  musicalStyles,
  eventTypes,
}: BasicInfoStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        if (!value) return t('validation.required');
        if (value.length < 2) return t('validation.minLength', { min: 2 });
        if (value.length > 50) return t('validation.maxLength', { max: 50 });
        break;
      case 'location':
        if (!value) return t('validation.required');
        if (value.length < 2) return t('validation.minLength', { min: 2 });
        if (value.length > 100) return t('validation.maxLength', { max: 100 });
        break;
      case 'bio':
        if (value && value.length > 500)
          return t('validation.maxLength', { max: 500 });
        break;
      case 'musicalStyleIds':
        if (!value || value.length === 0)
          return t('validation.atLeastOneStyle');
        break;
      case 'price':
        if (value === undefined || value === null)
          return t('validation.required');
        if (value <= 0) return t('validation.minValue', { min: 1 });
        break;
      case 'bandSize':
        if (!value || value.length === 0) return t('validation.required');
        break;
      case 'imageUrl':
        if (value) {
          if (!ALLOWED_FILE_TYPES.includes(value.type)) {
            return t('validation.imageType');
          }
          if (value.size > MAX_FILE_SIZE) {
            return t('validation.imageSize');
          }
        }
        break;
      case 'eventTypeIds':
        if (!value || value.length === 0)
          return t('validation.atLeastOneEventType');
        break;
    }
    return '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    onFormDataChange({
      ...formData,
      [name]: name === 'price' ? parseInt(value) || 0 : value,
    });
  };

  const handleStylesChange = (styles: string[]) => {
    const error = validateField('musicalStyleIds', styles);
    setErrors((prev) => ({ ...prev, musicalStyleIds: error }));
    onFormDataChange({ ...formData, musicalStyleIds: styles });
  };

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ ...prev, imageUrl: t('validation.imageSize') }));
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors((prev) => ({ ...prev, imageUrl: t('validation.imageType') }));
        return;
      }
      setErrors((prev) => ({ ...prev, imageUrl: '' }));
      const imageUrl = URL.createObjectURL(file);
      onFormDataChange({
        ...formData,
        imageUrl,
        imageFile: file,
      });
    }
  };

  const handleRemoveImage = () => {
    onFormDataChange({
      ...formData,
      imageUrl: undefined,
      imageFile: undefined,
    });
  };

  const handleEventTypesChange = (types: string[]) => {
    const error = validateField('eventTypeIds', types);
    setErrors((prev) => ({ ...prev, eventTypeIds: error }));
    onFormDataChange({ ...formData, eventTypeIds: types });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('form.basicInfo.title')}
        </h2>
        <p className="text-muted-foreground">{t('form.basicInfo.subtitle')}</p>
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.bandName')} *
        </label>
        <div className="mt-2">
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder={t('form.basicInfo.bandNamePlaceholder')}
            className={hasError && !formData.name ? 'border-red-500' : ''}
          />
          {hasError && !formData.name && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.location')} *
        </label>
        <div className="mt-2">
          <Input
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleInputChange}
            placeholder={t('form.basicInfo.locationPlaceholder')}
            className={hasError && !formData.location ? 'border-red-500' : ''}
          />
          {hasError && !formData.location && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.price')} *
        </label>
        <div className="mt-2">
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="1"
            value={formData.price || ''}
            onChange={handleInputChange}
            placeholder={t('form.basicInfo.pricePlaceholder')}
            className={
              hasError && formData.price === undefined ? 'border-red-500' : ''
            }
            onKeyPress={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === '.') {
                e.preventDefault();
              }
            }}
          />
          {hasError && formData.price === undefined && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
          {hasError && formData.price !== undefined && formData.price <= 0 && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.minValue', { min: 1 })}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bandSize" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.bandSize')} *
        </label>
        <div className="mt-2">
          <SingleSelect
            options={BAND_SIZES.map((size) => ({
              label: t(`form.basicInfo.bandSizes.${size}`),
              value: size,
            }))}
            value={formData.bandSize}
            onChange={(value) => {
              const error = validateField('bandSize', value);
              setErrors((prev) => ({ ...prev, bandSize: error }));
              onFormDataChange({ ...formData, bandSize: value });
            }}
            placeholder={t('form.basicInfo.bandSizePlaceholder')}
            className={hasError && !formData.bandSize ? 'border-red-500' : ''}
          />
          {hasError && !formData.bandSize && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="musicalStyleIds"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.basicInfo.musicalStyles')} *
        </label>
        <div className="mt-2">
          <MultiSelect
            options={musicalStyles.map((style) => ({
              label: style.label[language] || style.label['en'],
              value: style.id,
              icon: style.icon,
            }))}
            value={formData.musicalStyleIds || []}
            onChange={handleStylesChange}
            placeholder={t('form.basicInfo.musicalStylesPlaceholder')}
            className={
              hasError &&
              (!formData.musicalStyleIds ||
                formData.musicalStyleIds.length === 0)
                ? 'border-red-500'
                : ''
            }
          />
          {hasError &&
            (!formData.musicalStyleIds ||
              formData.musicalStyleIds.length === 0) && (
              <p className="mt-1 text-sm text-red-500">
                {t('validation.atLeastOneStyle')}
              </p>
            )}
        </div>
      </div>

      <div>
        <label
          htmlFor="eventTypeIds"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.basicInfo.eventTypes')} *
        </label>
        <div className="mt-2">
          <MultiSelect
            options={eventTypes.map((type) => ({
              label: type.label[language] || type.label['en'],
              value: type.id,
              icon: type.icon,
            }))}
            value={formData.eventTypeIds || []}
            onChange={handleEventTypesChange}
            placeholder={t('form.basicInfo.eventTypesPlaceholder')}
            className={
              hasError &&
              (!formData.eventTypeIds || formData.eventTypeIds.length === 0)
                ? 'border-red-500'
                : ''
            }
            showSelectAll
            selectAllLabel={t('form.basicInfo.selectAllEventTypes')}
          />
          {hasError &&
            (!formData.eventTypeIds || formData.eventTypeIds.length === 0) && (
              <p className="mt-1 text-sm text-red-500">
                {t('validation.atLeastOneEventType')}
              </p>
            )}
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.biography')}
        </label>
        <div className="mt-2">
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleInputChange}
            placeholder={t('form.basicInfo.biographyPlaceholder')}
            className={errors.bio ? 'border-red-500' : ''}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.bandImage')}
        </label>
        <div className="mt-2 space-y-4">
          <FileUpload
            onUpload={handleImageUpload}
            accept={ALLOWED_FILE_TYPES.join(',')}
          />
          {formData.imageUrl && (
            <div className="relative inline-block">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                <img
                  src={formData.imageUrl}
                  alt={t('form.basicInfo.bandImage')}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
          )}
        </div>
      </div>
    </div>
  );
}
