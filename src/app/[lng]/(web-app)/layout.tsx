import { WebAppAuthProvider } from '@/providers/webAppAuthProvider';
import WebAppHeader from '@/components/layout/web-app-header/web-app-header';
import Sidebar from '@/components/layout/sidebar/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebAppAuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <WebAppHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </WebAppAuthProvider>
  );
}
