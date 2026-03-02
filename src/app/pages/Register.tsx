import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Mail, Globe, Stethoscope, Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';

export function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '' as 'doctor' | 'patient' | '',
    country: ''
  });

  const countries = [
    'Thailand', 'United States', 'United Kingdom', 'Japan', 'Singapore',
    'Malaysia', 'Indonesia', 'Vietnam', 'Philippines', 'Australia'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      alert('กรุณาเลือกบทบาท');
      return;
    }
    
    setUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      country: formData.country
    });

    // นำไปหน้า Dashboard ตาม role
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">JIxSAW Health</h1>
            </div>
            <p className="text-muted-foreground text-base font-medium">
              Bladder Cancer AI Assessment Platform
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-card rounded-3xl shadow-2xl border border-border p-8">
            <h2 className="text-3xl font-bold mb-2">ลงทะเบียน</h2>
            <p className="text-muted-foreground mb-6 text-sm">สร้างบัญชีเพื่อเริ่มใช้งานระบบ</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block mb-3 text-sm font-semibold">
                  บทบาท *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'doctor' })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      formData.role === 'doctor'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    <Stethoscope className={`w-10 h-10 mx-auto mb-3 ${
                      formData.role === 'doctor' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="font-bold text-base">แพทย์</div>
                    <div className="text-xs text-muted-foreground mt-1">Medical Professional</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'patient' })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      formData.role === 'patient'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    <Heart className={`w-10 h-10 mx-auto mb-3 ${
                      formData.role === 'patient' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="font-bold text-base">ผู้ป่วย</div>
                    <div className="text-xs text-muted-foreground mt-1">Patient</div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-sm font-semibold">
                    ชื่อ *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="ชื่อ"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block mb-2 text-sm font-semibold">
                    นามสกุล *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="นามสกุล"
                    required
                    className="w-full px-4 py-3.5 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold">
                  อีเมล *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* Country Field */}
              <div>
                <label htmlFor="country" className="block mb-2 text-sm font-semibold">
                  ประเทศ *
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="">เลือกประเทศ</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base"
              >
                ลงทะเบียน
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                มีบัญชีอยู่แล้ว?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="font-medium">© 2026 JIxSAW Health. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex flex-1 bg-card items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1631217842667-131e8e92abb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2FyZSUyMGRvY3RvciUyMHBhdGllbnR8ZW58MXx8fHwxNzQwNDc5Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Medical Care"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-emerald-600/80 to-blue-600/90"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-xl">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            AI-Powered Bladder Cancer Assessment
          </h2>
          <p className="text-xl mb-10 text-white/90 font-medium leading-relaxed">
            แพลตฟอร์ม AI สำหรับการประเมินมะเร็งกระเพาะปัสสาวะ พร้อมให้คำปรึกษาและติดตามผลการรักษา
          </p>
          <div className="space-y-5">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-semibold">MRI Image Analysis</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-semibold">24/7 AI Chatbot Support</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Treatment History Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
