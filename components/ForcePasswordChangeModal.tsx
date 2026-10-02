'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ForcePasswordChangeModal() {
  const { user, changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || !user.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await changePassword(newPassword);
      if (ok) {
        alert('ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว ยินดีต้อนรับเข้าสู่ระบบ!');
      } else {
        setError('เกิดข้อผิดพลาดในการบันทึกรหัสผ่าน');
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการบันทึกรหัสผ่าน');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            กรุณาตั้งรหัสผ่านใหม่สำหรับการเข้าใช้งานครั้งแรก
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            ท่านได้เข้าสู่ระบบด้วยเลขประจำตัวทหาร เพื่อความปลอดภัยของข้อมูลกำลังพล กรุณากำหนดรหัสผ่านส่วนตัวใหม่สำหรับใช้ในการเข้าสู่ระบบครั้งถัดไป
          </p>
        </div>

        {/* User Info Capsule */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs">
          <div className="text-gray-400 font-medium">กำลังพล:</div>
          <div className="font-extrabold text-gray-900 text-sm mt-0.5">{user.displayName}</div>
          <div className="text-gray-500 font-mono mt-0.5">เลขประชาชน: {user.citizen_id}</div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              รหัสผ่านใหม่ (New Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="กำหนดรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ยืนยันรหัสผ่านใหม่อีกครั้ง (Confirm Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'กำลังบันทึกรหัสผ่าน...' : 'บันทึกรหัสผ่านและเริ่มใช้งาน'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
