'use client';
import { MessageSquareText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function MessagesMenu({ language }: { language: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
      >
        <MessageSquareText size={24} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[#15b7b9] bg-white shadow-xl">
          <p className="px-4 py-2 text-sm font-semibold text-gray-700">
            Missatges recents
          </p>
          <div className="divide-y">
            <Link
              href={`/${language}/chat`}
              className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
            >
              Marta G.: Confirmem horari?
            </Link>
            <Link
              href={`/${language}/chat`}
              className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
            >
              Jordi L.: Gràcies pel contracte!
            </Link>
            <Link
              href={`/${language}/chat`}
              className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
            >
              Carla B.: Podem revisar el rider?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
