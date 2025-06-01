'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Edit2,
  Facebook,
  Globe,
  Instagram,
  Link,
  MapPin,
  Maximize2,
  Music,
  Trash2,
  Twitter,
  UserMinus,
  UserPlus,
  Users,
  X,
  X as XIcon,
  Youtube,
} from 'lucide-react';
import {
  deleteBand,
  getBandProfileById,
  leaveBand,
  removeMember,
  updateBand,
} from '@/service/backend/band/service/band.service';
import { sendInvitation } from '@/service/backend/invitation/service/invitation.service';
import {
  BandProfile,
  HospitalityRider,
  PerformanceArea,
  TechnicalRider,
} from '@/service/backend/band/domain/bandProfile';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/providers/authProvider';
import { FileUpload } from '@/components/common/FileUpload';
import { MultiSelect } from '@/components/ui/multi-select';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineSpotify, AiOutlineTikTok } from 'react-icons/ai';

interface Media {
  id: string;
  url: string;
  type: string;
}

interface PendingMedia {
  id?: string;
  url: string;
  type: string;
  file: File;
}

type WeeklyAvailability = {
  [key in
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday']: boolean;
};

type BandSize = 'SOLO' | 'DUO' | 'TRIO' | 'BAND';

type EditedBandProfile = Omit<Partial<BandProfile>, 'media' | 'bandSize'> & {
  media?: (Media | PendingMedia)[];
  bandSize?: BandSize;
  imageFile?: File;
  hospitalityRider?: HospitalityRider;
  technicalRider?: TechnicalRider;
  performanceArea?: PerformanceArea;
};

interface BandDetailsProps {
  language: string;
  bandId: string;
  initialBandProfile: BandProfile;
}

export default function BandDetails({
  language,
  bandId,
  initialBandProfile,
}: BandDetailsProps) {
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();
  const { user } = useAuth();

  const [bandProfile, setBandProfile] =
    useState<BandProfile>(initialBandProfile);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(
    null,
  );
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<EditedBandProfile>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [musicalStyles, setMusicalStyles] = useState<MusicalStyle[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

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

  const hasChanges = () => {
    if (Object.keys(editedValues).length === 0) return false;

    // Check if any value is different from the original
    return Object.entries(editedValues).some(([key, value]) => {
      if (key === 'weeklyAvailability') {
        return Object.entries(value as WeeklyAvailability).some(
          ([day, isAvailable]) =>
            isAvailable !==
            bandProfile.weeklyAvailability[day as keyof WeeklyAvailability],
        );
      }
      return (
        JSON.stringify(value) !==
        JSON.stringify(bandProfile[key as keyof BandProfile])
      );
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBand(bandId);
      toast.success(t('successDeleting'));
      router.refresh();
      setTimeout(() => {
        router.push(`/${language}/bands`);
      }, 100);
    } catch (error) {
      console.error('Error deleting band:', error);
      toast.error(t('errorDeleting'));
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLeaveBand = async () => {
    setIsLeaving(true);
    try {
      await leaveBand(bandId);
      toast.success(t('successLeaving'));
      router.push(`/${language}/bands`);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error('Error leaving band:', err);
      toast.error(t('errorLeaving'));
      setShowLeaveConfirm(false);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await sendInvitation(bandId, inviteEmail.trim());
      setInviteEmail('');
      setShowInviteModal(false);
      toast.success(t('invitationSent'));
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error(t('common:errorInviting'));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(memberId);
    try {
      await removeMember(bandId, memberId);
      setBandProfile((prev) => ({
        ...prev,
        members: prev.members?.filter((member) => member.id !== memberId),
      }));
      toast.success(t('memberRemoved'));
    } catch (err) {
      console.error('Error removing member:', err);
      toast.error(t('common:errorRemoving'));
    } finally {
      setIsRemoving(null);
      setShowRemoveConfirm(null);
    }
  };

  const handleStartEdit = () => {
    setEditedValues({
      name: bandProfile.name,
      bio: bandProfile.bio,
      location: bandProfile.location,
      socialLinks: bandProfile.socialLinks,
      imageUrl: bandProfile.imageUrl,
      media: bandProfile.media,
      weeklyAvailability: { ...bandProfile.weeklyAvailability },
      musicalStyleIds: bandProfile.musicalStyleIds,
      bandSize: bandProfile.bandSize,
      hospitalityRider: bandProfile.hospitalityRider,
      technicalRider: bandProfile.technicalRider,
      performanceArea: bandProfile.performanceArea,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedValues({});
    setIsEditing(false);
  };

  const handleFileUpload = async (
    files: File[],
    isProfileImage: boolean = false,
  ) => {
    if (!files.length) return;

    // If we're uploading a profile image
    if (isProfileImage) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setEditedValues((prev) => ({
          ...prev,
          imageUrl,
          imageFile: file,
        }));
      }
      return;
    }

    // For media gallery
    const newMedia: PendingMedia[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      file,
    }));

    setEditedValues((prev) => ({
      ...prev,
      media: [...(prev.media || bandProfile.media || []), ...newMedia],
    }));
  };

  const handleDeleteMedia = (mediaId: string | undefined) => {
    if (!mediaId) return;

    setEditedValues((prev) => ({
      ...prev,
      media: (prev.media || bandProfile.media || []).filter(
        (media) => 'id' in media && media.id !== mediaId,
      ),
    }));
  };

  const handleSaveEdit = async () => {
    if (!bandId || !hasChanges()) return;

    // Validate required fields within sections
    if (editedValues.hospitalityRider) {
      if (
        !editedValues.hospitalityRider.accommodation ||
        !editedValues.hospitalityRider.catering ||
        !editedValues.hospitalityRider.beverages ||
        !editedValues.hospitalityRider.specialRequirements
      ) {
        toast.error(t('validation.incomplete.hospitalityRider'));
        return;
      }
    }

    if (editedValues.technicalRider) {
      if (
        !editedValues.technicalRider.soundSystem ||
        !editedValues.technicalRider.microphones ||
        !editedValues.technicalRider.backline ||
        !editedValues.technicalRider.lighting ||
        !editedValues.technicalRider.otherRequirements
      ) {
        toast.error(t('validation.incomplete.technicalRider'));
        return;
      }
    }

    if (editedValues.performanceArea) {
      if (
        !editedValues.performanceArea.regions?.length ||
        !editedValues.performanceArea.travelPreferences ||
        !editedValues.performanceArea.restrictions
      ) {
        toast.error(t('validation.incomplete.performanceArea'));
        return;
      }
    }

    setIsUpdating(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add profile image if it was changed
      if (editedValues.imageFile) {
        formData.append('image', editedValues.imageFile);
      }

      // Add all files from edited media
      editedValues.media?.forEach((media) => {
        if ('file' in media) {
          formData.append('files', media.file);
        }
      });

      // Add other band data
      const bandData = {
        name: editedValues.name || bandProfile.name,
        musicalStyleIds:
          editedValues.musicalStyleIds || bandProfile.musicalStyleIds,
        price: bandProfile.price || 0,
        location: editedValues.location || bandProfile.location,
        bandSize: editedValues.bandSize || bandProfile.bandSize,
        eventTypeIds: bandProfile.eventTypeIds,
        bio: editedValues.bio || bandProfile.bio,
        weeklyAvailability:
          editedValues.weeklyAvailability || bandProfile.weeklyAvailability,
        media: editedValues.media?.map((media) => ({
          url: media.url,
          type: media.type,
        })),
        socialLinks: editedValues.socialLinks || bandProfile.socialLinks || [],
        imageUrl: editedValues.imageUrl || bandProfile.imageUrl,
        hospitalityRider:
          editedValues.hospitalityRider || bandProfile.hospitalityRider,
        technicalRider:
          editedValues.technicalRider || bandProfile.technicalRider,
        performanceArea:
          editedValues.performanceArea || bandProfile.performanceArea,
      };

      formData.append('data', JSON.stringify(bandData));

      // TODO: Update the updateBand function to handle FormData
      await updateBand(bandId, bandData);

      const updatedProfile = await getBandProfileById(bandId);
      if (updatedProfile) {
        setBandProfile(updatedProfile);
        toast.success(t('successUpdating'));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating band:', error);
      toast.error(t('errorUpdating'));
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleAvailability = (day: keyof WeeklyAvailability) => {
    if (!isEditing) return;

    setEditedValues((prev) => ({
      ...prev,
      weeklyAvailability: {
        ...(prev.weeklyAvailability || bandProfile.weeklyAvailability),
        [day]: !(
          prev.weeklyAvailability?.[day] ?? bandProfile.weeklyAvailability[day]
        ),
      },
    }));
  };

  const isAdmin =
    bandProfile.members?.some(
      (member) => member.id === user?.id && member.role === 'ADMIN',
    ) ?? false;

  const detectPlatformFromUrl = (url: string): string => {
    if (!url) return 'website';

    const urlLower = url.toLowerCase();
    if (urlLower.includes('instagram.com')) return 'instagram';
    if (urlLower.includes('facebook.com')) return 'facebook';
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com'))
      return 'twitter';
    if (urlLower.includes('youtube.com')) return 'youtube';
    if (urlLower.includes('spotify.com')) return 'spotify';
    if (urlLower.includes('tiktok.com')) return 'tiktok';
    return 'website';
  };

  const getPlatformIcon = (platform: string) => {
    const Icon =
      {
        instagram: Instagram,
        facebook: Facebook,
        twitter: Twitter,
        youtube: Youtube,
        spotify: Music,
        tiktok: Music,
        website: Globe,
      }[platform.toLowerCase()] || Link;
    return <Icon size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        {t('back')}
      </motion.button>

      <div className="mx-auto max-w-4xl">
        {/* Band Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-start justify-between"
        >
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[70%] flex-1">
                {isEditing ? (
                  <motion.input
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    type="text"
                    value={editedValues.name || ''}
                    onChange={(e) =>
                      setEditedValues((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-xl font-bold focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  />
                ) : (
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-bold"
                  >
                    {bandProfile.name}
                  </motion.h1>
                )}
              </div>
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex shrink-0 gap-2"
                >
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <XIcon className="h-5 w-5" />
                        {t('common.cancel')}
                      </motion.button>
                      <motion.button
                        whileHover={{
                          scale: isUpdating || !hasChanges() ? 1 : 1.05,
                        }}
                        whileTap={{
                          scale: isUpdating || !hasChanges() ? 1 : 0.95,
                        }}
                        onClick={handleSaveEdit}
                        disabled={isUpdating || !hasChanges()}
                        className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90 disabled:opacity-50"
                      >
                        <Check className="h-5 w-5" />
                        {isUpdating ? t('common.saving') : t('common.save')}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartEdit}
                      className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90"
                    >
                      <Edit2 className="h-5 w-5" />
                      {t('common.edit')}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Band Image with Parallax Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 overflow-hidden rounded-lg"
        >
          <div className="relative h-[300px] w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <Image
                src={
                  editedValues.imageUrl ||
                  bandProfile.imageUrl ||
                  '/images/band-placeholder.jpg'
                }
                alt={bandProfile.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 right-4"
              >
                <FileUpload
                  onUpload={(files) => handleFileUpload(files, true)}
                  accept="image/*"
                  className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Edit2 size={18} />
                  </motion.div>
                  <span className="font-medium">{t('changeImage')}</span>
                </FileUpload>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Collapsible Sections */}
        <div className="space-y-6">
          {/* Basic Info Section */}
          <CollapsibleSection
            title={t('form.basicInfo.title')}
            defaultOpen={true}
          >
            <div className="space-y-6">
              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.basicInfo.location')}
                </label>
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={editedValues.location || bandProfile.location}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                      placeholder={t('form.basicInfo.location')}
                    />
                    <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {bandProfile.location}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.basicInfo.musicalStyles')}
                </label>
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <MultiSelect
                      options={musicalStyles.map((style) => ({
                        label: style.label[language] || style.label['en'],
                        value: style.id,
                        icon: style.icon,
                      }))}
                      value={
                        editedValues.musicalStyleIds ||
                        bandProfile.musicalStyleIds
                      }
                      onChange={(value) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          musicalStyleIds: value,
                        }))
                      }
                      placeholder={t('form.basicInfo.musicalStylesPlaceholder')}
                      className="w-full"
                    />
                  </motion.div>
                ) : (
                  <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {bandProfile.musicalStyleIds.map((styleId) => {
                      const style = musicalStyles.find((s) => s.id === styleId);
                      return (
                        <span
                          key={styleId}
                          className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-sm text-[#15b7b9]"
                        >
                          {style?.icon && <span>{style.icon}</span>}
                          <span>
                            {style?.label[language] ||
                              style?.label['en'] ||
                              styleId}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.basicInfo.bandSize')}
                </label>
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <select
                      value={editedValues.bandSize || bandProfile.bandSize}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          bandSize: e.target.value as BandSize,
                        }))
                      }
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                    >
                      <option value="SOLO">
                        {t('form.basicInfo.bandSizes.SOLO')}
                      </option>
                      <option value="DUO">
                        {t('form.basicInfo.bandSizes.DUO')}
                      </option>
                      <option value="TRIO">
                        {t('form.basicInfo.bandSizes.TRIO')}
                      </option>
                      <option value="BAND">
                        {t('form.basicInfo.bandSizes.BAND')}
                      </option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {t(`form.basicInfo.bandSizes.${bandProfile.bandSize}`)}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.basicInfo.bio')}
                </label>
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <textarea
                      value={editedValues.bio || bandProfile.bio}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                      placeholder={t('form.basicInfo.bio')}
                    />
                  </motion.div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="whitespace-pre-wrap text-gray-900">
                      {bandProfile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* Weekly Availability */}
          <CollapsibleSection
            title={t('form.availability.title')}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {(
                [
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ] as const
              ).map((day) => (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => toggleAvailability(day)}
                  disabled={!isEditing}
                  className={`rounded-lg p-4 text-center transition-colors ${
                    editedValues.weeklyAvailability?.[day] ??
                    bandProfile.weeklyAvailability[day]
                      ? 'bg-[#15b7b9] text-white'
                      : 'bg-gray-100 text-gray-500'
                  } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:bg-opacity-90'}`}
                >
                  {t(`form.availability.days.${day}`)}
                </motion.button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Social Links */}
          <CollapsibleSection
            title={t('form.multimedia.socialMedia')}
            defaultOpen={false}
          >
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  {(
                    editedValues.socialLinks ||
                    bandProfile.socialLinks ||
                    []
                  ).map((link, index) => (
                    <div key={link.id} className="flex items-center gap-4">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [
                            ...(editedValues.socialLinks ||
                              bandProfile.socialLinks ||
                              []),
                          ];
                          newLinks[index] = {
                            ...link,
                            url: e.target.value,
                            platform: detectPlatformFromUrl(e.target.value),
                          };
                          setEditedValues((prev) => ({
                            ...prev,
                            socialLinks: newLinks,
                          }));
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder="https://..."
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const newLinks = (
                            editedValues.socialLinks ||
                            bandProfile.socialLinks ||
                            []
                          ).filter((_, i) => i !== index);
                          setEditedValues((prev) => ({
                            ...prev,
                            socialLinks: newLinks,
                          }));
                        }}
                        className="rounded-full border-2 border-red-600 p-0.5 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newLinks = [
                        ...(editedValues.socialLinks ||
                          bandProfile.socialLinks ||
                          []),
                      ];
                      newLinks.push({
                        id: `new-${Date.now()}`,
                        platform: 'website',
                        url: '',
                      });
                      setEditedValues((prev) => ({
                        ...prev,
                        socialLinks: newLinks,
                      }));
                    }}
                    className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90"
                  >
                    <Link size={20} />
                    {t('form.multimedia.addSocialLink')}
                  </motion.button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {(bandProfile.socialLinks || []).map((link) => {
                    const Icon =
                      {
                        instagram: Instagram,
                        facebook: Facebook,
                        twitter: Twitter,
                        youtube: Youtube,
                        spotify: AiOutlineSpotify,
                        tiktok: AiOutlineTikTok,
                        website: Globe,
                      }[link.platform.toLowerCase()] || Link;

                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        <Icon size={20} />
                        <span className="capitalize">{link.platform}</span>
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Media Gallery */}
          <CollapsibleSection
            title={t('form.multimedia.mediaUpload')}
            defaultOpen={false}
          >
            <div className="mb-4 flex justify-end">
              {isAdmin && isEditing && (
                <FileUpload
                  onUpload={(files) => handleFileUpload(files, false)}
                  accept="image/*,video/*"
                  className="rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90"
                >
                  {t('uploadMedia')}
                </FileUpload>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {(editedValues.media || bandProfile.media || []).map(
                (media, index) => (
                  <motion.div
                    key={'id' in media ? media.id : `pending-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative aspect-square overflow-hidden rounded-lg"
                  >
                    {media.type === 'image' ? (
                      <motion.img
                        src={media.url}
                        alt=""
                        className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => setSelectedMedia(media as Media)}
                      />
                    ) : (
                      <motion.div
                        className="relative h-full w-full cursor-pointer"
                        onClick={() => setSelectedMedia(media as Media)}
                      >
                        <video
                          src={media.url}
                          className="h-full w-full object-cover"
                          controls
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Maximize2 className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>
                    )}
                    {isAdmin && isEditing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            'id' in media && handleDeleteMedia(media.id)
                          }
                          className="rounded-full border-2 border-red-600 p-0.5 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                        >
                          <X size={16} />
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                ),
              )}
            </div>
          </CollapsibleSection>

          {/* Hospitality Rider */}
          {(!isEditing || editedValues.hospitalityRider !== undefined) && (
            <CollapsibleSection
              title={
                <div className="flex items-center justify-between">
                  <span>{t('form.hospitalityRider.title')}</span>
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditedValues((prev) => ({
                          ...prev,
                          hospitalityRider: {
                            accommodation: '',
                            catering: '',
                            beverages: '',
                            specialRequirements: '',
                          },
                        }));
                      }}
                      className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              }
              defaultOpen={false}
            >
              <div className="space-y-6">
                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.hospitalityRider.accommodation.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={
                          editedValues.hospitalityRider?.accommodation || ''
                        }
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            hospitalityRider: {
                              ...prev.hospitalityRider,
                              accommodation: e.target.value,
                              catering: prev.hospitalityRider?.catering || '',
                              beverages: prev.hospitalityRider?.beverages || '',
                              specialRequirements:
                                prev.hospitalityRider?.specialRequirements ||
                                '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.hospitalityRider.accommodation.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.hospitalityRider?.accommodation ||
                          t('form.hospitalityRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.hospitalityRider.catering.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.hospitalityRider?.catering || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            hospitalityRider: {
                              ...prev.hospitalityRider,
                              accommodation:
                                prev.hospitalityRider?.accommodation || '',
                              catering: e.target.value,
                              beverages: prev.hospitalityRider?.beverages || '',
                              specialRequirements:
                                prev.hospitalityRider?.specialRequirements ||
                                '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.hospitalityRider.catering.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.hospitalityRider?.catering ||
                          t('form.hospitalityRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.hospitalityRider.beverages.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.hospitalityRider?.beverages || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            hospitalityRider: {
                              ...prev.hospitalityRider,
                              accommodation:
                                prev.hospitalityRider?.accommodation || '',
                              catering: prev.hospitalityRider?.catering || '',
                              beverages: e.target.value,
                              specialRequirements:
                                prev.hospitalityRider?.specialRequirements ||
                                '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.hospitalityRider.beverages.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.hospitalityRider?.beverages ||
                          t('form.hospitalityRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.hospitalityRider.specialRequirements.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={
                          editedValues.hospitalityRider?.specialRequirements ||
                          ''
                        }
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            hospitalityRider: {
                              ...prev.hospitalityRider,
                              accommodation:
                                prev.hospitalityRider?.accommodation || '',
                              catering: prev.hospitalityRider?.catering || '',
                              beverages: prev.hospitalityRider?.beverages || '',
                              specialRequirements: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.hospitalityRider.specialRequirements.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.hospitalityRider?.specialRequirements ||
                          t('form.hospitalityRider.empty')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleSection>
          )}

          {/* Technical Rider */}
          {(!isEditing || editedValues.technicalRider !== undefined) && (
            <CollapsibleSection
              title={
                <div className="flex items-center justify-between">
                  <span>{t('form.technicalRider.title')}</span>
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditedValues((prev) => ({
                          ...prev,
                          technicalRider: {
                            soundSystem: '',
                            microphones: '',
                            backline: '',
                            lighting: '',
                            otherRequirements: '',
                          },
                        }));
                      }}
                      className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              }
              defaultOpen={false}
            >
              <div className="space-y-6">
                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.technicalRider.soundSystem.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.technicalRider?.soundSystem || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            technicalRider: {
                              ...prev.technicalRider,
                              soundSystem: e.target.value,
                              microphones:
                                prev.technicalRider?.microphones || '',
                              backline: prev.technicalRider?.backline || '',
                              lighting: prev.technicalRider?.lighting || '',
                              otherRequirements:
                                prev.technicalRider?.otherRequirements || '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.technicalRider.soundSystem.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.technicalRider?.soundSystem ||
                          t('form.technicalRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.technicalRider.microphones.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.technicalRider?.microphones || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            technicalRider: {
                              ...prev.technicalRider,
                              soundSystem:
                                prev.technicalRider?.soundSystem || '',
                              microphones: e.target.value,
                              backline: prev.technicalRider?.backline || '',
                              lighting: prev.technicalRider?.lighting || '',
                              otherRequirements:
                                prev.technicalRider?.otherRequirements || '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.technicalRider.microphones.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.technicalRider?.microphones ||
                          t('form.technicalRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.technicalRider.backline.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.technicalRider?.backline || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            technicalRider: {
                              ...prev.technicalRider,
                              soundSystem:
                                prev.technicalRider?.soundSystem || '',
                              microphones:
                                prev.technicalRider?.microphones || '',
                              backline: e.target.value,
                              lighting: prev.technicalRider?.lighting || '',
                              otherRequirements:
                                prev.technicalRider?.otherRequirements || '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.technicalRider.backline.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.technicalRider?.backline ||
                          t('form.technicalRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.technicalRider.lighting.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.technicalRider?.lighting || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            technicalRider: {
                              ...prev.technicalRider,
                              soundSystem:
                                prev.technicalRider?.soundSystem || '',
                              microphones:
                                prev.technicalRider?.microphones || '',
                              backline: prev.technicalRider?.backline || '',
                              lighting: e.target.value,
                              otherRequirements:
                                prev.technicalRider?.otherRequirements || '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.technicalRider.lighting.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.technicalRider?.lighting ||
                          t('form.technicalRider.empty')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.technicalRider.otherRequirements.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={
                          editedValues.technicalRider?.otherRequirements || ''
                        }
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            technicalRider: {
                              ...prev.technicalRider,
                              soundSystem:
                                prev.technicalRider?.soundSystem || '',
                              microphones:
                                prev.technicalRider?.microphones || '',
                              backline: prev.technicalRider?.backline || '',
                              lighting: prev.technicalRider?.lighting || '',
                              otherRequirements: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.technicalRider.otherRequirements.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.technicalRider?.otherRequirements ||
                          t('form.technicalRider.empty')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleSection>
          )}

          {/* Performance Area */}
          {(!isEditing || editedValues.performanceArea !== undefined) && (
            <CollapsibleSection
              title={
                <div className="flex items-center justify-between">
                  <span>{t('form.performanceArea.title')}</span>
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditedValues((prev) => ({
                          ...prev,
                          performanceArea: {
                            regions: [],
                            travelPreferences: '',
                            restrictions: '',
                          },
                        }));
                      }}
                      className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              }
              defaultOpen={false}
            >
              <div className="space-y-6">
                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.performanceArea.regions.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={
                          editedValues.performanceArea?.regions?.join(', ') ||
                          ''
                        }
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            performanceArea: {
                              ...prev.performanceArea,
                              regions: e.target.value
                                .split(',')
                                .map((region) => region.trim()),
                              travelPreferences:
                                prev.performanceArea?.travelPreferences || '',
                              restrictions:
                                prev.performanceArea?.restrictions || '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.performanceArea.regions.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.performanceArea?.regions?.join(', ') || ''}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.performanceArea.travelPreferences.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={
                          editedValues.performanceArea?.travelPreferences || ''
                        }
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            performanceArea: {
                              ...prev.performanceArea,
                              regions: prev.performanceArea?.regions || [],
                              travelPreferences: e.target.value,
                              restrictions:
                                prev.performanceArea?.restrictions || '',
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.performanceArea.travelPreferences.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.performanceArea?.travelPreferences || ''}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.performanceArea.restrictions.label')}
                  </label>
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <textarea
                        value={editedValues.performanceArea?.restrictions || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            performanceArea: {
                              ...prev.performanceArea,
                              regions: prev.performanceArea?.regions || [],
                              travelPreferences:
                                prev.performanceArea?.travelPreferences || '',
                              restrictions: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                        placeholder={t(
                          'form.performanceArea.restrictions.placeholder',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {bandProfile.performanceArea?.restrictions || ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleSection>
          )}

          {/* Members Section with Animation */}
          <CollapsibleSection title={t('members')} defaultOpen={true}>
            <div className="mb-4 flex justify-end">
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
                >
                  <UserPlus size={20} />
                  {t('inviteMember')}
                </motion.button>
              )}
            </div>
            <div className="space-y-4">
              {bandProfile.members?.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    {member.imageUrl ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={member.imageUrl}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <span className="text-sm text-gray-500">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-900">
                        {member.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="rounded-full bg-[#15b7b9] px-3 py-1 text-sm text-white"
                    >
                      {t(`roles.${member.role.toLowerCase()}`)}
                    </motion.span>
                    {isAdmin && member.id !== user?.id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowRemoveConfirm(member.id)}
                        disabled={isRemoving === member.id}
                        className="text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <UserMinus size={20} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* Delete Band Button */}
        {isAdmin && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 size={20} />
              {t('deleteBand')}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modals with animations */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t('confirmDelete')}
              </h3>
              <p className="mb-6 text-gray-600">{t('deleteWarning')}</p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isDeleting}
                >
                  {t('cancel')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? t('deleting') : t('delete')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Invite Member Modal */}
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('inviteMember')}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <p className="mb-6 text-gray-600">
                {t('inviteMemberDescription')}
              </p>
              <form onSubmit={handleInviteMember}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('memberEmail')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    {t('cancel')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isInviting}
                    className="rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isInviting ? t('inviting') : t('invite')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Remove Member Confirmation Modal */}
        {showRemoveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t('confirmRemoveMember')}
              </h3>
              <p className="mb-6 text-gray-600">{t('removeMemberWarning')}</p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRemoveConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isRemoving === showRemoveConfirm}
                >
                  {t('cancel')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemoveMember(showRemoveConfirm)}
                  disabled={isRemoving === showRemoveConfirm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRemoving === showRemoveConfirm
                    ? t('removing')
                    : t('remove')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Media Preview Modal */}
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt=""
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="max-h-[90vh] max-w-[90vw]"
                  autoPlay
                />
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMedia(null)}
                className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-900 hover:bg-gray-100"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-white p-6 shadow-md"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
