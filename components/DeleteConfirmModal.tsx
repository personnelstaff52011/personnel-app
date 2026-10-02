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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          คุณต้องการลบข้อมูลกำลังพลนายนี้ออกจากระบบอย่างถาวรใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 mb-6">
          <div className="text-xs text-gray-500">กำลังพลที่เลือก:</div>
          <div className="font-bold text-gray-900 text-sm mt-0.5">{name}</div>
          {serviceCode && (
            <div className="text-xs font-mono text-gray-600 mt-0.5">รหัส: {serviceCode}</div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'กำลังลบ...' : 'ยืนยันลบข้อมูล'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
