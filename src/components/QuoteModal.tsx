import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, X, CheckCircle, Copy, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { results, sheets, parts } = useAppStore();
  const [isCopied, setIsCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [mockLink, setMockLink] = useState('');

  if (!isOpen) return null;

  const averageSheetCost = sheets.length > 0 && sheets[0].cost > 0 ? sheets[0].cost : 150;
  const sheetCount = results ? results.length : 0;
  const materialCost = sheetCount * averageSheetCost;

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
  const edgebandCost = edgebandMeters * 1.5;

  const cuttingServiceCost = sheetCount * 15;
  const totalGEL = materialCost + edgebandCost + cuttingServiceCost;
  
  const copyToClipboard = () => {
      navigator.clipboard.writeText(mockLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const generateQuote = () => {
      const code = 'QR' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const link = `${window.location.origin}/quote/${code}`;
      
      const newOrder = {
          code,
          date: new Date().toISOString(),
          totalGEL,
          parts,
          results,
          status: 'pending',
          type: 'quote'
      };

      const existingOrdersStr = localStorage.getItem('smart_orders');
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      localStorage.setItem('smart_orders', JSON.stringify([newOrder, ...existingOrders]));

      setGeneratedCode(code);
      setMockLink(link);
      setIsSuccess(true);
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
          
          <div className="flex flex-col gap-6">
             <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                   <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">კლიენტის შეთავაზება</h2>
                  <p className="text-slate-400 text-xs mt-1">შეფასების და ინვოისის ბმულის გენერაცია</p>
                </div>
             </div>

             <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 relative">
                 <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">საორიენტაციო ღირებულება</span>
                 <span className="text-3xl font-mono font-bold text-white mb-2">{totalGEL.toFixed(2)} ₾</span>
                 <p className="text-xs text-slate-400 leading-relaxed">
                     ეს თანხა მოიცავს {sheetCount} ფურცლის მასალას, {edgebandMeters.toFixed(1)}მ წიბოს და ჭრის მომსახურებას.
                 </p>
             </div>

             {!isSuccess ? (
                 <button onClick={generateQuote} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-2 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> გენერაცია & გაზიარება
                 </button>
             ) : (
                 <div className="flex flex-col gap-3 mt-2 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                        <CheckCircle className="w-4 h-4" /> შეთავაზების ბმული მზად არის
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-lg">
                        <input type="text" readOnly value={mockLink} className="bg-transparent border-none text-slate-300 text-sm w-full outline-none px-2 font-mono" />
                        <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
                            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                 </div>
             )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
