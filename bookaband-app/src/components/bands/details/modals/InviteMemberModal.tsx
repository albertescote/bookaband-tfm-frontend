import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  isInviting: boolean;
  inviteEmail: string;
  onClose: () => void;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  t: (key: string) => string;
}

export function InviteMemberModal({
  isOpen,
  isInviting,
  inviteEmail,
  onClose,
  onEmailChange,
  onSubmit,
  t,
}: InviteMemberModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </motion.button>
          </div>
          <p className="mb-6 text-gray-600">{t('inviteMemberDescription')}</p>
          <form onSubmit={onSubmit}>
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
                onChange={(e) => onEmailChange(e.target.value)}
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
                onClick={onClose}
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
    </AnimatePresence>
  );
}
