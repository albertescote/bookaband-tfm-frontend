'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/header/navBar';
import RegistrationButtons from '@/components/layout/header/registrationButtons';

export default function Header({ language }: { language: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-30 bg-[#f3f4f6] px-4 py-2 sm:px-6">
      <div className="relative flex items-center justify-between">
        <Link href="/" className="relative z-10">
          <Image
            src="/assets/logo.svg"
            alt="logo"
            height="200"
            width="200"
            className="h-6 w-auto sm:h-8"
          />
        </Link>

        <div className="ml-4 hidden flex-1 items-center justify-between lg:flex">
          <div className="flex-1">
            <Navbar language={language} />
          </div>
          <div className="ml-auto">
            <RegistrationButtons language={language} />
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative z-30 rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <div className="relative h-5 w-5 overflow-hidden">
            <span
              className={`absolute left-0 block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                isMenuOpen ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                isMenuOpen ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </div>
        </button>

        {isMenuOpen && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={closeMenu}
          />
        )}

        <div
          className={`fixed inset-y-0 right-0 z-20 w-full max-w-xs overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mt-16 flex flex-col items-center space-y-6 p-6">
            <div className="w-full">
              <Navbar language={language} onLinkClick={closeMenu} />
            </div>
            <div className="w-full">
              <RegistrationButtons language={language} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
