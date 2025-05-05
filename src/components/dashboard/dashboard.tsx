'use client';

import { useWebAppAuth } from '@/providers/webAppAuthProvider';

export default function Dashboard({ language }: { language: string }) {
  const { user, logoutUser } = useWebAppAuth();

  return (
    <main className="flex-1 p-6">
      <div className="p-8">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name || user?.email}
        </h1>
        <button
          onClick={logoutUser}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
