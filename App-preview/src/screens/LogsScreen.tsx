import { Search, CheckCircle2, Megaphone, BriefcaseMedical, Stethoscope, BellOff } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'motion/react';
import { useEmergency } from '../App';
import { useEffect } from 'react';

export default function LogsScreen() {
  const { notifications, markAllAsRead } = useEmergency();

  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return <Stethoscope className="text-on-tertiary-container" />;
      case 'CLINICAL': return <CheckCircle2 className="text-on-secondary-container" />;
      case 'ADMIN': return <Megaphone className="text-white" />;
      case 'DAILY': return <BriefcaseMedical className="text-on-surface-variant" />;
      default: return <Info />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'bg-tertiary-container';
      case 'CLINICAL': return 'bg-secondary-container';
      case 'ADMIN': return 'bg-primary';
      case 'DAILY': return 'bg-surface-container-high';
      default: return 'bg-surface-container';
    }
  };

  const getLabelColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'text-tertiary';
      case 'CLINICAL': return 'text-secondary';
      case 'ADMIN': return 'text-primary';
      case 'DAILY': return 'text-on-surface-variant';
      default: return 'text-on-surface';
    }
  };

  return (
    <Layout>
      <div className="px-4 py-8 space-y-8">
        <header className="px-2">
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Notifications</h1>
          <p className="text-on-surface-variant font-medium">Real-time emergency and clinical alerts.</p>
        </header>

        <div className="space-y-6">
          <div className="relative px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search notifications..."
              className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary transition-shadow shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-px">
          {notifications.length > 0 ? (
            notifications.map((log) => (
              <motion.div 
                key={log.id}
                whileHover={{ backgroundColor: 'var(--color-surface-container-low)' }}
                className={`p-6 relative overflow-hidden bg-white first:rounded-t-3xl last:rounded-b-3xl border-b border-surface-container-highest/20 cursor-pointer`}
              >
                {log.type === 'EMERGENCY' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary" />}
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full ${getIconBg(log.type)} flex items-center justify-center shrink-0`}>
                    {getIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${getLabelColor(log.type)}`}>
                        {log.type}
                      </span>
                      <span className="text-xs text-on-surface-variant opacity-60 font-medium">{log.time}</span>
                    </div>
                    <h3 className="text-base font-bold text-on-surface leading-tight mb-2 truncate group-hover:text-primary transition-colors">
                      {log.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                      {log.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant opacity-40">
              <BellOff className="w-16 h-16 mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Info(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
