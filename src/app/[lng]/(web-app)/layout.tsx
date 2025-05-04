import LanguageSwitcher from '@/components/layout/footer/languageSwitcher';
import { WebAppAuthProvider } from '@/providers/webAppAuthProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebAppAuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-white shadow-md md:flex">
          <div className="p-6 text-2xl font-extrabold text-[#15b7b9]">
            BookaBand
          </div>
          <nav className="flex-1 space-y-2 px-4">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/calendar" label="Calendar" />
            <NavItem href="/bands" label="Bands" />
            <NavItem href="/performances" label="Performances" />
            <NavItem href="/payments" label="Payments" />
            <NavItem href="/profile" label="Profile" />
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
            <div className="font-bold text-gray-700">Welcome back!</div>
            <div className="flex items-center space-x-4">
              {/* Language switcher, notifications, profile avatar */}
              <LanguageSwitcher language="en" />
              <img
                src="/assets/musician1.jpg"
                className="h-8 w-8 rounded-full"
                alt="User Avatar"
              />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </WebAppAuthProvider>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
    >
      {label}
    </a>
  );
}
