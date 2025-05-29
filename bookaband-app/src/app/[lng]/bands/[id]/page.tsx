'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { ArrowLeft, Trash2, UserPlus, UserMinus, X } from 'lucide-react';
import { getBandDetailsById, deleteBand, removeMember } from '@/service/backend/band/service/band.service';
import { sendInvitation } from '@/service/backend/invitation/service/invitation.service';
import { BandWithDetails } from '@/service/backend/band/domain/bandWithDetails';
import { MusicGenre } from '@/service/backend/band/domain/musicGenre';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

export default function ManageBandPage() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();
  const bandId = params.id as string;

  const [band, setBand] = useState<BandWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

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
    } catch (err) {
      console.error('Error deleting band:', err);
      setError(t('common:errorDeleting'));
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !band) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error || t('common:errorLoading')}</p>
          <button
            onClick={() => router.push('/bands')}
            className="mt-4 text-[#15b7b9] hover:text-[#15b7b9]/90"
          >
            {t('common:backToBands')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        {t('back')}
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Band Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{band.name}</h1>
            <p className="text-gray-600">{band.genre}</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 size={20} />
            {t('deleteBand')}
          </button>
        </div>

        {/* Band Image */}
        {band.imageUrl && (
          <div className="mb-8">
            <img
              src={band.imageUrl}
              alt={band.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Members Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{t('members')}</h2>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 bg-[#15b7b9] text-white px-4 py-2 rounded-lg hover:bg-[#15b7b9]/90 transition-colors"
            >
              <UserPlus size={20} />
              {t('inviteMember')}
            </button>
          </div>

          <div className="space-y-4">
            {band.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {member.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{member.userName}</span>
                </div>
                <button
                  onClick={() => setShowRemoveConfirm(member.id)}
                  disabled={isRemoving === member.id}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserMinus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('confirmDelete')}
            </h3>
            <p className="text-gray-600 mb-6">{t('deleteWarning')}</p>
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Invite Member Modal */}
      {showInviteModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
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
            <form onSubmit={handleInviteMember}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('memberEmail')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#15b7b9] focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  disabled={isInviting}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-4 py-2 bg-[#15b7b9] text-white rounded-lg hover:bg-[#15b7b9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInviting ? t('inviting') : t('invite')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveConfirm && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('confirmRemoveMember')}
            </h3>
            <p className="text-gray-600 mb-6">{t('removeMemberWarning')}</p>
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRemoving === showRemoveConfirm ? t('removing') : t('remove')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 