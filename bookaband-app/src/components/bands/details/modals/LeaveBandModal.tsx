import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LeaveBandModalProps {
  isOpen: boolean;
  isLeaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

export function LeaveBandModal({
  isOpen,
  isLeaving,
  onClose,
  onConfirm,
  t,
}: LeaveBandModalProps) {
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
              {t('leaveBand')}
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
          <p className="mb-6 text-gray-600">{t('leaveBandConfirmation')}</p>
          <p className="mb-6 text-sm text-gray-500">
            {t('leaveBandConfirmationDescription')}
          </p>
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              {t('common.cancel')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              disabled={isLeaving}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLeaving ? t('leaving') : t('leave')}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
