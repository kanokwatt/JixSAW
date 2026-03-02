import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, TrendingUp, TrendingDown, Minus, User, FileText, Activity, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MRIScan {
  id: number;
  date: string;
  visitNumber: number;
  aiResult: 'Low Risk' | 'Medium Risk' | 'High Risk';
  aiConfidence: number;
  imageUrl: string;
  findings: string[];
  doctorNotes?: string;
  doctorReviewed: boolean;
  tumorSize?: string;
  stage?: string;
}

const mockPatient = {
  id: 'PT-001',
  name: 'สมชาย ใจดี',
  age: 58,
  gender: 'Male',
  hn: 'HN-2024-0015',
  firstVisit: '2024-08-15',
};

const mockScans: MRIScan[] = [
  {
    id: 1,
    date: '2026-02-20',
    visitNumber: 6,
    aiResult: 'Low Risk',
    aiConfidence: 92,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400',
    findings: [
      'Tumor size decreased to 1.2 cm',
      'No new lesions detected',
      'Good response to treatment',
    ],
    doctorNotes: 'ผลการรักษาดีมาก เนื้องอกลดลงอย่างมีนัยสำคัญ แนะนำให้ติดตามต่อเนื่อง',
    doctorReviewed: true,
    tumorSize: '1.2 cm',
    stage: 'T1',
  },
  {
    id: 2,
    date: '2026-01-15',
    visitNumber: 5,
    aiResult: 'Medium Risk',
    aiConfidence: 78,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    findings: [
      'Tumor size: 2.1 cm',
      'Slight reduction from previous visit',
      'Continue monitoring',
    ],
    doctorNotes: 'เนื้องอกลดลงเล็กน้อย ให้ทำเคมีบำบัดต่อตามแผน',
    doctorReviewed: true,
    tumorSize: '2.1 cm',
    stage: 'T1',
  },
  {
    id: 3,
    date: '2025-12-10',
    visitNumber: 4,
    aiResult: 'Medium Risk',
    aiConfidence: 82,
    imageUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400',
    findings: [
      'Tumor size: 2.5 cm',
      'Stable size from previous visit',
      'No distant metastasis',
    ],
    doctorNotes: 'ขนาดเนื้องอกคงที่ ให้เฝ้าระวังและติดตามใกล้ชิด',
    doctorReviewed: true,
    tumorSize: '2.5 cm',
    stage: 'T1',
  },
  {
    id: 4,
    date: '2025-11-05',
    visitNumber: 3,
    aiResult: 'High Risk',
    aiConfidence: 87,
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400',
    findings: [
      'Tumor size: 2.5 cm',
      'Irregular bladder wall thickening',
      'Possible muscle layer infiltration',
    ],
    doctorNotes: 'เริ่มเคมีบำบัดตามแผนการรักษา ต้องติดตามผลอย่างใกล้ชิด',
    doctorReviewed: true,
    tumorSize: '2.5 cm',
    stage: 'T2',
  },
  {
    id: 5,
    date: '2025-10-01',
    visitNumber: 2,
    aiResult: 'High Risk',
    aiConfidence: 89,
    imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400',
    findings: [
      'Tumor size: 3.2 cm',
      'Infiltration into muscle layer confirmed',
      'No lymph node involvement',
    ],
    doctorNotes: 'ยืนยันการวินิจฉัย Stage T2 แนะนำเคมีบำบัดและติดตามผล',
    doctorReviewed: true,
    tumorSize: '3.2 cm',
    stage: 'T2',
  },
  {
    id: 6,
    date: '2025-08-15',
    visitNumber: 1,
    aiResult: 'High Risk',
    aiConfidence: 85,
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=400',
    findings: [
      'Initial diagnosis',
      'Tumor detected: 3.5 cm',
      'Bladder wall thickening present',
    ],
    doctorNotes: 'การตรวจครั้งแรก พบเนื้องอกในกระเพาะปัสสาวะ ต้องทำการตรวจเพิ่มเติมและวางแผนการรักษา',
    doctorReviewed: true,
    tumorSize: '3.5 cm',
    stage: 'T2',
  },
];

