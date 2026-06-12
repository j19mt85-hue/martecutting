import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, ArchiveRestore } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RemnantsTable() {
  const { remnants, updateRemnant, addRemnant, removeRemnant } = useAppStore();

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-md flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
           <ArchiveRestore className="w-4 h-4 text-amber-500" />
           ნარჩენები ({remnants.length})
        </h2>
        <button 
          onClick={addRemnant}
          className="bg-amber-600/20 hover:bg-amber-500/30 text-amber-500 p-1.5 rounded-lg border border-amber-500/30 transition-all flex items-center gap-1 text-xs pr-3"
        >
          <Plus className="w-4 h-4" /> დამატება
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <AnimatePresence>
            {remnants.map((remnant) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  key={remnant.id} 
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 group relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all hover:border-slate-700/80"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80 bg-amber-500" />

                  <div className="flex gap-2 items-center pl-2">
                      <input 
                        className="bg-transparent border-none text-sm font-semibold focus:outline-none w-full text-amber-100/90 placeholder:text-slate-600 focus:text-amber-100" 
                        value={remnant.label}
                        placeholder="ნარჩენის კოდი"
                        onChange={(e) => updateRemnant(remnant.id, { label: e.target.value })}
                      />
                      <button onClick={() => removeRemnant(remnant.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 bg-red-400/10 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 pl-2 items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">W</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-amber-700/50 transition-colors">
                          <input type="number" min="1" className="bg-transparent border-none w-full text-center text-sm p-1.5 focus:outline-none focus:bg-slate-800/50" value={remnant.w} onChange={e => updateRemnant(remnant.id, { w: Number(e.target.value) || 0 })} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">H</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-amber-700/50 transition-colors">
                          <input type="number" min="1" className="bg-transparent border-none w-full text-center text-sm p-1.5 focus:outline-none focus:bg-slate-800/50" value={remnant.h} onChange={e => updateRemnant(remnant.id, { h: Number(e.target.value) || 0 })} />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">მასალა</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-amber-700/50 transition-colors">
                           <input type="text" className="bg-transparent border-none w-full text-center text-xs p-2 text-slate-300 focus:outline-none focus:bg-slate-800/50" value={remnant.material} onChange={e => updateRemnant(remnant.id, { material: e.target.value })} />
                        </div>
                      </div>
                  </div>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {remnants.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-sm gap-3 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <ArchiveRestore className="w-8 h-8 opacity-20" />
             ნარჩენები საწყობში არ მოიძებნა
          </div>
        )}
      </div>
    </div>
  );
}
