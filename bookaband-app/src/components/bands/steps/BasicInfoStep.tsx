import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUpload } from '@/components/ui/file-upload';

interface BasicInfoStepProps {
  formData: any;
  onFormDataChange: (data: any) => void;
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

export default function BasicInfoStep({
  formData,
  onFormDataChange,
}: BasicInfoStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  const handleStylesChange = (styles: string[]) => {
    onFormDataChange({ ...formData, musicalStyles: styles });
  };

  const handleBandImageUpload = (files: File[]) => {
    if (files.length > 0) {
      onFormDataChange({ ...formData, bandImage: files[0] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('bandName')}
          </label>
          <Input
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder={t('bandNamePlaceholder')}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('location')}
          </label>
          <Input
            name="location"
            value={formData.location || ''}
            onChange={handleInputChange}
            placeholder={t('locationPlaceholder')}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('description')}
          </label>
          <Textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder={t('descriptionPlaceholder')}
            rows={4}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('musicalStyles')}
          </label>
          <MultiSelect
            options={MUSICAL_STYLES}
            value={formData.musicalStyles || []}
            onChange={handleStylesChange}
            placeholder={t('selectMusicalStyles')}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t('bandImage')}
        </label>
        <FileUpload
          onUpload={handleBandImageUpload}
          accept="image/*"
          multiple={false}
        />
      </div>
    </div>
  );
} 