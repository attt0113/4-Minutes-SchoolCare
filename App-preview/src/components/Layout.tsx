import { ReactNode } from 'react';
import { useEmergency } from '../App';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Bell, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  headerRight?: ReactNode;
}

export default function Layout({ 
  children, 
  showNav = true, 
  title, 
  onBack, 
  showBack = false,
  headerRight
}: LayoutProps) {
  const location = useLocation();
  const { hasUnread } = useEmergency();

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background relative shadow-2xl">
      {/* Header */}
      {(title || showBack) && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-surface-container-highest/30">
          <div className="flex items-center gap-4">
            {showBack && (
              <button 
                onClick={onBack}
                className="p-2 rounded-full hover:bg-surface-container transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-on-surface" />
              </button>
            )}
            <h1 className="text-lg font-bold tracking-tight text-on-surface">{title}</h1>
          </div>
          {headerRight}
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-28' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-background/80 backdrop-blur-xl border-t border-surface-container-highest/30 px-4 pb-8 pt-3 flex justify-around items-center rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${isActive ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/alerts" 
            className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative ${isActive ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Notifications</span>
            {hasUnread && <div className="absolute top-2 right-4 w-2 h-2 bg-tertiary rounded-full border-2 border-background" />}
          </NavLink>
        </nav>
      )}
    </div>
  );
}
