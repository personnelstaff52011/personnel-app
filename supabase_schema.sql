-- ==========================================================
-- ระบบสารสนเทศข้อมูลกำลังพล กองพลทหารช่าง
-- Engineer Division Personnel Management System - Supabase Schema
-- ==========================================================

-- 1. สร้างตาราง personnel
CREATE TABLE IF NOT EXISTS public.personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(50), -- รหัสกำลังพล (เป็นตัวเลือกเสริม)
    seq_no INTEGER NOT NULL,
    full_name_th VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    rank_en VARCHAR(50),
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    military_id VARCHAR(50),
    citizen_id VARCHAR(50),
    field_position VARCHAR(255),
    regular_position VARCHAR(255),
    salary_step VARCHAR(50),
    blood_group VARCHAR(10),
    phone_number VARCHAR(50),
    department VARCHAR(255),
    religion VARCHAR(100),
    birth_date DATE,
    passport_no VARCHAR(100),
    photo_url TEXT,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. สร้างตาราง field_definitions สำหรับจัดการ Custom Fields
CREATE TABLE IF NOT EXISTS public.field_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_key VARCHAR(100) UNIQUE NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL DEFAULT 'text', -- 'text' | 'number' | 'date'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_definitions ENABLE ROW LEVEL SECURITY;

-- สร้าง RLS Policies อนุญาตให้อ่านและจัดการข้อมูลได้ (Public / Anon Access)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public select personnel" ON public.personnel;
    CREATE POLICY "Public select personnel" ON public.personnel FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public insert personnel" ON public.personnel;
    CREATE POLICY "Public insert personnel" ON public.personnel FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Public update personnel" ON public.personnel;
    CREATE POLICY "Public update personnel" ON public.personnel FOR UPDATE USING (true);
    
    DROP POLICY IF EXISTS "Public delete personnel" ON public.personnel;
    CREATE POLICY "Public delete personnel" ON public.personnel FOR DELETE USING (true);

    DROP POLICY IF EXISTS "Public select field_definitions" ON public.field_definitions;
    CREATE POLICY "Public select field_definitions" ON public.field_definitions FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public insert field_definitions" ON public.field_definitions;
    CREATE POLICY "Public insert field_definitions" ON public.field_definitions FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Public update field_definitions" ON public.field_definitions;
    CREATE POLICY "Public update field_definitions" ON public.field_definitions FOR UPDATE USING (true);
    
    DROP POLICY IF EXISTS "Public delete field_definitions" ON public.field_definitions;
    CREATE POLICY "Public delete field_definitions" ON public.field_definitions FOR DELETE USING (true);
END $$;

-- 4. ตั้งค่า Storage Bucket สำหรับรูปภาพกำลังพล
INSERT INTO storage.buckets (id, name, public) 
VALUES ('personnel-avatars', 'personnel-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow Public Access to personnel-avatars" ON storage.objects;
    CREATE POLICY "Allow Public Access to personnel-avatars" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'personnel-avatars');

    DROP POLICY IF EXISTS "Allow Public Upload to personnel-avatars" ON storage.objects;
    CREATE POLICY "Allow Public Upload to personnel-avatars" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'personnel-avatars');

    DROP POLICY IF EXISTS "Allow Public Update on personnel-avatars" ON storage.objects;
    CREATE POLICY "Allow Public Update on personnel-avatars" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'personnel-avatars');

    DROP POLICY IF EXISTS "Allow Public Delete on personnel-avatars" ON storage.objects;
    CREATE POLICY "Allow Public Delete on personnel-avatars" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'personnel-avatars');
END $$;

-- 5. ข้อมูลตัวอย่างเริ่มต้น (Seed Initial Field Definitions)
INSERT INTO public.field_definitions (field_key, field_label, field_type, is_active)
VALUES 
    ('emergency_contact', 'ผู้ติดต่อฉุกเฉิน', 'text', true),
    ('uniform_size', 'ขนาดเครื่องแบบ/ชุดฝึก', 'text', true),
    ('shoe_size', 'ขนาดรองเท้าสนาม (เบอร์)', 'number', true),
    ('blood_pressure', 'ความดันโลหิตล่าสุด', 'text', true)
ON CONFLICT (field_key) DO NOTHING;

