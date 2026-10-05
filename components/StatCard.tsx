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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4.5 sm:p-5.5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm sm:text-base font-bold text-slate-600 tracking-tight line-clamp-1">
            {title}
          </p>
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-2 tracking-tight">
          {value}
        </h3>
      </div>
      
      {(subtitle || subValue || trend) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <div className="truncate mr-1">
            {subValue ? (
              <span className="font-bold text-slate-800 text-xs sm:text-sm">{subValue}</span>
            ) : (
              <span className="text-slate-500 font-medium">{subtitle}</span>
            )}
          </div>
          {trend && (
            <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold flex-shrink-0 text-xs border border-emerald-200">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
