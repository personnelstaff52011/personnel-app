'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Download, 
  UserPlus, 
  FileSpreadsheet, 
  RotateCcw,
  Users,
  Loader2,
  Filter,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import PersonnelTable from '@/components/PersonnelTable';
import PersonnelCard from '@/components/PersonnelCard';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { personnelService } from '@/lib/personnelService';
import { Personnel } from '@/types/personnel';
import { useAuth } from '@/context/AuthContext';

export default function PersonnelDirectoryPage() {
  const { isAdmin } = useAuth();
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default to 'card' on mobile, 'table' on desktop
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showFilters, setShowFilters] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterRank, setFilterRank] = useState('ALL');

  // Delete state
  const [targetPersonnel, setTargetPersonnel] = useState<Personnel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const data = await personnelService.getAll();
      setPersonnelList(data);
    } catch (err) {
      console.error('Error fetching personnel list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setViewMode('table');
    }
  }, []);

  // Filter options lists
  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    personnelList.forEach((p) => {
      if (p.department) set.add(p.department);
    });
    return Array.from(set).sort();
  }, [personnelList]);

  const rankOptions = useMemo(() => {
    const set = new Set<string>();
    personnelList.forEach((p) => {
      if (p.rank_en) set.add(p.rank_en);
    });
    return Array.from(set).sort();
  }, [personnelList]);

  // Filtered personnel calculation
  const filteredList = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return personnelList.filter((p) => {
      const matchesSearch =
        !term ||
        (p.full_name_th && p.full_name_th.toLowerCase().includes(term)) ||
        (p.nickname && p.nickname.toLowerCase().includes(term)) ||
        (p.first_name_en && p.first_name_en.toLowerCase().includes(term)) ||
        (p.last_name_en && p.last_name_en.toLowerCase().includes(term)) ||
        (p.military_id && p.military_id.toLowerCase().includes(term)) ||
        (p.citizen_id && p.citizen_id.replace(/[^0-9]/g, '').includes(term.replace(/[^0-9]/g, ''))) ||
        (p.phone_number && p.phone_number.includes(term));

      const matchesDept =
        filterDepartment === 'ALL' || p.department === filterDepartment;

      const matchesRank =
        filterRank === 'ALL' || p.rank_en === filterRank;

      return matchesSearch && matchesDept && matchesRank;
    });
  }, [personnelList, searchTerm, filterDepartment, filterRank]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('ALL');
    setFilterRank('ALL');
  };

  const hasActiveFilters = 
    searchTerm !== '' || 
    filterDepartment !== 'ALL' || 
    filterRank !== 'ALL';

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    if (personnelList.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const exportData = filteredList.map((p) => ({
      'ลำดับ (No)': p.seq_no,
      'ยศ ชื่อ-นามสกุล (ไทย)': p.full_name_th,
      'ชื่อเล่น': p.nickname || '',
      'RANK (EN)': p.rank_en || '',
      'NAME (EN)': p.first_name_en || '',
      'LASTNAME (EN)': p.last_name_en || '',
      'หมายเลขประจำตัวทหาร': p.military_id || '',
      'หมายเลขประชาชน': p.citizen_id || '',
      'ตำแหน่งปกติ': p.regular_position || '',
      'ขั้นเงินเดือน': p.salary_step || '',
      'กลุ่มเลือด': p.blood_group || '',
      'เบอร์ติดต่อ': p.phone_number || '',
      'ส่วนงาน/กองร้อย': p.department || '',
      'ศาสนา': p.religion || '',
      'วัน เดือน ปี เกิด': p.birth_date || '',
      'ลิงก์รูปถ่าย': p.photo_url || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ทำเนียบกำลังพล');

    const todayStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `ทำเนียบกำลังพล_กองพลทหารช่าง_${todayStr}.xlsx`);
  };

  // Delete Handler (Admin Only)
  const handleDeleteConfirm = async () => {
    if (!targetPersonnel || !isAdmin) return;
    setIsDeleting(true);
    try {
      await personnelService.delete(targetPersonnel.id);
      setPersonnelList((prev) => prev.filter((p) => p.id !== targetPersonnel.id));
      setTargetPersonnel(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-slate-800 flex-shrink-0" />
            <span>ทำเนียบกำลังพล กองพลทหารช่าง</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ค้นหา ตรวจสอบข้อมูล และโทรติดต่อได้ทันที
          </p>
        </div>

        {/* Action Buttons: Conditioned on Role (Admin Only) */}
        {isAdmin && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 text-xs font-semibold shadow-xs transition-all active:scale-95 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>ส่งออก Excel</span>
            </button>

            <Link
              href="/personnel/import"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 text-xs font-semibold shadow-xs transition-all flex-shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>นำเข้า Excel</span>
            </Link>
            <Link
              href="/personnel/new"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex-shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>เพิ่มกำลังพล</span>
            </Link>
          </div>
        )}
      </div>

      {/* Sticky Mobile Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-xs space-y-3 sticky top-16 z-30">
        <div className="flex items-center gap-2">
          {/* Instant Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา: ชื่อ, รหัส, เลขประจำตัว, เบอร์..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/70"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
            title="ตัวกรองข้อมูล"
          >
            <Filter className="w-4 h-4" />
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Table / Card View Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="มุมมองการ์ด (Card View)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="มุมมองตาราง (Table View)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Chips & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
            <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 truncate">
              <span>กำลังกรอง:</span>
              {filterDepartment !== 'ALL' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium truncate">
                  {filterDepartment}
                </span>
              )}
              {filterRank !== 'ALL' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  {filterRank}
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1 text-[11px] text-red-600 hover:text-red-700 font-semibold px-2 py-0.5 rounded-md hover:bg-red-50 flex-shrink-0 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>
        )}

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">ส่วนงาน / กองร้อย</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">ทั้งหมดทุกส่วนงาน</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">ชั้นยศ (Rank EN)</label>
              <select
                value={filterRank}
                onChange={(e) => setFilterRank(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">ทุกชั้นยศ</option>
                {rankOptions.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Summary Status Counter */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          พบกำลังพล <strong className="text-gray-900 font-bold">{filteredList.length}</strong> นาย (ทั้งหมด {personnelList.length} นาย)
        </span>
        {hasActiveFilters && (
          <span className="text-amber-700 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full">
            ตัวกรองทำงานอยู่
          </span>
        )}
      </div>

      {/* Content Rendering: Mobile Card View (Default) or Table */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
          <p className="text-xs text-gray-400">กำลังโหลดข้อมูลกำลังพล...</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredList.map((p) => (
            <PersonnelCard key={p.id} personnel={p} />
          ))}
          {filteredList.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-xs">
              ไม่พบข้อมูลกำลังพลตามคำค้นหา
            </div>
          )}
        </div>
      ) : (
        <PersonnelTable
          personnelList={filteredList}
          onDeleteRequest={(p) => setTargetPersonnel(p)}
          isAdmin={isAdmin}
        />
      )}

      {/* Delete Confirmation Modal (Admin only) */}
      {isAdmin && (
        <DeleteConfirmModal
          isOpen={Boolean(targetPersonnel)}
          name={targetPersonnel?.full_name_th || ''}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTargetPersonnel(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
