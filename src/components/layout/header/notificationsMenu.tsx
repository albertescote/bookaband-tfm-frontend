'use client';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function NotificationsMenu({ language }: { language: string }) {
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
        className="åitems-center flex justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
      >
        <Bell size={24} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[#15b7b9] bg-white shadow-xl">
          <p className="px-4 py-2 text-sm font-semibold text-gray-700">
            Notificacions
          </p>
          <div className="divide-y">
            <Link
              href={`/${language}/notifications`}
              className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
            >
              Nova reserva confirmada.
            </Link>
            <Link
              href={`/${language}/notifications`}
              className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
            >
              Missatge rebut de Marta G.
            </Link>
            <Link
              href={`/${language}/notifications`}
              className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
            >
              Contracte aprovat.
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