export function PatientReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id') || 'PT-001';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState<MRIScan | null>(null);
  const [filterRisk, setFilterRisk] = useState<'all' | 'Low Risk' | 'Medium Risk' | 'High Risk'>('all');

  const filteredScans = mockScans.filter(scan => {
    const matchesSearch = 
      scan.date.includes(searchTerm) ||
      scan.aiResult.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.visitNumber.toString().includes(searchTerm);
    const matchesFilter = filterRisk === 'all' || scan.aiResult === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk':
        return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
      case 'Medium Risk':
        return 'bg-orange-100 text-orange-700 ring-orange-200';
      case 'High Risk':
        return 'bg-red-100 text-red-700 ring-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (currentIndex: number) => {
    if (currentIndex === mockScans.length - 1) return <Minus className="w-4 h-4 text-gray-500" />;
    
    const current = mockScans[currentIndex];
    const previous = mockScans[currentIndex + 1];
    
    const riskLevels = { 'Low Risk': 1, 'Medium Risk': 2, 'High Risk': 3 };
    const currentLevel = riskLevels[current.aiResult];
    const previousLevel = riskLevels[previous.aiResult];
    
    if (currentLevel < previousLevel) {
      return <TrendingDown className="w-4 h-4 text-emerald-600" />;
    } else if (currentLevel > previousLevel) {
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 hover:bg-accent rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Patient Review
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              เปรียบเท���ยบผล MRI แต่ละครั้งของผู้ป่วย
            </p>
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-6 border-2 border-primary/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{mockPatient.name}</h2>
              <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {mockPatient.id}
                </span>
                <span>•</span>
                <span>HN: {mockPatient.hn}</span>
                <span>•</span>
                <span>{mockPatient.age} ปี • {mockPatient.gender}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-semibold mb-1">First Visit</p>
            <p className="text-lg font-bold">{new Date(mockPatient.firstVisit).toLocaleDateString('th-TH')}</p>
            <p className="text-sm text-primary font-semibold mt-2">Total Visits: {mockScans.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาด้วยวันที่, ผลการประเมิน, หรือครั้งที่..."
            className="w-full pl-12 pr-4 py-3.5 bg-card border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium shadow-sm"
          />
        </div>
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value as any)}
          className="px-6 py-3.5 bg-card border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium shadow-sm appearance-none cursor-pointer"
        >
          <option value="all">All Risk Levels</option>
          <option value="Low Risk">Low Risk</option>
          <option value="Medium Risk">Medium Risk</option>
          <option value="High Risk">High Risk</option>
        </select>
      </div>

      {/* Timeline Overview */}
      <div className="bg-card rounded-2xl shadow-lg border-2 border-border p-6">
        <h3 className="text-xl font-bold mb-5">Treatment Timeline</h3>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-orange-500 to-emerald-500"></div>
          <div className="space-y-4">
            {filteredScans.map((scan, index) => (
              <div key={scan.id} className="flex items-center gap-6 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg z-10 ${
                  scan.aiResult === 'Low Risk' ? 'bg-emerald-500' :
                  scan.aiResult === 'Medium Risk' ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  {scan.visitNumber}
                </div>
                <div className="flex-1 bg-accent/50 rounded-xl p-4 hover:bg-accent transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-bold text-base">{new Date(scan.date).toLocaleDateString('th-TH')}</p>
                        <p className="text-sm text-muted-foreground font-medium">Visit #{scan.visitNumber}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ring-1 ${getRiskColor(scan.aiResult)}`}>
                        {scan.aiResult}
                      </span>
                      {scan.tumorSize && (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                          {scan.tumorSize}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {getTrendIcon(index)}
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MRI Grid Comparison */}
      <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
        <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
          <h3 className="text-xl font-bold">MRI Comparison Grid</h3>
          <p className="text-sm text-muted-foreground mt-1">เปรียบเทียบภาพ MRI ทุกครั้งที่ตรวจ</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredScans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-accent/50 rounded-2xl overflow-hidden border-2 border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedScan(scan)}
              >
                {/* Image */}
                <div className="relative aspect-square bg-black">
                  <img
                    src={scan.imageUrl}
                    alt={`MRI Visit ${scan.visitNumber}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-12 h-12 text-white" />
                  </div>
                  {/* Visit Number Badge */}
                  <div className="absolute top-3 left-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {scan.visitNumber}
                  </div>
                  {/* Trend Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full">
                      {getTrendIcon(index)}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{new Date(scan.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                  </div>
                  
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ring-1 ${getRiskColor(scan.aiResult)}`}>
                    {scan.aiResult}
                  </span>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Confidence</span>
                    <span className="font-bold">{scan.aiConfidence}%</span>
                  </div>
                  
                  <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${scan.aiConfidence}%` }}
                    />
                  </div>

                  {scan.tumorSize && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                      <span className="text-muted-foreground font-semibold">Tumor Size</span>
                      <span className="font-bold text-blue-700">{scan.tumorSize}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredScans.length === 0 && (
            <div className="text-center py-16">
              <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-semibold">ไม่พบผลการค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedScan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-2xl border-2 border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-accent/80 to-transparent backdrop-blur-lg border-b-2 border-border p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Visit #{selectedScan.visitNumber}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {new Date(selectedScan.date).toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedScan(null)}
                    className="p-2 hover:bg-accent rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* MRI Image */}
                <div className="space-y-4">
                  <div className="aspect-square bg-black rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={selectedScan.imageUrl}
                      alt={`MRI Visit ${selectedScan.visitNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-accent/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">AI Confidence</p>
                      <p className="text-2xl font-bold">{selectedScan.aiConfidence}%</p>
                    </div>
                    <div className="bg-accent/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">Stage</p>
                      <p className="text-2xl font-bold">{selectedScan.stage}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-5">
                  {/* Risk Assessment */}
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground mb-3">RISK ASSESSMENT</h4>
                    <span className={`inline-flex items-center px-4 py-2.5 rounded-xl text-base font-bold ring-2 ${getRiskColor(selectedScan.aiResult)}`}>
                      {selectedScan.aiResult}
                    </span>
                  </div>

                  {/* AI Findings */}
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground mb-3">AI FINDINGS</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-4">
                      <ul className="space-y-2">
                        {selectedScan.findings.map((finding, index) => (
                          <li key={index} className="text-sm text-blue-800 font-medium flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Doctor's Notes */}
                  {selectedScan.doctorNotes && (
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground mb-3">DOCTOR'S NOTES</h4>
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-xl p-4">
                        <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                          {selectedScan.doctorNotes}
                        </p>
                        {selectedScan.doctorReviewed && (
                          <div className="flex items-center gap-2 mt-3 text-emerald-700 font-semibold text-xs">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                            Doctor Reviewed
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tumor Size */}
                  {selectedScan.tumorSize && (
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground mb-3">TUMOR SIZE</h4>
                      <div className="bg-accent/50 rounded-xl p-4">
                        <p className="text-3xl font-bold text-blue-700">{selectedScan.tumorSize}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
