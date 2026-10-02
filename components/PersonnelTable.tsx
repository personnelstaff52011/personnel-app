import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Eye, Edit3, Trash2, Phone } from 'lucide-react';
import { Personnel } from '@/types/personnel';

interface PersonnelTableProps {
  personnelList: Personnel[];
  onDeleteRequest: (personnel: Personnel) => void;
  isAdmin?: boolean;
}

export default function PersonnelTable({ 
  personnelList, 
  onDeleteRequest,
  isAdmin = false
}: PersonnelTableProps) {
  if (personnelList.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
        ไม่พบข้อมูลกำลังพลตามเงื่อนไขที่ค้นหา
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-slate-50 border-b border-gray-200 text-xs sm:text-sm font-bold text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-center w-14">ลำดับ</th>
              <th scope="col" className="px-3 py-3.5 w-16">รูปถ่าย</th>
              <th scope="col" className="px-4 py-3.5">ยศ ชื่อ-นามสกุล (ไทย / อังกฤษ)</th>
              <th scope="col" className="px-4 py-3.5">ตำแหน่ง</th>
              <th scope="col" className="px-4 py-3.5">ส่วนงาน/กองร้อย</th>
              <th scope="col" className="px-3 py-3.5 text-center">กลุ่มเลือด</th>
              <th scope="col" className="px-4 py-3.5">เบอร์ติดต่อ</th>
              <th scope="col" className="px-4 py-3.5 text-right w-24">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {personnelList.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                {/* Sequence No */}
                <td className="px-4 py-3 text-center font-bold text-gray-800">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-100 text-slate-800 text-xs font-extrabold">
                    {p.seq_no}
                  </span>
                </td>

                {/* Avatar */}
                <td className="px-3 py-3">
                  <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {p.photo_url ? (
                      <img
                        src={p.photo_url}
                        alt={p.full_name_th}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </td>

                {/* Names */}
                <td className="px-4 py-3">
                  <div className="text-sm sm:text-base font-bold text-gray-900 flex items-center space-x-1.5">
                    <Link href={`/personnel/${p.id}`} className="hover:text-blue-600 transition-colors">
                      {p.full_name_th || [p.rank_th, p.first_name_th, p.last_name_th].filter(Boolean).join(' ')}
                    </Link>
                    {p.nickname && (
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        ({p.nickname})
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">
                    {p.rank_en} {p.first_name_en} {p.last_name_en}
                  </div>
                </td>

                {/* Positions */}
                <td className="px-4 py-3 text-xs sm:text-sm">
                  <div className="text-gray-900 font-medium">
                    {p.regular_position || '-'}
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  {p.department || '-'}
                </td>

                {/* Blood Group */}
                <td className="px-3 py-3 text-center whitespace-nowrap">
                  {p.blood_group ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200">
                      {p.blood_group}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-xs sm:text-sm font-mono whitespace-nowrap">
                  {p.phone_number ? (
                    <a
                      href={`tel:${p.phone_number.replace(/[^0-9]/g, '')}`}
                      className="text-gray-700 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.phone_number}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <Link
                      href={`/personnel/${p.id}`}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ดูโปรไฟล์"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* Admin-only Edit & Delete Actions */}
                    {isAdmin && (
                      <>
                        <Link
                          href={`/personnel/${p.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="แก้ไข (Admin)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDeleteRequest(p)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบข้อมูล (Admin)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
