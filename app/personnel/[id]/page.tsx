'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronRight, 
  User, 
  ArrowLeft,
  Loader2,
  Sparkles,
  Phone,
  MessageSquare,
  Copy,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { personnelService } from '@/lib/personnelService';
import { Personnel, FieldDefinition, DisplayFieldSetting } from '@/types/personnel';
import { useAuth } from '@/context/AuthContext';
import QuickActionBar from '@/components/QuickActionBar';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

function formatBirthDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export default function PersonnelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { isAdmin } = useAuth();

  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [fieldDefs, setFieldDefs] = useState<FieldDefinition[]>([]);
  const [displayFields, setDisplayFields] = useState<DisplayFieldSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const [personnelData, fields] = await Promise.all([
          personnelService.getById(id),
          personnelService.getFieldDefinitions(),
        ]);
        setPersonnel(personnelData);
        setFieldDefs(fields);
        setDisplayFields(personnelService.getDisplayFields());
      } catch (err) {
        console.error('Error fetching personnel detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const isFieldVisible = (key: string): boolean => {
    const found = displayFields.find((f) => f.key === key);
    return found ? found.visible : true;
  };

  const handleCopy = (text: string, fieldName: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleDeleteConfirm = async () => {
    if (!personnel) return;
    setIsDeleting(true);
    try {
      await personnelService.delete(personnel.id);
      router.push('/personnel');
    } catch (err) {
      console.error('Error deleting personnel:', err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
        <p className="text-xs text-gray-500 font-medium">กำลังโหลดข้อมูลกำลังพล...</p>
      </div>
    );
  }

  if (!personnel) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-md mx-auto mt-8 shadow-xs">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <h2 className="text-base font-bold text-gray-800">ไม่พบข้อมูลกำลังพล</h2>
        <p className="text-xs text-gray-400 mt-1 mb-5">ข้อมูลอาจถูกลบไปแล้ว</p>
        <Link
          href="/personnel"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้ารายชื่อ</span>
        </Link>
      </div>
    );
  }

  // Label-Value Item with tap-to-copy
  const GridItem = ({ 
    label, 
    value, 
    isPhone = false 
  }: { 
    label: string; 
    value?: string | number | null;
    isPhone?: boolean;
  }) => {
    const valStr = value !== undefined && value !== null && value !== '' ? String(value) : '-';
    const isCopied = copiedField === label;

    return (
      <div 
        onClick={() => valStr !== '-' && handleCopy(valStr, label)}
        className="bg-white border border-gray-100 rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all cursor-pointer relative group active:scale-[0.99]"
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
            {label}
          </span>
          {valStr !== '-' && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </span>
          )}
        </div>
        <div className="text-xs sm:text-sm font-bold text-gray-900 break-words flex items-center justify-between">
          <span className={label === 'กลุ่มเลือด' ? 'text-red-600 font-extrabold' : ''}>
            {valStr}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-28 md:pb-12">
      {/* 1. Mobile-friendly Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200/90 shadow-xs">
        <Link 
          href="/personnel" 
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>รายชื่อทั้งหมด</span>
        </Link>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <span>ลำดับ</span>
          <span className="font-extrabold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-mono text-[11px]">
            No. {personnel.seq_no}
          </span>
        </div>
      </div>

      {/* Main Profile Card Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden p-5 sm:p-8">
        
        {/* 2. Centered Profile Header */}
        <div className="flex flex-col items-center text-center">
          {/* Rounded portrait photo */}
          <div className="relative w-32 h-44 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center mb-3 ring-1 ring-gray-200">
            {personnel.photo_url ? (
              <Image
                src={personnel.photo_url}
                alt={personnel.full_name_th}
                fill
                className="object-cover object-top"
                priority
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                <User className="w-14 h-14" />
                <span className="text-[10px] text-gray-400 mt-1">ไม่มีรูปถ่าย</span>
              </div>
            )}
          </div>

          {/* Large Sequence Number (seq_no) */}
          <div className="inline-flex items-center justify-center min-w-[2.75rem] h-9 px-3 rounded-xl bg-slate-900 text-amber-400 font-extrabold text-lg shadow-xs mb-1.5">
            {personnel.seq_no}
          </div>

          {/* Thai Rank & Full Name */}
          <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {personnel.full_name_th}
          </h1>

          {/* Nickname */}
          {personnel.nickname && (
            <div className="mt-1 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-0.5 rounded-full inline-block">
              ชื่อเล่น: <span className="text-gray-900 font-bold">{personnel.nickname}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="my-5 sm:my-8 border-gray-100" />

        {/* Admin Quick Link to Display Fields Settings */}
        {isAdmin && (
          <div className="mb-4 flex items-center justify-between bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>การ์ดฟิลด์ข้อมูลที่เปิดแสดงผล</span>
            </div>
            <Link
              href="/settings/fields"
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
            >
              <span>ตั้งค่าเปิด/ปิดการ์ดฟิลด์</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 3. Detailed Grid Layout: Only render visible field cards */}
        <div className="space-y-3">
          {/* แถวที่ 1: RANK (EN), NAME (EN), LASTNAME (EN), หมายเลขประจำตัว */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {isFieldVisible('rank_en') && <GridItem label="RANK (EN)" value={personnel.rank_en} />}
            {isFieldVisible('first_name_en') && <GridItem label="NAME (EN)" value={personnel.first_name_en} />}
            {isFieldVisible('last_name_en') && <GridItem label="LASTNAME (EN)" value={personnel.last_name_en} />}
            {isFieldVisible('military_id') && <GridItem label="หมายเลขประจำตัว" value={personnel.military_id} />}
          </div>

          {/* แถวที่ 2: หมายเลขประชาชน, ตำแหน่งปกติ, ขั้นเงินเดือน */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {isFieldVisible('citizen_id') && <GridItem label="หมายเลขประชาชน" value={personnel.citizen_id} />}
            {isFieldVisible('regular_position') && <GridItem label="ตำแหน่งปกติ" value={personnel.regular_position} />}
            {isFieldVisible('salary_step') && <GridItem label="ขั้นเงินเดือน" value={personnel.salary_step} />}
          </div>

          {/* แถวที่ 3: กลุ่มเลือด, เบอร์ติดต่อ, ส่วนงาน, ศาสนา */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {isFieldVisible('blood_group') && <GridItem label="กลุ่มเลือด" value={personnel.blood_group} />}
            {isFieldVisible('phone_number') && <GridItem label="เบอร์ติดต่อ" value={personnel.phone_number} isPhone />}
            {isFieldVisible('department') && <GridItem label="ส่วนงาน" value={personnel.department} />}
            {isFieldVisible('religion') && <GridItem label="ศาสนา" value={personnel.religion} />}
          </div>

          {/* แถวที่ 4: วัน เดือน ปี เกิด */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {isFieldVisible('birth_date') && (
              <div className="sm:col-span-2 lg:col-span-4">
                <GridItem 
                  label="วัน เดือน ปี เกิด" 
                  value={formatBirthDate(personnel.birth_date)} 
                />
              </div>
            )}
          </div>

          {/* 4. Custom Fields (JSONB) */}
          {personnel.custom_fields && Object.keys(personnel.custom_fields).length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ข้อมูลเพิ่มเติม (Custom Fields)</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {Object.entries(personnel.custom_fields).map(([key, val]) => {
                  const def = fieldDefs.find((f) => f.field_key === key);
                  const label = def?.field_label || key;
                  return <GridItem key={key} label={label} value={String(val)} />;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Bottom Action Controls */}
        <div className="hidden md:flex items-center justify-between mt-8 pt-5 border-t border-gray-200">
          <Link
            href="/personnel"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้ารายชื่อ</span>
          </Link>

          <QuickActionBar
            personnelId={personnel.id}
            phoneNumber={personnel.phone_number}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

      {/* 5. Mobile Quick Action Bar (Floating at bottom for one-thumb reach) */}
      <div className="md:hidden">
        <QuickActionBar
          personnelId={personnel.id}
          phoneNumber={personnel.phone_number}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        name={personnel.full_name_th}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
