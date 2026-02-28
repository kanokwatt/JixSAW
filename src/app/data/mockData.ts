// Mock data for the Medical AI-Assisted Cystoscopy Diagnosis System

export interface CaseData {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'pending' | 'analyzing' | 'completed' | 'approved';
  aiConfidence?: number;
  findings?: string[];
}

export interface AppointmentData {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
}

export interface AuditLogData {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  caseId: string;
  details: string;
  status: 'approved' | 'rejected' | 'modified';
}

export const mockCases: CaseData[] = [
  {
    id: 'CS-2026-001',
    patientId: 'PT-5421',
    patientName: 'สมชาย ใจดี',
    date: '2026-02-25',
    time: '09:30',
    status: 'completed',
    aiConfidence: 87,
    findings: ['Suspicious lesion detected', 'Recommend biopsy']
  },
  {
    id: 'CS-2026-002',
    patientId: 'PT-5422',
    patientName: 'สมหญิง รักษ์ดี',
    date: '2026-02-25',
    time: '10:45',
    status: 'analyzing',
    aiConfidence: 92
  },
  {
    id: 'CS-2026-003',
    patientId: 'PT-5423',
    patientName: 'ประเสริฐ สุขสบาย',
    date: '2026-02-25',
    time: '14:00',
    status: 'pending'
  },
  {
    id: 'CS-2026-004',
    patientId: 'PT-5424',
    patientName: 'วิภา ศรีสุข',
    date: '2026-02-25',
    time: '15:30',
    status: 'approved',
    aiConfidence: 95,
    findings: ['No abnormalities detected', 'Normal bladder mucosa']
  }
];

export const mockAppointments: AppointmentData[] = [
  {
    id: 'APT-001',
    patientId: 'PT-5421',
    patientName: 'สมชาย ใจดี',
    age: 58,
    gender: 'ชาย',
    date: '2026-02-25',
    time: '09:30',
    status: 'completed',
    notes: 'Follow-up cystoscopy for surveillance'
  },
  {
    id: 'APT-002',
    patientId: 'PT-5422',
    patientName: 'สมหญิง รักษ์ดี',
    age: 62,
    gender: 'หญิง',
    date: '2026-02-25',
    time: '10:45',
    status: 'in-progress',
    notes: 'Hematuria investigation'
  },
  {
    id: 'APT-003',
    patientId: 'PT-5423',
    patientName: 'ประเสริฐ สุขสบาย',
    age: 71,
    gender: 'ชาย',
    date: '2026-02-25',
    time: '14:00',
    status: 'scheduled',
    notes: 'Post-treatment evaluation'
  },
  {
    id: 'APT-004',
    patientId: 'PT-5424',
    patientName: 'วิภา ศรีสุข',
    age: 45,
    gender: 'หญิง',
    date: '2026-02-25',
    time: '15:30',
    status: 'scheduled',
    notes: 'Routine screening'
  },
  {
    id: 'APT-005',
    patientId: 'PT-5425',
    patientName: 'สุรชัย วงศ์ดี',
    age: 54,
    gender: 'ชาย',
    date: '2026-02-26',
    time: '09:00',
    status: 'scheduled',
    notes: 'Initial consultation'
  }
];

export const mockAuditLogs: AuditLogData[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-02-25 15:45:23',
    user: 'Dr. Siriwan P.',
    action: 'Diagnosis Approved',
    caseId: 'CS-2026-004',
    details: 'AI diagnosis approved without modifications',
    status: 'approved'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-02-25 14:32:10',
    user: 'Dr. Somchai K.',
    action: 'Diagnosis Modified',
    caseId: 'CS-2026-001',
    details: 'Added additional notes regarding lesion location',
    status: 'modified'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-02-25 11:15:45',
    user: 'Dr. Ananya T.',
    action: 'AI Analysis Rejected',
    caseId: 'CS-2026-002',
    details: 'False positive suspected - manual review required',
    status: 'rejected'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-02-25 09:50:33',
    user: 'Dr. Siriwan P.',
    action: 'Case Created',
    caseId: 'CS-2026-003',
    details: 'New case uploaded for AI analysis',
    status: 'approved'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-02-24 16:22:11',
    user: 'Dr. Somchai K.',
    action: 'Diagnosis Approved',
    caseId: 'CS-2026-001',
    details: 'Confirmed suspicious lesion - biopsy recommended',
    status: 'approved'
  }
];

export const dashboardStats = {
  todayCases: 4,
  pendingReview: 2,
  completedToday: 2,
  averageConfidence: 91.3
};
