import { motion, AnimatePresence } from 'motion/react';
import { Search, Calculator, Settings, FileText, X, Box } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Auto-focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch(''); // Clear search on open
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands = [
    { icon: <FileText className="w-5 h-5 text-blue-400" />, label: 'ახალი 2D ჭრის პროექტი' },
    { icon: <Box className="w-5 h-5 text-purple-400" />, label: 'მასალების ბაზა' },
    { icon: <Calculator className="w-5 h-5 text-emerald-400" />, label: 'ფასების კალკულატორი' },
    { icon: <Settings className="w-5 h-5 text-slate-400" />, label: 'ძრავის პარამეტრები' },
    { icon: <Search className="w-5 h-5 text-fuchsia-400" />, label: 'ნარჩენების ძიება' },
  ];

  const filtered = search 
    ? commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
    : commands;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-xl mx-4 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-slate-800">
              <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent border-none px-4 py-4 text-slate-200 placeholder-slate-500 focus:outline-none text-base"
                placeholder="მოძებნეთ ფუნქცია ან დეტალი (მაგ: კარადის გვერდი)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors flex-shrink-0 bg-slate-950 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
              {filtered.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    შედეგები
                  </div>
                  {filtered.map((cmd, i) => (
                    <button 
                      key={i} 
                      onClick={onClose}
                      className="w-full flex items-center gap-3 px-3 py-2.5 mt-0.5 text-sm font-medium text-slate-300 hover:bg-blue-500/10 hover:text-blue-300 rounded-xl transition-colors text-left group"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/10 transition-colors shadow-inner border border-slate-700/50 group-hover:border-blue-500/30">
                        {cmd.icon}
                      </div>
                      {cmd.label}
                    </button>
                  ))}
                </>
              ) : (
                 <div className="px-4 py-10 flex flex-col items-center justify-center text-center text-sm text-slate-500 gap-3">
                   <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-1">
                     <Search className="w-6 h-6 text-slate-600" />
                   </div>
                   შედეგი ვერ მოიძებნა "{search}"
                 </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
