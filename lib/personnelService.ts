import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  Personnel,
  FieldDefinition,
  DisplayFieldSetting,
  KPIStats,
  DepartmentStat,
  BloodGroupStat,
  RankStat,
  splitFullNameTh,
  formatFullNameTh,
} from '@/types/personnel';
import { INITIAL_PERSONNEL, INITIAL_FIELD_DEFINITIONS } from './mockData';

const LOCAL_STORAGE_PERSONNEL_KEY = 'engineer_division_personnel';
const LOCAL_STORAGE_FIELDS_KEY = 'engineer_division_fields';
const LOCAL_STORAGE_DISPLAY_FIELDS_KEY = 'engineer_division_display_fields';

export const DEFAULT_DISPLAY_FIELDS: DisplayFieldSetting[] = [
  // 1. ข้อมูลยศและชื่อ
  { key: 'rank_th', label: 'ยศ (ไทย)', category: 'ข้อมูลยศและชื่อ', visible: false, description: 'ชั้นยศภาษาไทย เช่น พ.ท., พ.อ., ส.อ.' },
  { key: 'first_name_th', label: 'ชื่อ (ไทย)', category: 'ข้อมูลยศและชื่อ', visible: false, description: 'ชื่อตัวภาษาไทย' },
  { key: 'last_name_th', label: 'นามสกุล (ไทย)', category: 'ข้อมูลยศและชื่อ', visible: false, description: 'นามสกุลภาษาไทย' },
  { key: 'rank_en', label: 'RANK (EN)', category: 'ข้อมูลยศและชื่อ', visible: true, description: 'ชั้นยศภาษาอังกฤษ เช่น LTC, MAJ, CPT' },
  { key: 'first_name_en', label: 'NAME (EN)', category: 'ข้อมูลยศและชื่อ', visible: true, description: 'ชื่อตัวภาษาอังกฤษ' },
  { key: 'last_name_en', label: 'LASTNAME (EN)', category: 'ข้อมูลยศและชื่อ', visible: true, description: 'นามสกุลภาษาอังกฤษ' },
  { key: 'military_id', label: 'หมายเลขประจำตัวทหาร', category: 'ข้อมูลยศและชื่อ', visible: true, description: 'เลขประจำตัวทหาร 10 หลัก' },

  // 2. ข้อมูลสังกัดและตำแหน่ง
  { key: 'citizen_id', label: 'หมายเลขประชาชน', category: 'ข้อมูลสังกัดและตำแหน่ง', visible: true, description: 'เลขประจำตัวประชาชน 13 หลัก' },
  { key: 'regular_position', label: 'ตำแหน่งปกติ', category: 'ข้อมูลสังกัดและตำแหน่ง', visible: true, description: 'ตำแหน่งตามโครงสร้างอัตราปกติ' },
  { key: 'duty_status', label: 'สถานะกำลังพล (บรรจุ / ช่วยราชการ)', category: 'ข้อมูลสังกัดและตำแหน่ง', visible: true, description: 'สถานะการปฏิบัติหน้าที่ บรรจุ หรือ ช่วยราชการ' },
  { key: 'salary_step', label: 'ขั้นเงินเดือน', category: 'ข้อมูลสังกัดและตำแหน่ง', visible: false, description: 'ขั้นเงินเดือน เช่น น.๓/๑๘.๕' },

  // 3. ข้อมูลส่วนตัวและการแพทย์
  { key: 'blood_group', label: 'กลุ่มเลือด', category: 'ข้อมูลส่วนตัวและการแพทย์', visible: true, description: 'หมู่เลือด A, B, O, AB สำหรับการแพทย์' },
  { key: 'phone_number', label: 'เบอร์ติดต่อ', category: 'ข้อมูลส่วนตัวและการแพทย์', visible: true, description: 'หมายเลขโทรศัพท์มือถือ' },
  { key: 'department', label: 'ส่วนงาน / กองร้อย', category: 'ข้อมูลส่วนตัวและการแพทย์', visible: true, description: 'กองร้อยหรือส่วนงานในกองพลทหารช่าง' },
  { key: 'religion', label: 'ศาสนา', category: 'ข้อมูลส่วนตัวและการแพทย์', visible: true, description: 'ศาสนาของกำลังพล' },
  { key: 'birth_date', label: 'วัน เดือน ปี เกิด', category: 'ข้อมูลส่วนตัวและการแพทย์', visible: true, description: 'วันเดือนปีเกิด' },
];

