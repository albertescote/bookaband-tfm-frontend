'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { ArrowLeft, Trash2, LogOut } from 'lucide-react';
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
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { motion } from 'framer-motion';
import { BandHeader } from './details/BandHeader';
import { BandImage } from './details/BandImage';
import { BasicInfoSection } from './details/BasicInfoSection';
import { WeeklyAvailabilitySection } from './details/WeeklyAvailabilitySection';
import { SocialLinksSection } from './details/SocialLinksSection';
import { MediaGallerySection } from './details/MediaGallerySection';
import { MembersSection } from './details/MembersSection';
import { DeleteBandModal } from './details/modals/DeleteBandModal';
import { InviteMemberModal } from './details/modals/InviteMemberModal';
import { RemoveMemberModal } from './details/modals/RemoveMemberModal';
import { TechnicalRiderSection } from './details/TechnicalRiderSection';
import { HospitalityRiderSection } from './details/HospitalityRiderSection';
import { PerformanceAreaSection } from './details/PerformanceAreaSection';
import { LeaveBandModal } from './details/modals/LeaveBandModal';

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
  const [editedValues, setEditedValues] = useState<EditedBandProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
  const [musicalStyles, setMusicalStyles] = useState<MusicalStyle[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Ensure we always have a valid name
  const currentName = editedValues.name || bandProfile.name;

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
    if (hasImageChanged) return true;
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
    setHasImageChanged(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedValues({});
    setHasImageChanged(false);
    setBandProfile((prev) => ({
      ...prev,
      imageUrl: initialBandProfile.imageUrl,
    }));
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
        setHasImageChanged(true);
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

    // Validate band name
    if (!editedValues.name?.trim()) {
      toast.error(t('validation.bandName'));
      return;
    }

    // Validate required basic info fields
    if (!editedValues.location?.trim()) {
      toast.error(t('validation.location'));
      return;
    }

    if (!editedValues.bandSize) {
      toast.error(t('validation.bandSize'));
      return;
    }

    if (!editedValues.musicalStyleIds?.length) {
      toast.error(t('validation.atLeastOneStyle'));
      return;
    }

    // Validate required fields within sections
    if (editedValues.hospitalityRider) {
      if (
        !editedValues.hospitalityRider.accommodation ||
        !editedValues.hospitalityRider.catering ||
        !editedValues.hospitalityRider.beverages
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
        !editedValues.technicalRider.lighting
      ) {
        toast.error(t('validation.incomplete.technicalRider'));
        return;
      }
    }

    if (editedValues.performanceArea) {
      if (
        !editedValues.performanceArea.regions?.length ||
        !editedValues.performanceArea.travelPreferences
      ) {
        toast.error(t('validation.incomplete.performanceArea'));
        return;
      }
    }

    // Ensure mandatory arrays are present
    if (!editedValues.socialLinks && !bandProfile.socialLinks) {
      toast.error(t('validation.required.socialLinks'));
      return;
    }

    if (!editedValues.media && !bandProfile.media) {
      toast.error(t('validation.required.media'));
      return;
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
        media:
          editedValues.media?.map((media) => ({
          url: media.url,
          type: media.type,
          })) || [],
        socialLinks: editedValues.socialLinks || bandProfile.socialLinks || [],
        imageUrl:
          editedValues.imageUrl === ''
            ? ''
            : editedValues.imageUrl || bandProfile.imageUrl,
        technicalRider: {
          soundSystem:
            editedValues.technicalRider?.soundSystem ||
            bandProfile.technicalRider?.soundSystem ||
            '',
          microphones:
            editedValues.technicalRider?.microphones ||
            bandProfile.technicalRider?.microphones ||
            '',
          backline:
            editedValues.technicalRider?.backline ||
            bandProfile.technicalRider?.backline ||
            '',
          lighting:
            editedValues.technicalRider?.lighting ||
            bandProfile.technicalRider?.lighting ||
            '',
          otherRequirements:
            editedValues.technicalRider?.otherRequirements === ''
              ? ''
              : editedValues.technicalRider?.otherRequirements ||
                bandProfile.technicalRider?.otherRequirements ||
                '',
        },
        performanceArea: {
          regions:
            editedValues.performanceArea?.regions ||
            bandProfile.performanceArea?.regions ||
            [],
          travelPreferences:
            editedValues.performanceArea?.travelPreferences ||
            bandProfile.performanceArea?.travelPreferences ||
            '',
          restrictions:
            editedValues.performanceArea?.restrictions === ''
              ? ''
              : editedValues.performanceArea?.restrictions ||
                bandProfile.performanceArea?.restrictions ||
                '',
        },
        hospitalityRider: {
          accommodation:
            editedValues.hospitalityRider?.accommodation ||
            bandProfile.hospitalityRider?.accommodation ||
            '',
          catering:
            editedValues.hospitalityRider?.catering ||
            bandProfile.hospitalityRider?.catering ||
            '',
          beverages:
            editedValues.hospitalityRider?.beverages ||
            bandProfile.hospitalityRider?.beverages ||
            '',
          specialRequirements:
            editedValues.hospitalityRider?.specialRequirements === ''
              ? ''
              : editedValues.hospitalityRider?.specialRequirements ||
                bandProfile.hospitalityRider?.specialRequirements ||
                '',
        },
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
        <BandHeader
          name={editedValues.name ?? bandProfile.name ?? ''}
          isEditing={isEditing}
          isUpdating={isUpdating}
          hasChanges={hasChanges()}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onNameChange={(newName) =>
            setEditedValues((prev) => ({ ...prev, name: newName }))
          }
          t={t}
        />

        <BandImage
          imageUrl={editedValues.imageUrl || bandProfile.imageUrl || ''}
          bandName={editedValues.name || bandProfile.name!}
          isEditing={isEditing}
          onImageUpload={(files) => handleFileUpload(files, true)}
          onImageRemove={() => {
                        setEditedValues((prev) => ({
                          ...prev,
              imageUrl: '',
              imageFile: undefined,
            }));
            setBandProfile((prev) => ({
              ...prev,
              imageUrl: '',
            }));
            setHasImageChanged(true);
          }}
          language={language}
        />

        <div className="space-y-6">
          <BasicInfoSection
            location={editedValues.location ?? bandProfile.location ?? ''}
            musicalStyles={musicalStyles}
            selectedMusicalStyleIds={
              editedValues.musicalStyleIds || bandProfile.musicalStyleIds
            }
            bandSize={editedValues.bandSize || bandProfile.bandSize}
            bio={editedValues.bio ?? bandProfile.bio ?? ''}
            isEditing={isEditing}
            language={language}
            onLocationChange={(value) =>
              setEditedValues((prev) => ({ ...prev, location: value }))
            }
            onMusicalStylesChange={(value) =>
              setEditedValues((prev) => ({ ...prev, musicalStyleIds: value }))
            }
            onBandSizeChange={(value) =>
                        setEditedValues((prev) => ({
                          ...prev,
                bandSize: value as BandSize,
              }))
            }
            onBioChange={(value) =>
              setEditedValues((prev) => ({ ...prev, bio: value }))
            }
            t={t}
          />

          <WeeklyAvailabilitySection
            availability={
              editedValues.weeklyAvailability || bandProfile.weeklyAvailability
            }
            isEditing={isEditing}
            onToggleDay={toggleAvailability}
            t={t}
          />

          <SocialLinksSection
            socialLinks={
              editedValues.socialLinks || bandProfile.socialLinks || []
            }
            isEditing={isEditing}
            onAddLink={() => {
              const newLinks = [
                ...(editedValues.socialLinks || bandProfile.socialLinks || []),
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
            onUpdateLink={(index, url) => {
                          const newLinks = [
                ...(editedValues.socialLinks || bandProfile.socialLinks || []),
                          ];
                          newLinks[index] = {
                ...newLinks[index],
                url,
                platform: detectPlatformFromUrl(url),
                          };
                          setEditedValues((prev) => ({
                            ...prev,
                            socialLinks: newLinks,
                          }));
                        }}
            onRemoveLink={(index) => {
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
            t={t}
          />

          <MediaGallerySection
            media={editedValues.media || bandProfile.media || []}
            isEditing={isEditing}
            isAdmin={isAdmin}
            onMediaUpload={(files) => handleFileUpload(files, false)}
            onMediaDelete={handleDeleteMedia}
            onMediaSelect={setSelectedMedia}
            t={t}
          />

          <TechnicalRiderSection
            technicalRider={
              editedValues.technicalRider ||
              bandProfile.technicalRider || {
                            soundSystem: '',
                            microphones: '',
                            backline: '',
                            lighting: '',
                            otherRequirements: '',
              }
            }
            isEditing={isEditing}
            onUpdate={(rider) =>
              setEditedValues((prev) => ({ ...prev, technicalRider: rider }))
            }
            t={t}
          />

          <HospitalityRiderSection
            hospitalityRider={
              editedValues.hospitalityRider ||
              bandProfile.hospitalityRider || {
                accommodation: '',
                catering: '',
                beverages: '',
                specialRequirements: '',
              }
            }
            isEditing={isEditing}
            onUpdate={(rider) =>
              setEditedValues((prev) => ({ ...prev, hospitalityRider: rider }))
            }
            t={t}
          />

          <PerformanceAreaSection
            performanceArea={
              editedValues.performanceArea ||
              bandProfile.performanceArea || {
                            regions: [],
                            travelPreferences: '',
                            restrictions: '',
              }
            }
            isEditing={isEditing}
            onUpdate={(area) =>
              setEditedValues((prev) => ({ ...prev, performanceArea: area }))
            }
            t={t}
          />

          <MembersSection
            members={bandProfile.members || []}
            isAdmin={isAdmin}
            currentUserId={user?.id}
            onInviteMember={() => setShowInviteModal(true)}
            onRemoveMember={(memberId) => setShowRemoveConfirm(memberId)}
            t={t}
          />
                </div>

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

        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-end"
          >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              onClick={() => setShowLeaveConfirm(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
              <LogOut size={20} />
              {t('leaveBand')}
                </motion.button>
          </motion.div>
        )}
              </div>

      <DeleteBandModal
        isOpen={showDeleteConfirm}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        t={t}
      />

      <InviteMemberModal
        isOpen={showInviteModal}
        isInviting={isInviting}
        inviteEmail={inviteEmail}
        onClose={() => setShowInviteModal(false)}
        onEmailChange={setInviteEmail}
        onSubmit={handleInviteMember}
        t={t}
      />

      <RemoveMemberModal
        isOpen={!!showRemoveConfirm}
        isRemoving={!!isRemoving}
        onClose={() => setShowRemoveConfirm(null)}
        onConfirm={() => handleRemoveMember(showRemoveConfirm!)}
        t={t}
      />

      <LeaveBandModal
        isOpen={showLeaveConfirm}
        isLeaving={isLeaving}
        onClose={() => setShowLeaveConfirm(false)}
        onConfirm={handleLeaveBand}
        t={t}
      />
    </motion.div>
  );
}
