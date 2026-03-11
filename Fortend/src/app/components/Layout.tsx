import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

// Layout เป็นโครงหน้าหลักของระบบ ประกอบด้วย sidebar, top bar และพื้นที่แสดงหน้าลูก
export function Layout() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* แสดงเมนูด้านข้างที่ใช้ร่วมกันทุกหน้าหลังล็อกอิน */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Hamburger */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 shadow-sm">
          <button
            // เรียก toggleSidebar เพื่อสลับการเปิดปิดเมนูด้านข้าง
            onClick={toggleSidebar}
            className="p-2.5 hover:bg-accent rounded-xl transition-colors mr-4"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold">JIxSAW Health</h1>
          </div>
        </header>

        {/* Outlet คือพื้นที่สำหรับ render หน้าย่อยตาม route ที่เลือก */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}