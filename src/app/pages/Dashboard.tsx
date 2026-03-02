import { Users, FileCheck, Clock, TrendingUp, Plus, Upload, ArrowUpRight } from 'lucide-react';
import { dashboardStats, mockCases } from '../data/mockData';
import { Link } from 'react-router';

export function Dashboard() {
  const stats = [
    {
      label: "Today's Cases",
      value: dashboardStats.todayCases,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Pending Review',
      value: dashboardStats.pendingReview,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      label: 'Completed Today',
      value: dashboardStats.completedToday,
      icon: FileCheck,
      color: 'text-primary'
    },
    {
      label: 'Avg AI Confidence',
      value: `${dashboardStats.averageConfidence}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Dashboard</h1>
          <p className="text-muted-foreground text-base">
            Overview of today&apos;s cystoscopy cases and AI analysis
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/ai-analysis"
            className="flex items-center gap-2 px-5 py-2.5 bg-card border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 font-medium shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </Link>
          <Link
            to="/appointments"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const gradients = [
            'from-blue-500 to-blue-600',
            'from-orange-500 to-orange-600',
            'from-emerald-500 to-emerald-600',
            'from-purple-500 to-purple-600',
          ];
          return (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[index]} shadow-md`}>
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
          <h2 className="text-2xl font-bold">Recent Cases</h2>
          <p className="text-sm text-muted-foreground mt-1">Latest patient examinations and AI analysis results</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50 backdrop-blur">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Case ID</th>
                <th className="text-left p-4 font-semibold text-sm">Patient</th>
                <th className="text-left p-4 font-semibold text-sm">Date & Time</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">AI Confidence</th>
              </tr>
            </thead>
            <tbody>
              {mockCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <td className="p-4 font-semibold text-primary">{caseItem.id}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-semibold">{caseItem.patientName}</div>
                      <div className="text-sm text-muted-foreground font-medium">{caseItem.patientId}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">
                      {new Date(caseItem.date).toLocaleDateString('th-TH')} {caseItem.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
                        ${caseItem.status === 'completed' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' : ''}
                        ${caseItem.status === 'analyzing' ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-200' : ''}
                        ${caseItem.status === 'pending' ? 'bg-gray-100 text-gray-700 ring-1 ring-gray-200' : ''}
                        ${caseItem.status === 'approved' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : ''}
                      `}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {caseItem.aiConfidence ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-2.5 max-w-[100px] overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${caseItem.aiConfidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold min-w-[45px]">{caseItem.aiConfidence}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
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