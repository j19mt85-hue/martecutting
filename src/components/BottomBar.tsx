import { SystemStatus } from './SystemStatus';

export function BottomBar() {
  return (
    <div className="h-14 glass-panel border-t-0 px-8 flex items-center justify-between text-sm text-slate-400 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-[11px] font-medium tracking-wide uppercase text-slate-300">ძრავა მზადაა</span>
        </div>
        
        <SystemStatus />
        
        <div className="flex gap-8 border-l border-slate-800 pl-8">
          <span className="flex items-center gap-2">გამოყენება: <strong className="text-blue-300 text-base font-mono bg-blue-950/50 px-2 flex items-center rounded border border-blue-900/50 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">86.2%</strong></span>
          <span className="flex items-center gap-2">ნარჩენი: <strong className="text-slate-200 font-mono">1.2 მ²</strong></span>
          <span className="flex items-center gap-2">ჭრის სიგრძე: <strong className="text-slate-200 font-mono">24.5 m</strong></span>
          <span className="flex items-center gap-2">ფურცლები: <strong className="text-slate-200 font-mono text-base">2</strong></span>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-emerald-950/30 px-4 py-1.5 rounded-xl border border-emerald-900/30">
          <span className="text-emerald-500/70 uppercase text-[10px] font-bold tracking-widest">ჯამური ფასი</span>
          <span className="font-bold text-lg text-emerald-400 font-mono tracking-tight shadow-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            340.50 ₾
          </span>
      </div>
    </div>
  );
}
