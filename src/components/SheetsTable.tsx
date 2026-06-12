import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SheetsTable() {
  const { sheets, updateSheet, addSheet, removeSheet } = useAppStore();

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-md flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
           <Map className="w-4 h-4 text-emerald-400" />
           ფურცლები ({sheets.length})
        </h2>
        <button 
          onClick={addSheet}
          className="bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1 text-xs pr-3"
        >
          <Plus className="w-4 h-4" /> დამატება
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <AnimatePresence>
            {sheets.map((sheet) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  key={sheet.id} 
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 group relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all hover:border-slate-700/80"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80 bg-emerald-500" />

                  <div className="flex gap-2 items-center pl-2 justify-between">
                      <div className="text-sm font-semibold text-slate-300 truncate">ფურცელი 2800x2070</div>
                      <button onClick={() => removeSheet(sheet.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 bg-red-400/10 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pl-2 items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">სიგრძე (W)</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-emerald-700/50 transition-colors">
                          <input type="number" min="1" className="bg-transparent border-none w-full text-left text-sm p-2 focus:outline-none focus:bg-slate-800/50" value={sheet.w} onChange={e => updateSheet(sheet.id, { w: Number(e.target.value) || 0 })} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">სიგანე (H)</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-emerald-700/50 transition-colors">
                          <input type="number" min="1" className="bg-transparent border-none w-full text-left text-sm p-2 focus:outline-none focus:bg-slate-800/50" value={sheet.h} onChange={e => updateSheet(sheet.id, { h: Number(e.target.value) || 0 })} />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">რაოდენობა</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-emerald-700/50 transition-colors">
                           <input type="number" min="1" className="bg-transparent border-none w-full text-left text-sm p-2 font-bold text-emerald-400 focus:outline-none focus:bg-slate-800/50" value={sheet.qty} onChange={e => updateSheet(sheet.id, { qty: Number(e.target.value) || 1 })} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ჩამონაჭრელი (Trim)</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-emerald-700/50 transition-colors">
                          <input type="number" min="0" className="bg-transparent border-none w-full text-left text-sm p-2 focus:outline-none focus:bg-slate-800/50" value={sheet.trim} onChange={e => updateSheet(sheet.id, { trim: Number(e.target.value) || 0 })} />
                        </div>
                      </div>
                  </div>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {sheets.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-sm gap-3 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <Map className="w-8 h-8 opacity-20" />
             ფურცლები არ დამატებულა
          </div>
        )}
      </div>
    </div>
  );
}
