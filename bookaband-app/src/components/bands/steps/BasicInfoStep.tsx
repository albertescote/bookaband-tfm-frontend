import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUpload } from '@/components/ui/file-upload';
import { useEffect, useState } from 'react';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { BandSize } from '@/service/backend/band/domain/bandSize';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';

interface BasicInfoStepProps {
  formData: Partial<UpsertBandRequest>;
  onFormDataChange: (data: Partial<UpsertBandRequest>) => void;
  hasError: boolean;
}

const BAND_SIZES = Object.values(BandSize);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function BasicInfoStep({
  formData,
  onFormDataChange,
  hasError,
}: BasicInfoStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [musicalStyles, setMusicalStyles] = useState<MusicalStyle[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(true);

  useEffect(() => {
    const loadMusicalStyles = async () => {
      try {
        const styles = await fetchMusicalStyles();
        if (!('message' in styles)) {
          setMusicalStyles(styles as MusicalStyle[]);
        }
      } catch (error) {
        console.error('Error loading musical styles:', error);
      } finally {
        setIsLoadingStyles(false);
      }
    };

    loadMusicalStyles();
  }, []);

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
        if (value < 0) return t('validation.minValue', { min: 0 });
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
      [name]: name === 'price' ? parseInt(value) || 0 : value 
    });
  };

  const handleStylesChange = (styles: string[]) => {
    const error = validateField('musicalStyleIds', styles);
    setErrors((prev) => ({ ...prev, musicalStyleIds: error }));
    onFormDataChange({ ...formData, musicalStyleIds: styles });
  };

  const handleBandSizeChange = (sizes: string[]) => {
    // Only take the last selected option, effectively making it a single select
    const newSize = sizes.length > 0 ? sizes[sizes.length - 1] : undefined;
    const error = validateField('bandSize', newSize);
    setErrors((prev) => ({ ...prev, bandSize: error }));
    onFormDataChange({ ...formData, bandSize: newSize });
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
      });
    }
  };

  const handleRemoveImage = () => {
    onFormDataChange({
      ...formData,
      imageUrl: undefined,
    });
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

      <div>
        <label htmlFor="location" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.location')} *
        </label>
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

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.description')} *
        </label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleInputChange}
          placeholder={t('form.basicInfo.descriptionPlaceholder')}
          className={hasError && !formData.bio ? 'border-red-500' : ''}
        />
        {hasError && !formData.bio && (
          <p className="mt-1 text-sm text-red-500">
            {t('validation.required')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.price')} *
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price || ''}
          onChange={handleInputChange}
          placeholder={t('form.basicInfo.pricePlaceholder')}
          className={
            hasError && formData.price === undefined ? 'border-red-500' : ''
          }
        />
        {hasError && formData.price === undefined && (
          <p className="mt-1 text-sm text-red-500">
            {t('validation.required')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bandSize" className="text-sm font-medium text-gray-700">
          {t('form.basicInfo.bandSize')} *
        </label>
        <MultiSelect
          options={BAND_SIZES.map((size) => ({
            label: t(`form.basicInfo.bandSizes.${size}`),
            value: size,
          }))}
          value={formData.bandSize ? [formData.bandSize] : []}
          onChange={handleBandSizeChange}
          placeholder={t('form.basicInfo.bandSizePlaceholder')}
          className={hasError && !formData.bandSize ? 'border-red-500' : ''}
          hideRemoveButton={true}
        />
        {hasError && !formData.bandSize && (
          <p className="mt-1 text-sm text-red-500">
            {t('validation.required')}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="musicalStyleIds"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.basicInfo.musicalStyles')} *
        </label>
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
            (!formData.musicalStyleIds || formData.musicalStyleIds.length === 0)
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
