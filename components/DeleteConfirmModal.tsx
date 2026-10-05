'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  name: string;
  serviceCode?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title = 'ยืนยันการลบข้อมูลกำลังพล',
  name,
  serviceCode,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative space-y-4">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full transition-colors active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3 text-red-600">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h3>
        </div>

        <p className="text-base text-slate-600 leading-relaxed font-medium">
          คุณต้องการลบข้อมูลกำลังพลนายนี้ออกจากระบบอย่างถาวรใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="text-sm font-bold text-slate-500">กำลังพลที่เลือก:</div>
          <div className="font-black text-slate-900 text-lg sm:text-xl mt-0.5">{name}</div>
          {serviceCode && (
            <div className="text-sm font-mono text-slate-600 mt-0.5">รหัส: {serviceCode}</div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-5 py-3.5 sm:py-4 rounded-2xl text-base font-bold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 active:scale-95 text-center"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 sm:py-4 rounded-2xl text-base font-black text-white bg-red-600 hover:bg-red-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            <span>{isDeleting ? 'กำลังลบ...' : 'ยืนยันลบข้อมูล'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
