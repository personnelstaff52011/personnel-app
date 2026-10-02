import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import ForcePasswordChangeModal from '@/components/ForcePasswordChangeModal';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ระบบสารสนเทศข้อมูลกำลังพล กองพลทหารช่าง',
  description: 'ระบบจัดการและติดตามข้อมูลกำลังพล กองพลทหารช่าง รองรับมือถือ 100% เชื่อมต่อ Supabase Database & Storage',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'กำลังพล ช.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-100">
        <AuthProvider>
          <Navbar />
          {/* pb-28 on mobile creates generous space for MobileBottomNav */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-8">
            {children}
          </main>
          
          {/* Mobile Bottom Tab Bar */}
          <MobileBottomNav />

          {/* Mandatory First-Time Password Change Modal */}
          <ForcePasswordChangeModal />

          {/* Footer (hidden on mobile) */}
          <footer className="hidden md:block bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-semibold text-gray-700">ระบบสารสนเทศข้อมูลกำลังพล กองพลทหารช่าง</p>
              <p className="text-gray-400 mt-1">Engineer Division Personnel Management System • Powered by Next.js & Supabase</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
