import image_59b667750b1988c0a6273c07ef14c39f97f305ea from 'figma:asset/59b667750b1988c0a6273c07ef14c39f97f305ea.png'
import image_421a1d099a68f9707d70bc24e409c9b0cc291fff from 'figma:asset/421a1d099a68f9707d70bc24e409c9b0cc291fff.png'
import image_f2d3b023094edbc47e88e3c458a6c416d3d094eb from 'figma:asset/f2d3b023094edbc47e88e3c458a6c416d3d094eb.png'
import { useState, useRef } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface MRIScan {
  id: number;
  date: string;
  stage: 'T1' | 'T2' | 'T3' | 'T4';
  risk: 'Low Risk' | 'Medium Risk' | 'High Risk';
  status: 'รักษาแล้ว' | 'ยังไม่รักษา' | 'กำลังรักษา' | 'ตรวจแล้ว';
  imageUrl: string;
  notes: string;
}

const mockPatient = {
  id: 'PT-001',
  name: 'สมชาย ใจดี',
  age: 58,
  email: 'somchai@example.com',
};

const mockScans: MRIScan[] = [
  {
    id: 1,
    date: '2026-03-01',
    stage: 'T2',
    risk: 'Medium Risk',
    status: 'กำลังรักษา',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FuJTIwYmxhZGRlcnxlbnwxfHx8fDE3NDA0ODA4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    notes: 'Tumor invasion detected in muscle layer'
  },
  {
    id: 2,
    date: '2026-02-15',
    stage: 'T2',
    risk: 'Medium Risk',
    status: 'ตรวจแล้ว',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FuJTIwYmxhZGRlcnxlbnwxfHx8fDE3NDA0ODA4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    notes: 'Progressive tumor growth observed'
  },
  {
    id: 3,
    date: '2026-01-20',
    stage: 'T1',
    risk: 'Low Risk',
    status: 'รักษาแล้ว',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FuJTIwYmxhZGRlcnxlbnwxfHx8fDE3NDA0ODA4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    notes: 'Early stage detection'
  },
  {
    id: 4,
    date: '2025-12-10',
    stage: 'T1',
    risk: 'Low Risk',
    status: 'รักษาแล้ว',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FuJTIwYmxhZGRlcnxlbnwxfHx8fDE3NDA0ODA4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    notes: 'Initial screening - no significant findings'
  },
];

