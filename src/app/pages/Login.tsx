"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Link from 'next/link';

export function Login() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login - ในระบบจริงจะเชื่อมกับ API
    setTimeout(() => {
      // สมมติว่าเป็นแพทย์ถ้า email มี "doctor" หรือ "dr"
      const isDoctor = email.toLowerCase().includes('doctor') || email.toLowerCase().includes('dr');
      
      setUser({
        firstName: isDoctor ? 'Siriwan' : 'สมชาย',
        lastName: isDoctor ? 'Prateep' : 'ใจดี',
        email: email,
        role: isDoctor ? 'doctor' : 'patient',
        country: 'Thailand'
      });

      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
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

          {/* Login Form */}
          <div className="bg-card rounded-3xl shadow-2xl border border-border p-8">
            <h2 className="text-3xl font-bold mb-2">เข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6 text-sm">กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@jixsaw.health or patient@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  💡 Tip: ใช้ email ที่มี &quot;doctor&quot; เพื่อเข้าสู่โหมดแพทย์
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-semibold">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm font-medium">จดจำฉัน</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline font-semibold">
                  ลืมรหัสผ่าน?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">หรือ</span>
              </div>
            </div>

            {/* SSO Options */}
            <div className="space-y-3">
              <button className="w-full py-3.5 bg-white border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                เข้าสู่ระบบด้วย Google
              </button>
              
              <button className="w-full py-3.5 bg-white border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                เข้าสู่ระบบด้วย Microsoft
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                ยังไม่มีบัญชี?{' '}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                  ลงทะเบียน
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="font-medium">© 2026 JIxSAW Health. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
              Certified Medical Device | ISO 13485 Compliant
            </p>
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