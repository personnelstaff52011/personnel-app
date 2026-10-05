'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Settings,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  // If viewing single personnel details, hide main bottom nav so QuickActionBar has full control
  const isPersonnelDetail = 
    pathname.startsWith('/personnel/') && 
    pathname !== '/personnel/new' && 
    pathname !== '/personnel/import' &&
    !pathname.endsWith('/edit');

  // If in /login page, hide bottom nav
  if (pathname === '/login' || isPersonnelDetail) {
    return null;
  }

  interface NavItem {
    href: string;
    label: string;
    icon: any;
    highlight?: boolean;
  }

  // 1. Menu items for Regular User: EXACTLY 3 MENUS (หน้าหลัก, ทำเนียบ, ตั้งค่าผู้ใช้)
  const userNavItems: NavItem[] = [
    { href: '/', label: 'หน้าหลัก', icon: LayoutDashboard },
    { href: '/personnel', label: 'ทำเนียบ', icon: Users },
    { href: '/settings/profile', label: 'ตั้งค่าผู้ใช้', icon: User },
  ];

  // 2. Menu items for Admin: Full access with การ์ดฟิลด์ (5 items)
  const adminNavItems: NavItem[] = [
    { href: '/', label: 'หน้าแรก', icon: LayoutDashboard },
    { href: '/personnel', label: 'ทำเนียบ', icon: Users },
    { href: '/personnel/new', label: 'เพิ่มกำลังพล', icon: UserPlus, highlight: true },
    { href: '/personnel/import', label: 'Excel', icon: FileSpreadsheet },
    { href: '/settings/fields', label: 'การ์ดฟิลด์', icon: SlidersHorizontal },
  ];

  const currentNavItems: NavItem[] = isAdmin ? adminNavItems : userNavItems;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.09)] safe-bottom">
      <div className="flex items-center justify-around h-[70px] px-2 max-w-md mx-auto">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4 flex flex-col items-center group px-1"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90 ${
                  active 
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100' 
                    : 'bg-slate-900 text-amber-400 ring-4 ring-white shadow-slate-900/30'
                }`}>
                  <Icon className="w-7 h-7 stroke-[2.3]" />
                </div>
                <span className={`text-[12.5px] sm:text-sm font-extrabold mt-1 tracking-tight ${
                  active ? 'text-amber-600' : 'text-slate-800'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all active:scale-95 ${
                active ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              <div className={`relative px-4 py-1 rounded-2xl transition-all ${
                active ? 'bg-blue-50 text-blue-600' : ''
              }`}>
                <Icon className={`w-6.5 h-6.5 ${active ? 'stroke-[2.5]' : 'stroke-[1.9]'}`} />
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className={`text-[13px] sm:text-sm mt-0.5 leading-tight ${active ? 'font-black text-slate-950' : 'font-semibold text-slate-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
