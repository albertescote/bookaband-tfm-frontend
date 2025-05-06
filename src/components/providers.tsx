'use client';

import { WebPageAuthProvider } from '@/providers/webPageAuthProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <WebPageAuthProvider>{children}</WebPageAuthProvider>;
}
