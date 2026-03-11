import { FileText, Calendar, Activity, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAppSettings } from '../context/AppSettingsContext';

// mockHistory คือประวัติการประเมินของผู้ป่วยแต่ละครั้ง พร้อมความเห็นแพทย์
const mockHistory = [
  {
    id: 1,
    date: '2026-02-20',
    type: 'MRI Assessment',
    aiResult: 'Low Risk',
    aiConfidence: 92,
    doctorReview: {
      reviewed: true,
      opinion: 'Agree',
      notes: 'ผลการตรวจดีมาก ให้ติดตามอาการทุก 6 เดือน ไม่พบความผิดปกติที่น่าเป็นห่วง',
      doctorName: 'Dr. Siriwan P.',
      reviewDate: '2026-02-21'
    }
  },
  {
    id: 2,
    date: '2026-01-15',
    type: 'MRI Assessment',
    aiResult: 'Medium Risk',
    aiConfidence: 78,
    doctorReview: {
      reviewed: true,
      opinion: 'Partially Agree',
      notes: 'จากผล lab เพิ่มเติมและการตรวจร่างกาย ประเมินว่าเป็น Low-Medium Risk ให้ติดตามอาการและนัดตรวจซ้ำใน 3 เดือน',
      doctorName: 'Dr. Siriwan P.',
      reviewDate: '2026-01-16'
    }
  },
  {
    id: 3,
    date: '2025-12-10',
    type: 'MRI Assessment',
    aiResult: 'Low Risk',
    aiConfidence: 88,
    doctorReview: {
      reviewed: true,
      opinion: 'Agree',
      notes: 'ผลการตรวจปกติ ให้รักษาพฤติกรรมสุขภาพที่ดีต่อไป',
      doctorName: 'Dr. Siriwan P.',
      reviewDate: '2025-12-11'
    }
  },
];

// หน้าประวัติการรักษา แสดง timeline ของผลประเมิน AI และการทบทวนโดยแพทย์
export function PatientHistory() {
  const { user } = useUser();
  const { t, locale, formatDate } = useAppSettings();

  const getRiskLabel = (risk: string) => {
    if (locale === 'en') return risk;
    if (risk === 'Low Risk') return 'ความเสี่ยงต่ำ';
    if (risk === 'Medium Risk') return 'ความเสี่ยงปานกลาง';
    if (risk === 'High Risk') return 'ความเสี่ยงสูง';
    return risk;
  };

  const getOpinionLabel = (opinion: string) => {
    if (locale === 'en') return opinion;
    if (opinion === 'Agree') return 'เห็นด้วย';
    if (opinion === 'Partially Agree') return 'เห็นด้วยบางส่วน';
    return opinion;
  };

  return (
    <div className="p-8 space-y-8 max-w-[1920px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{t('patientHistory.title')}</h1>
        <p className="text-muted-foreground text-base font-medium">
          {t('patientHistory.subtitle')}
        </p>
      </div>

      {/* Patient Info */}
      <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-6 border-2 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-muted-foreground font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="space-y-6">
        {mockHistory.map((record, index) => (
          // วนแสดงแต่ละรายการประวัติเป็นการ์ดแยกตามลำดับเวลา
          <div
            key={record.id}
            className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-accent/50 to-transparent border-b-2 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {mockHistory.length - index}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{record.type}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(record.date, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* AI Assessment */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-base">{t('patientHistory.aiAssessment')}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/50 rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">{t('patientHistory.assessmentResult')}</p>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm
                        ${record.aiResult === 'Low Risk' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : ''}
                        ${record.aiResult === 'Medium Risk' ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-200' : ''}
                        ${record.aiResult === 'High Risk' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : ''}
                      `}
                    >
                      {getRiskLabel(record.aiResult)}
                    </span>
                  </div>
                  <div className="bg-accent/50 rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold mb-3">{t('patientHistory.aiConfidence')}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          // ความกว้างของ progress bar แสดงตามค่า aiConfidence
                          className="bg-gradient-to-r from-primary to-emerald-500 h-3 rounded-full"
                          style={{ width: `${record.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{record.aiConfidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Review */}
              {record.doctorReview.reviewed && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-bold text-base text-blue-900">{t('patientHistory.doctorReview')}</h4>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            record.doctorReview.opinion === 'Agree'
                              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-orange-100 text-orange-700 ring-1 ring-orange-200'
                          }`}
                        >
                          {getOpinionLabel(record.doctorReview.opinion)}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 font-medium leading-relaxed mb-3">
                        {record.doctorReview.notes}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-blue-600 font-semibold">
                        <span>{t('patientHistory.doctorLabel')}: {record.doctorReview.doctorName}</span>
                        <span>•</span>
                        <span>{t('patientHistory.reviewedAt')}: {formatDate(record.doctorReview.reviewDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-accent/70 to-accent/40 rounded-2xl p-6 border-2 border-border">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-2">{t('patientHistory.noteTitle')}</h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t('patientHistory.noteDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}