import { Calendar, Clock, User, Plus, Search } from 'lucide-react';
import { mockAppointments } from '../data/mockData';

// หน้านัดหมาย ใช้แสดงรายการตรวจหรือ procedure ที่ถูกนัดไว้ในแต่ละวัน
export function Appointments() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Appointments</h1>
          <p className="text-muted-foreground text-base font-medium">
            Today's scheduled cystoscopy procedures
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 font-medium shadow-sm">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 font-medium">
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-5">
        {mockAppointments.map((appointment) => (
          // แสดงข้อมูลนัดหมายทีละรายการจาก mockAppointments
          <div
            key={appointment.id}
            className="bg-card rounded-2xl p-7 shadow-lg border-2 border-border hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{appointment.patientName}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {appointment.patientId} • {appointment.age} ปี • {appointment.gender}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 text-sm bg-accent/50 rounded-xl px-4 py-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{new Date(appointment.date).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm bg-accent/50 rounded-xl px-4 py-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{appointment.time}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gradient-to-r from-accent/70 to-accent/40 rounded-xl p-4 text-sm border-2 border-border">
                    <span className="font-bold text-foreground">Note: </span>
                    <span className="font-medium">{appointment.notes}</span>
                  </div>
                )}
              </div>

              <div className="ml-6">
                <span
                  className={`
                    inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-md
                    ${appointment.status === 'completed' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200' : ''}
                    ${appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' : ''}
                    ${appointment.status === 'scheduled' ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-200' : ''}
                  `}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}