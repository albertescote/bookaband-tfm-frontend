export function NavItem({ 
  href, 
  label, 
  onClick 
}: { 
  href: string; 
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
    >
      {label}
    </a>
  );
}
