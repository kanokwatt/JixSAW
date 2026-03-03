import { Users, FileCheck, Clock, Search, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

const mockStats = {
  totalPatients: 156,
  pendingReviews: 8,
  completedToday: 12,
  avgAccuracy: 94
};

const mockRecentCases = [
  { id: 'PT-001', patientName: 'สมชาย ใจดี', date: '2026-02-25', status: 'pending', aiConfidence: 87 },
  { id: 'PT-002', patientName: 'สมหญิง รักดี', date: '2026-02-25', status: 'reviewed', aiConfidence: 92 },
  { id: 'PT-003', patientName: 'วิชัย สุขสันต์', date: '2026-02-24', status: 'approved', aiConfidence: 89 },
  { id: 'PT-004', patientName: 'นภา แสงดาว', date: '2026-02-24', status: 'pending', aiConfidence: 78 },
];

export function DashboardDoctor() {
  const stats = [
    { label: 'Total Patients', value: mockStats.totalPatients, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Reviews', value: mockStats.pendingReviews, icon: Clock, color: 'from-orange-500 to-orange-600' },
    { label: 'Completed Today', value: mockStats.completedToday, icon: FileCheck, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Avg AI Accuracy', value: `${mockStats.avgAccuracy}%`, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Dashboard - แพทย์</h1>
          <p className="text-muted-foreground text-base font-medium">
            ภาพรวมการประเมินผู้ป่วยและ AI Analysis
          </p>
        </div>
        <Link
          to="/case-search"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium"
        >
          <Search className="w-4 h-4" />
          <span>ค้นหาเคส</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-3xl font-bold mb-1.5">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Cases */}
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-gradient-to-r from-accent/50 to-transparent">
          <h2 className="text-2xl font-bold">เคสล่าสุดที่ต้องตรวจสอบ</h2>
          <p className="text-sm text-muted-foreground mt-1">รายการผู้ป่วยที่รอการประเมินจากแพทย์</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50 backdrop-blur">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Patient ID</th>
                <th className="text-left p-4 font-semibold text-sm">Patient Name</th>
                <th className="text-left p-4 font-semibold text-sm">Date</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">AI Confidence</th>
                <th className="text-left p-4 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="p-4 font-semibold text-primary">{caseItem.id}</td>
                  <td className="p-4 font-semibold">{caseItem.patientName}</td>
                  <td className="p-4 text-sm font-medium">
                    {new Date(caseItem.date).toLocaleDateString('th-TH')}
                  </td>
                  <td className="p-4">
                    <span
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
                        ${caseItem.status === 'approved' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : ''}
                        ${caseItem.status === 'pending' ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-200' : ''}
                        ${caseItem.status === 'reviewed' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' : ''}
                      `}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-2.5 max-w-[100px] overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${caseItem.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold min-w-[45px]">{caseItem.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link 
                      to="/case-search"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold inline-block"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}