const REMOVED_FIELD_KEYS = new Set(['field_position', 'passport_no', 'service_code', 'uniform_size', 'shoe_size', 'blood_pressure']);

const initialPhotoMap = new Map(INITIAL_PERSONNEL.map((ip) => [ip.id, ip.photo_url]));

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Helper for local storage access (client-side)
const getLocalPersonnel = (): Personnel[] => {
  if (typeof window === 'undefined') return INITIAL_PERSONNEL;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_PERSONNEL_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_PERSONNEL_KEY, JSON.stringify(INITIAL_PERSONNEL));
      return INITIAL_PERSONNEL;
    }
    const parsed: Personnel[] = JSON.parse(data);
    return parsed.map((p) => {
      const cleanCustom = { ...(p.custom_fields || {}) };
      delete cleanCustom.uniform_size;
      delete cleanCustom.shoe_size;
      delete cleanCustom.blood_pressure;

      const fallbackPhoto = initialPhotoMap.get(p.id) || '';
      const photo_url = (p.photo_url && p.photo_url.trim() !== '') ? p.photo_url : fallbackPhoto;

      const split = splitFullNameTh(p.full_name_th || '');
      const rank_th = p.rank_th || split.rank_th;
      const first_name_th = p.first_name_th || split.first_name_th;
      const last_name_th = p.last_name_th || split.last_name_th;
      const full_name_th = p.full_name_th || formatFullNameTh(rank_th, first_name_th, last_name_th);

      return {
        ...p,
        rank_th,
        first_name_th,
        last_name_th,
        full_name_th,
        photo_url,
        duty_status: p.duty_status || 'บรรจุ',
        field_position: undefined,
        passport_no: undefined,
        custom_fields: cleanCustom,
      };
    });
  } catch (e) {
    return INITIAL_PERSONNEL;
  }
};

const saveLocalPersonnel = (list: Personnel[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PERSONNEL_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

const getLocalFields = (): FieldDefinition[] => {
  if (typeof window === 'undefined') return INITIAL_FIELD_DEFINITIONS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_FIELDS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_FIELDS_KEY, JSON.stringify(INITIAL_FIELD_DEFINITIONS));
      return INITIAL_FIELD_DEFINITIONS;
    }
    const parsed: FieldDefinition[] = JSON.parse(data);
    return parsed.filter((f) => !REMOVED_FIELD_KEYS.has(f.field_key));
  } catch (e) {
    return INITIAL_FIELD_DEFINITIONS;
  }
};

const saveLocalFields = (list: FieldDefinition[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_FIELDS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving fields to localStorage', e);
  }
};

const SUPABASE_PERSONNEL_COLUMNS = new Set([
  'id',
  'service_code',
  'seq_no',
  'full_name_th',
  'nickname',
  'rank_en',
  'first_name_en',
  'last_name_en',
  'military_id',
  'citizen_id',
  'field_position',
  'regular_position',
  'salary_step',
  'blood_group',
  'phone_number',
  'department',
  'religion',
  'birth_date',
  'passport_no',
  'photo_url',
  'custom_fields',
  'created_at',
  'updated_at',
]);

