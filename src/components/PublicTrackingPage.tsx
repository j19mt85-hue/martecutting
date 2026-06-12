import React, { useState, useEffect } from 'react';
import { Search, Box, Ruler, CheckCircle, PackageSearch } from 'lucide-react';
import { Part } from '../types';
import { BinResult } from '../engine/types';

interface SavedOrder {
  code: string;
  date: string;
  totalGEL: number;
  parts: Part[];
  results: BinResult[] | null;
  status: 'pending' | 'cutting' | 'ready';
  type: 'quote' | 'pos';
}

export function PublicTrackingPage() {
  const [code, setCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [error, setError] = useState('');

  // Auto-fill code from URL if present
  useEffect(() => {
     const pathSegments = window.location.pathname.split('/');
     const possibleCode = pathSegments[pathSegments.length - 1];
     if (possibleCode && possibleCode !== 'track') {
         setCode(possibleCode);
         handleSearch(possibleCode);
     }
  }, []);

  const handleSearch = (searchCode: string) => {
    setSearchedCode(searchCode);
    setError('');
    setOrder(null);
    
    if (!searchCode.trim()) return;

    try {
        const savedOrdersStr = localStorage.getItem('smart_orders');
        if (savedOrdersStr) {
            const orders: SavedOrder[] = JSON.parse(savedOrdersStr);
            const found = orders.find(o => o.code.toUpperCase() === searchCode.toUpperCase());
            if (found) {
                setOrder(found);
            } else {
                setError('შეკვეთა მოცემული კოდით არ მოიძებნა.');
            }
        } else {
            setError('სისტემაში შეკვეთები არ ფიქსირდება.');
        }
    } catch (e) {
        setError('შეცდომა მონაცემების წაკითხვისას.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12 flex flex-col items-center">
       <div className="w-full max-w-2xl flex flex-col gap-8">
           <div className="text-center space-y-2">
               <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] mb-6 text-white font-bold text-3xl">
                  S
               </div>
               <h1 className="text-3xl font-bold text-white tracking-tight">შეკვეთის სტატუსი</h1>
               <p className="text-slate-400">შეიყვანეთ თქვენი ქვითრის ან შეთავაზების კოდი</p>
           </div>

           <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-500" />
               </div>
               <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(code)}
                  placeholder="მაგ: QRf29S"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-4 pl-12 pr-24 text-lg font-mono tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner uppercase"
               />
               <button 
                  onClick={() => handleSearch(code)}
                  className="absolute inset-y-2 right-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded-lg transition-colors"
               >
                  ძიება
               </button>
           </div>

           {error && (
               <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl text-center">
                   {error}
               </div>
           )}

           {order && (
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                       <div>
                           <h2 className="text-xl font-bold text-white mb-1">
                               {order.type === 'quote' ? 'შეთავაზება' : 'შეკვეთა'} #{order.code}
                           </h2>
                           <p className="text-slate-400 text-sm">თარიღი: {new Date(order.date).toLocaleString('ka-GE')}</p>
                       </div>
                       <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                           <span className="text-slate-400 text-sm">სტატუსი:</span>
                           {order.status === 'pending' && <span className="text-amber-400 font-semibold flex items-center gap-1.5"><Box className="w-4 h-4" /> მომლოდინე</span>}
                           {order.status === 'cutting' && <span className="text-blue-400 font-semibold flex items-center gap-1.5"><Ruler className="w-4 h-4" /> იჭრება</span>}
                           {order.status === 'ready' && <span className="text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> მზადაა გასატანად</span>}
                       </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col">
                           <span className="text-slate-500 text-xs uppercase font-semibold mb-1">ჯამური ღირებულება</span>
                           <span className="text-2xl font-mono font-bold text-emerald-400">{order.totalGEL.toFixed(2)} ₾</span>
                       </div>
                       <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col">
                           <span className="text-slate-500 text-xs uppercase font-semibold mb-1">ფურცლები</span>
                           <span className="text-2xl font-mono font-bold text-white">{order.results ? order.results.length : 0} ცალი</span>
                       </div>
                       <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col">
                           <span className="text-slate-500 text-xs uppercase font-semibold mb-1">დეტალები</span>
                           <span className="text-2xl font-mono font-bold text-white">{order.parts.reduce((acc, p) => acc + p.qty, 0)} ცალი</span>
                       </div>
                   </div>

                   <div>
                       <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                           <PackageSearch className="w-4 h-4" /> დაჭრილი დეტალების სია
                       </h3>
                       <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                           <table className="w-full text-left text-sm text-slate-400">
                               <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase">
                                   <tr>
                                       <th className="px-4 py-3 font-semibold">სახელი / ჭდე</th>
                                       <th className="px-4 py-3 font-semibold text-right">ზომები (მმ)</th>
                                       <th className="px-4 py-3 font-semibold text-right">რაოდენობა</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-800">
                                   {order.parts.map((p, idx) => (
                                       <tr key={idx} className="hover:bg-slate-900/50">
                                           <td className="px-4 py-3 font-medium text-slate-300">{p.name || 'უსახელო'}</td>
                                           <td className="px-4 py-3 text-right font-mono">{p.h} × {p.w}</td>
                                           <td className="px-4 py-3 text-right font-mono text-emerald-400">{p.qty} ც</td>
                                       </tr>
                                   ))}
                                   {order.parts.length === 0 && (
                                       <tr>
                                           <td colSpan={3} className="px-4 py-6 text-center text-slate-500">დეტალები არ ფიქსირდება</td>
                                       </tr>
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}
