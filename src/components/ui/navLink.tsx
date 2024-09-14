'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavButtonProps {
  href: string;
  label: string;
}

const NavButton = ({ href, label }: NavButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(href);

  return (
    <Link href={href} passHref>
      <p
        className={`rounded-lg px-4 py-2 text-lg text-[#23395b] transition-colors duration-300 
        ${isActive ? 'font-bold text-white' : 'font-semibold hover:font-bold hover:text-white'}`}
      >
        {label}
      </p>
    </Link>
  );
};

export default NavButton;
