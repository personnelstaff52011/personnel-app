'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  ShieldCheck,
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

  const fillSamplePersonnel = (sampleCitizenId: string, sampleMilitaryId: string) => {
    setCitizenId(sampleCitizenId);
    setPassword(sampleMilitaryId);
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-3 py-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            เข้าสู่ระบบสารสนเทศกำลังพล
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            กองพลทหารช่าง (Engineer Division)
          </p>
        </div>

        {/* Notice Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-blue-950">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>คำแนะนำการเข้าสู่ระบบ:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-800">
            • <strong>ชื่อผู้ใช้</strong>: ระบุเลขประจำตัวประชาชน 13 หลัก<br />
            • <strong>เข้าสู่ระบบครั้งแรก</strong>: ให้ใส่รหัสผ่านเป็น <u>เลขประจำตัวทหาร 10 หลัก</u> และระบบจะให้ท่านตั้งรหัสผ่านใหม่ทันที
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              เลขประจำตัวประชาชน (13 หลัก) *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={citizenId}
                onChange={(e) => setCitizenId(e.target.value)}
                placeholder="เช่น 1-7099-00124-91-2 หรือ 1709900124912"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              รหัสผ่าน (ครั้งแรกใช้เลขประจำตัวทหาร 10 หลัก) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน หรือเลขทหาร 10 หลัก"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ArrowRight className="w-4 h-4 text-amber-400" />
            )}
            <span>{isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</span>
          </button>
        </form>

        {/* Quick Testing Samples (Click to auto-fill for testing) */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
            ตัวอย่างกำลังพลในฐานข้อมูล (แตะเพื่อกรอกทดสอบ)
          </p>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => fillSamplePersonnel('1-7099-00124-91-2', '1309900213')}
              className="w-full p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-gray-800">พ.ท. นฤเบศร์ บุญคุ้ม</span>
                <span className="text-gray-400 text-[10px] block">เลขประชาชน: 1-7099-00124-91-2</span>
              </div>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                เลขทหาร: 1309900213
              </span>
            </button>

            <button
              type="button"
              onClick={() => fillSamplePersonnel('1-1004-00234-88-1', '1258800112')}
              className="w-full p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-gray-800">พ.อ. เกียรติศักดิ์ พรหมมินทร์</span>
                <span className="text-gray-400 text-[10px] block">เลขประชาชน: 1-1004-00234-88-1</span>
              </div>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                เลขทหาร: 1258800112
              </span>
            </button>

            <button
              type="button"
              onClick={() => fillSamplePersonnel('admin', 'admin123')}
              className="w-full p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>เข้าสู่ระบบในฐานะ Admin ส่วนกลาง</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300">admin / admin123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
