import { useState } from 'react';
import { Search, User, Calendar, ThumbsUp, ThumbsDown, MessageSquare, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router';

const mockCases = [
  {
    id: 'PT-001',
    patientName: 'สมชาย ใจดี',
    age: 58,
    gender: 'Male',
    date: '2026-02-25',
    aiResult: 'High Risk',
    aiConfidence: 87,
    doctorOpinion: 'Agree',
    doctorNotes: 'ยืนยันผลการประเมิน แนะนำทำ biopsy เพิ่มเติม',
    status: 'reviewed'
  },
  {
    id: 'PT-002',
    patientName: 'สมหญิง รักดี',
    age: 62,
    gender: 'Female',
    date: '2026-02-24',
    aiResult: 'Medium Risk',
    aiConfidence: 78,
    doctorOpinion: 'Disagree',
    doctorNotes: 'จากประสบการณ์และผล lab เพิ่มเติม ประเมินว่าเป็น Low Risk ติดตามอาการต่อไป',
    status: 'reviewed'
  },
  {
    id: 'PT-003',
    patientName: 'วิชัย สุขสันต์',
    age: 45,
    gender: 'Male',
    date: '2026-02-23',
    aiResult: 'Low Risk',
    aiConfidence: 92,
    doctorOpinion: 'Agree',
    doctorNotes: 'เห็นด้วยกับการประเมิน ให้ติดตามทุก 6 เดือน',
    status: 'reviewed'
  },
  {
    id: 'PT-004',
    patientName: 'นภา แสงดาว',
    age: 55,
    gender: 'Female',
    date: '2026-02-22',
    aiResult: 'High Risk',
    aiConfidence: 89,
    doctorOpinion: 'Agree',
    doctorNotes: 'ต้องทำ CT Scan และ biopsy ทันที นัดผู้ป่วยอาทิตย์หน้า',
    status: 'reviewed'
  },
];

export function CaseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCases = mockCases.filter(caseItem => {
    const matchesSearch = caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || caseItem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-8 max-w-[1920px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">ค้นหาเคส</h1>
        <p className="text-muted-foreground text-base font-medium">
          ค้นหาและเปรียบเทียบประวัติการรักษาของผู้ป่วย
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาด้วยชื่อผู้ป่วยหรือ Patient ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-card border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-6 py-3.5 bg-card border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium shadow-sm appearance-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Cases List */}
      <div className="space-y-5">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-card rounded-2xl shadow-lg border-2 border-border hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-accent/50 to-transparent border-b-2 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{caseItem.patientName}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {caseItem.id} • {caseItem.age} ปี • {caseItem.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{new Date(caseItem.date).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* AI Assessment */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-base">AI Assessment</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Result</p>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold
                        ${caseItem.aiResult === 'Low Risk' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : ''}
                        ${caseItem.aiResult === 'Medium Risk' ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-200' : ''}
                        ${caseItem.aiResult === 'High Risk' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : ''}
                      `}
                    >
                      {caseItem.aiResult}
                    </span>
                  </div>
                  <div className="bg-accent/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">Confidence</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full"
                          style={{ width: `${caseItem.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{caseItem.aiConfidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Opinion */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      caseItem.doctorOpinion === 'Agree' ? 'bg-emerald-100' : 'bg-orange-100'
                    }`}>
                      {caseItem.doctorOpinion === 'Agree' ? (
                        <ThumbsUp className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <ThumbsDown className="w-5 h-5 text-orange-700" />
                      )}
                    </div>
                    <h4 className="font-bold text-base">Doctor&apos;s Opinion</h4>
                    <span
                      className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold ${
                        caseItem.doctorOpinion === 'Agree'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {caseItem.doctorOpinion}
                    </span>
                  </div>
                  <Link
                    to={`/patient-review?id=${caseItem.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    ดูประวัติผู้ป่วย
                  </Link>
                </div>
                <div className="bg-gradient-to-r from-accent/70 to-accent/40 rounded-xl p-5 border-2 border-border">
                  <div className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">{caseItem.doctorNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-semibold">ไม่พบผลการค้นหา</p>
        </div>
      )}
    </div>
  );
}