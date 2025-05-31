import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUpload } from '@/components/ui/file-upload';
import { useState } from 'react';
import { BandProfile } from '@/service/backend/band/domain/bandProfile';

interface BasicInfoStepProps {
  formData: Partial<BandProfile>;
  onFormDataChange: (data: Partial<BandProfile>) => void;
  hasError: boolean;
}

const MUSICAL_STYLES = [
  'Rock',
  'Pop',
  'Jazz',
  'Blues',
  'Classical',
  'Electronic',
  'Folk',
  'Hip Hop',
  'R&B',
  'Country',
  'Metal',
  'Reggae',
  'World Music',
  'Indie',
  'Alternative',
];

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
      case 'description':
        if (value && value.length > 500) return t('validation.maxLength', { max: 500 });
        break;
      case 'musicalStyles':
        if (!value || value.length === 0) return t('validation.atLeastOneStyle');
        break;
      case 'bandImage':
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    onFormDataChange({ ...formData, [name]: value });
  };

  const handleStylesChange = (styles: string[]) => {
    const error = validateField('musicalStyles', styles);
    setErrors(prev => ({ ...prev, musicalStyles: error }));
    onFormDataChange({ ...formData, musicalStyles: styles });
  };

  const handleBandImageUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const error = validateField('bandImage', file);
      setErrors(prev => ({ ...prev, bandImage: error }));
      if (!error) {
        onFormDataChange({
          ...formData,
          multimediaContent: {
            images: [URL.createObjectURL(file)],
            videos: [],
            spotifyLink: formData.multimediaContent?.spotifyLink,
            youtubeLink: formData.multimediaContent?.youtubeLink,
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{t('form.basicInfo.title')}</h2>
        <p className="text-muted-foreground">{t('form.basicInfo.subtitle')}</p>
      </div>
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form.basicInfo.bandName')}
            </label>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder={t('form.basicInfo.bandNamePlaceholder')}
              required
              className={hasError && !formData.name ? 'border-red-500' : ''}
            />
            {hasError && !formData.name && (
              <p className="mt-1 text-sm text-red-500">{t('validation.required')}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form.basicInfo.location')}
            </label>
            <Input
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              placeholder={t('form.basicInfo.locationPlaceholder')}
              required
              className={hasError && !formData.location ? 'border-red-500' : ''}
            />
            {hasError && !formData.location && (
              <p className="mt-1 text-sm text-red-500">{t('validation.required')}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form.basicInfo.description')}
            </label>
            <Textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder={t('form.basicInfo.descriptionPlaceholder')}
              rows={4}
              className={hasError && !formData.description ? 'border-red-500' : ''}
            />
            {hasError && !formData.description && (
              <p className="mt-1 text-sm text-red-500">{t('validation.required')}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('form.basicInfo.musicalStyles')}
            </label>
            <MultiSelect
              options={MUSICAL_STYLES}
              value={formData.musicalStyles || []}
              onChange={handleStylesChange}
              placeholder={t('form.basicInfo.musicalStylesPlaceholder')}
              className={hasError && (!formData.musicalStyles || formData.musicalStyles.length === 0) ? 'border-red-500' : ''}
            />
            {hasError && (!formData.musicalStyles || formData.musicalStyles.length === 0) && (
              <p className="mt-1 text-sm text-red-500">{t('validation.required')}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="bandImage"
            className="text-sm font-medium text-gray-700"
          >
            {t('form.bandImage')}
          </label>
          <FileUpload
            onUpload={(files) => {
              if (files.length > 0) {
                // Store the image URL in multimediaContent.images
                onFormDataChange({
                  ...formData,
                  multimediaContent: {
                    images: [URL.createObjectURL(files[0])],
                    videos: [],
                    spotifyLink: formData.multimediaContent?.spotifyLink,
                    youtubeLink: formData.multimediaContent?.youtubeLink,
                  },
                });
              }
            }}
            accept="image/*"
            multiple={false}
          />
        </div>
      </div>
    </div>
  );
} 