export function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
    >
      {label}
    </a>
  );
}
