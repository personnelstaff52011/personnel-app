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
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            กรุณาตั้งรหัสผ่านใหม่
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            เพื่อความปลอดภัยของข้อมูลกำลังพล กรุณากำหนดรหัสผ่านส่วนตัวใหม่สำหรับใช้ในการเข้าสู่ระบบครั้งถัดไป
          </p>
        </div>

        {/* User Info Capsule */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-sm sm:text-base">
          <div className="text-slate-500 font-bold">กำลังพล:</div>
          <div className="font-black text-slate-900 text-lg sm:text-xl mt-0.5">{user.displayName}</div>
          <div className="text-slate-600 font-mono mt-1 font-semibold">เลขประชาชน: {user.citizen_id}</div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-sm sm:text-base text-red-700 flex items-start space-x-2.5 font-bold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
              รหัสผ่านใหม่ (New Password) *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="กำหนดรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)"
                required
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border border-slate-300 text-base sm:text-lg font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
              ยืนยันรหัสผ่านใหม่อีกครั้ง (Confirm Password) *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                required
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border border-slate-300 text-base sm:text-lg font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base sm:text-lg shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'กำลังบันทึกรหัสผ่าน...' : 'บันทึกรหัสผ่านและเริ่มใช้งาน'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
