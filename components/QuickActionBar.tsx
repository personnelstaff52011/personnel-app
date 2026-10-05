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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-4 py-3.5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] safe-bottom md:static md:bg-transparent md:border-0 md:p-0 md:shadow-none md:backdrop-blur-none">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Call Button (Available for all roles) */}
        {cleanPhone ? (
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3.5 sm:py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base sm:text-lg shadow-sm transition-transform active:scale-95 touch-manipulation"
            title={`โทรออก ${phoneNumber}`}
          >
            <Phone className="w-5.5 h-5.5 fill-white flex-shrink-0" />
            <span>โทรออก</span>
          </a>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3.5 sm:py-4 rounded-2xl bg-slate-200 text-slate-400 font-extrabold text-base sm:text-lg cursor-not-allowed"
          >
            <Phone className="w-5.5 h-5.5 flex-shrink-0" />
            <span>โทรออก</span>
          </button>
        )}

        {/* SMS Button (Available for all roles) */}
        {cleanPhone ? (
          <a
            href={`sms:${cleanPhone}`}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3.5 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base sm:text-lg shadow-sm transition-transform active:scale-95 touch-manipulation"
            title={`ส่งข้อความ SMS ${phoneNumber}`}
          >
            <MessageSquare className="w-5.5 h-5.5 flex-shrink-0" />
            <span>ข้อความ</span>
          </a>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3.5 sm:py-4 rounded-2xl bg-slate-200 text-slate-400 font-extrabold text-base sm:text-lg cursor-not-allowed"
          >
            <MessageSquare className="w-5.5 h-5.5 flex-shrink-0" />
            <span>ข้อความ</span>
          </button>
        )}

        {/* Admin-Only: Edit and Delete Buttons */}
        {isAdmin && (
          <>
            <Link
              href={`/personnel/${personnelId}/edit`}
              className="inline-flex items-center justify-center space-x-1.5 px-4.5 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-sm transition-transform active:scale-95 touch-manipulation flex-shrink-0"
              title="แก้ไขข้อมูลกำลังพล (Admin)"
            >
              <Edit3 className="w-4.5 h-4.5 flex-shrink-0" />
              <span>แก้ไข</span>
            </Link>

            <button
              type="button"
              onClick={onDeleteClick}
              className="inline-flex items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-base transition-transform active:scale-95 touch-manipulation flex-shrink-0"
              title="ลบข้อมูลกำลังพล (Admin)"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
