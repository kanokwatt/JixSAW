import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, Search, History, LogOut, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSidebar } from '../context/SidebarContext';
import { motion, AnimatePresence } from 'motion/react';

export function Sidebar() {
  const location = { pathname: usePathname() } as { pathname: string };
  const { user, logout } = useUser();
  const { isOpen, closeSidebar } = useSidebar();
                      <Link
                        href={item.path}
                        onClick={handleNavClick}
                        className={
                          `
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
  const handleNavClick = () => {
    closeSidebar();
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
                    <p className="text-xs text-muted-foreground font-medium">Bladder Cancer AI</p>
                  </div>
                </div>
                <button
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

            {/* User Info */}
            <div className="p-4 border-t border-border bg-accent/30">
              <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-card">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <span className="text-sm font-bold">{user?.role === 'doctor' ? 'ดร' : user?.firstName?.charAt(0) || 'P'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground font-medium capitalize">{user?.role || 'Patient'}</p>
                </div>
              </div>
              <Link
                to="/login"
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}