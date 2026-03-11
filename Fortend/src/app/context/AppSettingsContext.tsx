import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';
type Locale = 'th' | 'en';

const translations = {
  th: {
    'app.subtitle': 'Bladder Cancer AI',
    'roles.doctor': 'แพทย์',
    'roles.patient': 'ผู้ป่วย',
    'nav.dashboard': 'Dashboard',
    'nav.mriAssessment': 'MRI Assessment',
    'nav.caseSearch': 'ค้นหาเคส',
    'nav.patientHistory': 'ประวัติการรักษา',
    'nav.logout': 'ออกจากระบบ',
    'settings.title': 'การตั้งค่า',
    'settings.open': 'ตั้งค่า',
    'settings.theme': 'ธีม',
    'settings.language': 'ภาษา',
    'settings.light': 'สว่าง',
    'settings.dark': 'มืด',
    'settings.th': 'ไทย',
    'settings.en': 'อังกฤษ',
    'settings.username': 'ชื่อผู้ใช้',
    'settings.usernamePlaceholder': 'กรอกชื่อที่ต้องการแสดง',
    'settings.save': 'บันทึก',
    'settings.cancel': 'ยกเลิก',
    'dashboardPatient.overdue': 'เกินกำหนดนัดหมาย',
    'dashboardPatient.nextAppointment': 'วันนัดหมายถัดไป',
    'dashboardPatient.days': 'วัน',
    'dashboardPatient.greeting': 'สวัสดี, คุณ',
    'dashboardPatient.subtitle': 'แพลตฟอร์มติดตามสุขภาพและให้คำปรึกษาเกี่ยวกับมะเร็งกระเพาะปัสสาวะ',
    'dashboardPatient.quickActionTitle': 'MRI Assessment & AI Chat',
    'dashboardPatient.quickActionDesc': 'อัปโหลด MRI และปรึกษา AI Assistant',
    'dashboardPatient.historyTitle': 'ประวัติการรักษา',
    'dashboardPatient.historyDesc': 'ดูประวัติและผลการประเมินของแพทย์',
    'dashboardPatient.bannerTitle': 'สำคัญ: AI ให้ข้อมูลเบื้องต้นเท่านั้น',
    'dashboardPatient.bannerDesc': 'ผลการประเมินจาก AI เป็นเพียงข้อมูลเบื้องต้น การวินิจฉัยและการรักษาที่แท้จริงต้องได้รับการยืนยันจากแพทย์ผู้เชี่ยวชาญเท่านั้น กรุณาปรึกษาแพทย์ของคุณเพื่อการดูแลที่เหมาะสม',
    'dashboardPatient.recentTitle': 'การประเมินล่าสุด',
    'dashboardPatient.recentDesc': 'ผลการประเมิน AI และการตรวจสอบจากแพทย์',
    'dashboardPatient.aiConfidence': 'ความมั่นใจของ AI',
    'dashboardPatient.reviewed': 'แพทย์ตรวจสอบแล้ว',
    'dashboardDoctor.title': 'Dashboard - แพทย์',
    'dashboardDoctor.subtitle': 'ภาพรวมการประเมินผู้ป่วยและ AI Analysis',
    'dashboardDoctor.searchCases': 'ค้นหาเคส',
    'dashboardDoctor.totalPatients': 'จำนวนผู้ป่วยทั้งหมด',
    'dashboardDoctor.pendingReviews': 'งานรอตรวจสอบ',
    'dashboardDoctor.completedToday': 'เสร็จสิ้นวันนี้',
    'dashboardDoctor.avgAccuracy': 'ความแม่นยำ AI เฉลี่ย',
    'dashboardDoctor.recentTitle': 'เคสล่าสุดที่ต้องตรวจสอบ',
    'dashboardDoctor.recentDesc': 'รายการผู้ป่วยที่รอการประเมินจากแพทย์',
    'dashboardDoctor.patientId': 'รหัสผู้ป่วย',
    'dashboardDoctor.patientName': 'ชื่อผู้ป่วย',
    'dashboardDoctor.date': 'วันที่',
    'dashboardDoctor.status': 'สถานะ',
    'dashboardDoctor.aiConfidence': 'ความมั่นใจของ AI',
    'dashboardDoctor.action': 'การดำเนินการ',
    'dashboardDoctor.review': 'Review',
    'caseSearch.title': 'ค้นหาเคส',
    'caseSearch.subtitle': 'ค้นหาและเปรียบเทียบประวัติการรักษาของผู้ป่วย',
    'caseSearch.placeholder': 'ค้นหาด้วยชื่อผู้ป่วยหรือ Patient ID...',
    'caseSearch.allStatus': 'ทุกสถานะ',
    'caseSearch.pending': 'รอดำเนินการ',
    'caseSearch.reviewed': 'ตรวจสอบแล้ว',
    'caseSearch.approved': 'อนุมัติแล้ว',
    'caseSearch.ageYears': 'ปี',
    'caseSearch.aiAssessment': 'AI Assessment',
    'caseSearch.result': 'ผลการประเมิน',
    'caseSearch.confidence': 'Confidence',
    'caseSearch.doctorOpinion': 'ความเห็นแพทย์',
    'caseSearch.viewPatientHistory': 'ดูประวัติผู้ป่วย',
    'caseSearch.noResults': 'ไม่พบผลการค้นหา',
    'patientHistory.title': 'ประวัติการรักษา',
    'patientHistory.subtitle': 'ประวัติการประเมินและความเห็นของแพทย์ทั้งหมด',
    'patientHistory.aiAssessment': 'การประเมินจาก AI',
    'patientHistory.assessmentResult': 'ผลการประเมิน',
    'patientHistory.aiConfidence': 'ความมั่นใจของ AI',
    'patientHistory.doctorReview': 'ความเห็นของแพทย์',
    'patientHistory.doctorLabel': 'แพทย์',
    'patientHistory.reviewedAt': 'ตรวจสอบเมื่อ',
    'patientHistory.noteTitle': 'หมายเหตุ',
    'patientHistory.noteDesc': 'ประวัติการรักษาทั้งหมดได้รับการเก็บรักษาอย่างปลอดภัย คุณสามารถดาวน์โหลดหรือพิมพ์ประวัติเพื่อนำไปใช้ได้ หากมีข้อสงสัยเกี่ยวกับผลการประเมิน กรุณาปรึกษาแพทย์ของคุณโดยตรง',
    'mri.title': 'MRI Assessment',
    'mri.subtitle': 'อัปโหลด MRI เพื่อการประเมินมะเร็งกระเพาะปัสสาวะเบื้องต้น และรับคำปรึกษาจาก AI Assistant',
    'mri.uploadTitle': 'Upload MRI Image',
    'mri.uploadHint': 'Drag and drop or click to browse',
    'mri.selectFile': 'Select File',
    'mri.progressTitle': 'AI Analysis in Progress...',
    'mri.complete': 'Complete',
    'mri.previewTitle': 'MRI Image Preview',
    'mri.fileName': 'ชื่อไฟล์',
    'mri.fileSize': 'ขนาดไฟล์',
    'mri.pen': 'ปากกา',
    'mri.eraser': 'ยางลบ',
    'mri.clearAll': 'ล้างทั้งหมด',
    'mri.drawHint': 'วาดบนภาพเพื่อระบุตำแหน่ง',
    'mri.eraseHint': 'ลบรอยวาด',
    'mri.aiAssistantSubtitle': 'ถามคำถามเกี่ยวกับการรักษา',
  },
  en: {
    'app.subtitle': 'Bladder Cancer AI',
    'roles.doctor': 'Doctor',
    'roles.patient': 'Patient',
    'nav.dashboard': 'Dashboard',
    'nav.mriAssessment': 'MRI Assessment',
    'nav.caseSearch': 'Case Search',
    'nav.patientHistory': 'Patient History',
    'nav.logout': 'Log Out',
    'settings.title': 'Settings',
    'settings.open': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.th': 'Thai',
    'settings.en': 'English',
    'settings.username': 'Username',
    'settings.usernamePlaceholder': 'Enter display name',
    'settings.save': 'Save',
    'settings.cancel': 'Cancel',
    'dashboardPatient.overdue': 'Appointment overdue',
    'dashboardPatient.nextAppointment': 'Next appointment',
    'dashboardPatient.days': 'days',
    'dashboardPatient.greeting': 'Hello, ',
    'dashboardPatient.subtitle': 'Health monitoring and consultation platform for bladder cancer care',
    'dashboardPatient.quickActionTitle': 'MRI Assessment & AI Chat',
    'dashboardPatient.quickActionDesc': 'Upload MRI and consult the AI Assistant',
    'dashboardPatient.historyTitle': 'Patient History',
    'dashboardPatient.historyDesc': 'View your treatment history and doctor reviews',
    'dashboardPatient.bannerTitle': 'Important: AI provides preliminary guidance only',
    'dashboardPatient.bannerDesc': 'AI assessment results are preliminary guidance only. Diagnosis and treatment decisions must be confirmed by a medical specialist. Please consult your doctor for appropriate care.',
    'dashboardPatient.recentTitle': 'Recent assessments',
    'dashboardPatient.recentDesc': 'AI assessment results and doctor reviews',
    'dashboardPatient.aiConfidence': 'AI Confidence',
    'dashboardPatient.reviewed': 'Reviewed by doctor',
    'dashboardDoctor.title': 'Dashboard - Doctor',
    'dashboardDoctor.subtitle': 'Overview of patient reviews and AI analysis',
    'dashboardDoctor.searchCases': 'Search Cases',
    'dashboardDoctor.totalPatients': 'Total Patients',
    'dashboardDoctor.pendingReviews': 'Pending Reviews',
    'dashboardDoctor.completedToday': 'Completed Today',
    'dashboardDoctor.avgAccuracy': 'Avg AI Accuracy',
    'dashboardDoctor.recentTitle': 'Recent cases to review',
    'dashboardDoctor.recentDesc': 'Patients currently waiting for doctor review',
    'dashboardDoctor.patientId': 'Patient ID',
    'dashboardDoctor.patientName': 'Patient Name',
    'dashboardDoctor.date': 'Date',
    'dashboardDoctor.status': 'Status',
    'dashboardDoctor.aiConfidence': 'AI Confidence',
    'dashboardDoctor.action': 'Action',
    'dashboardDoctor.review': 'Review',
    'caseSearch.title': 'Case Search',
    'caseSearch.subtitle': 'Search and compare patient treatment history',
    'caseSearch.placeholder': 'Search by patient name or ID...',
    'caseSearch.allStatus': 'All Status',
    'caseSearch.pending': 'Pending',
    'caseSearch.reviewed': 'Reviewed',
    'caseSearch.approved': 'Approved',
    'caseSearch.ageYears': 'yrs',
    'caseSearch.aiAssessment': 'AI Assessment',
    'caseSearch.result': 'Result',
    'caseSearch.confidence': 'Confidence',
    'caseSearch.doctorOpinion': "Doctor's Opinion",
    'caseSearch.viewPatientHistory': 'View Patient History',
    'caseSearch.noResults': 'No results found',
    'patientHistory.title': 'Patient History',
    'patientHistory.subtitle': 'Complete assessment history and doctor reviews',
    'patientHistory.aiAssessment': 'AI Assessment',
    'patientHistory.assessmentResult': 'Assessment Result',
    'patientHistory.aiConfidence': 'AI Confidence',
    'patientHistory.doctorReview': 'Doctor Review',
    'patientHistory.doctorLabel': 'Doctor',
    'patientHistory.reviewedAt': 'Reviewed at',
    'patientHistory.noteTitle': 'Note',
    'patientHistory.noteDesc': 'Your full treatment history is stored securely. You can download or print the record when needed. If you have any questions about the assessment results, please consult your doctor directly.',
    'mri.title': 'MRI Assessment',
    'mri.subtitle': 'Upload MRI images for an initial bladder cancer assessment and consult the AI Assistant',
    'mri.uploadTitle': 'Upload MRI Image',
    'mri.uploadHint': 'Drag and drop or click to browse',
    'mri.selectFile': 'Select File',
    'mri.progressTitle': 'AI Analysis in Progress...',
    'mri.complete': 'Complete',
    'mri.previewTitle': 'MRI Image Preview',
    'mri.fileName': 'File name',
    'mri.fileSize': 'File size',
    'mri.pen': 'Pen',
    'mri.eraser': 'Eraser',
    'mri.clearAll': 'Clear all',
    'mri.drawHint': 'Draw on the image to mark areas',
    'mri.eraseHint': 'Erase annotations',
    'mri.aiAssistantSubtitle': 'Ask questions about treatment',
  },
} as const;

type TranslationKey = keyof typeof translations.th;

interface AppSettingsContextType {
  theme: ThemeMode;
  locale: Locale;
  dateLocale: string;
  setTheme: (theme: ThemeMode) => void;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'jixsaw-theme';
const LOCALE_STORAGE_KEY = 'jixsaw-locale';

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' ? 'dark' : 'light';
  });
  const [locale, setLocale] = useState<Locale>(() => {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    return storedLocale === 'en' ? 'en' : 'th';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale === 'th' ? 'th' : 'en';
  }, [locale]);

  const value = useMemo<AppSettingsContextType>(() => {
    const dateLocale = locale === 'th' ? 'th-TH' : 'en-US';

    return {
      theme,
      locale,
      dateLocale,
      setTheme,
      setLocale,
      t: (key) => translations[locale][key],
      formatDate: (date, options) => new Date(date).toLocaleDateString(dateLocale, options),
      formatTime: (date, options) => new Date(date).toLocaleTimeString(dateLocale, options),
    };
  }, [theme, locale]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return context;
}