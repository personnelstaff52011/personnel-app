'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Lock, 
  CreditCard, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Info 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!citizenId.trim() || !password) {
      setError('กรุณากรอกเลขประจำตัวประชาชนและรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(citizenId, password);
      if (res.success) {
        router.push('/');
      } else {
        setError(res.message || 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-3 py-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#0e2617] p-1 mx-auto shadow-lg border border-amber-500/40 flex items-center justify-center">
            <Image
              src="/icons/logo.png"
              alt="Engineer Division Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#0e2617] text-amber-400 text-xs font-bold border border-amber-500/30">
            iPonchor
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Engineer Division
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Personnel Information System • กองพลทหารช่าง
          </p>
        </div>

        {/* Notice Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-900 space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-blue-950 text-sm">
            <Info className="w-4.5 h-4.5 text-blue-600 flex-shrink-0" />
            <span>คำแนะนำการเข้าสู่ระบบ:</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-blue-800">
            • <strong>ชื่อผู้ใช้</strong>: ระบุเลขประจำตัวประชาชน 13 หลัก<br />
            • <strong>เข้าสู่ระบบครั้งแรก</strong>: ให้ใส่รหัสผ่านเป็น <u>เลขประจำตัวทหาร 10 หลัก</u> และระบบจะให้ท่านตั้งรหัสผ่านใหม่ทันที
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              เลขประจำตัวประชาชน (13 หลัก) *
            </label>
            <div className="relative">
              <CreditCard className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="เช่น 1-7099-00124-91-2 หรือ 1709900124912"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              รหัสผ่าน (ครั้งแรกใช้เลขประจำตัวทหาร 10 หลัก) *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน หรือเลขทหาร 10 หลัก"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <ArrowRight className="w-5 h-5 text-amber-400" />
            )}
            <span>{isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
