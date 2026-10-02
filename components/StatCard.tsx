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
    <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-tight line-clamp-1">
            {title}
          </p>
          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 sm:mt-2 tracking-tight">
          {value}
        </h3>
      </div>
      
      {(subtitle || subValue || trend) && (
        <div className="mt-3 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="truncate mr-1">
            {subValue ? (
              <span className="font-bold text-gray-800 text-xs sm:text-sm">{subValue}</span>
            ) : (
              <span className="text-gray-500 font-medium">{subtitle}</span>
            )}
          </div>
          {trend && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex-shrink-0 text-xs border border-emerald-200">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
