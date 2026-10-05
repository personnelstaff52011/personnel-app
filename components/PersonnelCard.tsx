'use client';

import React from 'react';
import Link from 'next/link';
import { User, Phone, Building2, ChevronRight, Shield, Edit3 } from 'lucide-react';
import { Personnel } from '@/types/personnel';
import { useAuth } from '@/context/AuthContext';

interface PersonnelCardProps {
  personnel: Personnel;
}

export default function PersonnelCard({ personnel }: PersonnelCardProps) {
  const { isAdmin } = useAuth();
  const [imgError, setImgError] = React.useState(false);
  const cleanPhone = personnel.phone_number ? personnel.phone_number.replace(/[^0-9]/g, '') : '';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group active:scale-[0.99]">
      <div>
        {/* Profile Avatar & Names */}
        <Link href={`/personnel/${personnel.id}`} className="flex items-center space-x-3 group/link">
          <div className="relative w-[56px] h-[72px] sm:w-[64px] sm:h-[82px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-2xs">
            {personnel.photo_url && !imgError ? (
              <img
                src={personnel.photo_url}
                alt={personnel.full_name_th}
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">ไม่มีรูป</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover/link:text-blue-600 transition-colors leading-snug">
                {personnel.full_name_th || [personnel.rank_th, personnel.first_name_th, personnel.last_name_th].filter(Boolean).join(' ')}
              </h4>
              {personnel.duty_status === 'ช่วยราชการ' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0">
                  ช่วยราชการ
                </span>
              )}
            </div>
            {personnel.nickname && (
              <p className="text-sm sm:text-base text-slate-700 font-semibold mt-0.5">
                ชื่อเล่น: <span className="text-slate-950 font-black">{personnel.nickname}</span>
              </p>
            )}
            <p className="text-xs sm:text-sm font-mono text-slate-500 mt-0.5 truncate font-medium">
              {personnel.rank_en} {personnel.first_name_en} {personnel.last_name_en}
            </p>
          </div>
        </Link>

        {/* Department & Position */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-sm sm:text-base text-slate-700">
          <div className="flex items-center space-x-2.5 truncate">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate font-semibold text-slate-900">{personnel.department || 'ไม่ระบุสังกัด'}</span>
          </div>
          <div className="flex items-center space-x-2.5 truncate">
            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate text-slate-600 font-medium">{personnel.regular_position || '-'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer: Quick Call + View Profile */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {cleanPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-bold transition-all active:scale-95 shadow-2xs"
            title={`โทรออก ${personnel.phone_number}`}
          >
            <Phone className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span className="font-mono">{personnel.phone_number}</span>
          </a>
        ) : (
          <span className="text-xs sm:text-sm text-slate-400 italic font-medium">ไม่มีเบอร์โทร</span>
        )}

        <div className="flex items-center space-x-1">
          {isAdmin && (
            <Link
              href={`/personnel/${personnel.id}/edit`}
              className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              title="แก้ไขข้อมูล (Admin)"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
          )}

          <Link
            href={`/personnel/${personnel.id}`}
            className="inline-flex items-center space-x-1 text-sm sm:text-base font-bold text-blue-600 hover:text-blue-800 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors active:scale-95"
          >
            <span>ดูโปรไฟล์</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
