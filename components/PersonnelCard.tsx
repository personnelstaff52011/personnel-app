'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="bg-white rounded-3xl border border-gray-200/90 hover:border-blue-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group active:scale-[0.99]">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 text-amber-400 text-sm font-extrabold shadow-xs">
            {personnel.seq_no}
          </span>
          {personnel.blood_group && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200">
              เลือด {personnel.blood_group}
            </span>
          )}
        </div>

        {/* Profile Avatar & Names */}
        <Link href={`/personnel/${personnel.id}`} className="flex items-center space-x-3.5 group/link">
          <div className="relative w-20 h-25 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-xs">
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
                <User className="w-8 h-8 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium">ไม่มีรูป</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-base sm:text-lg font-extrabold text-gray-900 group-hover/link:text-blue-600 transition-colors truncate">
              {personnel.full_name_th || [personnel.rank_th, personnel.first_name_th, personnel.last_name_th].filter(Boolean).join(' ')}
            </h4>
            {personnel.nickname && (
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                ชื่อเล่น: <span className="text-gray-900 font-bold">{personnel.nickname}</span>
              </p>
            )}
            <p className="text-xs font-mono text-gray-500 mt-0.5 truncate">
              {personnel.rank_en} {personnel.first_name_en} {personnel.last_name_en}
            </p>
          </div>
        </Link>

        {/* Department & Position */}
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-2 truncate">
            <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate font-medium text-gray-800">{personnel.department || 'ไม่ระบุสังกัด'}</span>
          </div>
          <div className="flex items-center space-x-2 truncate">
            <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate text-gray-600">{personnel.regular_position || '-'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer: Quick Call + View Profile */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        {cleanPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold transition-colors active:scale-95"
            title={`โทรออก ${personnel.phone_number}`}
          >
            <Phone className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span className="font-mono">{personnel.phone_number}</span>
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">ไม่มีเบอร์โทร</span>
        )}

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Link
              href={`/personnel/${personnel.id}/edit`}
              className="text-gray-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="แก้ไขข้อมูล (Admin)"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
          )}

          <Link
            href={`/personnel/${personnel.id}`}
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span>ดูโปรไฟล์</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
