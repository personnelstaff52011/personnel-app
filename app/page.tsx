'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Award, 
  Building2, 
  UserPlus, 
  FileSpreadsheet, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Phone,
  User,
  UserCheck
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import DepartmentBarChart from '@/components/charts/DepartmentBarChart';
import RankBreakdownChart from '@/components/charts/RankBreakdownChart';
import { personnelService } from '@/lib/personnelService';
import { Personnel, KPIStats, DepartmentStat, RankStat } from '@/types/personnel';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [deptStats, setDeptStats] = useState<DepartmentStat[]>([]);
  const [rankStats, setRankStats] = useState<RankStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await personnelService.getAll();
      setPersonnelList(data);
      setStats(personnelService.calculateKPIs(data));
      setDeptStats(personnelService.getDepartmentStats(data));
      setRankStats(personnelService.getRankBreakdown(data));
      setIsLiveSupabase(isSupabaseConfigured());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-First Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <span>กองพลทหารช่าง • Engineer Division</span>
            </div>

            {/* Current Role Badge */}
            <div className="text-xs sm:text-sm font-bold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              {isAdmin ? '🛡️ ผู้ดูแลระบบ (Admin)' : '👤 ผู้ใช้งานทั่วไป (User)'}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            ระบบสารสนเทศข้อมูลกำลังพล
          </h1>
          <p className="text-slate-200 text-base sm:text-lg mt-2 max-w-xl leading-relaxed font-medium">
            สถิติกำลังพล และการกระจายตัวตามฝ่าย/ตอน
          </p>

          {/* Quick Action Buttons: Admin or Refresh */}
          <div className="flex items-center gap-2.5 mt-5 overflow-x-auto pb-1 scrollbar-none">
            {isAdmin && (
              <>
                <Link
                  href="/personnel/new"
                  className="inline-flex items-center space-x-2 px-4.5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm sm:text-base shadow-md transition-transform active:scale-95 flex-shrink-0"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>เพิ่มกำลังพล</span>
                </Link>
                <Link
                  href="/personnel/import"
                  className="inline-flex items-center space-x-2 px-4.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-sm border border-white/20 transition-transform active:scale-95 flex-shrink-0"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>นำเข้า Excel</span>
                </Link>
              </>
            )}

            <button
              onClick={fetchData}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 active:scale-95 transition-transform flex-shrink-0 ml-auto"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Notice Banner if in Demo mode */}
      {!isLiveSupabase && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start space-x-3 text-amber-950 text-sm sm:text-base shadow-xs">
          <AlertCircle className="w-5.5 h-5.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold">โหมดทดสอบข้อมูลจำลอง (Demo Mode):</span>{' '}
            ระบบทำงานผ่าน Local Sync ชั่วคราว ท่านสามารถทดสอบสลับระหว่างบัญชี Admin และ User ได้ในหน้าตั้งค่าผู้ใช้
          </div>
        </div>
      )}

      {/* 4 KPI Summary Cards (2x2 grid on mobile!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
        <StatCard
          title="กำลังพลทั้งหมด"
          value={stats ? `${stats.totalPersonnel} นาย` : '-'}
          subtitle="สถานะ"
          subValue="พร้อมปฏิบัติ 100%"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="สัญญาบัตร/ประทวน"
          value={stats ? `${stats.commissionedOfficers}/${stats.nonCommissionedOfficers}` : '-'}
          subtitle="สัญญาบัตร"
          subValue={stats ? `${stats.commissionedOfficers} นาย` : '-'}
          icon={Award}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="ฝ่าย/ตอน"
          value={stats ? `${stats.departmentsCount} ส่วน` : '-'}
          subtitle="ขึ้นตรง"
          subValue="ทุกสายงาน"
          icon={Building2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="กำลังพลช่วยราชการ"
          value={stats ? `${stats.detachedCount} นาย` : '-'}
          subtitle="บรรจุจริง"
          subValue={stats ? `${stats.assignedCount} นาย` : '-'}
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Department Distribution (Full Width) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4.5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              กำลังพลแยกตามฝ่าย/ตอน
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Department & Section Distribution
            </p>
          </div>
          <span className="text-xs sm:text-sm font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
            {deptStats.length} ส่วนงาน
          </span>
        </div>
        <DepartmentBarChart data={deptStats} />
      </div>

      {/* Rank Breakdown and Recent Personnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5 sm:gap-6">
        {/* Chart 3: Rank Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4.5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                สัดส่วนชั้นยศ (Rank)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                แยกตามชั้นยศทหารช่าง
              </p>
            </div>
          </div>
          <RankBreakdownChart data={rankStats} />
        </div>

        {/* Recent Personnel List Preview */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4.5 sm:p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  กำลังพลล่าสุดในระบบ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  แตะเพื่อดูโปรไฟล์หรือโทรด่วน
                </p>
              </div>
              <Link
                href="/personnel"
                className="text-sm sm:text-base font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {personnelList.slice(0, 5).map((p) => {
                const cleanPhone = p.phone_number ? p.phone_number.replace(/[^0-9]/g, '') : '';
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors">
                    <Link href={`/personnel/${p.id}`} className="flex items-center space-x-3 min-w-0 flex-1">
                      <span className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 text-xs sm:text-sm font-black flex items-center justify-center flex-shrink-0">
                        {p.seq_no}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-base sm:text-lg font-black text-slate-900 truncate block">
                          {(p.full_name_th || [p.rank_th, p.first_name_th, p.last_name_th].filter(Boolean).join(' '))} {p.nickname ? `(${p.nickname})` : ''}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 truncate block font-medium">
                          {p.department || 'ไม่ระบุสังกัด'}
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                      {p.blood_group && (
                        <span className="text-xs sm:text-sm font-black text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                          {p.blood_group}
                        </span>
                      )}
                      {cleanPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-95"
                          title={`โทร ${p.phone_number}`}
                        >
                          <Phone className="w-4.5 h-4.5 fill-emerald-600" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-100 mt-4 text-center">
            <Link
              href="/personnel"
              className="inline-flex items-center justify-center space-x-2 w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-base font-bold transition-all active:scale-[0.99]"
            >
              <span>เปิดดูทำเนียบกำลังพลทั้งหมด ({personnelList.length} นาย)</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
