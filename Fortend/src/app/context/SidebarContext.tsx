import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

// สร้าง context สำหรับควบคุมการเปิดปิด sidebar จากหลาย component
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider สำหรับเก็บสถานะ sidebar กลางของทั้งแอป
export function SidebarProvider({ children }: { children: ReactNode }) {
  // true คือ sidebar เปิด, false คือปิด
  const [isOpen, setIsOpen] = useState(false);

  // สลับสถานะ sidebar ระหว่างเปิดและปิด
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  // ปิด sidebar โดยตรง ใช้ในกรณีที่ต้องการบังคับให้ปิด
  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// custom hook สำหรับดึงค่าและคำสั่งของ sidebar ไปใช้ใน component ต่าง ๆ
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
