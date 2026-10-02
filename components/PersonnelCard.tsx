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
    <div className="bg-white rounded-2xl border border-gray-200/90 hover:border-blue-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group active:scale-[0.99]">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-amber-400 text-xs font-extrabold shadow-xs">
            {personnel.seq_no}
          </span>
          {personnel.blood_group && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
              เลือด {personnel.blood_group}
            </span>
          )}
        </div>

        {/* Profile Avatar & Names */}
        <Link href={`/personnel/${personnel.id}`} className="flex items-center space-x-3 group/link">
          <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-xs">
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
                <User className="w-7 h-7 text-slate-400" />
                <span className="text-[9px] text-slate-400 font-medium">ไม่มีรูป</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover/link:text-blue-600 transition-colors truncate">
              {personnel.full_name_th}
            </h4>
            {personnel.nickname && (
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                ชื่อเล่น: <span className="text-gray-800 font-bold">{personnel.nickname}</span>
              </p>
            )}
            <p className="text-[11px] font-mono text-gray-400 mt-0.5 truncate">
              {personnel.rank_en} {personnel.first_name_en} {personnel.last_name_en}
            </p>
          </div>
        </Link>

        {/* Department & Position */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center space-x-2 truncate">
            <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate font-medium">{personnel.department || 'ไม่ระบุสังกัด'}</span>
          </div>
          <div className="flex items-center space-x-2 truncate">
            <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{personnel.regular_position || '-'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer: Quick Call + View Profile */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        {cleanPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors active:scale-95"
            title={`โทรออก ${personnel.phone_number}`}
          >
            <Phone className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span className="font-mono">{personnel.phone_number}</span>
          </a>
        ) : (
          <span className="text-[11px] text-gray-400 italic">ไม่มีเบอร์โทร</span>
        )}

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Link
              href={`/personnel/${personnel.id}/edit`}
              className="text-xs font-semibold text-gray-400 hover:text-slate-800 p-1"
              title="แก้ไขข้อมูล (Admin)"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Link>
          )}

          <Link
            href={`/personnel/${personnel.id}`}
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 p-1 rounded-md transition-colors"
          >
            <span>ดูโปรไฟล์</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
