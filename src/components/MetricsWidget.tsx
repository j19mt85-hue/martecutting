import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock initial data generator for 30 intervals
const generateInitialData = () => {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => ({
    time: new Date(now.getTime() - (29 - i) * 2000).toLocaleTimeString([], { 
      hour12: false, 
      minute: '2-digit', 
      second: '2-digit' 
    }),
    utilization: Math.max(65, Math.min(95, 75 + Math.random() * 20 + Math.sin(i / 3) * 10)),
  }));
};

export function MetricsWidget() {
  const [data, setData] = useState(generateInitialData());

  useEffect(() => {
    // Simulate real-time data streaming every 2 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1)];
        const now = new Date();
        const lastVal = prev[prev.length - 1].utilization;
        const newVal = Math.max(65, Math.min(95, lastVal + (Math.random() - 0.5) * 8));

        next.push({
          time: now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
          utilization: parseFloat(newVal.toFixed(1)),
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleExportCSV = () => {
    const csvContent = [
      ['Time', 'Utilization (%)'],
      ...data.map(row => [row.time, row.utilization])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'metrics_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.4 }}
      style={{ perspective: "1000px" }}
      className="col-span-1 md:col-span-2 lg:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:border-blue-500/30 transition-colors h-80 relative overflow-hidden group"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          სიმძლავრის ათვისება (Real-time %)
        </h3>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded flex items-center gap-1.5 border border-blue-500/20">
            საშ. {((data.reduce((a, b) => a + b.utilization, 0)) / data.length).toFixed(1)}%
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            რეპორტი
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-full pb-6 relative z-10" style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10}
              minTickGap={20}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={[50, 100]} 
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(8px)',
                borderColor: '#1e293b', 
                borderRadius: '12px', 
                color: '#f8fafc', 
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="utilization" 
              name="ათვისება"
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorUtil)" 
              isAnimationActive={false} 
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
