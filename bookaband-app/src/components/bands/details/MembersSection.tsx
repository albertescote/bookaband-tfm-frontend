import { motion } from 'framer-motion';
import { UserMinus, UserPlus } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';

interface Member {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

interface MembersSectionProps {
  members: Member[];
  isAdmin: boolean;
  currentUserId?: string;
  onInviteMember: () => void;
  onRemoveMember: (memberId: string) => void;
  t: (key: string) => string;
}

export function MembersSection({
  members,
  isAdmin,
  currentUserId,
  onInviteMember,
  onRemoveMember,
  t,
}: MembersSectionProps) {
  return (
    <CollapsibleSection title={t('members')} defaultOpen={true}>
      <div className="mb-4 flex justify-end">
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInviteMember}
            className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
          >
            <UserPlus size={20} />
            {t('inviteMember')}
          </motion.button>
        )}
      </div>
      <div className="space-y-4">
        {members.map((member, index) => (
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
                <span className="font-medium text-gray-900">{member.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="rounded-full bg-[#15b7b9] px-3 py-1 text-sm text-white"
              >
                {t(`roles.${member.role.toLowerCase()}`)}
              </motion.span>
              {isAdmin && member.id !== currentUserId && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <UserMinus size={20} />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </CollapsibleSection>
  );
}
