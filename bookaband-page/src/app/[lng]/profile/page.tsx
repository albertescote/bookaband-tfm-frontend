'use client';

import ClientProfileEditor from '@/components/profile/editor/clientProfileEditor';

interface PageParams {
  params: {
    lng: string;
  };
}

export default function Page({ params: { lng } }: PageParams) {
  return (
    <div className="min-h-screen bg-white p-6">
      <ClientProfileEditor />
    </div>
  );
}
