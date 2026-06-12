import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, CheckCircle, X, CreditCard, Banknote } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function POSModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { results, sheets, parts } = useAppStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');

  if (!isOpen) return null;

  const averageSheetCost = sheets.length > 0 && sheets[0].cost > 0 ? sheets[0].cost : 150;
  const sheetCount = results ? results.length : 0;
  const materialCost = sheetCount * averageSheetCost;

  // Approximate edgeband cost: 1.5 GEL per meter. 
  let totalPerimeterMm = 0;
  parts.forEach(p => {
     let edges = 0;
     if(p.edges.top) edges += p.w;
     if(p.edges.bottom) edges += p.w;
     if(p.edges.left) edges += p.h;
     if(p.edges.right) edges += p.h;
     totalPerimeterMm += edges * p.qty;
  });
  const edgebandMeters = totalPerimeterMm / 1000;
  const edgebandCost = edgebandMeters * 1.5; // GEL

  const cuttingServiceCost = sheetCount * 15; // 15 GEL per sheet cut

  const totalGEL = materialCost + edgebandCost + cuttingServiceCost;

  const handleSale = () => {
    const code = 'OR' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newOrder = {
        code,
        date: new Date().toISOString(),
        totalGEL,
        parts,
        results,
        status: 'cutting',
        type: 'pos'
    };

    const existingOrdersStr = localStorage.getItem('smart_orders');
    const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    localStorage.setItem('smart_orders', JSON.stringify([newOrder, ...existingOrders]));

    // Automatically add large free spaces to the remnants module
    if (results) {
        const newRemnants = results.flatMap(r => 
           (r.freeSpaces || []).map(free => ({
               id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
               w: Number(free.w.toFixed(1)),
               h: Number(free.h.toFixed(1)),
               label: `Auto-${code}`,
               material: 'მასალა (ავტომატური)'
           }))
        );
        
        if (newRemnants.length > 0) {
            useAppStore.setState(state => ({
                remnants: [...newRemnants, ...state.remnants]
            }));
        }
    }

    setGeneratedCode(code);
    setIsSuccess(true);
    setTimeout(() => {
        setIsSuccess(false);
        onClose();
    }, 4000);
  };

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      >
        <motion.div 
           initial={{ scale: 0.95, y: 20 }}
           animate={{ scale: 1, y: 0 }}
           exit={{ scale: 0.95, y: -20 }}
           className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          {isSuccess ? (
             <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                   <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-white">გაყიდვა წარმატებულია!</h2>
                <p className="text-slate-400 text-sm text-center">
                    ტრანზაქცია აისახა სისტემაში.<br/>
                    თვალთვალის კოდი: <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded ml-1">{generatedCode}</span>
                </p>
             </div>
          ) : (
             <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <ShoppingCart className="w-5 h-5" />
                   </div>
                   <div>
                     <h2 className="text-lg font-bold text-white leading-tight">POS ტერმინალი</h2>
                     <p className="text-slate-400 text-xs mt-1">ჭრის და მასალის რეალიზაცია</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">მასალა ({sheetCount} ფურცელი)</span>
                      <span className="text-white font-mono">{materialCost.toFixed(2)} ₾</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">წიბო ({edgebandMeters.toFixed(1)} მ)</span>
                      <span className="text-white font-mono">{edgebandCost.toFixed(2)} ₾</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">ჭრის მომსახურება</span>
                      <span className="text-white font-mono">{cuttingServiceCost.toFixed(2)} ₾</span>
                   </div>
                   <div className="h-px w-full bg-slate-800 my-2" />
                   <div className="flex justify-between items-center text-lg font-bold text-white">
                      <span>ჯამი გასადახდელი</span>
                      <span className="font-mono text-emerald-400 text-xl">{totalGEL.toFixed(2)} ₾</span>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button 
                     onClick={() => setPaymentMethod('card')}
                     className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border transition-all ${paymentMethod === 'card' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                   >
                      <CreditCard className="w-4 h-4" /> ბარათი
                   </button>
                   <button 
                     onClick={() => setPaymentMethod('cash')}
                     className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border transition-all ${paymentMethod === 'cash' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                   >
                      <Banknote className="w-4 h-4" /> ნაღდი
                   </button>
                </div>

                <button onClick={handleSale} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)] mt-2">
                   გაყიდვის დადასტურება
                </button>
             </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
