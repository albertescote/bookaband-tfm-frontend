'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { ArrowLeft, LogOut, Trash2 } from 'lucide-react';
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
import { EventType } from '@/service/backend/eventTypes/domain/eventType';
import { fetchEventTypes } from '@/service/backend/eventTypes/service/eventType.service';

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

export default function BandDetails() {
  const { id, lng } = useParams<{ id: string; lng: string }>();
  const { t } = useTranslation(lng || 'en', 'bands');
  const router = useRouter();
  const { user } = useAuth();

  const [bandProfile, setBandProfile] = useState<BandProfile | null>(null);
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
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const [bandData, stylesData, eventTypesData] = await Promise.all([
          getBandProfileById(id),
          fetchMusicalStyles(),
          fetchEventTypes(),
        ]);

        if (bandData && !('message' in bandData)) {
          setBandProfile(bandData);
        }
        if (stylesData && !('message' in stylesData)) {
          setMusicalStyles(stylesData as MusicalStyle[]);
        }
        if (eventTypesData && !('message' in eventTypesData)) {
          setEventTypes(eventTypesData as EventType[]);
        }
      } catch (error) {
        console.error('Error loading band data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const hasChanges = () => {
    if (hasImageChanged) return true;
    if (Object.keys(editedValues).length === 0) return false;

    // Check if any value is different from the original
    return Object.entries(editedValues).some(([key, value]) => {
      if (key === 'weeklyAvailability') {
        return Object.entries(value as WeeklyAvailability).some(
          ([day, isAvailable]) =>
            isAvailable !==
            bandProfile?.weeklyAvailability[day as keyof WeeklyAvailability],
        );
      }
      return (
        JSON.stringify(value) !==
        JSON.stringify(bandProfile?.[key as keyof BandProfile] || {})
      );
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBand(id);
      toast.success(t('successDeleting'));
      router.refresh();
      setTimeout(() => {
        router.push(`/${lng}/bands`);
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
      await leaveBand(id);
      toast.success(t('successLeaving'));
      router.push(`/${lng}/bands`);
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
      await sendInvitation(id, inviteEmail.trim());
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
      await removeMember(id, memberId);
      setBandProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: prev.members?.filter((member) => member.id !== memberId),
        };
      });
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
      name: bandProfile?.name ?? '',
      bio: bandProfile?.bio ?? '',
      location: bandProfile?.location ?? '',
      socialLinks: bandProfile?.socialLinks ?? [],
      imageUrl: bandProfile?.imageUrl ?? '',
      media: bandProfile?.media ?? [],
      weeklyAvailability: bandProfile?.weeklyAvailability ?? {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      musicalStyleIds: bandProfile?.musicalStyleIds ?? [],
      bandSize: bandProfile?.bandSize ?? 'BAND',
      hospitalityRider: bandProfile?.hospitalityRider ?? {
        accommodation: '',
        catering: '',
        beverages: '',
        specialRequirements: '',
      },
      technicalRider: bandProfile?.technicalRider ?? {
        soundSystem: '',
        microphones: '',
        backline: '',
        lighting: '',
        otherRequirements: '',
      },
      performanceArea: bandProfile?.performanceArea ?? {
        regions: [],
        travelPreferences: '',
        restrictions: '',
      },
      eventTypeIds: bandProfile?.eventTypeIds ?? [],
    });
    setHasImageChanged(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedValues({});
    setHasImageChanged(false);
    setBandProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        imageUrl: bandProfile?.imageUrl ?? '',
      };
    });
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
      media: [...(prev.media || bandProfile?.media || []), ...newMedia],
    }));
  };

  const handleDeleteMedia = (mediaId: string | undefined) => {
    if (!mediaId) return;

    setEditedValues((prev) => ({
      ...prev,
      media: (prev.media || bandProfile?.media || []).filter(
        (media) => 'id' in media && media.id !== mediaId,
      ),
    }));
  };

  const handleSaveEdit = async () => {
    if (!id || !hasChanges()) return;

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
    if (!editedValues.socialLinks && !bandProfile?.socialLinks) {
      toast.error(t('validation.required.socialLinks'));
      return;
    }

    if (!editedValues.media && !bandProfile?.media) {
      toast.error(t('validation.required.media'));
      return;
    }

    setIsUpdating(true);
    try {
      let uploadedImageUrl = editedValues.imageUrl;
      const uploadedMediaUrls: { url: string; type: string }[] = [];

      // Upload profile image if changed
      if (editedValues.imageFile) {
        const formData = new FormData();
        formData.append('file', editedValues.imageFile);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload profile image');
        }

        const data = await response.json();
        uploadedImageUrl = data.url;
      }

      // Upload media files if any
      if (editedValues.media?.some((media) => 'file' in media)) {
        for (const media of editedValues.media) {
          if ('file' in media) {
            const formData = new FormData();
            formData.append('file', media.file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to upload media file');
            }

            const data = await response.json();
            uploadedMediaUrls.push({
              url: data.url,
              type: media.type,
            });
          } else {
            // Keep existing media that wasn't changed
            uploadedMediaUrls.push({
              url: media.url,
              type: media.type,
            });
          }
        }
      }

      // Add other band data
      const bandData = {
        name: editedValues.name || bandProfile?.name || '',
        musicalStyleIds:
          editedValues.musicalStyleIds || bandProfile?.musicalStyleIds || [],
        price: bandProfile?.price || 0,
        location: editedValues.location || bandProfile?.location || '',
        bandSize: editedValues.bandSize || bandProfile?.bandSize || 'BAND',
        eventTypeIds:
          editedValues.eventTypeIds || bandProfile?.eventTypeIds || [],
        bio: editedValues.bio || bandProfile?.bio || '',
        weeklyAvailability: editedValues.weeklyAvailability ||
          bandProfile?.weeklyAvailability || {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          },
        media:
          uploadedMediaUrls.length > 0
            ? uploadedMediaUrls
            : editedValues.media || bandProfile?.media || [],
        socialLinks: editedValues.socialLinks || bandProfile?.socialLinks || [],
        imageUrl:
          uploadedImageUrl === ''
            ? ''
            : uploadedImageUrl || bandProfile?.imageUrl || '',
        technicalRider: {
          soundSystem:
            editedValues.technicalRider?.soundSystem ||
            bandProfile?.technicalRider?.soundSystem ||
            '',
          microphones:
            editedValues.technicalRider?.microphones ||
            bandProfile?.technicalRider?.microphones ||
            '',
          backline:
            editedValues.technicalRider?.backline ||
            bandProfile?.technicalRider?.backline ||
            '',
          lighting:
            editedValues.technicalRider?.lighting ||
            bandProfile?.technicalRider?.lighting ||
            '',
          otherRequirements:
            editedValues.technicalRider?.otherRequirements === ''
              ? ''
              : editedValues.technicalRider?.otherRequirements ||
                bandProfile?.technicalRider?.otherRequirements ||
                '',
        },
        performanceArea: {
          regions:
            editedValues.performanceArea?.regions ||
            bandProfile?.performanceArea?.regions ||
            [],
          travelPreferences:
            editedValues.performanceArea?.travelPreferences ||
            bandProfile?.performanceArea?.travelPreferences ||
            '',
          restrictions:
            editedValues.performanceArea?.restrictions === ''
              ? ''
              : editedValues.performanceArea?.restrictions ||
                bandProfile?.performanceArea?.restrictions ||
                '',
        },
        hospitalityRider: {
          accommodation:
            editedValues.hospitalityRider?.accommodation ||
            bandProfile?.hospitalityRider?.accommodation ||
            '',
          catering:
            editedValues.hospitalityRider?.catering ||
            bandProfile?.hospitalityRider?.catering ||
            '',
          beverages:
            editedValues.hospitalityRider?.beverages ||
            bandProfile?.hospitalityRider?.beverages ||
            '',
          specialRequirements:
            editedValues.hospitalityRider?.specialRequirements === ''
              ? ''
              : editedValues.hospitalityRider?.specialRequirements ||
                bandProfile?.hospitalityRider?.specialRequirements ||
                '',
        },
      };

      // Update the band with the new data
      await updateBand(id, bandData);

      const updatedProfile = await getBandProfileById(id);
      if (updatedProfile) {
        setBandProfile(updatedProfile);
        toast.success(t('successUpdating'));
        setIsEditing(false);
        setEditedValues({});
        setHasImageChanged(false);
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

    setEditedValues((prev) => {
      const base = prev.weeklyAvailability ||
        bandProfile?.weeklyAvailability || {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        };
      return {
        ...prev,
        weeklyAvailability: {
          ...base,
          [day]: !base[day],
        },
      };
    });
  };

  const isAdmin =
    bandProfile?.members?.some(
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!bandProfile) {
    return <div>Band not found</div>;
  }

  const handleLocationChange = (value: string) => {
    setEditedValues((prev) => ({ ...prev, location: value }));
  };

  const handleMusicalStylesChange = (value: string[]) => {
    setEditedValues((prev) => ({ ...prev, musicalStyleIds: value }));
  };

  const handleEventTypesChange = (value: string[]) => {
    setEditedValues((prev) => ({ ...prev, eventTypeIds: value }));
  };

  const handleBandSizeChange = (value: string) => {
    setEditedValues((prev) => ({ ...prev, bandSize: value as BandSize }));
  };

  const handleBioChange = (value: string) => {
    setEditedValues((prev) => ({ ...prev, bio: value }));
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
            setBandProfile((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                imageUrl: '',
              };
            });
            setHasImageChanged(true);
          }}
          language={lng || 'en'}
        />

        <div className="space-y-6">
          <BasicInfoSection
            location={editedValues.location ?? bandProfile.location ?? ''}
            musicalStyles={musicalStyles}
            selectedMusicalStyleIds={
              editedValues.musicalStyleIds || bandProfile.musicalStyleIds
            }
            eventTypes={eventTypes}
            selectedEventTypeIds={
              editedValues.eventTypeIds || bandProfile.eventTypeIds
            }
            bandSize={editedValues.bandSize || bandProfile.bandSize}
            bio={editedValues.bio ?? bandProfile.bio ?? ''}
            isEditing={isEditing}
            language={lng || 'en'}
            onLocationChange={handleLocationChange}
            onMusicalStylesChange={handleMusicalStylesChange}
            onEventTypesChange={handleEventTypesChange}
            onBandSizeChange={handleBandSizeChange}
            onBioChange={handleBioChange}
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
