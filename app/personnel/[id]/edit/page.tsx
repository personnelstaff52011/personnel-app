'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  User, 
  HeartHandshake, 
  Loader2,
  FileText
} from 'lucide-react';
import AvatarUploader from '@/components/AvatarUploader';
import AdminOnlyGuard from '@/components/AdminOnlyGuard';
import { personnelService } from '@/lib/personnelService';
import { FieldDefinition, splitFullNameTh, formatFullNameTh } from '@/types/personnel';

export default function EditPersonnelPage() {
  return (
    <AdminOnlyGuard>
      <EditPersonnelForm />
    </AdminOnlyGuard>
  );
}

function EditPersonnelForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fieldDefs, setFieldDefs] = useState<FieldDefinition[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    seq_no: 1,
    rank_th: '',
    first_name_th: '',
    last_name_th: '',
    full_name_th: '',
    nickname: '',
    rank_en: '',
    first_name_en: '',
    last_name_en: '',
    military_id: '',
    citizen_id: '',
    regular_position: '',
    salary_step: '',
    blood_group: 'O',
    phone_number: '',
    department: '',
    religion: 'พุทธ',
    birth_date: '',
    photo_url: '',
  });

  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setFetching(true);
      try {
        const [fields, personnel] = await Promise.all([
          personnelService.getFieldDefinitions(),
          personnelService.getById(id),
        ]);
        setFieldDefs(fields);

        if (personnel) {
          const split = splitFullNameTh(personnel.full_name_th || '');
          const rank_th = personnel.rank_th || split.rank_th || '';
          const first_name_th = personnel.first_name_th || split.first_name_th || '';
          const last_name_th = personnel.last_name_th || split.last_name_th || '';

          setFormData({
            seq_no: personnel.seq_no || 1,
            rank_th,
            first_name_th,
            last_name_th,
            full_name_th: personnel.full_name_th || formatFullNameTh(rank_th, first_name_th, last_name_th),
            nickname: personnel.nickname || '',
            rank_en: personnel.rank_en || '',
            first_name_en: personnel.first_name_en || '',
            last_name_en: personnel.last_name_en || '',
            military_id: personnel.military_id || '',
            citizen_id: personnel.citizen_id || '',
            regular_position: personnel.regular_position || '',
            salary_step: personnel.salary_step || '',
            blood_group: personnel.blood_group || 'O',
            phone_number: personnel.phone_number || '',
            department: personnel.department || '',
            religion: personnel.religion || 'พุทธ',
            birth_date: personnel.birth_date || '',
            photo_url: personnel.photo_url || '',
          });
          setCustomFields(personnel.custom_fields || {});
        }
      } catch (err) {
        console.error('Failed to load personnel for edit:', err);
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'seq_no' ? Number(value) : value,
    }));
  };

  const handleCustomFieldChange = (key: string, value: any) => {
    setCustomFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name_th.trim() || !formData.last_name_th.trim()) {
      alert('กรุณากรอกชื่อและนามสกุลภาษาไทย');
      return;
    }

    const full_name_th = formatFullNameTh(formData.rank_th, formData.first_name_th, formData.last_name_th);

    setLoading(true);
    try {
      await personnelService.update(id, {
        ...formData,
        full_name_th,
        custom_fields: customFields,
      });
      router.push(`/personnel/${id}`);
    } catch (err) {
      console.error('Failed to update personnel:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
        <p className="text-xs text-gray-500 font-medium">กำลังโหลดข้อมูลสำหรับแก้ไข...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20 sm:pb-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          href={`/personnel/${id}`}
          className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:text-gray-900 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            แก้ไขข้อมูลกำลังพล
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-bold">
            ลำดับที่ {formData.seq_no}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs">
          <AvatarUploader
            currentUrl={formData.photo_url}
            onUrlChange={(url) => setFormData((prev) => ({ ...prev, photo_url: url }))}
          />
        </div>

        {/* Section 1: ข้อมูลรหัสประจำตัวและสังกัด */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>ข้อมูลสังกัดและรหัสประจำตัว</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ลำดับหมายเลข (seq_no) *
              </label>
              <input
                type="number"
                inputMode="numeric"
                name="seq_no"
                value={formData.seq_no}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ส่วนงาน / กองร้อย (department)
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ตำแหน่งปกติ (regular_position)
              </label>
              <input
                type="text"
                name="regular_position"
                value={formData.regular_position}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ขั้นเงินเดือน (salary_step)
              </label>
              <input
                type="text"
                name="salary_step"
                value={formData.salary_step}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: ข้อมูลส่วนตัวและยศ-ชื่อ-สกุล */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            <User className="w-5 h-5 text-amber-600" />
            <span>ยศ ชื่อ-นามสกุล และข้อมูลบุคคล</span>
          </div>

          {/* 1. ยศ, ชื่อ, สกุล ภาษาไทย */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ยศ (ไทย)
              </label>
              <input
                type="text"
                name="rank_th"
                value={formData.rank_th}
                onChange={handleChange}
                placeholder="เช่น พ.ท. หรือ ส.อ."
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ชื่อ (ไทย) *
              </label>
              <input
                type="text"
                name="first_name_th"
                value={formData.first_name_th}
                onChange={handleChange}
                placeholder="เช่น นฤเบศร์"
                required
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                สกุล (ไทย) *
              </label>
              <input
                type="text"
                name="last_name_th"
                value={formData.last_name_th}
                onChange={handleChange}
                placeholder="เช่น บุญคุ้ม"
                required
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ชื่อเล่น (nickname)
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="เช่น สอง"
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                RANK (EN)
              </label>
              <input
                type="text"
                name="rank_en"
                value={formData.rank_en}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                NAME (EN)
              </label>
              <input
                type="text"
                name="first_name_en"
                value={formData.first_name_en}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                LASTNAME (EN)
              </label>
              <input
                type="text"
                name="last_name_en"
                value={formData.last_name_en}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                หมายเลขประจำตัวทหาร (military_id)
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="military_id"
                value={formData.military_id}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                หมายเลขประจำตัวประชาชน (citizen_id)
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="citizen_id"
                value={formData.citizen_id}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: ข้อมูลทางการแพทย์และการติดต่อ */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            <HeartHandshake className="w-5 h-5 text-red-600" />
            <span>ข้อมูลการแพทย์ การติดต่อ และเอกสาร</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                กลุ่มเลือด (blood_group)
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="O">O</option>
                <option value="AB">AB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                เบอร์ติดต่อ (phone_number)
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ศาสนา (religion)
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                วัน เดือน ปี เกิด (birth_date)
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Dynamic Custom Fields */}
        {fieldDefs.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>ข้อมูลเสริมเพิ่มเติม (Dynamic Fields)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {fieldDefs.map((def) => (
                <div key={def.id}>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">
                    {def.field_label}
                  </label>
                  <input
                    type={def.field_type === 'number' ? 'number' : def.field_type === 'date' ? 'date' : 'text'}
                    inputMode={def.field_type === 'number' ? 'numeric' : undefined}
                    value={customFields[def.field_key] || ''}
                    onChange={(e) => handleCustomFieldChange(def.field_key, e.target.value)}
                    placeholder={`กรอก ${def.field_label}`}
                    className="w-full px-3.5 py-3 rounded-2xl border border-gray-300 text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            href={`/personnel/${id}`}
            className="flex-1 sm:flex-none text-center px-5 py-3.5 rounded-2xl border border-gray-300 text-gray-700 text-sm sm:text-base font-bold hover:bg-gray-50 active:scale-95 transition-all"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base font-extrabold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Save className="w-5 h-5 text-amber-400" />
            )}
            <span>{loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
