import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, Cuboid, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ModulesTable() {
  const { modules, parts, updateModule, addModule, removeModule } = useAppStore();

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-md flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
           <Cuboid className="w-4 h-4 text-blue-400" />
           მოდულები ({modules.length})
        </h2>
        <button 
          onClick={addModule}
          className="bg-blue-600/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-lg border border-blue-500/30 transition-all flex items-center gap-1 text-xs pr-3"
        >
          <Plus className="w-4 h-4" /> დამატება
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <AnimatePresence>
            {modules.map((module) => {
              const modulePartsCount = parts.filter(p => p.moduleId === module.id).length;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  key={module.id} 
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 group relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all hover:border-slate-700/80"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: module.color }} />

                  <div className="flex gap-3 justify-between items-center pl-2">
                      <div className="flex-1 flex gap-2 items-center bg-slate-900/50 border border-slate-800/80 rounded-lg px-3 py-1.5 focus-within:border-slate-700">
                          <input 
                            className="bg-transparent border-none text-sm font-medium focus:outline-none w-full text-slate-200 placeholder:text-slate-600 focus:text-blue-100" 
                            value={module.name}
                            placeholder="მოდულის სახელი"
                            onChange={(e) => updateModule(module.id, { name: e.target.value })}
                          />
                      </div>
                      <button onClick={() => removeModule(module.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 bg-red-400/10 rounded-md shadow-inner">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  <div className="flex items-center gap-3 pl-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                         <span className="font-semibold text-slate-400">{modulePartsCount}</span> დეტალი
                      </div>
                      
                      <div className="flex items-center gap-2 ml-auto p-1 pr-2 bg-slate-900 border border-slate-800 rounded-lg">
                        <Palette className="w-3.5 h-3.5 opacity-60 ml-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">ფერი</span>
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner ml-1">
                          <input 
                            type="color" 
                            value={module.color}
                            onChange={(e) => updateModule(module.id, { color: e.target.value })}
                            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                          />
                        </div>
                      </div>
                  </div>

                </motion.div>
              );
            })}
        </AnimatePresence>
        
        {modules.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-sm gap-3 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <Cuboid className="w-8 h-8 opacity-20" />
             მოდულები არ შექმნილა 
          </div>
        )}
      </div>
    </div>
  );
}