const prepareSupabasePayload = (record: Record<string, any>) => {
  const clean: Record<string, any> = {};
  const custom = { ...(record.custom_fields || {}) };

  // Store client/extra fields safely in custom_fields (JSONB)
  if (record.rank_th) custom.rank_th = record.rank_th;
  if (record.first_name_th) custom.first_name_th = record.first_name_th;
  if (record.last_name_th) custom.last_name_th = record.last_name_th;
  if (record.duty_status) custom.duty_status = record.duty_status;

  for (const [key, val] of Object.entries(record)) {
    if (SUPABASE_PERSONNEL_COLUMNS.has(key)) {
      if (key === 'birth_date') {
        clean[key] = (val && String(val).trim() !== '') ? String(val).trim() : null;
      } else if (key === 'service_code') {
        clean[key] = (val && String(val).trim() !== '') ? String(val).trim() : `PKF-THAI-${String(record.seq_no || 1).padStart(5, '0')}`;
      } else if (key === 'seq_no') {
        clean[key] = Number(val) || 1;
      } else if (val === '') {
        clean[key] = null;
      } else {
        clean[key] = val;
      }
    }
  }

  // Ensure service_code is always set if missing or empty (required by PostgreSQL NOT NULL constraint)
  if (!clean.service_code && ('seq_no' in record || 'service_code' in record || !record.id)) {
    clean.service_code = (record.service_code && String(record.service_code).trim() !== '')
      ? String(record.service_code).trim()
      : `PKF-THAI-${String(record.seq_no || 1).padStart(5, '0')}`;
  }

  // Ensure full_name_th is always valid string
  if (!clean.full_name_th && (record.rank_th || record.first_name_th || record.last_name_th)) {
    clean.full_name_th = formatFullNameTh(record.rank_th, record.first_name_th, record.last_name_th);
  }

  clean.custom_fields = custom;
  return clean;
};

const mapFromSupabase = (p: any): Personnel => {
  if (!p) return p;
  const custom = p.custom_fields || {};
  const split = splitFullNameTh(p.full_name_th || '');
  const rank_th = custom.rank_th || p.rank_th || split.rank_th || '';
  const first_name_th = custom.first_name_th || p.first_name_th || split.first_name_th || '';
  const last_name_th = custom.last_name_th || p.last_name_th || split.last_name_th || '';
  const full_name_th = p.full_name_th || formatFullNameTh(rank_th, first_name_th, last_name_th);
  const duty_status = custom.duty_status || p.duty_status || 'บรรจุ';

  const fallbackPhoto = initialPhotoMap.get(p.id) || '';
  const photo_url = (p.photo_url && p.photo_url.trim() !== '') ? p.photo_url : fallbackPhoto;

  return {
    ...p,
    rank_th,
    first_name_th,
    last_name_th,
    full_name_th,
    duty_status,
    photo_url,
  };
};

