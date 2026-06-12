import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MaterialsTable() {
  const { materials, updateMaterial, addMaterial, removeMaterial } = useAppStore();

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-md flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
           <Box className="w-4 h-4 text-purple-400" />
           მასალები ({materials.length})
        </h2>
        <button 
          onClick={addMaterial}
          className="bg-purple-600/20 hover:bg-purple-500/30 text-purple-400 p-1.5 rounded-lg border border-purple-500/30 transition-all flex items-center gap-1 text-xs pr-3"
        >
          <Plus className="w-4 h-4" /> დამატება
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <AnimatePresence>
            {materials.map((material) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  key={material.id} 
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 group relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all hover:border-slate-700/80"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80 bg-purple-500" />

                  <div className="flex gap-2 items-center pl-2">
                      <input 
                        className="bg-transparent border-none text-sm font-semibold focus:outline-none w-full text-purple-100/90 placeholder:text-slate-600 focus:text-purple-100" 
                        value={material.name}
                        placeholder="მასალის დასახელება"
                        onChange={(e) => updateMaterial(material.id, { name: e.target.value })}
                      />
                      <button onClick={() => removeMaterial(material.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 bg-red-400/10 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  <div className="grid grid-cols-[1fr] gap-3 pl-2 items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">სისქე (მმ)</span>
                        <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-purple-700/50 transition-colors">
                          <input type="number" min="0" step="0.1" className="bg-transparent border-none w-full text-left text-sm p-1.5 focus:outline-none focus:bg-slate-800/50 text-slate-300" value={material.thickness} onChange={e => updateMaterial(material.id, { thickness: Number(e.target.value) || 0 })} />
                        </div>
                      </div>
                  </div>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {materials.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-sm gap-3 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <Box className="w-8 h-8 opacity-20" />
             მასალები არ მოიძებნა
          </div>
        )}
      </div>
    </div>
  );
}
