import { motion } from 'framer-motion';
import { Check, Edit2, X } from 'lucide-react';

interface BandHeaderProps {
  name: string;
  isEditing: boolean;
  isUpdating: boolean;
  hasChanges: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onNameChange: (name: string) => void;
  t: (key: string) => string;
}

export function BandHeader({
  name,
  isEditing,
  isUpdating,
  hasChanges,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onNameChange,
  t,
}: BandHeaderProps) {
  return (
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
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-xl font-bold focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
              />
            ) : (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold"
              >
                {name}
              </motion.h1>
            )}
          </div>
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
                  onClick={onCancelEdit}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                  {t('common.cancel')}
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: isUpdating || !hasChanges ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: isUpdating || !hasChanges ? 1 : 0.95,
                  }}
                  onClick={onSaveEdit}
                  disabled={isUpdating || !hasChanges}
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
                onClick={onStartEdit}
                className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90"
              >
                <Edit2 className="h-5 w-5" />
                {t('common.edit')}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
