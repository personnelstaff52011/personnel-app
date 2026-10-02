'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Settings, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  SlidersHorizontal 
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  useEffect(() => {
    setSupabaseConnected(isSupabaseConfigured());
  }, []);

  // 1. Navigation links for regular User (3 main items)
  const userNavLinks = [
    { href: '/', label: 'หน้าหลัก (Dashboard)', icon: LayoutDashboard },
    { href: '/personnel', label: 'ทำเนียบกำลังพล', icon: Users },
    { href: '/settings/profile', label: 'ตั้งค่าผู้ใช้', icon: User },
  ];

  // 2. Navigation links for Admin (Full access + การ์ดฟิลด์ที่แสดง)
  const adminNavLinks = [
    { href: '/', label: 'ภาพรวม (Dashboard)', icon: LayoutDashboard },
    { href: '/personnel', label: 'รายชื่อกำลังพล', icon: Users },
    { href: '/personnel/new', label: 'เพิ่มกำลังพล', icon: UserPlus },
    { href: '/personnel/import', label: 'นำเข้า Excel', icon: FileSpreadsheet },
    { href: '/settings/fields', label: 'การ์ดฟิลด์ที่แสดง', icon: SlidersHorizontal },
    { href: '/settings/profile', label: 'ตั้งค่าผู้ใช้', icon: User },
  ];

  const currentNavLinks = isAdmin ? adminNavLinks : userNavLinks;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/90 sticky top-0 z-40 shadow-sm safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-[#0e2617] p-0.5 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center border border-amber-500/30">
              <Image
                src="/icons/logo.png"
                alt="Engineer Division Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight tracking-tight">
                  Engineer Division
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#0e2617] text-amber-400 border border-amber-500/30">
                  iPonchor
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-gray-500 font-medium tracking-tight truncate max-w-[200px] sm:max-w-none">
                Personnel Information System • กองพลทหารช่าง
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links: Filtered based on User vs Admin */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {currentNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${active ? 'text-amber-400' : 'text-gray-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Account / Status Controls */}
          <div className="flex items-center space-x-2">
            {/* Supabase Status Pill */}
            {supabaseConnected ? (
              <div 
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                title="เชื่อมต่อ Supabase Live Database สำเร็จ"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Online</span>
              </div>
            ) : (
              <div 
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300"
                title="โหมด Local Demo Sync"
              >
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>Demo Sync</span>
              </div>
            )}

            {/* User Profile / Role Pill */}
            {user ? (
              <Link
                href="/settings/profile"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-bold text-gray-800 transition-colors shadow-2xs"
                title="แตะเพื่อจัดการตั้งค่าผู้ใช้"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white ${
                  isAdmin ? 'bg-slate-900 text-amber-400' : 'bg-blue-600'
                }`}>
                  {isAdmin ? 'A' : 'U'}
                </div>
                <span className="truncate max-w-[85px] sm:max-w-[130px]">
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
