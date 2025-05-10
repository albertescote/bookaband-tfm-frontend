'use client';

import { useTranslation } from '@/app/i18n/client';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import React from 'react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface DataTableProps<T> {
  language: string;
  data: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onSort?: (key: string) => void;
  onFilter?: (key: string, value: string) => void;
  sortConfig?: SortConfig;

  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  language,
  data,
  columns,
  onSort,
  onFilter,
  sortConfig,
  onRowClick,
}: DataTableProps<T>) {
  const { t } = useTranslation(language, 'home');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={`${column.key}-${index}`}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <div className="flex items-center space-x-2">
                  <span>{column.label}</span>
                  {onSort && (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex flex-col"
                    >
                      <ChevronUp
                        className={`h-4 w-4 ${
                          sortConfig?.key === column.key &&
                          sortConfig?.direction === 'asc'
                            ? 'text-[#15b7b9]'
                            : 'text-gray-400'
                        }`}
                      />
                      <ChevronDown
                        className={`h-4 w-4 ${
                          sortConfig?.key === column.key &&
                          sortConfig?.direction === 'desc'
                            ? 'text-[#15b7b9]'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  )}
                </div>
                {onFilter && (
                  <div className="mt-2">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#15b7b9]"
                        placeholder={t('search')}
                        onChange={(e) => onFilter(column.key, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                key="no-results"
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {t('no-results')}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${column.key}-${index}-${colIndex}`}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
