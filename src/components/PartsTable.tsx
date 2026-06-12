import { useAppStore } from '../store/useAppStore';
import { EdgebandSelector } from './EdgebandSelector';
import { Plus, Trash2, ArrowUpDown, MoveHorizontal, MoveVertical, Settings2, LayoutTemplate, FileUp } from 'lucide-react';
import { Grain, Part } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import React, { useRef } from 'react';
import Papa from 'papaparse';

export function PartsTable() {
  const { parts, modules, updatePart, addPart, removePart } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          // Add random ID, default module if omitted, basic logic for lengths and qty
          if (row.Length && row.Width) {
             const newPart: Part = {
                id: Date.now().toString() + Math.random(),
                name: row.Label || 'იმპორტირებული დეტალი',
                w: Number(row.Width) || 0,
                h: Number(row.Length) || 0,
                qty: Number(row.Qty) || 1,
                grain: 'none',
                moduleId: modules.length > 0 ? modules[0].id : '',
                edges: {
                    top: row.EdgeT === '1' ? 1 : 0,
                    bottom: row.EdgeB === '1' ? 1 : 0,
                    left: row.EdgeL === '1' ? 1 : 0,
                    right: row.EdgeR === '1' ? 1 : 0,
                }
             };
             // Workaround: Not using the standard `addPart` function directly to avoid the empty default Part structure overriding this
             useAppStore.setState(state => ({ parts: [...state.parts, newPart] }));
          }
        });
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleGrain = (grain: Grain): Grain => {
    if (grain === 'none') return 'horizontal';
    if (grain === 'horizontal') return 'vertical';
    return 'none';
  };

  const GrainIcon = ({ grain }: { grain: Grain }) => {
    if (grain === 'none') return <Settings2 className="w-4 h-4 opacity-40 rotate-45" />;
    if (grain === 'horizontal') return <MoveHorizontal className="w-4 h-4 text-emerald-400" />;
    return <MoveVertical className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-3 shadow-md flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
           <LayoutTemplate className="w-4 h-4 text-blue-400" />
           დეტალების სია ({parts.length})
        </h2>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1 text-xs pr-3 shadow-md"
              title="CSV ან Cutting ფაილის იმპორტი"
            >
              <FileUp className="w-4 h-4" /> იმპორტი
            </button>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleCSVImport} 
            />
            <button 
              onClick={addPart}
              className="bg-blue-600/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-lg border border-blue-500/30 transition-all flex items-center gap-1 text-xs pr-3"
            >
              <Plus className="w-4 h-4" /> დამატება
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
            {parts.map((part) => {
              const module = modules.find(m => m.id === part.moduleId);

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  key={part.id} 
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-3 group relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all hover:border-slate-700/80"
                >
                  {/* Decorator line for module coloring */}
                  {module && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: module.color }} />
                  )}

                  <div className="flex gap-2 items-center pl-2">
                      <input 
                        className="bg-transparent border-none text-sm font-medium focus:outline-none w-full text-slate-200 placeholder:text-slate-600 focus:text-blue-100" 
                        value={part.name}
                        placeholder="დეტალის სახელი"
                        onChange={(e) => updatePart(part.id, { name: e.target.value })}
                      />
                      <button onClick={() => removePart(part.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 bg-red-400/10 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>

                  <div className="grid grid-cols-[1fr_1fr_40px_1fr] gap-3 pl-2 items-center">
                      <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-slate-700 transition-colors">
                        <span className="text-[10px] uppercase text-slate-500 bg-slate-800/50 flex items-center justify-center px-2 border-r border-slate-800">W</span>
                        <input type="number" min="1" className="bg-transparent border-none w-full text-center text-sm p-1.5 focus:outline-none focus:bg-slate-800/50" value={part.w} onChange={e => updatePart(part.id, { w: Number(e.target.value) || 0 })} />
                      </div>
                      
                      <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-slate-700 transition-colors">
                        <span className="text-[10px] uppercase text-slate-500 bg-slate-800/50 flex items-center justify-center px-2 border-r border-slate-800">H</span>
                        <input type="number" min="1" className="bg-transparent border-none w-full text-center text-sm p-1.5 focus:outline-none focus:bg-slate-800/50" value={part.h} onChange={e => updatePart(part.id, { h: Number(e.target.value) || 0 })} />
                      </div>

                      <div className="flex border border-slate-800 bg-slate-900 rounded-lg overflow-hidden group-focus-within:border-fuchsia-900/50 transition-colors">
                         <input type="number" min="1" className="bg-transparent border-none w-full text-center text-sm p-1.5 font-bold text-fuchsia-300 focus:outline-none focus:bg-slate-800/50 placeholder:text-slate-600" value={part.qty} onChange={e => updatePart(part.id, { qty: Number(e.target.value) || 1 })} />
                      </div>

                      <div className="flex items-center justify-between">
                         <select 
                           className="bg-transparent text-xs outline-none border-none text-slate-400 w-20 appearance-none cursor-pointer hover:text-slate-200 truncate"
                           value={part.moduleId || ''}
                           onChange={e => updatePart(part.id, { moduleId: e.target.value })}
                         >
                           <option value="" className="bg-slate-900">-</option>
                           {modules.map(m => (
                             <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>
                           ))}
                         </select>
                      </div>
                  </div>

                  <div className="flex items-center justify-between pl-2 pt-2 border-t border-slate-800/50 mt-1">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updatePart(part.id, { grain: toggleGrain(part.grain) })}
                          title="უზორის მიმართულება"
                          className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-colors"
                        >
                          <GrainIcon grain={part.grain} />
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{part.grain.slice(0, 4)}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">კრომკა</span>
                        <EdgebandSelector edges={part.edges} onChange={(edges) => updatePart(part.id, { edges })} />
                      </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
        
        {parts.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-sm gap-3 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <LayoutTemplate className="w-8 h-8 opacity-20" />
             სია ცარიელია 
          </div>
        )}
      </div>
    </div>
  );
}
