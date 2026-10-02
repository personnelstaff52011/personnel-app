'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  Building2, 
  KeyRound, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Phone,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserProfileSettingsPage() {
  const router = useRouter();
  const { user, personnelData, isAdmin, updateSelfProfile, changePassword, logout } = useAuth();

  // Profile editable form state (Only allowed fields: ยศ, ชื่อ, นามสกุล, ชื่อเล่น, หมายเลขโทรศัพท์)
  const [fullNameTh, setFullNameTh] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rankEn, setRankEn] = useState('');
  const [firstNameEn, setFirstNameEn] = useState('');
  const [lastNameEn, setLastNameEn] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password change form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  useEffect(() => {
    if (personnelData) {
      setFullNameTh(personnelData.full_name_th || '');
      setNickname(personnelData.nickname || '');
      setPhoneNumber(personnelData.phone_number || '');
      setRankEn(personnelData.rank_en || '');
      setFirstNameEn(personnelData.first_name_en || '');
      setLastNameEn(personnelData.last_name_en || '');
    } else if (user) {
      setFullNameTh(user.displayName || '');
      setNickname(user.nickname || '');
      setPhoneNumber(user.phone_number || '');
      setRankEn(user.rank_en || '');
      setFirstNameEn(user.first_name_en || '');
      setLastNameEn(user.last_name_en || '');
    }
  }, [personnelData, user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!fullNameTh.trim()) {
      setProfileErrorMsg('กรุณากรอกยศและชื่อ-นามสกุล');
      return;
    }

    setIsSavingProfile(true);
    try {
      const ok = await updateSelfProfile({
        full_name_th: fullNameTh.trim(),
        nickname: nickname.trim(),
        phone_number: phoneNumber.trim(),
        rank_en: rankEn.trim(),
        first_name_en: firstNameEn.trim(),
        last_name_en: lastNameEn.trim(),
      });

      if (ok) {
        setProfileSuccessMsg('บันทึกการแก้ไขข้อมูลส่วนตัวสำเร็จ');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      } else {
        setProfileErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch {
      setProfileErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    if (!newPassword || newPassword.length < 4) {
      setPasswordErrorMsg('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setIsChangingPass(true);
    try {
      const ok = await changePassword(newPassword);
      if (ok) {
        setPasswordSuccessMsg('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccessMsg(''), 4000);
      } else {
        setPasswordErrorMsg('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch {
      setPasswordErrorMsg('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24 sm:pb-12">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/"
          className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:text-gray-900 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            ตั้งค่าผู้ใช้งาน (User Settings)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            ข้อมูลกำลังพลส่วนตัวและความปลอดภัยของบัญชี
          </p>
        </div>
      </div>

      {/* User Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-25 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center shadow-xs">
            {personnelData?.photo_url || user?.photo_url ? (
              <Image
                src={personnelData?.photo_url || user?.photo_url || ''}
                alt="Profile"
                fill
                className="object-cover object-top"
                unoptimized
              />
            ) : (
              <User className="w-9 h-9 text-gray-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 truncate">
              {fullNameTh || user?.displayName || 'กำลังพล'}
            </h2>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isAdmin 
                  ? 'bg-slate-900 text-amber-400' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4" />}
                <span>{isAdmin ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานทั่วไป (User)'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
              {personnelData?.department || user?.department || 'กองพลทหารช่าง'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Edit Form: STRICTLY ONLY ALLOWED FIELDS (ยศ, ชื่อ, นามสกุล, ชื่อเล่น, หมายเลขโทรศัพท์) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>แก้ไขข้อมูลส่วนตัวของตนเอง</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            อนุญาตให้แก้ไขได้เฉพาะ ยศ ชื่อ-นามสกุล ชื่อเล่น และเบอร์โทรศัพท์
          </p>
        </div>

        {profileSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {profileErrorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{profileErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4 text-sm">
          {/* 1. ยศ ชื่อ-นามสกุล ภาษาไทย */}
          <div>
            <label className="block text-gray-800 font-bold mb-1.5">
              ยศ ชื่อ-นามสกุล ภาษาไทย (full_name_th) *
            </label>
            <input
              type="text"
              value={fullNameTh}
              onChange={(e) => setFullNameTh(e.target.value)}
              placeholder="เช่น พ.ท. นฤเบศร์ บุญคุ้ม"
              required
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 2. ชื่อเล่น */}
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">
                ชื่อเล่น (nickname)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="เช่น สอง"
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* 3. หมายเลขโทรศัพท์ */}
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">
                หมายเลขโทรศัพท์ติดต่อ (phone_number)
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="เช่น 081-892-3412"
                  className="w-full pl-11 pr-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 4. ยศ / ชื่อ / นามสกุล ภาษาอังกฤษ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">RANK (EN)</label>
              <input
                type="text"
                value={rankEn}
                onChange={(e) => setRankEn(e.target.value)}
                placeholder="เช่น LTC"
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">NAME (EN)</label>
              <input
                type="text"
                value={firstNameEn}
                onChange={(e) => setFirstNameEn(e.target.value)}
                placeholder="เช่น NARUBES"
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">LASTNAME (EN)</label>
              <input
                type="text"
                value={lastNameEn}
                onChange={(e) => setLastNameEn(e.target.value)}
                placeholder="เช่น BOONKOOM"
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Locked / Read-Only Fields Section */}
          <div className="mt-5 pt-3.5 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
              🔒 ข้อมูลประจำตำแหน่งและรหัสทางราชการ (สงวนสิทธิ์แก้ไขโดย Admin เท่านั้น)
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-400 block font-medium">เลขประจำตัวประชาชน</span>
                <span className="font-mono font-bold text-gray-800 text-sm">
                  {personnelData?.citizen_id || user?.citizen_id || '-'}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-400 block font-medium">เลขประจำตัวทหาร</span>
                <span className="font-mono font-bold text-gray-800 text-sm">
                  {personnelData?.military_id || user?.military_id || '-'}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-400 block font-medium">ตำแหน่ง</span>
                <span className="font-bold text-gray-800 truncate block text-sm">
                  {personnelData?.regular_position || '-'}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-400 block font-medium">สังกัด / กองร้อย</span>
                <span className="font-bold text-gray-800 truncate block text-sm">
                  {personnelData?.department || '-'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 mt-3"
          >
            {isSavingProfile ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Save className="w-5 h-5 text-amber-400" />
            )}
            <span>{isSavingProfile ? 'กำลังบันทึก...' : 'บันทึกการแก้ไขข้อมูล'}</span>
          </button>
        </form>
      </div>

      {/* Password Change Box */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-amber-600" />
            <span>เปลี่ยนรหัสผ่านส่วนตัว</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            กำหนดรหัสผ่านใหม่สำหรับการเข้าสู่ระบบในครั้งถัดไป
          </p>
        </div>

        {passwordSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}

        {passwordErrorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{passwordErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-sm">
          <div>
            <label className="block text-gray-800 font-bold mb-1.5">รหัสผ่านใหม่ (New Password) *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="กำหนดรหัสผ่านใหม่อย่างน้อย 4 ตัวอักษร"
              required
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-200 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-bold mb-1.5">ยืนยันรหัสผ่านใหม่อีกครั้ง *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              required
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-200 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isChangingPass}
            className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm sm:text-base transition-all active:scale-95 disabled:opacity-50"
          >
            {isChangingPass ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
          </button>
        </form>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <LogOut className="w-5 h-5" />
          <span>ออกจากระบบ (Sign Out)</span>
        </button>
      </div>
    </div>
  );
}
