import { useEffect, useState } from 'react';
import { Cpu, HardDrive, Activity } from 'lucide-react';

const generateSparkline = (data: number[], max: number, width = 60, height = 20) => {
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / Math.max(1, max)) * height;
    return `${x},${y}`;
  }).join(' ');
  return points;
};

export function SystemStatus() {
  const [cpuScale, setCpuScale] = useState<number[]>(Array(20).fill(10));
  const [memScale, setMemScale] = useState<number[]>(Array(20).fill(40));
  const [netScale, setNetScale] = useState<number[]>(Array(20).fill(5));

  useEffect(() => {
    const int = setInterval(() => {
      setCpuScale(prev => [...prev.slice(1), Math.max(5, Math.min(100, prev[prev.length - 1] + (Math.random() - 0.5) * 40))]);
      setMemScale(prev => [...prev.slice(1), Math.max(20, Math.min(90, prev[prev.length - 1] + (Math.random() - 0.5) * 10))]);
      setNetScale(prev => [...prev.slice(1), Math.max(1, Math.min(100, Math.random() * 80))]); // Network bursts
    }, 1000);
    return () => clearInterval(int);
  }, []);

  const currentCpu = cpuScale[cpuScale.length - 1];
  const currentMem = memScale[memScale.length - 1];
  const currentNet = netScale[netScale.length - 1];

  const renderSpark = (data: number[], color: string, Icon: any, label: string, current: number, suffix: string) => {
    return (
      <div className="flex items-center gap-2 px-3">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <div className="flex flex-col gap-0.5">
           <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-wider text-slate-500 font-bold leading-none">
             <span>{label}</span>
             <span className={color}>{Math.round(current)}{suffix}</span>
           </div>
           <svg width="40" height="12" className="overflow-visible mt-0.5">
             <polyline
               points={`0,12 ${generateSparkline(data, 100, 40, 12)} 40,12`}
               fill="currentColor"
               className={`${color} opacity-10`}
               stroke="none"
             />
             <polyline
               points={generateSparkline(data, 100, 40, 12)}
               fill="none"
               stroke="currentColor"
               strokeWidth="1.5"
               strokeLinecap="round"
               strokeLinejoin="round"
               className={`${color} opacity-80 shadow-[0_0_5px_currentColor]`}
             />
           </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center border border-slate-800 bg-slate-900/40 rounded-lg p-1.5 shadow-inner">
      {renderSpark(cpuScale, "text-blue-400", Cpu, "CPU", currentCpu, "%")}
      <div className="w-px h-5 bg-slate-800 mx-1" />
      {renderSpark(memScale, "text-fuchsia-400", HardDrive, "MEM", currentMem, "%")}
      <div className="w-px h-5 bg-slate-800 mx-1" />
      {renderSpark(netScale, "text-emerald-400", Activity, "NET", currentNet, "Mb")}
    </div>
  );
}
