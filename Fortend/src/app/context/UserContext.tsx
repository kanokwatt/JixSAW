import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'doctor' | 'patient' | null;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  country: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// สร้าง context สำหรับเก็บข้อมูลผู้ใช้ที่ล็อกอินอยู่ และเมธอดที่เกี่ยวข้อง
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider ตัวนี้ห่อ component tree เพื่อให้ทุกหน้าสามารถเข้าถึงข้อมูล user ได้
export function UserProvider({ children }: { children: ReactNode }) {
  // เก็บสถานะผู้ใช้ปัจจุบันไว้ในหน่วยความจำของฝั่ง frontend
  const [user, setUser] = useState<User | null>(null);

  // ล้างข้อมูลผู้ใช้เมื่อออกจากระบบ
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// custom hook สำหรับเรียกใช้ UserContext แบบปลอดภัย
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
