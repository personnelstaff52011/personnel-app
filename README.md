# ระบบสารสนเทศข้อมูลกำลังพล กองพลทหารช่าง
## Engineer Division Personnel Management System

Web Application สำหรับการบริหารจัดการและติดตามข้อมูลกำลังพล กองพลทหารช่าง พัฒนาด้วย **Next.js 14+ (App Router)**, **Tailwind CSS**, **Lucide React**, **Recharts** และเชื่อมต่อกับ **Supabase Database & Storage**

---

## 🌟 ฟังก์ชันหลักของระบบ (Key Features)

1. **Dashboard สรุปยอดกำลังพล (Personnel Overview - Route `/`)**
   - **KPI Summary Cards 4 ใบ**: ยอดกำลังพลรวมทั้งหมด, สัดส่วนกลุ่มชั้นยศ (สัญญาบัตร / ประทวน), ยอดแยกตามสังกัด/ส่วนงาน, ความสมบูรณ์ของรูปถ่าย
   - **Interactive Charts (Recharts)**:
     - **Bar Chart**: ยอดกำลังพลแยกตามส่วนงาน/กองร้อย (Department Distribution)
     - **Donut Chart**: สัดส่วนกลุ่มเลือดทางการแพทย์ (A, B, O, AB)
     - **Horizontal Bar Chart**: สัดส่วนชั้นยศ (Rank Breakdown)
   - แถบแสดงสถานะการเชื่อมต่อ Supabase Live / Local Demo Sync

2. **หน้าโปรไฟล์กำลังพลรายบุคคล (Personnel Detail View - Route `/personnel/[id]`)**
   - การจัดวาง UI ถอดแบบตามโครงสร้างที่กำหนด 100%:
     - แถบ Breadcrumb: `ข้อมูลกำลังพล / ข้อมูลกำลังพล`
     - รูปถ่ายหน้าตรงข้าราชการ กรอบสี่เหลี่ยมมุมมน
     - ลำดับหมายเลข (`seq_no`) ขนาดใหญ่ตรงกลาง
     - รหัสกำลังพลตัวหนา ชัดเจน (`service_code` เช่น `PKF-THAI-01236`)
     - ยศ ชื่อ-นามสกุล ภาษาไทย (เช่น `พ.ท. นฤเบศร์ บุญคุ้ม`) และชื่อเล่น (เช่น `สอง`)
     - ตาราง Grid 4 คอลัมน์ (PC) / 2 คอลัมน์ (Tablet) / 1 คอลัมน์ (Mobile):
       - แถวที่ 1: `RANK (EN)`, `NAME (EN)`, `LASTNAME (EN)`, `หมายเลขประจำตัว`
       - แถวที่ 2: `หมายเลขประชาชน`, `ตำแหน่งในสนาม`, `ตำแหน่งปกติ`, `ขั้นเงินเดือน`
       - แถวที่ 3: `กลุ่มเลือด`, `เบอร์ติดต่อ`, `ส่วนงาน`, `ศาสนา`
       - แถวที่ 4: `วัน เดือน ปี เกิด` (รูปแบบอ่านง่าย เช่น February 27, 1991), `Passport No.`
     - แสดงฟิลด์เพิ่มเติม (Custom Fields จาก JSONB) ต่อท้ายใน Grid อัตโนมัติ
   - **Mobile Quick Action Bar**:
     - ปุ่มโทรออก **Call** (`tel:...`) รูปวงรี
     - ปุ่มส่งข้อความ **SMS** (`sms:...`) รูปวงรี
     - ปุ่ม **แก้ไข (Edit)** และปุ่ม **ลบ (Delete)** พร้อม Modal ยืนยันความปลอดภัย

3. **ทำเนียบกำลังพลและการสืบค้น (Directory & Filters - Route `/personnel`)**
   - รองรับสลับมุมมอง **Table View** (ตารางราชการ) และ **Card View** (การ์ดพร้อมรูป)
   - **Instant Search**: พิมพ์แล้วเจอทันทีจากชื่อ-สกุล, รหัสกำลังพล, เลขประจำตัว, เลขประชาชน, เบอร์โทร
   - **Multi-Filter**: กรองแยกตามกองร้อย/ส่วนงาน, กลุ่มเลือด, และชั้นยศ
   - **Export to Excel (.xlsx)**: ส่งออกข้อมูลทำเนียบกำลังพลเป็นไฟล์สเปรดชีตทันที

4. **การเพิ่ม/แก้ไขข้อมูลกำลังพล (Add/Edit Form - Route `/personnel/new` & `/[id]/edit`)**
   - กล่องอัปโหลดรูปถ่ายแบบ **Drag & Drop** พร้อมพรีวิว อัปโหลดตรงไปยัง Bucket `personnel-avatars` ใน Supabase Storage
   - กรอกข้อมูลมาตรฐานและข้อมูลเสริม Dynamic Fields ครบถ้วน

5. **ระบบนำเข้าไฟล์ Excel (Bulk Import - Route `/personnel/import`)**
   - อัปโหลดไฟล์ `.xlsx` หรือ `.csv`
   - ตรวจสอบและแสดงตัวอย่างข้อมูล (Data Preview) ก่อนกดยืนยันบันทึกแบบ Bulk Insert
   - ปุ่มดาวน์โหลดไฟล์ Template ตัวอย่าง

6. **ระบบจัดการฟิลด์ข้อมูลเสริม (Dynamic Fields Settings - Route `/settings/fields`)**
   - ให้ Admin เพิ่มฟิลด์ใหม่ (ชื่อฟิลด์ภาษาไทย, ชนิดข้อมูล Text/Number/Date) บันทึกลงตาราง `field_definitions`

---

## 🛠️ ขั้นตอนการติดตั้งและการเชื่อมต่อ Supabase

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าฐานข้อมูล Supabase
1. ไปที่ Supabase Dashboard -> **SQL Editor**
2. คัดลอกคำสั่งในไฟล์ `supabase_schema.sql` ไปวางแล้วกด **Run**
   - คำสั่งนี้จะสร้างตาราง `personnel`, `field_definitions`, Storage Bucket `personnel-avatars`, Policies และ Seed Data ข้อมูลเริ่มต้นให้อัตโนมัติ

### 3. ตั้งค่า Environment Variables
เปิดไฟล์ `.env.local` แล้วใส่ค่า URL และ Key ของ Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(หากยังไม่ได้กรอกค่า ระบบจะเปิดโหมด Local Demo Mode พร้อมข้อมูลตัวอย่างให้ใช้งานและทดสอบได้ทันทีโดยไม่ติดขัด)*

### 4. รัน Development Server
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)
