import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';

interface MultimediaStepProps {
  formData: any;
  onFormDataChange: (data: any) => void;
}

export default function MultimediaStep({
  formData,
  onFormDataChange,
}: MultimediaStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [name]: value,
      },
    });
  };

  const handleMultimediaUpload = (files: File[]) => {
    onFormDataChange({
      ...formData,
      multimediaFiles: [...(formData.multimediaFiles || []), ...files],
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('instagram')}
          </label>
          <Input
            name="instagram"
            value={formData.socialMedia?.instagram || ''}
            onChange={handleInputChange}
            placeholder={t('instagramPlaceholder')}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('facebook')}
          </label>
          <Input
            name="facebook"
            value={formData.socialMedia?.facebook || ''}
            onChange={handleInputChange}
            placeholder={t('facebookPlaceholder')}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('tiktok')}
          </label>
          <Input
            name="tiktok"
            value={formData.socialMedia?.tiktok || ''}
            onChange={handleInputChange}
            placeholder={t('tiktokPlaceholder')}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('website')}
          </label>
          <Input
            name="website"
            value={formData.socialMedia?.website || ''}
            onChange={handleInputChange}
            placeholder={t('websitePlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t('multimediaContent')}
        </label>
        <FileUpload
          onUpload={handleMultimediaUpload}
          accept="image/*,video/*"
          multiple={true}
        />
      </div>
    </div>
  );
} 