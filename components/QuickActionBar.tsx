'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface QuickActionBarProps {
  personnelId: string;
  phoneNumber?: string | null;
  onDeleteClick: () => void;
}

export default function QuickActionBar({
  personnelId,
  phoneNumber,
  onDeleteClick,
}: QuickActionBarProps) {
  const { isAdmin } = useAuth();
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 px-3.5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom md:static md:bg-transparent md:border-0 md:p-0 md:shadow-none md:backdrop-blur-none">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Call Button (Available for all roles) */}
        {cleanPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 touch-manipulation"
            title={`โทรออก ${phoneNumber}`}
          >
            <Phone className="w-4 h-4 fill-white flex-shrink-0" />
            <span>โทรออก (Call)</span>
          </a>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-gray-200 text-gray-400 font-bold text-xs sm:text-sm cursor-not-allowed"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>โทรออก (Call)</span>
          </button>
        )}

        {/* SMS Button (Available for all roles) */}
        {cleanPhone ? (
          <a
            href={`sms:${cleanPhone}`}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 touch-manipulation"
            title={`ส่งข้อความ SMS ${phoneNumber}`}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span>ข้อความ (SMS)</span>
          </a>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-gray-200 text-gray-400 font-bold text-xs sm:text-sm cursor-not-allowed"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span>ข้อความ (SMS)</span>
          </button>
        )}

        {/* Admin-Only: Edit and Delete Buttons */}
        {isAdmin && (
          <>
            <Link
              href={`/personnel/${personnelId}/edit`}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 touch-manipulation flex-shrink-0"
              title="แก้ไขข้อมูลกำลังพล (Admin)"
            >
              <Edit3 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>แก้ไข</span>
            </Link>

            <button
              type="button"
              onClick={onDeleteClick}
              className="inline-flex items-center justify-center p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs sm:text-sm transition-transform active:scale-95 touch-manipulation flex-shrink-0"
              title="ลบข้อมูลกำลังพล (Admin)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
