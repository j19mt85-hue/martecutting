import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { TrendingUp, BarChart3, BrainCircuit } from 'lucide-react';

const mockHistoricalData = [
  { month: 'იან', utilization: 82, waste: 18 },
  { month: 'თებ', utilization: 85, waste: 15 },
  { month: 'მარ', utilization: 84, waste: 16 },
  { month: 'აპრ', utilization: 88, waste: 12 },
  { month: 'მაი', utilization: 86, waste: 14 },
  { month: 'ივნ', utilization: 91, waste: 9 },
];

export function AnalyticsDashboard() {
  const { parts, sheets } = useAppStore();
  
  const totalPartArea = parts.reduce((acc, p) => acc + (p.w * p.h * p.qty) / 1000000, 0); // sq meters
  
  // Minimal ML Predictor Mock
  const estimatedUtilization = totalPartArea > 0 ? Math.min(94, 82 + Math.log10(totalPartArea * 10)) : 0;
  const estimatedSheets = sheets.length > 0 && totalPartArea > 0 
      ? Math.ceil(totalPartArea / ((sheets[0].w * sheets[0].h) / 1000000)) 
      : 0;
  const predictedValueColor = estimatedUtilization > 88 ? 'text-emerald-400' : 'text-amber-400';

  return (
    <div className="flex flex-col h-full relative p-4 space-y-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-2">
         <BarChart3 className="w-5 h-5 text-indigo-400" />
         <h2 className="text-sm font-semibold text-slate-300">ანალიტიკა და ML პროგნოზები</h2>
      </div>

      {/* ML Predictor Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col gap-3 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="w-16 h-16 text-fuchsia-400" />
         </div>
         <h3 className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1">
            <BrainCircuit className="w-3 h-3" />
            ML Predictor (პროგნოზი)
         </h3>
         <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="flex flex-col">
                 <span className="text-slate-500 text-xs">მოსალოდნელი ათვისება</span>
                 <span className={`text-2xl font-bold font-mono ${predictedValueColor}`}>
                    {estimatedUtilization > 0 ? estimatedUtilization.toFixed(1) : '0.0'}%
                 </span>
             </div>
             <div className="flex flex-col">
                 <span className="text-slate-500 text-xs">საჭირო ფურცლების Nº</span>
                 <span className="text-2xl font-bold font-mono text-white">
                    ~{estimatedSheets > 0 ? Math.max(1, Math.round(estimatedSheets * 1.1)) : 0}
                 </span>
             </div>
         </div>
      </div>

      {/* Charts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col gap-4 h-64">
         <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400">ათვისების ტრენდი (ბოლო 6 თვე)</h3>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
         </div>
         <div className="flex-1 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockHistoricalData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="utilization" name="ათვისება %" stroke="#10b981" fillOpacity={1} fill="url(#colorUtil)" />
                </AreaChart>
             </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
