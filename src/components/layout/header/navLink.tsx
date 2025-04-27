'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavButtonProps {
  href: string;
  label: string;
}

const NavButton = ({ href, label }: NavButtonProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname.endsWith(href);

  const navigateTo = () => {
    router.push(href);
  };

  return (
    <button onClick={navigateTo} className="mt-2 space-y-2">
      <p
        className={`px-4 text-base transition-colors duration-300 
        ${isActive ? 'font-semibold text-[#15b7b9]' : 'text-[#565d6d] hover:text-[#15b7b9]'}`}
      >
        {label}
      </p>
      <p
        className={`${isActive ? 'border-b-2 border-[#15b7b9]' : 'invisible'}`}
      ></p>
    </button>
  );
};

export default NavButton;
