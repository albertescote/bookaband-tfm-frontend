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
      className={`relative text-base font-medium will-change-transform ${
        isActive ? 'font-semibold text-[#15b7b9]' : 'text-[#565d6d]'
      }`}
      onClick={onClick}
    >
      <span className="transform transition-transform duration-200 hover:scale-105">
        {label}
      </span>
      <span
        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transform bg-[#15b7b9] transition-transform duration-200 ease-in-out ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </Link>
  );
}
