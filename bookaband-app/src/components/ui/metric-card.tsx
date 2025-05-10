import { ReactNode } from 'react';

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
    <div className={`rounded-lg bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-[#15b7b9]">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center">
            <span
              className={`text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
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
