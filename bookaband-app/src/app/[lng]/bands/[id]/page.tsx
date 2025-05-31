'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import {
  ArrowLeft,
  LogOut,
  Trash2,
  UserMinus,
  UserPlus,
  X,
} from 'lucide-react';
import {
  deleteBand,
  getBandDetailsById,
  leaveBand,
  removeMember,
} from '@/service/backend/band/service/band.service';
import { sendInvitation } from '@/service/backend/invitation/service/invitation.service';
import { BandWithDetails } from '@/service/backend/band/domain/bandWithDetails';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { useAuth } from '@/providers/authProvider';
import { BandRole } from '@/service/backend/band/domain/bandRole';

export default function ManageBandPage() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();
  const bandId = params.id as string;
  const { user } = useAuth();

  const [band, setBand] = useState<BandWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    fetchBandDetails();
  }, [bandId]);

  const fetchBandDetails = async () => {
    try {
      const bandDetails = await getBandDetailsById(bandId);
      if (bandDetails) {
        setBand(bandDetails);
      } else {
        setError(t('common:errorLoading'));
      }
    } catch (err) {
      console.error('Error fetching band details:', err);
      setError(t('common:errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBand = async () => {
    setIsDeleting(true);
    try {
      await deleteBand(bandId);
      toast.success(t('bandDeleted'));
      router.push('/bands');
      window.location.reload();
    } catch (err) {
      console.error('Error deleting band:', err);
      setError(t('common:errorDeleting'));
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeaveBand = async () => {
    setIsLeaving(true);
    try {
      await leaveBand(bandId);
      toast.success(t('successLeaving'));
      router.push('/bands');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error('Error leaving band:', err);
      setError(t('errorLeaving'));
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
      setError(t('common:errorInviting'));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(memberId);
    try {
      await removeMember(bandId, memberId);
      await fetchBandDetails();
      toast.success(t('memberRemoved'));
    } catch (err) {
      console.error('Error removing member:', err);
      setError(t('common:errorRemoving'));
    } finally {
      setIsRemoving(null);
      setShowRemoveConfirm(null);
    }
  };

  const isAdmin =
    band?.members.find((member) => member.id === user?.id)?.role ===
    BandRole.ADMIN;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <p className="text-gray-600">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !band) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            {t('errorScreen.title')}
          </h2>
          <p className="max-w-md text-gray-600">
            {t('errorScreen.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        {t('back')}
      </button>

      <div className="mx-auto max-w-4xl">
        {/* Band Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {band.name}
            </h1>
            <p className="text-gray-600">{band.genre}</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
                {t('deleteBand')}
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={20} />
                {t('leaveBand')}
              </button>
            )}
          </div>
        </div>

        {/* Band Image */}
        {band.imageUrl && (
          <div className="mb-8">
            <img
              src={band.imageUrl}
              alt={band.name}
              className="h-64 w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Members Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('members')}
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
              >
                <UserPlus size={20} />
                {t('inviteMember')}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {band.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.userName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-sm text-gray-500">
                        {member.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-900">
                      {member.userName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-[#15b7b9] px-3 py-1 text-xs font-medium text-white">
                    {t(member.role.toLowerCase())}
                  </span>
                  {isAdmin && member.id !== user?.id && (
                    <button
                      onClick={() => setShowRemoveConfirm(member.id)}
                      disabled={isRemoving === member.id}
                      className="text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <UserMinus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t('confirmDelete')}
              </h3>
              <p className="mb-6 text-gray-600">{t('deleteWarning')}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isDeleting}
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleDeleteBand}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? t('deleting') : t('delete')}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Leave Band Confirmation Modal */}
      {showLeaveConfirm &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t('leaveBandConfirmation')}
              </h3>
              <p className="mb-6 text-gray-600">
                {t('leaveBandConfirmationDescription')}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isLeaving}
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleLeaveBand}
                  disabled={isLeaving}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLeaving ? t('leaving') : t('leave')}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Invite Member Modal */}
      {showInviteModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('inviteMember')}
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#15b7b9]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isInviting ? t('inviting') : t('invite')}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveConfirm &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {t('confirmRemoveMember')}
              </h3>
              <p className="mb-6 text-gray-600">{t('removeMemberWarning')}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRemoveConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isRemoving === showRemoveConfirm}
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => handleRemoveMember(showRemoveConfirm)}
                  disabled={isRemoving === showRemoveConfirm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRemoving === showRemoveConfirm
                    ? t('removing')
                    : t('remove')}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