-- 6. ข้อมูลตัวอย่างกำลังพล (Sample Personnel Data)
INSERT INTO public.personnel (
    service_code, seq_no, full_name_th, nickname, rank_en, first_name_en, last_name_en,
    military_id, citizen_id, field_position, regular_position, salary_step, blood_group,
    phone_number, department, religion, birth_date, passport_no, photo_url, custom_fields
) VALUES
(
    'PKF-THAI-01236',
    2,
    'พ.ท. นฤเบศร์ บุญคุ้ม',
    'สอง',
    'LTC',
    'NARUBES',
    'BOONKOOM',
    '1309900213',
    '1-7099-00124-91-2',
    'ผบ.ร้อย ช.ชั่วคราว',
    'รอง ผบ.พัน.ช.๕๒',
    'น.๓/๑๘.๕',
    'B',
    '081-892-3412',
    'กองร้อยทหารช่างก่อสร้าง',
    'พุทธ',
    '1991-02-27',
    'AA4892104',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    '{"emergency_contact": "นางกานดา บุญคุ้ม (ภรรยา) 089-999-1234", "uniform_size": "XL", "shoe_size": 43, "blood_pressure": "120/80"}'::jsonb
),
(
    'PKF-THAI-01235',
    1,
    'พ.อ. เกียรติศักดิ์ พรหมมินทร์',
    'เอก',
    'COL',
    'KIATTISAK',
    'PROMMIN',
    '1258800112',
    '1-1004-00234-88-1',
    'ผบ.กองกำลังเฉพาะกิจ',
    'ผบ.ช.๑ พัน.๑๑๑',
    'น.๔/๑๙',
    'O',
    '089-456-7890',
    'กองบังคับการกองพล',
    'พุทธ',
    '1985-06-15',
    'AA2398411',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    '{"emergency_contact": "คุณมาลี พรหมมินทร์ 081-234-5678", "uniform_size": "L", "shoe_size": 42}'::jsonb
),
(
    'PKF-THAI-01237',
    3,
    'ร.อ. ธีรภัทร วงศ์สุวรรณ',
    'ภัทร',
    'CPT',
    'THEERAPAT',
    'WONGSUWAN',
    '1345500891',
    '1-5099-00432-11-0',
    'นายทหารยุทธการ',
    'ผบ.ร้อย.ช.สนับสนุน',
    'น.๒/๑๒.๕',
    'A',
    '092-345-6789',
    'กองร้อยทหารช่างสนับสนุน',
    'พุทธ',
    '1993-11-12',
    'AB8912301',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    '{"uniform_size": "M", "shoe_size": 41}'::jsonb
),
(
    'PKF-THAI-01238',
    4,
    'ร.ท. อัครพล สุขสมบูรณ์',
    'บอย',
    '1LT',
    'AKKARAPOL',
    'SUKSOMBOON',
    '1387700445',
    '1-6099-00112-44-3',
    'ผบ.มว.ชวภ.',
    'นายทหารเทคนิค',
    'น.๑/๙.๐',
    'AB',
    '086-778-9901',
    'กองร้อยทหารช่างเครื่องมือพิเศษ',
    'พุทธ',
    '1995-04-03',
    'AB9940122',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    '{}'::jsonb
),
(
    'PKF-THAI-01239',
    5,
    'จ.ส.อ. สมเกียรติ ยิ่งเจริญ',
    'เกียรติ',
    'SGM',
    'SOMKIAT',
    'YINGCHAROEN',
    '2308800561',
    '3-7099-00341-22-1',
    'จ่านายสิบกองร้อย',
    'สิบเอกอาวุโส',
    'ป.๓/๑๔.๐',
    'O',
    '084-556-1122',
    'กองร้อยทหารช่างสะพาน',
    'พุทธ',
    '1988-08-20',
    'AC1129481',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    '{"uniform_size": "L", "shoe_size": 42}'::jsonb
),
(
    'PKF-THAI-01240',
    6,
    'ส.อ. ปริญญา บุญส่ง',
    'ปริญ',
    'SGT',
    'PARINYA',
    'BOONSONG',
    '2419900334',
    '1-7299-00567-89-4',
    'พลขับรถบรรทุกสะพาน',
    'พลช่างกล',
    'ป.๑/๘.๕',
    'A',
    '087-990-2345',
    'กองร้อยทหารช่างสะพาน',
    'อิสลาม',
    '1998-01-14',
    '',
    '',
    '{"uniform_size": "M", "shoe_size": 40}'::jsonb
);
