import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Notification = {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  time: string;
  read: boolean;
};

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate fetching alerts
    setNotifications([
      { id: '1', type: 'success', message: 'ოპტიმიზაცია დასრულდა წამებში, ათვისება: 86%', time: '2 წთ წინ', read: false },
      { id: '2', type: 'warning', message: 'ნარჩენი B-3 თაროდან მალე ამოიწურება', time: '1 სთ წინ', read: false },
      { id: '3', type: 'info', message: 'განახლდა ძრავის S-V1.2 ვერსია', time: 'გუშინ', read: true },
    ]);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all shadow-inner group"
      >
        <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-500 text-[10px] font-bold text-white border-2 border-slate-950 shadow-[0_0_10px_rgba(217,70,239,0.5)]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, x: 10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="absolute top-full right-0 mt-4 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 flex flex-col"
          >
            {/* Glossy Top Edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-sm font-semibold text-slate-200">შეტყობინებები</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                  წაკითხულად მონიშვნა
                </button>
              )}
            </div>

            <div className="max-h-[320px] overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1.5 bg-slate-900/50">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className={`flex gap-3 p-3 rounded-xl transition-colors ${notif.read ? 'opacity-70 hover:bg-slate-800/50' : 'bg-slate-800/80 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600/50'}`}>
                    <div className="shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm text-slate-200 leading-snug">{notif.message}</p>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{notif.time}</span>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2 ml-auto shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center text-sm text-slate-500 gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-1">
                    <Bell className="w-6 h-6 text-slate-600" />
                  </div>
                  შეტყობინებები არ არის
                </div>
              )}
            </div>
            
            <button className="p-3 text-center text-xs text-slate-400 font-bold tracking-wider uppercase border-t border-slate-800 hover:text-slate-300 hover:bg-slate-800/80 transition-colors bg-slate-950/30">
              ყველას ნახვა
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
