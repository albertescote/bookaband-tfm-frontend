import { motion } from 'framer-motion';
import {
  Facebook,
  Globe,
  Instagram,
  Link,
  LucideIcon,
  Twitter,
  X,
} from 'lucide-react';
import { AiOutlineSpotify, AiOutlineTikTok } from 'react-icons/ai';
import { CollapsibleSection } from './CollapsibleSection';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  isEditing: boolean;
  onAddLink: () => void;
  onUpdateLink: (index: number, url: string) => void;
  onRemoveLink: (index: number) => void;
  t: (key: string) => string;
}

export function SocialLinksSection({
  socialLinks,
  isEditing,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  t,
}: SocialLinksSectionProps) {
  const getPlatformIcon = (
    platform: string,
  ): LucideIcon | typeof AiOutlineSpotify | typeof AiOutlineTikTok => {
    return (
      {
        instagram: Instagram,
        facebook: Facebook,
        twitter: Twitter,
        youtube: Globe,
        spotify: AiOutlineSpotify,
        tiktok: AiOutlineTikTok,
        website: Globe,
      }[platform.toLowerCase()] || Link
    );
  };

  return (
    <CollapsibleSection
      title={t('form.multimedia.socialMedia')}
      defaultOpen={false}
    >
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            {socialLinks.length > 0 ? (
              socialLinks.map((link, index) => (
                <div key={link.id} className="flex items-center gap-4">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      onUpdateLink(index, e.target.value);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                    placeholder="https://..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveLink(index)}
                    className="rounded-full border-2 border-red-600 p-0.5 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-gray-500">
                  {t('form.multimedia.noSocialLinks')}
                </p>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddLink}
              className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90"
            >
              <Link size={20} />
              {t('form.multimedia.addSocialLink')}
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => {
                const Icon = getPlatformIcon(link.platform);

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
              })
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-gray-500">
                  {t('form.multimedia.noSocialLinks')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
