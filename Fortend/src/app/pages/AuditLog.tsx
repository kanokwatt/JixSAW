import { FileText, CheckCircle, XCircle, Edit, Download, Filter } from 'lucide-react';
import { mockAuditLogs } from '../data/mockData';

// หน้า audit log แสดงประวัติการอนุมัติ แก้ไข หรือปฏิเสธผลวินิจฉัยทั้งหมด
export function AuditLog() {
  // เลือก icon ให้ตรงกับสถานะของ log แต่ละรายการ
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'modified':
        return <Edit className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Audit Logs</h1>
          <p className="text-muted-foreground text-base font-medium">
            Complete history of all diagnostic actions and approvals
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 font-medium shadow-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex gap-4">
          <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2 text-base">Data Integrity & Compliance</h4>
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              All actions are logged for transparency and meet international medical standards. 
              Logs are immutable and can be exported for regulatory review.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50 backdrop-blur">
              <tr>
                <th className="text-left p-5 font-bold text-sm">Timestamp</th>
                <th className="text-left p-5 font-bold text-sm">User</th>
                <th className="text-left p-5 font-bold text-sm">Action</th>
                <th className="text-left p-5 font-bold text-sm">Case ID</th>
                <th className="text-left p-5 font-bold text-sm">Details</th>
                <th className="text-left p-5 font-bold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((log) => (
                // สร้างแถวข้อมูลของ log แต่ละรายการในตาราง
                <tr key={log.id} className="border-b-2 border-border hover:bg-accent/50 transition-colors">
                  <td className="p-5">
                    <div className="text-sm font-mono font-semibold bg-accent/50 px-3 py-1.5 rounded-lg inline-block">{log.timestamp}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold">{log.user}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-semibold">{log.action}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-mono text-sm text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-lg inline-block">{log.caseId}</div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm text-muted-foreground max-w-md font-medium">{log.details}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <span
                        className={`
                          inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold capitalize shadow-sm
                          ${log.status === 'approved' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200' : ''}
                          ${log.status === 'rejected' ? 'bg-red-100 text-red-700 ring-2 ring-red-200' : ''}
                          ${log.status === 'modified' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' : ''}
                        `}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-card border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 font-semibold shadow-sm">
          Export as CSV
        </button>
        <button className="px-6 py-3 bg-card border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 font-semibold shadow-sm">
          Export as PDF
        </button>
      </div>
    </div>
  );
}