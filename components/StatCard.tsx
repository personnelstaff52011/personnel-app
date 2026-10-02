import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subValue?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  subValue,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-tight line-clamp-1">
            {title}
          </p>
          <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 sm:mt-2 tracking-tight">
          {value}
        </h3>
      </div>
      
      {(subtitle || subValue || trend) && (
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
          <div className="truncate mr-1">
            {subValue ? (
              <span className="font-semibold text-gray-700">{subValue}</span>
            ) : (
              <span>{subtitle}</span>
            )}
          </div>
          {trend && (
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 text-[10px]">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