export const personnelService = {
  // 1. ดึงรายชื่อกำลังพลทั้งหมด
  async getAll(): Promise<Personnel[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('personnel')
          .select('*')
          .order('seq_no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(mapFromSupabase);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local data:', err);
      }
    }
    return getLocalPersonnel();
  },

  // 2. ดึงข้อมูลกำลังพลรายบุคคลตาม ID
  async getById(id: string): Promise<Personnel | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('personnel')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapFromSupabase(data);
        }
      } catch (err) {
        console.warn('Supabase getById failed, checking local:', err);
      }
    }

    const locals = getLocalPersonnel();
    return locals.find((p) => p.id === id) || null;
  },

  // 3. เพิ่มข้อมูลกำลังพลใหม่
  async create(personnel: Omit<Personnel, 'id' | 'created_at' | 'updated_at'>): Promise<Personnel> {
    const newId = generateUUID();
    const now = new Date().toISOString();

    const split = splitFullNameTh(personnel.full_name_th || '');
    const rank_th = (personnel.rank_th !== undefined && personnel.rank_th !== null && personnel.rank_th !== '') ? personnel.rank_th : split.rank_th;
    const first_name_th = (personnel.first_name_th !== undefined && personnel.first_name_th !== null && personnel.first_name_th !== '') ? personnel.first_name_th : split.first_name_th;
    const last_name_th = (personnel.last_name_th !== undefined && personnel.last_name_th !== null && personnel.last_name_th !== '') ? personnel.last_name_th : split.last_name_th;
    const full_name_th = formatFullNameTh(rank_th, first_name_th, last_name_th) || personnel.full_name_th || '';

    const newPersonnel: Personnel = {
      ...personnel,
      rank_th,
      first_name_th,
      last_name_th,
      full_name_th,
      duty_status: personnel.duty_status || 'บรรจุ',
      service_code: personnel.service_code || `PKF-THAI-${String(personnel.seq_no || 1).padStart(5, '0')}`,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        const payload = prepareSupabasePayload(newPersonnel);
        const { data, error } = await supabase
          .from('personnel')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          const created = mapFromSupabase(data);
          const list = getLocalPersonnel();
          const filtered = list.filter((p) => p.id !== created.id);
          filtered.push(created);
          saveLocalPersonnel(filtered);
          return created;
        } else if (error) {
          console.error('Supabase create error:', error);
          throw new Error(error.message || 'บันทึกข้อมูลไปยังฐานข้อมูลไม่สำเร็จ');
        }
      } catch (err: any) {
        console.error('Supabase create failed:', err);
        throw err;
      }
    }

    const list = getLocalPersonnel();
    list.push(newPersonnel);
    saveLocalPersonnel(list);
    return newPersonnel;
  },

  // 4. แก้ไขข้อมูลกำลังพล
  async update(id: string, personnel: Partial<Personnel>): Promise<Personnel> {
    const now = new Date().toISOString();
    const currentList = getLocalPersonnel();
    const existing = currentList.find((p) => p.id === id);

    let rank_th = personnel.rank_th !== undefined ? personnel.rank_th : existing?.rank_th;
    let first_name_th = personnel.first_name_th !== undefined ? personnel.first_name_th : existing?.first_name_th;
    let last_name_th = personnel.last_name_th !== undefined ? personnel.last_name_th : existing?.last_name_th;
    let full_name_th = personnel.full_name_th !== undefined ? personnel.full_name_th : existing?.full_name_th;

    // If individual Thai name parts were supplied, recompute full_name_th
    if (personnel.rank_th !== undefined || personnel.first_name_th !== undefined || personnel.last_name_th !== undefined) {
      full_name_th = formatFullNameTh(rank_th, first_name_th, last_name_th);
    } else if (personnel.full_name_th !== undefined) {
      // If only full_name_th was passed, split into 3 parts
      const split = splitFullNameTh(personnel.full_name_th);
      rank_th = split.rank_th;
      first_name_th = split.first_name_th;
      last_name_th = split.last_name_th;
    }

    const updatedData: Partial<Personnel> = {
      ...personnel,
      ...(rank_th !== undefined ? { rank_th } : {}),
      ...(first_name_th !== undefined ? { first_name_th } : {}),
      ...(last_name_th !== undefined ? { last_name_th } : {}),
      ...(full_name_th !== undefined ? { full_name_th } : {}),
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        const payload = prepareSupabasePayload(updatedData);
        const { data, error } = await supabase
          .from('personnel')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const updated = mapFromSupabase(data);
          const list = getLocalPersonnel();
          const index = list.findIndex((p) => p.id === id);
          if (index !== -1) {
            list[index] = updated;
            saveLocalPersonnel(list);
          }
          return updated;
        } else if (error) {
          console.error('Supabase update error:', error);
          throw new Error(error.message || 'บันทึกการแก้ไขข้อมูลไม่สำเร็จ');
        }
      } catch (err: any) {
        console.error('Supabase update failed:', err);
        throw err;
      }
    }

    const list = getLocalPersonnel();
    const index = list.findIndex((p) => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData } as Personnel;
      saveLocalPersonnel(list);
      return list[index];
    }
    throw new Error('Personnel not found');
  },

  // 5. ลบข้อมูลกำลังพล
  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('personnel').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete failed, deleting locally:', err);
      }
    }

    const list = getLocalPersonnel();
    const filtered = list.filter((p) => p.id !== id);
    saveLocalPersonnel(filtered);
    return true;
  },

  // 6. อัปโหลดรูปภาพไปยัง Supabase Storage Bucket `personnel-avatars`
  async uploadAvatar(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    if (isSupabaseConfigured()) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('personnel-avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('personnel-avatars').getPublicUrl(filePath);
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase avatar upload failed:', err);
      }
    }

    // Fallback: Convert to Base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // 7. Bulk Insert (สำหรับ Excel Import)
  async bulkInsert(personnelList: Array<Omit<Personnel, 'id' | 'created_at' | 'updated_at'>>): Promise<number> {
    const now = new Date().toISOString();
    const formattedList = personnelList.map((p, index) => {
      const split = splitFullNameTh(p.full_name_th || '');
      const rank_th = (p.rank_th !== undefined && p.rank_th !== null && p.rank_th !== '') ? p.rank_th : split.rank_th;
      const first_name_th = (p.first_name_th !== undefined && p.first_name_th !== null && p.first_name_th !== '') ? p.first_name_th : split.first_name_th;
      const last_name_th = (p.last_name_th !== undefined && p.last_name_th !== null && p.last_name_th !== '') ? p.last_name_th : split.last_name_th;
      const full_name_th = formatFullNameTh(rank_th, first_name_th, last_name_th) || p.full_name_th || '';

      return {
        ...p,
        rank_th,
        first_name_th,
        last_name_th,
        full_name_th,
        duty_status: p.duty_status || 'บรรจุ',
        service_code: p.service_code || `PKF-THAI-${String(p.seq_no || (index + 1)).padStart(5, '0')}`,
        id: generateUUID(),
        created_at: now,
        updated_at: now,
      };
    });

    if (isSupabaseConfigured()) {
      try {
        const payloads = formattedList.map(prepareSupabasePayload);
        const { data, error } = await supabase.from('personnel').insert(payloads).select();
        if (!error && data) {
          return data.length;
        } else if (error) {
          console.error('Supabase bulkInsert error:', error);
          throw new Error(error.message || 'นำเข้าข้อมูลไปยังฐานข้อมูลไม่สำเร็จ');
        }
      } catch (err: any) {
        console.error('Supabase bulk insert failed:', err);
        throw err;
      }
    }

    const currentList = getLocalPersonnel();
    const combined = [...currentList, ...formattedList];
    saveLocalPersonnel(combined);
    return formattedList.length;
  },

  // 8. ดึงรายการ Dynamic Field Definitions
  async getFieldDefinitions(): Promise<FieldDefinition[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('field_definitions')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as FieldDefinition[];
        }
      } catch (err) {
        console.warn('Supabase getFieldDefinitions failed:', err);
      }
    }
    return getLocalFields();
  },

  // 9. เพิ่ม Custom Field Definition
  async createFieldDefinition(field: Omit<FieldDefinition, 'id' | 'created_at'>): Promise<FieldDefinition> {
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'f-' + Date.now();
    const newField: FieldDefinition = {
      ...field,
      id: newId,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('field_definitions')
          .insert([newField])
          .select()
          .single();

        if (!error && data) {
          return data as FieldDefinition;
        }
      } catch (err) {
        console.warn('Supabase createFieldDefinition failed:', err);
      }
    }

    const fields = getLocalFields();
    fields.push(newField);
    saveLocalFields(fields);
    return newField;
  },

  // 10. สถิติภาพรวมสำหรับ Dashboard
  calculateKPIs(personnel: Personnel[]): KPIStats {
    const totalPersonnel = personnel.length;
    let commissionedOfficers = 0;
    let nonCommissionedOfficers = 0;
    let withPhotoCount = 0;
    let assignedCount = 0;
    let detachedCount = 0;
    const departmentSet = new Set<string>();

    const commissionedRanks = ['พ.อ.', 'พ.ท.', 'พ.ต.', 'ร.อ.', 'ร.ท.', 'ร.ต.', 'COL', 'LTC', 'MAJ', 'CPT', '1LT', '2LT'];

    personnel.forEach((p) => {
      if (p.photo_url && p.photo_url.trim() !== '') {
        withPhotoCount++;
      }
      if (p.department && p.department.trim() !== '') {
        departmentSet.add(p.department.trim());
      }

      // ตรวจสอบสถานะการปฏิบัติหน้าที่
      if (p.duty_status === 'ช่วยราชการ') {
        detachedCount++;
      } else {
        assignedCount++;
      }

      // ตรวจสอบชั้นยศ
      const isCommissioned = commissionedRanks.some(
        (r) =>
          (p.rank_th && p.rank_th.startsWith(r)) ||
          (p.full_name_th && p.full_name_th.startsWith(r)) ||
          (p.rank_en && p.rank_en.toUpperCase() === r.toUpperCase())
      );

      if (isCommissioned) {
        commissionedOfficers++;
      } else {
        nonCommissionedOfficers++;
      }
    });

    return {
      totalPersonnel,
      commissionedOfficers,
      nonCommissionedOfficers,
      departmentsCount: departmentSet.size,
      withPhotoCount,
      withoutPhotoCount: totalPersonnel - withPhotoCount,
      assignedCount,
      detachedCount,
    };
  },

  // สถิติแยกตามส่วนงาน/กองร้อย
  getDepartmentStats(personnel: Personnel[]): DepartmentStat[] {
    const map = new Map<string, number>();
    personnel.forEach((p) => {
      const dept = p.department?.trim() || 'ไม่ระบุสังกัด';
      map.set(dept, (map.get(dept) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  },

  // สถิติกลุ่มเลือด
  getBloodGroupStats(personnel: Personnel[]): BloodGroupStat[] {
    const bloodColors: Record<string, string> = {
      A: '#ef4444',   // Red
      B: '#3b82f6',   // Blue
      O: '#10b981',   // Green
      AB: '#f59e0b',  // Amber
      'ไม่ระบุ': '#94a3b8'
    };

    const counts: Record<string, number> = { A: 0, B: 0, O: 0, AB: 0, 'ไม่ระบุ': 0 };

    personnel.forEach((p) => {
      const bg = p.blood_group?.trim().toUpperCase();
      if (bg && counts[bg] !== undefined) {
        counts[bg]++;
      } else {
        counts['ไม่ระบุ']++;
      }
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({
        name: `กลุ่ม ${name}`,
        count,
        color: bloodColors[name] || '#94a3b8',
      }));
  },

  // สถิติการกระจายชั้นยศ
  getRankBreakdown(personnel: Personnel[]): RankStat[] {
    const map = new Map<string, number>();
    const commissionedRanks = ['พ.อ.', 'พ.ท.', 'พ.ต.', 'ร.อ.', 'ร.ท.', 'ร.ต.', 'COL', 'LTC', 'MAJ', 'CPT', '1LT', '2LT'];

    personnel.forEach((p) => {
      const rank = p.rank_en?.toUpperCase() || 'N/A';
      map.set(rank, (map.get(rank) || 0) + 1);
    });

    return Array.from(map.entries()).map(([rank, count]) => ({
      rank,
      count,
      category: commissionedRanks.includes(rank) ? 'นายทหารสัญญาบัตร' : 'นายทหารประทวน',
    }));
  },

  // 11. ดึงการตั้งค่าการเปิด/ปิด การ์ดฟิลด์ข้อมูลที่แสดงผล
  getDisplayFields(): DisplayFieldSetting[] {
    if (typeof window === 'undefined') return DEFAULT_DISPLAY_FIELDS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_DISPLAY_FIELDS_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_DISPLAY_FIELDS_KEY, JSON.stringify(DEFAULT_DISPLAY_FIELDS));
        return DEFAULT_DISPLAY_FIELDS;
      }
      const parsed: DisplayFieldSetting[] = JSON.parse(stored);
      return parsed.filter((f) => !REMOVED_FIELD_KEYS.has(f.key));
    } catch {
      return DEFAULT_DISPLAY_FIELDS;
    }
  },

  // 12. บันทึกการตั้งค่าการเปิด/ปิด การ์ดฟิลด์ข้อมูล
  saveDisplayFields(fields: DisplayFieldSetting[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_DISPLAY_FIELDS_KEY, JSON.stringify(fields));
    } catch (e) {
      console.error('Error saving display fields', e);
    }
  },

  // 13. รีเซ็ตฟิลด์ที่แสดงเป็นค่าเริ่มต้น
  resetDisplayFields(): DisplayFieldSetting[] {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_DISPLAY_FIELDS_KEY, JSON.stringify(DEFAULT_DISPLAY_FIELDS));
      } catch (e) {
        console.error('Error resetting display fields', e);
      }
    }
    return DEFAULT_DISPLAY_FIELDS;
  },

  // 14. สลับสถานะเปิด/ปิดฟิลด์เดี่ยว
  toggleDisplayField(key: string, visible: boolean): DisplayFieldSetting[] {
    const list = this.getDisplayFields();
    const updated = list.map((f) => (f.key === key ? { ...f, visible } : f));
    this.saveDisplayFields(updated);
    return updated;
  }
};
