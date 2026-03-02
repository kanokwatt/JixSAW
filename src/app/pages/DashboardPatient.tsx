import { MessageCircle, Calendar, FileText, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export function DashboardPatient() {
  const { user } = useUser();
  
  // Mock data - วันนัดหมายถัดไป
  const nextAppointment = new Date('2026-03-05');
  const today = new Date();
  const daysUntilAppointment = Math.ceil((nextAppointment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const recentAssessments = [
    { date: '2026-02-20', result: 'Low Risk', aiConfidence: 92, doctorReviewed: true },
    { date: '2026-01-15', result: 'Medium Risk', aiConfidence: 78, doctorReviewed: true },
    { date: '2025-12-10', result: 'Low Risk', aiConfidence: 88, doctorReviewed: true },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Appointment Countdown - มุมขวาบน */}
      <div className="fixed top-8 right-8 z-50">
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-xs font-semibold text-red-600">วันนัดหมายถัดไป</p>
              <p className="text-2xl font-bold text-red-700">
                {daysUntilAppointment} วัน
              </p>
              <p className="text-xs text-red-600 font-medium">{nextAppointment.toLocaleDateString('th-TH')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          สวัสดี, คุณ{user?.firstName}
        </h1>
        <p className="text-muted-foreground text-base font-medium">
          แพลตฟอร์มติดตามสุขภาพและให้คำปรึกษาเกี่ยวกับมะเร็งกระเพาะปัสสาวะ
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/chatbot"
          className="bg-gradient-to-br from-primary to-emerald-500 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group text-white"
        >
          <MessageCircle className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Chat with AI</h3>
          <p className="text-white/90 font-medium">ปรึกษาและถามคำถามเกี่ยวกับโรคของคุณ</p>
        </Link>

        <Link
          to="/mri-upload"
          className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
        >
          <Activity className="w-12 h-12 mb-4 text-blue-600" />
          <h3 className="text-2xl font-bold mb-2">Upload MRI</h3>
          <p className="text-muted-foreground font-medium">อัปโหลด MRI เพื่อการประเมินเบื้องต้น</p>
        </Link>

        <Link
          to="/patient-history"
          className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
        >
          <FileText className="w-12 h-12 mb-4 text-purple-600" />
          <h3 className="text-2xl font-bold mb-2">ประวัติการรักษา</h3>
          <p className="text-muted-foreground font-medium">ดูประวัติและผลการประเมินของแพทย์</p>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2 text-base">สำคัญ: AI ให้ข้อมูลเบื้องต้นเท่านั้น</h4>
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              ผลการประเมินจาก AI เป็นเพียงข้อมูลเบื้องต้น การวินิจฉัยและการรักษาที่แท้จริงต้องได้รับการยืนยันจากแพทย์ผู้เชี่ยวชาญเท่านั้น 
              กรุณาปรึกษาแพทย์ของคุณเพื่อการดูแลที่เหมาะสม
            </p>
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-gradient-to-r from-accent/50 to-transparent">
          <h2 className="text-2xl font-bold">การประเมินล่าสุด</h2>
          <p className="text-sm text-muted-foreground mt-1">ผลการประเมิน AI และการตรวจสอบจากแพทย์</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentAssessments.map((assessment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 bg-accent/30 rounded-xl border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-base">{new Date(assessment.date).toLocaleDateString('th-TH')}</p>
                    <p className="text-sm text-muted-foreground font-medium">AI Confidence: {assessment.aiConfidence}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm
                        ${assessment.result === 'Low Risk' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : ''}
                        ${assessment.result === 'Medium Risk' ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-200' : ''}
                        ${assessment.result === 'High Risk' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : ''}
                      `}
                    >
                      {assessment.result}
                    </span>
                  </div>
                  {assessment.doctorReviewed && (
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      แพทย์ตรวจสอบแล้ว
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