export function PatientReviewNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('id') || 'PT-001';
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedScans, setSelectedScans] = useState<[number, number]>([0, 1]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'รักษาแล้ว':
        return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
      case 'ยังไม่รักษา':
        return 'bg-red-100 text-red-700 ring-1 ring-red-200';
      case 'กำลังรักษา':
        return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200';
      case 'ตรวจแล้ว':
        return 'bg-orange-100 text-orange-700 ring-1 ring-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk':
        return 'text-emerald-600';
      case 'Medium Risk':
        return 'text-orange-600';
      case 'High Risk':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/case-search')}
            className="p-2 hover:bg-accent rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              ประวัติผู้ป่วย
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              การติดตามและเปรียบเทียบผลการรักษา
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm font-medium">Patient ID: {patientId}</p>
      </div>

      {/* Patient Info */}
      <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-6 border-2 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{mockPatient.name}</h3>
              <p className="text-sm text-muted-foreground font-medium">
                อายุ {mockPatient.age} ปี • รหัสผู้ป่วย: {mockPatient.id}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-card rounded-xl px-6 py-3 border-2 border-border">
              <p className="text-xs text-muted-foreground font-semibold mb-1">จำนวนครั้งที่ตรวจ</p>
              <p className="text-2xl font-bold text-primary">{mockScans.length}</p>
            </div>
            <div className="bg-card rounded-xl px-6 py-3 border-2 border-border">
              <p className="text-xs text-muted-foreground font-semibold mb-1">ระยะปัจจุบัน</p>
              <p className="text-2xl font-bold text-purple-600">{mockScans[0].stage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
        <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
          <h3 className="text-xl font-bold">เปรียบเทียบผล MRI</h3>
          <p className="text-sm text-muted-foreground mt-1">เปรียบเทียบการเปลี่ยนแปลงของโรคในแต่ละครั้งที่ตรวจ</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Side - Previous Scan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border-2 border-blue-200">
                <div>
                  <h4 className="font-bold text-blue-900">ครั้งก่อนหน้า</h4>
                  <p className="text-sm text-blue-700 font-medium">
                    {mockScans[selectedScans[0]].date}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(mockScans[selectedScans[0]].status)}`}>
                  {mockScans[selectedScans[0]].status}
                </span>
              </div>

              <div className="relative aspect-square bg-black rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={image_f2d3b023094edbc47e88e3c458a6c416d3d094eb}
                  alt={`MRI Scan ${mockScans[selectedScans[0]].date}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                  {mockScans[selectedScans[0]].stage}
                </div>
                {/* Cancer Tumor Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    {/* Tumor circle with outline */}
                    <circle
                      cx="180"
                      cy="200"
                      r="50"
                      fill="none"
                      stroke="#FF6B6B"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                    <circle
                      cx="180"
                      cy="200"
                      r="50"
                      fill="#FF6B6B"
                      fillOpacity="0.15"
                    />
                    {/* Label */}
                    <text
                      x="180"
                      y="270"
                      textAnchor="middle"
                      fill="#FF6B6B"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      Tumor
                    </text>
                  </svg>
                </div>
              </div>

              <div className="bg-accent/50 rounded-xl p-4 border border-border">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Tumor Stage</p>
                    <p className="text-lg font-bold text-purple-600">{mockScans[selectedScans[0]].stage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Risk Level</p>
                    <p className={`text-lg font-bold ${getRiskColor(mockScans[selectedScans[0]].risk)}`}>
                      {mockScans[selectedScans[0]].risk}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Notes</p>
                  <p className="text-sm font-medium">{mockScans[selectedScans[0]].notes}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Current Scan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-4 border-2 border-emerald-200">
                <div>
                  <h4 className="font-bold text-emerald-900">ครั้งปัจจุบัน</h4>
                  <p className="text-sm text-emerald-700 font-medium">
                    {mockScans[selectedScans[1]].date}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(mockScans[selectedScans[1]].status)}`}>
                  {mockScans[selectedScans[1]].status}
                </span>
              </div>

              <div className="relative aspect-square bg-black rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={image_421a1d099a68f9707d70bc24e409c9b0cc291fff}
                  alt={`MRI Scan ${mockScans[selectedScans[1]].date}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                  {mockScans[selectedScans[1]].stage}
                </div>
                {/* Cancer Tumor Overlay - Larger tumor for current scan */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    {/* Larger tumor circle with outline */}
                    <circle
                      cx="200"
                      cy="200"
                      r="65"
                      fill="none"
                      stroke="#FF6B6B"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="65"
                      fill="#FF6B6B"
                      fillOpacity="0.15"
                    />
                    {/* Label */}
                    <text
                      x="200"
                      y="285"
                      textAnchor="middle"
                      fill="#FF6B6B"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      Tumor (Enlarged)
                    </text>
                  </svg>
                </div>
              </div>

              <div className="bg-accent/50 rounded-xl p-4 border border-border">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Tumor Stage</p>
                    <p className="text-lg font-bold text-purple-600">{mockScans[selectedScans[1]].stage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Risk Level</p>
                    <p className={`text-lg font-bold ${getRiskColor(mockScans[selectedScans[1]].risk)}`}>
                      {mockScans[selectedScans[1]].risk}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Notes</p>
                  <p className="text-sm font-medium">{mockScans[selectedScans[1]].notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Grid with Scroll */}
      <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
        <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">ประวัติการตรวจทั้งหมด</h3>
            <p className="text-sm text-muted-foreground mt-1">เลือกเพื่อเปรียบเทียบ</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-accent hover:bg-accent/70 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-accent hover:bg-accent/70 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 p-6 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockScans.map((scan, index) => (
            <div
              key={scan.id}
              onClick={() => {
                // Toggle selection
                if (selectedScans.includes(index)) {
                  // Remove from selection
                  setSelectedScans(prev => {
                    const newSelection = prev.filter(i => i !== index);
                    if (newSelection.length === 0) {
                      return [index, index === 0 ? 1 : 0];
                    }
                    return newSelection.length === 1 ? [newSelection[0], newSelection[0]] : newSelection as [number, number];
                  });
                } else {
                  // Add to selection (max 2)
                  setSelectedScans(prev => {
                    if (prev.length < 2) {
                      return [...prev, index].sort() as [number, number];
                    }
                    return [prev[1], index].sort() as [number, number];
                  });
                }
              }}
              className={`flex-shrink-0 w-64 bg-card border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedScans.includes(index) ? 'border-primary shadow-lg' : 'border-border'
              }`}
            >
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden mb-3">
                <img
                  src={image_59b667750b1988c0a6273c07ef14c39f97f305ea}
                  alt={`Scan ${scan.date}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                  {scan.stage}
                </div>
                {selectedScans.includes(index) && (
                  <div className="absolute top-2 right-2 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {selectedScans.indexOf(index) + 1}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Calendar className="w-3 h-3" />
                  <span>{scan.date}</span>
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(scan.status)}`}>
                  {scan.status}
                </span>
                <p className={`text-sm font-bold ${getRiskColor(scan.risk)}`}>
                  {scan.risk}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}