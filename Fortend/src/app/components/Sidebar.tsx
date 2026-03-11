import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Activity, Search, History, LogOut, X, Sun, Moon, Languages, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSidebar } from '../context/SidebarContext';
import { useAppSettings } from '../context/AppSettingsContext';
import { motion, AnimatePresence } from 'motion/react';

// Sidebar แสดงเมนูนำทางตามบทบาทของผู้ใช้ และควบคุมการออกจากระบบ
export function Sidebar() {
  const location = useLocation();
  const { user, setUser, logout } = useUser();
  const { isOpen, closeSidebar } = useSidebar();
  const { theme, setTheme, locale, setLocale, t } = useAppSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  useEffect(() => {
    setUsernameInput([user?.firstName, user?.lastName].filter(Boolean).join(' ').trim());
  }, [user]);

  // เมนูสำหรับแพทย์
  const navItemsDoctor = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/mri-upload', label: t('nav.mriAssessment'), icon: Activity },
    { path: '/case-search', label: t('nav.caseSearch'), icon: Search },
  ];

  // เมนูสำหรับผู้ป่วย
  const navItemsPatient = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/mri-upload', label: t('nav.mriAssessment'), icon: Activity },
    { path: '/patient-history', label: t('nav.patientHistory'), icon: History },
  ];

  // เลือกชุดเมนูตาม role ปัจจุบัน
  const navItems = user?.role === 'doctor' ? navItemsDoctor : navItemsPatient;

  // เมื่อกดเมนูใน sidebar ให้ปิดเมนูเพื่อคืนพื้นที่หน้าจอบน mobile
  const handleNavClick = () => {
    setIsSettingsOpen(false);
    closeSidebar();
  };

  const handleSaveUsername = () => {
    if (!user) return;

    const trimmedUsername = usernameInput.trim();
    if (!trimmedUsername) return;

    const [firstName, ...lastNameParts] = trimmedUsername.split(/\s+/);
    setUser({
      ...user,
      firstName,
      lastName: lastNameParts.join(' '),
    });
    setIsSettingsOpen(false);
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 w-72 bg-card h-screen border-r border-border flex flex-col shadow-2xl z-50"
          >
            {/* Logo/Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight">JIxSAW Health</h1>
                    <p className="text-xs text-muted-foreground font-medium">{t('app.subtitle')}</p>
                  </div>
                </div>
                <button
                  // ปิด sidebar เมื่อกดปุ่มกากบาท
                  onClick={closeSidebar}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        // เลือกหน้าใหม่แล้วปิด sidebar ทันที
                        onClick={handleNavClick}
                        className={`
                          flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                            : 'text-foreground/70 hover:bg-accent hover:text-foreground hover:scale-[1.01]'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[15px]">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </nav>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-4 bottom-36 w-[255px] rounded-3xl border border-border bg-card/95 backdrop-blur shadow-2xl p-4 space-y-4"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('settings.title')}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        <span>{t('settings.theme')}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 rounded-[1.4rem] bg-muted/80 p-2 shadow-inner border border-border/60">
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          aria-label={t('settings.light')}
                          className={`flex items-center justify-center rounded-[1.15rem] px-3 py-3 transition-all ${
                            theme === 'light'
                              ? 'bg-card text-foreground shadow-lg ring-1 ring-border scale-[1.02]'
                              : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'
                          }`}
                        >
                          <Sun className="w-10 h-10 stroke-[1.75]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          aria-label={t('settings.dark')}
                          className={`flex items-center justify-center rounded-[1.15rem] px-3 py-3 transition-all ${
                            theme === 'dark'
                              ? 'bg-card text-foreground shadow-lg ring-1 ring-border scale-[1.02]'
                              : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'
                          }`}
                        >
                          <Moon className="w-10 h-10 stroke-[1.75]" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Languages className="w-4 h-4" />
                        <span>{t('settings.language')}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 rounded-full bg-muted/80 p-1.5 shadow-inner border border-border/60">
                        <button
                          type="button"
                          onClick={() => setLocale('th')}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            locale === 'th'
                              ? 'bg-card text-indigo-600 shadow-md ring-1 ring-border'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          TH
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocale('en')}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            locale === 'en'
                              ? 'bg-card text-indigo-600 shadow-md ring-1 ring-border'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-border pt-3">
                    <label className="block text-sm font-semibold">{t('settings.username')}</label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder={t('settings.usernamePlaceholder')}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveUsername}
                        className="flex-1 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
                      >
                        {t('settings.save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsernameInput([user?.firstName, user?.lastName].filter(Boolean).join(' ').trim());
                          setIsSettingsOpen(false);
                        }}
                        className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-all hover:bg-accent"
                      >
                        {t('settings.cancel')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Info */}
            <div className="p-4 border-t border-border bg-accent/30">
              <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="mb-3 flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-left text-sm font-semibold shadow-sm transition-all hover:bg-accent"
              >
                <Settings2 className="w-4 h-4 text-primary" />
                <span>{t('settings.open')}</span>
              </button>

              <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-card">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <span className="text-sm font-bold">{user?.role === 'doctor' ? 'Dr' : user?.firstName?.charAt(0) || 'P'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground font-medium capitalize">{user?.role === 'doctor' ? t('roles.doctor') : t('roles.patient')}</p>
                </div>
              </div>
              <Link
                to="/login"
                onClick={() => {
                  // ล้าง user session และปิด sidebar ก่อนกลับไปหน้า login
                  setIsSettingsOpen(false);
                  logout();
                  closeSidebar();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}