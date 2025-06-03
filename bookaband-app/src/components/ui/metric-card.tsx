import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl p-6 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="rounded-full bg-white/50 p-2 text-gray-600 backdrop-blur-sm">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                trend.isPositive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
