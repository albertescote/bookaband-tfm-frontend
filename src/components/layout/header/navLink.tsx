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
    <button onClick={navigateTo}>
      <p
        className={`rounded-lg px-4 text-lg text-[#23395b] transition-colors duration-300 
        ${isActive ? 'font-bold text-white' : 'font-semibold hover:font-bold hover:text-white'}`}
      >
        {label}
      </p>
    </button>
  );
};

export default NavButton;
