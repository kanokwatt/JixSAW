import { useUser } from '../context/UserContext';
import { DashboardDoctor } from './DashboardDoctor';
import { DashboardPatient } from './DashboardPatient';

// ใช้เลือก dashboard ให้ตรงกับบทบาทของผู้ใช้ที่ล็อกอินอยู่
export function DashboardWrapper() {
  const { user } = useUser();

  // ถ้า role เป็น doctor ให้แสดงหน้า dashboard ของแพทย์
  if (user?.role === 'doctor') {
    return <DashboardDoctor />;
  }

  // กรณีอื่นทั้งหมด รวมถึง patient และ user ที่ยังไม่มี role ชัดเจน
  return <DashboardPatient />;
}
