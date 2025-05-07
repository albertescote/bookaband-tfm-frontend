'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export default function NavLink({ href, label, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-base font-medium hover:text-[#15b7b9] ${
        isActive
          ? 'font-semibold text-[#15b7b9]'
          : 'text-[#565d6d] hover:text-[#15b7b9]'
      }`}
      onClick={onClick}
    >
      {label}
      <p
        className={`${isActive ? 'border-b-2 border-[#15b7b9]' : 'invisible'}`}
      ></p>
    </Link>
  );
}
