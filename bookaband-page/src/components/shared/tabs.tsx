'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('flex gap-4', className)}>{children}</div>;
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within a Tabs');

  const { value: current, setValue } = context;

  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
        current === value
          ? 'border-[#15b7b9] text-[#15b7b9]'
          : 'border-transparent text-gray-500 hover:text-[#15b7b9]',
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within a Tabs');

  const { value: current } = context;

  if (value !== current) return null;

  return <div className={cn('pt-4', className)}>{children}</div>;
}
