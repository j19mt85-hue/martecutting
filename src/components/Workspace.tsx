import React, { useState } from 'react';
import { DashboardGrid } from './DashboardGrid';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Maximize, FileDown, Printer, Banknote, ShoppingCart, Send } from 'lucide-react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { POSModal } from './POSModal';
import { QuoteModal } from './QuoteModal';

export function Workspace() {
  const { isOptimizing, results, sheets, parts } = useAppStore();
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [simulatingIndex, setSimulatingIndex] = useState<number | null>(null);

  const handleCuttingExport = () => {
    if (!parts || parts.length === 0) {
      alert("ჯერ დაამატეთ დეტალები!");
      return;
    }
    // Generate Cutting 2/3 / CSV generic export
    const csvContent = "Length,Width,Qty,Material,Label,EdgeT,EdgeB,EdgeL,EdgeR\n" + parts.map(p => {
        return `${p.h},${p.w},${p.qty},${p.moduleId || 'DEF'},${p.name},${p.edges.top > 0 ? 1 : 0},${p.edges.bottom > 0 ? 1 : 0},${p.edges.left > 0 ? 1 : 0},${p.edges.right > 0 ? 1 : 0}`;
    }).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cutting3_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCNCExport = () => {
    if (!results || results.length === 0) {
      alert("ჯერ შექმენით ჭრის სქემა!");
      return;
    }

    let dxfContent = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";
    // basic DXF loop for demonstration
    results.forEach((res, index) => {
      // draw bin
      dxfContent += `0\nPOLYLINE\n8\nBIN_${index}\n66\n1\n`;
      dxfContent += `0\nVERTEX\n8\nBIN_${index}\n10\n0.0\n20\n0.0\n`;
      dxfContent += `0\nVERTEX\n8\nBIN_${index}\n10\n${res.bin.w}.0\n20\n0.0\n`;
      dxfContent += `0\nVERTEX\n8\nBIN_${index}\n10\n${res.bin.w}.0\n20\n${res.bin.h}.0\n`;
      dxfContent += `0\nVERTEX\n8\nBIN_${index}\n10\n0.0\n20\n${res.bin.h}.0\n`;
      dxfContent += `0\nSEQEND\n`;

      res.items.forEach((item, itemIdx) => {
        dxfContent += `0\nPOLYLINE\n8\nPART_${index}_${itemIdx}\n66\n1\n`;
        dxfContent += `0\nVERTEX\n8\nPART_${index}_${itemIdx}\n10\n${item.x}.0\n20\n${item.y}.0\n`;
        dxfContent += `0\nVERTEX\n8\nPART_${index}_${itemIdx}\n10\n${item.x + item.w}.0\n20\n${item.y}.0\n`;
        dxfContent += `0\nVERTEX\n8\nPART_${index}_${itemIdx}\n10\n${item.x + item.w}.0\n20\n${item.y + item.h}.0\n`;
        dxfContent += `0\nVERTEX\n8\nPART_${index}_${itemIdx}\n10\n${item.x}.0\n20\n${item.y + item.h}.0\n`;
        dxfContent += `0\nSEQEND\n`;
      });
    });

    dxfContent += "0\nENDSEC\n0\nEOF\n";

    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project_export_${new Date().toISOString().slice(0, 10)}.dxf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLabelPrint = async () => {
    if (!results || results.length === 0) {
      alert("ჯერ შექმენით ჭრის სქემა!");
      return;
    }
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [58, 40] // standard thermal label size
    });

    let first = true;
    for (const res of results) {
       for (const item of res.items) {
          if (!first) doc.addPage([58, 40], 'landscape');
          first = false;

          doc.setFontSize(10);
          doc.text(`W: ${item.w} H: ${item.h}`, 2, 6);
          doc.setFontSize(8);
          doc.text(`დეტალი: ${item.id}`, 2, 12);
          
          try {
            const qrDataUrl = await QRCode.toDataURL(item.id, { margin: 0 });
            doc.addImage(qrDataUrl, 'PNG', 32, 14, 24, 24);
          } catch (e) {
            console.error(e);
          }
       }
    }

    doc.save(`labels_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const averageSheetCost = sheets.length > 0 && sheets[0].cost > 0 ? sheets[0].cost : 150;

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 md:p-10 relative custom-scrollbar flex flex-col items-center">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Decorative center radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none fixed" />

      {/* 3D Dashboard Grid */}
      <DashboardGrid />

      <AnimatePresence mode="wait">
        {isOptimizing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 relative z-10 shadow-[0_0_50px_rgba(99,102,241,0.1)] mb-20 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[shimmer_2s_infinite]" />
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative">
               <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
               <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping" />
            </div>
            <div className="text-center">
               <h3 className="text-indigo-100 font-semibold mb-1">ჭრის სქემის გენერაცია</h3>
               <p className="text-indigo-400/60 text-sm font-mono tracking-widest">Nesting Engine V2</p>
            </div>
          </motion.div>
        )}

        {!isOptimizing && results && results.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-10 w-full max-w-5xl items-center relative z-10 pb-20"
          >
             <div className="flex flex-col md:flex-row gap-6 w-full mb-2">
                <div className="flex-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col shadow-xl">
                    <h3 className="text-slate-300 font-semibold flex items-center gap-2 mb-2"><Banknote className="w-5 h-5 text-emerald-400" /> ხარჯთაღრიცხვა</h3>
                    <p className="text-slate-500 text-sm mb-4">გამოყენებულია {results.length} ფურცელი</p>
                    <div className="text-3xl font-bold text-white font-mono">{results.length * averageSheetCost} ₾ <span className="text-sm font-normal text-slate-500 ml-2">მასალის ღირებულება</span></div>
                </div>
                
                <div className="flex-[1.5] flex-col lg:flex-row bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex justify-center gap-4 shadow-xl">
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="text-slate-300 font-semibold flex items-center gap-2"><FileDown className="w-5 h-5 text-blue-400" /> ექსპორტი</h3>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={handleCNCExport} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                                DXF
                            </button>
                            <button onClick={handleCuttingExport} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(15,23,42,0.5)]">
                                Cutting 2/3
                            </button>
                            <button onClick={handleLabelPrint} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs">
                                PDF ეტიკეტები
                            </button>
                        </div>
                    </div>
                    <div className="w-px bg-slate-800 hidden lg:block" />
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="text-slate-300 font-semibold flex items-center gap-2"><Banknote className="w-5 h-5 text-emerald-400" /> ფინანსები</h3>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={() => setIsQuoteOpen(true)} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(8,145,178,0.2)]">
                                შეთავაზება (Link)
                            </button>
                            <button onClick={() => setIsPOSOpen(true)} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                                POS ტერმინალი
                            </button>
                        </div>
                    </div>
                </div>
             </div>

             {results.map((r, i) => (
                <div key={i} className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 relative group overflow-hidden">
                   {/* Shiny hover effect */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   
                   <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold font-mono">
                         {i + 1}
                       </div>
                       <div>
                         <div className="text-slate-200 font-bold font-mono text-sm sm:text-base">MDF თეთრი {r.bin.w}x{r.bin.h}მმ</div>
                         <div className="text-slate-500 text-xs">სტანდარტული ფორმატი</div>
                       </div>
                     </div>
                     <div className="flex gap-3">
                        <div className="text-emerald-400 font-mono text-xs sm:text-sm bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                          <Maximize className="w-3.5 h-3.5 opacity-70" />
                          ათვისება: {Math.round(r.utilization * 100)}%
                        </div>
                     </div>
                   </div>
                   
                   <div className="w-full border-2 border-slate-800 bg-[#0a0f1c] rounded-xl relative overflow-hidden shadow-inner" style={{ aspectRatio: `${r.bin.w} / ${r.bin.h}` }}>
                      {r.items.map(item => (
                         <div
                           key={item.id}
                           className="absolute border border-blue-500/50 bg-blue-500/10 flex flex-col items-center justify-center hover:bg-blue-400/20 hover:border-blue-400 transition-all cursor-pointer shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] group/part"
                           style={{
                             left: `${(item.x / r.bin.w) * 100}%`,
                             top: `${(item.y / r.bin.h) * 100}%`,
                             width: `${(item.w / r.bin.w) * 100}%`,
                             height: `${(item.h / r.bin.h) * 100}%`,
                           }}
                         >
                            <span className="text-blue-300 text-[8px] sm:text-[10px] md:text-xs font-mono font-bold truncate px-1 opacity-50 group-hover/part:opacity-100 drop-shadow-md">
                               {item.w}×{item.h}
                            </span>
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </motion.div>
        )}

        {!isOptimizing && !results && (
          <motion.div
            key="mock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl aspect-[28/20] shrink-0 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex items-center justify-center relative z-10 mb-20 overflow-hidden group"
          >
             <div className="absolute top-4 left-4 text-slate-500 text-sm font-bold font-mono tracking-widest bg-slate-950/80 px-3 py-1 rounded-md border border-slate-800/80 z-20">
                ფურცელი 1 · 2800x2070mm
             </div>

             {/* Mock Render Box to simulate part placement */}
             <div className="w-[80%] h-[70%] border-2 border-dashed border-slate-700/50 rounded-xl relative bg-slate-950/20">
                <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-blue-500/5 border-r hover:border-blue-500/50 transition-colors border-b border-blue-500/20 flex items-center justify-center font-mono text-blue-500/50 hover:text-blue-400 text-xs shadow-inner">2000x600</div>
                <div className="absolute top-0 left-[33.3%] w-1/3 h-1/2 bg-blue-500/5 border-r hover:border-blue-500/50 transition-colors border-b border-blue-500/20 flex items-center justify-center font-mono text-blue-500/50 hover:text-blue-400 text-xs shadow-inner">2000x600</div>
                <div className="absolute top-[50%] left-0 w-1/5 h-1/3 bg-emerald-500/5 border-r hover:border-emerald-500/50 transition-colors border-b border-emerald-500/20 flex items-center justify-center font-mono text-emerald-500/50 hover:text-emerald-400 text-xs shadow-inner">715x396</div>
                <div className="absolute top-[50%] left-[20%] w-1/5 h-1/3 bg-emerald-500/5 border-r hover:border-emerald-500/50 transition-colors border-b border-emerald-500/20 flex items-center justify-center font-mono text-emerald-500/50 hover:text-emerald-400 text-xs shadow-inner">715x396</div>
                <div className="absolute top-[50%] left-[40%] w-[10%] h-[20%] bg-amber-500/5 border-r hover:border-amber-500/50 transition-colors border-b border-amber-500/20 flex items-center justify-center font-mono text-amber-500/50 hover:text-amber-400 text-[10px] shadow-inner">564x500</div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-slate-600 font-mono text-xl sm:text-2xl font-bold opacity-20 select-none">
                     ტილოს პრევიუ
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <POSModal isOpen={isPOSOpen} onClose={() => setIsPOSOpen(false)} />
    </div>
  );
}
