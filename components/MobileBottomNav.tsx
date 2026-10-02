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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] safe-bottom">
      <div className="flex items-center justify-around h-14 px-2 max-w-md mx-auto">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  active 
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100' 
                    : 'bg-slate-900 text-amber-400 ring-4 ring-white'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                  active ? 'text-amber-600' : 'text-slate-700'
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
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
                active ? 'text-slate-900 font-extrabold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] mt-1 leading-none ${active ? 'font-bold text-slate-900' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
