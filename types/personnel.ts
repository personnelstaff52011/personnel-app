export interface Personnel {
  id: string;
  service_code?: string | null;
  seq_no: number;
  full_name_th: string;
  nickname?: string | null;
  rank_en?: string | null;
  first_name_en?: string | null;
  last_name_en?: string | null;
  military_id?: string | null;
  citizen_id?: string | null;
  field_position?: string | null;
  regular_position?: string | null;
  salary_step?: string | null;
  blood_group?: string | null;
  phone_number?: string | null;
  department?: string | null;
  religion?: string | null;
  birth_date?: string | null;
  passport_no?: string | null;
  photo_url?: string | null;
  custom_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface FieldDefinition {
  id: string;
  field_key: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date';
  is_active: boolean;
  created_at?: string;
}

export interface DisplayFieldSetting {
  key: string;
  label: string;
  category: 'ข้อมูลยศและชื่อ' | 'ข้อมูลสังกัดและตำแหน่ง' | 'ข้อมูลส่วนตัวและการแพทย์' | 'ข้อมูลเสริม (Custom)';
  visible: boolean;
  description?: string;
}

export interface KPIStats {
  totalPersonnel: number;
  commissionedOfficers: number;
  nonCommissionedOfficers: number;
  departmentsCount: number;
  withPhotoCount: number;
  withoutPhotoCount: number;
}

export interface DepartmentStat {
  name: string;
  count: number;
}

export interface BloodGroupStat {
  name: string;
  count: number;
  color: string;
}

export interface RankStat {
  rank: string;
  count: number;
  category: 'นายทหารสัญญาบัตร' | 'นายทหารประทวน';
}
